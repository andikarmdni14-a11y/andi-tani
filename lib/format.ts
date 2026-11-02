const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number): string {
  return rupiah.format(value);
}

// Asumsi zona waktu toko: WIB (Asia/Jakarta)
const dateTime = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export function formatDateTime(value: string): string {
  return dateTime.format(new Date(value));
}

export const ORDER_STATUS_LABEL = {
  pending: "Menunggu konfirmasi",
  completed: "Dikonfirmasi",
  cancelled: "Dibatalkan",
} as const;
