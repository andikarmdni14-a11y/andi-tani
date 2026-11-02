import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";
import Link from "next/link";
import ProductImage from "@/components/shop/ProductImage";
import ProductActiveToggle from "@/components/admin/ProductActiveToggle";
import { primaryButton, secondaryButton } from "@/components/admin/fields";
import EmptyState from "@/components/ui/EmptyState";
import LoadError from "@/components/shop/LoadError";
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
  category: { name: string } | null;
};

async function AdminProductsPageContent() {
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return null;

  const { data, error } = await ctx.supabase
    .from("products")
    .select("id, name, price, stock, plant_status, is_active, image_url, category:categories(name)")
    .order("created_at", { ascending: false });

  const products = data as unknown as AdminProductRow[] | null;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-brand-primary">Produk</h1>
          {products && <p className="text-sm text-text-muted">{products.length} produk terdaftar</p>}
        </div>
        <Link href="/admin/produk/baru" className={primaryButton}>Tambah produk</Link>
      </div>

      {error || !products ? (
        <LoadError what="Daftar produk" />
      ) : products.length === 0 ? (
        <EmptyState
          title="Belum ada produk"
          description="Tambahkan produk pertama agar katalog toko mulai terisi."
          action={{ href: "/admin/produk/baru", label: "Tambah produk" }}
        />
      ) : (
        <ul className="divide-y divide-border-subtle rounded-2xl border border-border-subtle">
          {products.map((product) => (
            <li key={product.id} className="flex flex-wrap items-center gap-4 p-4">
              <ProductImage src={product.image_url} alt={product.name} sizes="64px" className="size-16 shrink-0 rounded-lg text-2xl" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-text-muted">
                  {product.category?.name ?? "Tanpa kategori"} / {formatRupiah(product.price)} / Stok {product.stock}
                </p>
                <p className="mt-1 text-xs">
                  <span className="rounded-full border border-border-subtle px-2 py-0.5">{product.plant_status}</span>{" "}
                  {!product.is_active && (
                    <span className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-brand-accent">Nonaktif</span>
                  )}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Link href={`/admin/produk/${product.id}`} className={secondaryButton}>Ubah</Link>
                <ProductActiveToggle id={product.id} isActive={product.is_active} name={product.name} />
              </div>
            </li>
          ))}
        </ul>
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
