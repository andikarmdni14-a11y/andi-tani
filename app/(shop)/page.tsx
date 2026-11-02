import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CategoryCircles, CategoryCirclesSkeleton } from "@/components/shop/CategoryCircles";
import ProductGrid from "@/components/shop/ProductGrid";
import LoadError from "@/components/shop/LoadError";
import EmptyState from "@/components/ui/EmptyState";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { getFeaturedProducts } from "@/lib/data/catalog";

async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  if (!products) return <LoadError what="Produk" />;
  if (products.length === 0) {
    return (
      <EmptyState
        title="Koleksi sedang disiapkan"
        description="Tanaman dan pupuk baru segera tampil di sini. Mampir lagi dalam waktu dekat."
      />
    );
  }
  return <ProductGrid products={products} />;
}

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="judul-hero" className="relative md:h-[clamp(420px,50vw,640px)]">
        <div className="relative aspect-[4/3] w-full md:absolute md:inset-0 md:aspect-auto">
          <Image
            src="/hero.webp"
            alt="Aglaonema dalam pot terakota di atas meja"
            fill
            preload
            sizes="100vw"
            className="object-cover object-[25%_50%]"
          />
        </div>
        <div className="mx-auto max-w-6xl px-4 md:relative md:flex md:h-full md:items-center md:justify-end">
          <div className="py-8 md:max-w-md md:rounded-2xl md:bg-surface-light/85 md:p-8 md:backdrop-blur-sm lg:max-w-lg">
            <h1 id="judul-hero" className="font-heading text-4xl leading-[1.08] text-brand-primary lg:text-5xl">
              Bikin Rumah Jadi Lebih Hidup, Mulai dari Sudut Kecil.
            </h1>
            <p className="mt-4 font-body leading-relaxed text-text-primary">
              Lagi cari teman hijau baru buat nemenin meja kerja atau bikin ruang tamu adem?
              Koleksi tanaman hias dan pupuk organik pilihan paman siap diantar ke rumahmu
              dalam kondisi segar.
            </p>
            <div className="mt-8">
              <Link
                href="/produk"
                className="touch-target inline-flex items-center rounded-lg bg-brand-accent px-6 font-semibold text-surface-light transition-colors duration-300 hover:bg-brand-primary"
              >
                Jelajahi Koleksi Hijau
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="kategori" aria-labelledby="judul-kategori" className="mx-auto max-w-6xl scroll-mt-32 px-4 pt-12">
        <h2 id="judul-kategori" className="sr-only">Kategori</h2>
        <Suspense fallback={<CategoryCirclesSkeleton />}>
          <CategoryCircles />
        </Suspense>
      </section>

      <section aria-labelledby="judul-favorit" className="mx-auto max-w-6xl px-4 pt-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="judul-favorit" className="text-3xl text-brand-primary md:text-4xl">
              Pilihan Favorit Minggu Ini
            </h2>
            <p className="mt-2 max-w-xl text-text-secondary">
              Tanaman paling gampang dirawat yang lagi banyak dicari tetangga sebelah buat
              menghias rumah.
            </p>
          </div>
          <Link href="/produk" className="touch-target inline-flex items-center font-semibold text-brand-primary underline underline-offset-4">
            Lihat semua produk
          </Link>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>
    </>
  );
}
