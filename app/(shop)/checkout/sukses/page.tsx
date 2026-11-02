import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import OrderSummary from "@/components/account/OrderSummary";
import { secondaryButton } from "@/components/admin/fields";
import { Skeleton } from "@/components/ui/Skeleton";
import { WhatsAppIcon } from "@/components/ui/icons";
import { getCurrentUser } from "@/lib/auth/user";
import { ORDER_CODE_PATTERN, ORDER_WITH_ITEMS, type OrderWithItems } from "@/lib/data/orders";
import { buildOrderMessage, buildWhatsAppUrl, formatAddress } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Pesanan Dibuat", robots: { index: false } };

async function Success({ searchParams }: Pick<PageProps<"/checkout/sukses">, "searchParams">) {
  const params = await searchParams;
  const code = (Array.isArray(params.kode) ? params.kode[0] : params.kode)?.toUpperCase() ?? "";
  if (!ORDER_CODE_PATTERN.test(code)) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/masuk?next=${encodeURIComponent(`/checkout/sukses?kode=${code}`)}`);

  // RLS memastikan pelanggan hanya bisa membaca pesanannya sendiri
  const { data } = await user.supabase.from("orders").select(ORDER_WITH_ITEMS).eq("order_code", code).maybeSingle();
  if (!data) notFound();
  const order = data as unknown as OrderWithItems;

  const waUrl = buildWhatsAppUrl(
    buildOrderMessage({
      orderCode: order.order_code,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      address: formatAddress({
        address_detail: order.shipping_address_detail,
        district: order.shipping_district,
        city: order.shipping_city,
        province: order.shipping_province,
        postal_code: order.shipping_postal_code,
      }),
      subtotal: order.total_amount,
      items: order.order_items.map((item) => ({
        name: item.product?.name ?? "Produk",
        quantity: item.quantity,
        price: item.price_at_time,
      })),
    }),
  );

  return (
    <div className="mx-auto max-w-lg">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Satu langkah lagi</p>
      <h1 className="mt-2 text-4xl text-brand-primary">Kirim pesananmu ke WhatsApp admin</h1>
      <p className="mt-3 text-text-muted">
        Pesanan <strong className="font-mono text-text-primary">{order.order_code}</strong> sudah tercatat.
        Kirim pesan otomatis di bawah agar admin bisa cek stok, menghitung ongkir, dan mengonfirmasi pesananmu.
      </p>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="touch-target mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-accent font-semibold text-surface-light hover:bg-brand-primary"
      >
        <WhatsAppIcon className="size-6" />
        Kirim ke WhatsApp Admin
      </a>
      <div className="mt-8">
        <OrderSummary order={order} />
      </div>
      <Link href="/akun" className={`${secondaryButton} mt-6`}>Lihat semua pesanan</Link>
    </div>
  );
}

export default function SuksesPage(props: PageProps<"/checkout/sukses">) {
  return (
    <div className="px-4 pt-12">
      <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-lg rounded-2xl" />}>
        <Success searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
