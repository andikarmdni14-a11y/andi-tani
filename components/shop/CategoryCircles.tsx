import Link from "next/link";
import { getCategories } from "@/lib/data/catalog";
import CategoryIcon from "@/components/shop/CategoryIcon";
import LoadError from "@/components/shop/LoadError";
import { Skeleton } from "@/components/ui/Skeleton";

export async function CategoryCircles() {
  const categories = await getCategories();
  if (!categories) return <LoadError what="Kategori" />;

  return (
    <ul className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-8 md:px-0">
      {categories.map((category) => (
        <li key={category.id} className="w-24 shrink-0 snap-start md:w-auto">
          <Link
            href={`/produk?kategori=${category.id}`}
            className="group flex flex-col items-center text-center"
          >
            <span className="flex size-20 items-center justify-center rounded-full border border-brand-accent/25 bg-logo-surface text-brand-accent transition-[transform,background-color,border-color] duration-300 ease-out group-hover:scale-105 group-hover:border-brand-accent/60 group-hover:bg-surface-light md:size-24">
              <CategoryIcon name={category.name} className="size-10 md:size-12" />
            </span>
            <span className="mt-3 text-sm font-semibold leading-tight text-text-primary">{category.name}</span>
            {category.description && (
              <span className="mt-0.5 text-xs leading-snug text-text-secondary">
                {category.description}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function CategoryCirclesSkeleton() {
  return (
    <div aria-hidden className="flex gap-5 overflow-hidden md:grid md:grid-cols-4 lg:grid-cols-8">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex w-24 shrink-0 flex-col items-center gap-3 md:w-auto">
          <Skeleton className="size-20 rounded-full md:size-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
