import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import {
  CATALOG_TAG,
  FEATURED_LIMIT,
  PRODUCTS_PER_PAGE,
  SELLABLE_STATUSES,
  UUID_PATTERN,
} from "@/lib/constants";
import type { CareGuide, Category, Product } from "@/types/database";

// Semua fungsi mengembalikan `null` jika database gagal diakses.
// Hasil gagal di-cache sangat singkat agar segera dicoba ulang,
// hasil sukses di-cache per jam dan dibersihkan saat admin mengubah data.

export type ProductCard = Pick<
  Product,
  "id" | "name" | "price" | "image_url" | "stock"
> & { category: Pick<Category, "id" | "name"> | null };

export type ProductDetail = Product & {
  category: Pick<Category, "id" | "name"> | null;
  care_guide: CareGuide | null;
};

const CARD_COLUMNS = "id, name, price, image_url, stock, category:categories(id, name)";

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export async function getCategories(): Promise<Category[] | null> {
  "use cache";
  cacheTag(CATALOG_TAG);

  const { data, error } = await createPublicClient()
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getCategories:", error.message);
    cacheLife("seconds");
    return null;
  }
  cacheLife("hours");
  return data;
}

export async function getFeaturedProducts(): Promise<ProductCard[] | null> {
  "use cache";
  cacheTag(CATALOG_TAG);

  const { data, error } = await createPublicClient()
    .from("products")
    .select(CARD_COLUMNS)
    .eq("is_active", true)
    .in("plant_status", [...SELLABLE_STATUSES])
    .order("created_at", { ascending: false })
    .range(0, FEATURED_LIMIT - 1);

  if (error) {
    console.error("getFeaturedProducts:", error.message);
    cacheLife("seconds");
    return null;
  }
  cacheLife("hours");
  return data as unknown as ProductCard[];
}

export type CatalogQuery = { categoryId?: string; q?: string; page: number };
export type CatalogResult = { items: ProductCard[]; total: number };

export async function getCatalog({
  categoryId,
  q,
  page,
}: CatalogQuery): Promise<CatalogResult | null> {
  "use cache";
  cacheTag(CATALOG_TAG);

  const from = (page - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;

  let query = createPublicClient()
    .from("products")
    .select(CARD_COLUMNS, { count: "exact" })
    .eq("is_active", true)
    .in("plant_status", [...SELLABLE_STATUSES]);

  if (categoryId && UUID_PATTERN.test(categoryId)) {
    query = query.eq("category_id", categoryId);
  }
  if (q) {
    query = query.ilike("name", `%${escapeLike(q)}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    // Halaman di luar jangkauan juga mengembalikan error dari PostgREST
    if (error.code === "PGRST103") {
      cacheLife("hours");
      return { items: [], total: count ?? 0 };
    }
    console.error("getCatalog:", error.message);
    cacheLife("seconds");
    return null;
  }
  cacheLife("hours");
  return { items: data as unknown as ProductCard[], total: count ?? 0 };
}

export async function getProduct(
  id: string,
): Promise<ProductDetail | "not_found" | null> {
  "use cache";
  cacheTag(CATALOG_TAG);

  if (!UUID_PATTERN.test(id)) {
    cacheLife("hours");
    return "not_found";
  }

  const { data, error } = await createPublicClient()
    .from("products")
    .select("*, category:categories(id, name), care_guide:care_guides(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getProduct:", error.message);
    cacheLife("seconds");
    return null;
  }
  cacheLife("hours");
  // RLS sudah menyaring produk nonaktif / Karantina / Pembibitan
  return data ? (data as unknown as ProductDetail) : "not_found";
}

export type CareGuideWithProducts = CareGuide & {
  products: Pick<Product, "id" | "name">[];
};

export async function getCareGuides(): Promise<CareGuideWithProducts[] | null> {
  "use cache";
  cacheTag(CATALOG_TAG);

  const { data, error } = await createPublicClient()
    .from("care_guides")
    .select("*, products(id, name)")
    .order("name", { ascending: true });

  if (error) {
    console.error("getCareGuides:", error.message);
    cacheLife("seconds");
    return null;
  }
  cacheLife("hours");
  return data as unknown as CareGuideWithProducts[];
}
