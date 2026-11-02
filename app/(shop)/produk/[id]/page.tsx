import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CareGuidePanel from "@/components/shop/CareGuidePanel";
import LoadError from "@/components/shop/LoadError";
import ProductImage from "@/components/shop/ProductImage";
import QuantityAdder from "@/components/shop/QuantityAdder";
import { Skeleton } from "@/components/ui/Skeleton";
import { getProduct } from "@/lib/data/catalog";
import { formatRupiah } from "@/lib/format";

export async function generateMetadata(props: PageProps<"/produk/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const product = await getProduct(id);
  if (!product || product === "not_found") return { title: "Produk" };

  const description =
    product.description?.slice(0, 155) ||
    `${product.name} seharga ${formatRupiah(product.price)} di Andi Tani.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | Andi Tani`,
      description,
      type: "website",
      // Varian full (1000px) agar thumbnail tajam saat dibagikan via WhatsApp
      images: product.image_url ? [{ url: product.image_url, alt: product.name }] : undefined,
    },
  };
}

async function ProductDetail({ params }: Pick<PageProps<"/produk/[id]">, "params">) {
  const { id } = await params;
  const product = await getProduct(id);

  if (product === "not_found") notFound();
  if (!product) return <LoadError what="Produk" />;

  const stockText = product.stock > 0 ? `Stok tersedia: ${product.stock}` : "Stok sedang habis";

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <ProductImage
        src={product.image_url}
        alt={product.name}
        sizes="(min-width: 768px) 50vw, 100vw"
        preload
        className="aspect-[4/5] w-full rounded-2xl"
      />

      <div>
        {product.category && (
          <Link
            href={`/produk?kategori=${product.category.id}`}
            className="text-sm text-text-muted underline-offset-4 hover:underline"
          >
            {product.category.name}
          </Link>
        )}
        <h1 className="mt-2 text-4xl leading-tight text-brand-primary">{product.name}</h1>
        <p className="mt-3 text-2xl font-semibold">{formatRupiah(product.price)}</p>
        <p className="mt-1 text-sm text-text-muted">{stockText}</p>

        <div className="mt-6">
          <QuantityAdder
            product={{
              productId: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.image_url,
              stock: product.stock,
            }}
          />
        </div>

        {product.description && (
          <div className="mt-8">
            <h2 className="text-xl">Tentang produk ini</h2>
            <p className="mt-2 max-w-prose whitespace-pre-line leading-relaxed">{product.description}</p>
          </div>
        )}

        {product.care_guide && (
          <div className="mt-8">
            <CareGuidePanel guide={product.care_guide} />
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div role="status" aria-label="Memuat produk" className="grid gap-8 md:grid-cols-2 md:gap-12">
      <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default function ProductPage(props: PageProps<"/produk/[id]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Link href="/produk" className="touch-target mb-4 inline-flex items-center text-sm text-text-muted hover:text-text-primary">
        Kembali ke katalog
      </Link>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail params={props.params} />
      </Suspense>
    </div>
  );
}
