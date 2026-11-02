import EmptyState from "@/components/ui/EmptyState";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <EmptyState
        title="Produk tidak tersedia"
        description="Produk ini sudah tidak dijual atau tautannya salah."
        action={{ href: "/produk", label: "Lihat produk lain" }}
      />
    </div>
  );
}
