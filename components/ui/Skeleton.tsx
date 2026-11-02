import { SproutIcon } from "@/components/ui/icons";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`shimmer rounded-lg ${className}`} />;
}

// Skeleton "tunas tumbuh" (PRD #57): siluet tunas berdenyut di atas shimmer
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div aria-hidden className="shimmer relative flex aspect-[4/5] w-full items-center justify-center rounded-xl">
        <SproutIcon className="size-12 animate-pulse text-text-muted/40" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Memuat produk"
      className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
