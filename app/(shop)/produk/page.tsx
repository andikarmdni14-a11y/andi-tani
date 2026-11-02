import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ProductGrid from "@/components/shop/ProductGrid";
import Pagination from "@/components/shop/Pagination";
import LoadError from "@/components/shop/LoadError";
import EmptyState from "@/components/ui/EmptyState";
import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { getCatalog, getCategories } from "@/lib/data/catalog";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Belanja",
  description: "Tanaman hias, pupuk, pot, media tanam, dan peralatan berkebun dari Andi Tani.",
};

function readParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
}

async function Catalog({ searchParams }: Pick<PageProps<"/produk">, "searchParams">) {
  const params = await searchParams;
  const categoryId = readParam(params.kategori);
  const q = readParam(params.q)?.slice(0, 80);
  const rawPage = Number(readParam(params.halaman) ?? 1);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const [categories, catalog] = await Promise.all([
    getCategories(),
    getCatalog({ categoryId, q, page }),
  ]);

  if (!catalog) return <LoadError what="Katalog" />;

  const activeCategory = categories?.find((c) => c.id === categoryId);
  const totalPages = Math.ceil(catalog.total / PRODUCTS_PER_PAGE);

  const chipHref = (id?: string) => {
    const search = new URLSearchParams();
    if (id) search.set("kategori", id);
    if (q) search.set("q", q);
    const qs = search.toString();
    return qs ? `/produk?${qs}` : "/produk";
  };
  const chipClass = (active: boolean) =>
    `touch-target inline-flex shrink-0 items-center rounded-full border px-4 text-sm transition-colors duration-300 ${
      active
        ? "border-brand-primary bg-brand-primary font-semibold text-surface-light"
        : "border-border-subtle hover:border-brand-primary"
    }`;

  return (
    <>
      {categories && (
        <nav aria-label="Filter kategori" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
          <Link href={chipHref()} className={chipClass(!activeCategory)} aria-current={!activeCategory ? "page" : undefined}>
            Semua
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={chipHref(category.id)}
              className={chipClass(category.id === activeCategory?.id)}
              aria-current={category.id === activeCategory?.id ? "page" : undefined}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      )}

      <p className="mb-6 text-sm text-text-muted" aria-live="polite">
        {q ? `Hasil pencarian "${q}": ` : ""}
        {catalog.total} produk
        {activeCategory ? ` di ${activeCategory.name}` : ""}
      </p>

      {catalog.items.length === 0 ? (
        q || activeCategory ? (
          <EmptyState
            title="Produk tidak ditemukan"
            description="Coba kata kunci lain atau lihat semua kategori."
            action={{ href: "/produk", label: "Lihat semua produk" }}
          />
        ) : page > 1 ? (
          <EmptyState
            title="Halaman ini kosong"
            description="Nomor halaman melebihi jumlah produk yang ada."
            action={{ href: "/produk", label: "Kembali ke halaman 1" }}
          />
        ) : (
          <EmptyState
            title="Koleksi sedang disiapkan"
            description="Tanaman dan pupuk baru segera tampil di sini."
          />
        )
      ) : (
        <>
          <ProductGrid products={catalog.items} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseParams={{ kategori: activeCategory?.id, q }}
          />
        </>
      )}
    </>
  );
}

function CatalogSkeleton() {
  return (
    <>
      <div aria-hidden className="mb-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-11 w-28 shrink-0 rounded-full" />
        ))}
      </div>
      <Skeleton className="mb-6 h-4 w-32" />
      <ProductGridSkeleton count={12} />
    </>
  );
}

export default function ProdukPage(props: PageProps<"/produk">) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="mb-6 text-4xl text-brand-primary">Belanja</h1>
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
