import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CareFacts } from "@/components/shop/CareGuidePanel";
import LoadError from "@/components/shop/LoadError";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { getCareGuides } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Panduan Perawatan",
  description: "Kebutuhan cahaya, jadwal siram, dan pupuk yang cocok untuk tiap tanaman di Andi Tani.",
};

async function GuideList() {
  const guides = await getCareGuides();
  if (!guides) return <LoadError what="Panduan perawatan" />;
  if (guides.length === 0) {
    return (
      <EmptyState
        title="Panduan sedang ditulis"
        description="Cara merawat tiap tanaman akan muncul di sini."
        action={{ href: "/produk", label: "Lihat produk" }}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {guides.map((guide) => (
        <article key={guide.id} className="rounded-2xl border border-border-subtle p-6">
          <h2 className="text-2xl text-brand-primary">{guide.name}</h2>
          <div className="mt-5">
            <CareFacts guide={guide} />
          </div>
          {guide.products.length > 0 && (
            <div className="mt-6 border-t border-border-subtle pt-4">
              <p className="text-sm text-text-muted">Berlaku untuk</p>
              <ul className="mt-1 flex flex-wrap gap-x-4">
                {guide.products.map((product) => (
                  <li key={product.id}>
                    <Link href={`/produk/${product.id}`} className="touch-target inline-flex items-center font-semibold underline-offset-4 hover:underline">
                      {product.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function GuideSkeleton() {
  return (
    <div aria-hidden className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-56 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export default function PanduanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="text-4xl text-brand-primary">Panduan Perawatan</h1>
      <p className="mb-8 mt-2 max-w-xl text-text-muted">
        Biar tanamanmu awet, cek dulu butuh cahaya seberapa, kapan disiram, dan pupuk apa yang cocok.
      </p>
      <Suspense fallback={<GuideSkeleton />}>
        <GuideList />
      </Suspense>
    </div>
  );
}
