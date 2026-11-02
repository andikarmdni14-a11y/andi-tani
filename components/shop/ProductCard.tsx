import Link from "next/link";
import ProductImage from "@/components/shop/ProductImage";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { formatRupiah } from "@/lib/format";
import type { ProductCard as ProductCardData } from "@/lib/data/catalog";

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="flex flex-col">
      <Link href={`/produk/${product.id}`} className="group block rounded-xl [perspective:900px]">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="aspect-[4/5] w-full rounded-xl transition-transform duration-300 ease-out group-hover:[transform:scale(1.05)_rotateX(3deg)_rotateY(-2deg)]"
        />
        {product.category && (
          <p className="mt-3 text-xs text-text-muted">{product.category.name}</p>
        )}
        <h3 className="mt-1 font-body text-base font-semibold leading-snug group-hover:text-brand-primary">
          {product.name}
        </h3>
      </Link>
      <p className="mt-1 font-semibold text-brand-primary">{formatRupiah(product.price)}</p>
      <div className="mt-auto pt-3">
        <AddToCartButton
          product={{
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.image_url,
            stock: product.stock,
          }}
        />
      </div>
    </article>
  );
}
