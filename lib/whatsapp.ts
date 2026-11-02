import { formatRupiah } from "@/lib/format";

export type WhatsAppOrder = {
  orderCode: string;
  customerName: string;
  customerPhone: string;
  address: string;
  subtotal: number;
  items: { name: string; quantity: number; price: number }[];
};

// Kode pesanan wajib di baris paling atas agar admin mudah mencocokkan
// dengan dashboard.
export function buildOrderMessage(order: WhatsAppOrder): string {
  const lines = [
    `Kode Pesanan: ${order.orderCode}`,
    "",
    "Halo Andi Tani, saya mau pesan ini ya:",
    ...order.items.map(
      (item) =>
        `- ${item.name} x${item.quantity} = ${formatRupiah(item.price * item.quantity)}`,
    ),
    "",
    `Subtotal: ${formatRupiah(order.subtotal)}`,
    "Ongkir: menunggu info dari admin",
    "",
    `Nama: ${order.customerName}`,
    `No. HP: ${order.customerPhone}`,
    `Alamat: ${order.address}`,
  ];
  return lines.join("\n");
}

// encodeURIComponent mengubah setiap "\n" menjadi %0A.
export function buildWhatsAppUrl(message: string): string {
  const number = (process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER ?? "").replace(/\D/g, "");
  if (!number) {
    throw new Error("NEXT_PUBLIC_WA_ADMIN_NUMBER belum diisi.");
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function formatAddress(parts: {
  address_detail: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
}): string {
  return `${parts.address_detail}, Kec. ${parts.district}, ${parts.city}, ${parts.province} ${parts.postal_code}`;
}
