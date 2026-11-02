import ProductCard from "@/components/shop/ProductCard";
import type { ProductCard as ProductCardData } from "@/lib/data/catalog";

export default function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
