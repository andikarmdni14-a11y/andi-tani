import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";
import ProductActiveToggle from "@/components/admin/ProductActiveToggle";
import { primaryButton, secondaryButton } from "@/components/admin/fields";
import LoadError from "@/components/shop/LoadError";
import ProductImage from "@/components/shop/ProductImage";
import EmptyState from "@/components/ui/EmptyState";
import { getAdminContext } from "@/lib/auth/admin";
import { formatRupiah } from "@/lib/format";

export const metadata: Metadata = { title: "Produk" };

type AdminProductRow = {
  id: string;
  name: string;
  price: number;
  stock: number;
  plant_status: string;
  is_active: boolean;
  image_url: string | null;
  category_id: string;
};

type CategoryRow = { id: string; name: string };

function ProductRow({ product }: { product: AdminProductRow }) {
  const lowStock = product.stock > 0 && product.stock <= 3;

  return (
    <li className="grid grid-cols-[64px_1fr] gap-x-4 gap-y-3 p-4 md:grid-cols-[64px_1fr_auto] md:items-center">
      <ProductImage
        src={product.image_url}
        alt={product.name}
        sizes="64px"
        className={`size-16 rounded-lg text-2xl ${product.is_active ? "" : "opacity-50"}`}
      />

      <div className="min-w-0">
        <p className="font-semibold leading-snug">{product.name}</p>
        <p className="mt-0.5 text-sm text-text-secondary">{formatRupiah(product.price)}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
          <span
            className={`whitespace-nowrap rounded-full px-2 py-0.5 font-semibold ${
              product.stock === 0
                ? "bg-brand-accent/10 text-brand-accent"
                : lowStock
                  ? "bg-brand-accent/10 text-brand-accent"
                  : "bg-brand-primary/10 text-brand-primary"
            }`}
          >
            {product.stock === 0 ? "Stok habis" : `Stok ${product.stock}`}
          </span>
          <span className="whitespace-nowrap rounded-full border border-border-subtle px-2 py-0.5">
            {product.plant_status}
          </span>
          {!product.is_active && (
            <span className="whitespace-nowrap rounded-full bg-text-primary/10 px-2 py-0.5 font-semibold">
              Nonaktif
            </span>
          )}
        </div>
      </div>

      {/* Mobile: tombol di baris sendiri selebar kartu. Desktop: di sisi kanan. */}
      <div className="col-span-2 grid grid-cols-2 gap-2 md:col-span-1 md:flex">
        <Link href={`/admin/produk/${product.id}`} className={`${secondaryButton} w-full md:w-auto`}>
          Ubah
        </Link>
        <ProductActiveToggle id={product.id} isActive={product.is_active} name={product.name} />
      </div>
    </li>
  );
}

async function AdminProductsPageContent() {
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return null;

  const [productsRes, categoriesRes] = await Promise.all([
    ctx.supabase
      .from("products")
      .select("id, name, price, stock, plant_status, is_active, image_url, category_id")
      .order("name", { ascending: true }),
    ctx.supabase.from("categories").select("id, name").order("created_at", { ascending: true }),
  ]);

  const products = productsRes.data as AdminProductRow[] | null;
  const categories = categoriesRes.data as CategoryRow[] | null;
  const failed = productsRes.error || categoriesRes.error || !products || !categories;

  // Kelompokkan produk per kategori, urut sesuai urutan kategori
  const groups = failed
    ? []
    : categories
        .map((category) => ({
          category,
          items: products.filter((p) => p.category_id === category.id),
        }))
        .filter((group) => group.items.length > 0);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-brand-primary">Produk</h1>
          {products && (
            <p className="text-sm text-text-secondary">
              {products.length} produk di {groups.length} kategori
            </p>
          )}
        </div>
        <Link href="/admin/produk/baru" className={primaryButton}>
          Tambah produk
        </Link>
      </div>

      {failed ? (
        <LoadError what="Daftar produk" />
      ) : products.length === 0 ? (
        <EmptyState
          title="Belum ada produk"
          description="Tambahkan produk pertama agar katalog toko mulai terisi."
          action={{ href: "/admin/produk/baru", label: "Tambah produk" }}
        />
      ) : (
        <>
          {/* Lompat cepat ke kategori */}
          <nav aria-label="Lompat ke kategori" className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1">
            {groups.map(({ category, items }) => (
              <a
                key={category.id}
                href={`#kategori-${category.id}`}
                className="touch-target inline-flex shrink-0 items-center gap-2 rounded-full border border-border-subtle px-4 text-sm transition-colors duration-300 hover:border-brand-primary"
              >
                {category.name}
                <span className="rounded-full bg-border-subtle px-1.5 text-xs font-semibold">{items.length}</span>
              </a>
            ))}
          </nav>

          <div className="space-y-10">
            {groups.map(({ category, items }) => (
              <section
                key={category.id}
                id={`kategori-${category.id}`}
                aria-labelledby={`judul-${category.id}`}
                className="scroll-mt-36"
              >
                <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-border-subtle pb-2">
                  <h2 id={`judul-${category.id}`} className="text-2xl text-brand-primary">
                    {category.name}
                  </h2>
                  <span className="text-sm text-text-secondary">{items.length} produk</span>
                </div>
                <ul className="divide-y divide-border-subtle rounded-2xl border border-border-subtle">
                  {items.map((product) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </>
  );
}

// Batas Suspense di dalam halaman agar navigasi antar-menu admin tetap instan
export default function AdminProductsPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminProductsPageContent />
    </Suspense>
  );
}
