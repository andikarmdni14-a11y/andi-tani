import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";
import Link from "next/link";
import OrderActions from "@/components/admin/OrderActions";
import { StatusBadge } from "@/components/account/OrderSummary";
import LoadError from "@/components/shop/LoadError";
import { getAdminContext } from "@/lib/auth/admin";
import { ORDER_WITH_ITEMS, type OrderWithItems } from "@/lib/data/orders";
import { formatDateTime, formatRupiah, ORDER_STATUS_LABEL } from "@/lib/format";
import { formatAddress } from "@/lib/whatsapp";
import type { OrderStatus } from "@/types/database";

export const metadata: Metadata = { title: "Pesanan" };

const STATUSES: OrderStatus[] = ["pending", "completed", "cancelled"];

function waLink(phone: string, code: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "62");
  const text = `Halo, ini admin Andi Tani terkait pesanan ${code}.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

async function AdminOrdersPageContent(props: PageProps<"/admin/pesanan">) {
  const params = await props.searchParams;
  const rawStatus = Array.isArray(params.status) ? params.status[0] : params.status;
  const status: OrderStatus = STATUSES.includes(rawStatus as OrderStatus) ? (rawStatus as OrderStatus) : "pending";
  const rawCode = (Array.isArray(params.kode) ? params.kode[0] : params.kode)?.trim().toUpperCase() ?? "";

  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return null;

  let query = ctx.supabase.from("orders").select(ORDER_WITH_ITEMS).order("created_at", { ascending: false }).limit(50);
  // Pencarian kode mengabaikan filter status agar pesanan pasti ketemu
  query = rawCode ? query.eq("order_code", rawCode.slice(0, 6)) : query.eq("status", status);
  const { data, error } = await query;
  const orders = (data ?? []) as unknown as OrderWithItems[];

  return (
    <>
      <h1 className="mb-6 text-3xl text-brand-primary">Pesanan</h1>

      <form className="mb-4 flex gap-2" action="/admin/pesanan">
        <label htmlFor="kode" className="sr-only">Cari kode pesanan</label>
        <input
          id="kode"
          name="kode"
          defaultValue={rawCode}
          maxLength={6}
          placeholder="Kode dari WhatsApp, misal TF5Y52"
          className="h-11 w-full max-w-xs rounded-lg border border-border-subtle bg-surface-light px-3 font-mono uppercase"
        />
        <button type="submit" className="touch-target rounded-lg bg-brand-primary px-4 text-sm font-semibold text-surface-light">Cari</button>
      </form>

      <nav aria-label="Filter status" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/pesanan?status=${s}`}
            aria-current={!rawCode && s === status ? "page" : undefined}
            className={`touch-target inline-flex shrink-0 items-center rounded-full border px-4 text-sm transition-colors duration-300 ${
              !rawCode && s === status ? "border-brand-primary bg-brand-primary font-semibold text-surface-light" : "border-border-subtle hover:border-brand-primary"
            }`}
          >
            {ORDER_STATUS_LABEL[s]}
          </Link>
        ))}
      </nav>

      {error ? (
        <LoadError what="Daftar pesanan" />
      ) : orders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-subtle p-10 text-center text-text-muted">
          {rawCode ? `Pesanan dengan kode ${rawCode} tidak ditemukan.` : "Belum ada pesanan di status ini."}
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-border-subtle p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xl font-bold tracking-widest">{order.order_code}</p>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-text-muted">{formatDateTime(order.created_at)}</p>

              <div className="mt-3 text-sm">
                <p className="font-semibold">{order.customer_name}</p>
                <a href={waLink(order.customer_phone, order.order_code)} target="_blank" rel="noopener noreferrer" className="text-brand-primary underline underline-offset-4">
                  {order.customer_phone}
                </a>
                <p className="mt-1 text-text-muted">
                  {formatAddress({
                    address_detail: order.shipping_address_detail,
                    district: order.shipping_district,
                    city: order.shipping_city,
                    province: order.shipping_province,
                    postal_code: order.shipping_postal_code,
                  })}
                </p>
              </div>

              <ul className="mt-3 space-y-1 border-t border-border-subtle pt-3 text-sm">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-4">
                    <span>{item.product?.name ?? "Produk"} x{item.quantity}</span>
                    <span>{formatRupiah(item.price_at_time * item.quantity)}</span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-border-subtle pt-2 font-semibold">
                  <span>Subtotal</span><span>{formatRupiah(order.total_amount)}</span>
                </li>
                {order.status === "completed" && (
                  <li className="flex justify-between text-text-muted">
                    <span>Ongkir</span><span>{formatRupiah(order.shipping_cost)}</span>
                  </li>
                )}
              </ul>

              <OrderActions code={order.order_code} status={order.status} />
            </article>
          ))}
        </div>
      )}
    </>
  );
}

// Batas Suspense di dalam halaman agar navigasi antar-menu admin tetap instan
export default function AdminOrdersPage(props: PageProps<"/admin/pesanan">) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminOrdersPageContent {...props} />
    </Suspense>
  );
}
