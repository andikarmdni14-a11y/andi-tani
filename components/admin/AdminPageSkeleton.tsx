import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminPageSkeleton() {
  return (
    <div role="status" aria-label="Memuat halaman" className="space-y-3">
      <Skeleton className="h-9 w-48" />
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}
