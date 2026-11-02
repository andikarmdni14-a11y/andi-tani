import { formatDateTime, formatRupiah, ORDER_STATUS_LABEL } from "@/lib/format";
import type { OrderWithItems } from "@/lib/data/orders";

export function StatusBadge({ status }: { status: OrderWithItems["status"] }) {
  const tone =
    status === "completed"
      ? "bg-brand-primary/10 text-brand-primary"
      : status === "cancelled"
        ? "bg-border-subtle text-text-muted"
        : "bg-brand-accent/10 text-brand-accent";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>{ORDER_STATUS_LABEL[status]}</span>;
}

export default function OrderSummary({ order }: { order: OrderWithItems }) {
  return (
    <article className="rounded-2xl border border-border-subtle p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-lg font-bold tracking-widest">{order.order_code}</p>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-xs text-text-muted">{formatDateTime(order.created_at)}</p>
      <ul className="mt-3 space-y-1 text-sm">
        {order.order_items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4">
            <span>{item.product?.name ?? "Produk"} x{item.quantity}</span>
            <span>{formatRupiah(item.price_at_time * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 space-y-1 border-t border-border-subtle pt-3 text-sm">
        <div className="flex justify-between"><span className="text-text-muted">Subtotal</span><span>{formatRupiah(order.total_amount)}</span></div>
        <div className="flex justify-between">
          <span className="text-text-muted">Ongkir</span>
          <span>{order.status === "completed" ? formatRupiah(order.shipping_cost) : "Menunggu admin"}</span>
        </div>
        {order.status === "completed" && (
          <div className="flex justify-between font-semibold">
            <span>Total</span><span>{formatRupiah(order.total_amount + order.shipping_cost)}</span>
          </div>
        )}
      </div>
    </article>
  );
}
