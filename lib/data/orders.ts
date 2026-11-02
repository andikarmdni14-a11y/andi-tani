import type { Order } from "@/types/database";

// Kolom pesanan beserta item untuk tampilan pelanggan & admin
export const ORDER_WITH_ITEMS =
  "*, order_items(id, quantity, price_at_time, product:products(id, name))";

export type OrderWithItems = Order & {
  order_items: {
    id: string;
    quantity: number;
    price_at_time: number;
    product: { id: string; name: string } | null;
  }[];
};

export const ORDER_CODE_PATTERN = /^[A-HJKMNP-Z2-9]{6}$/;
