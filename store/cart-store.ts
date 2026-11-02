import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  quantity: number;
};

export type AddResult = "added" | "limited" | "out_of_stock";

type CartState = {
  // Hash map dengan Product ID sebagai key: akses, update, dan hapus O(1).
  items: Record<string, CartItem>;
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => AddResult;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},

      addItem: (product, quantity = 1) => {
        if (product.stock <= 0) return "out_of_stock";

        const current = get().items[product.productId]?.quantity ?? 0;
        const next = Math.min(current + quantity, product.stock);

        set((state) => ({
          items: {
            ...state.items,
            [product.productId]: { ...product, quantity: next },
          },
        }));

        return next < current + quantity ? "limited" : "added";
      },

      setQuantity: (productId, quantity) => {
        const item = get().items[productId];
        if (!item) return;

        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: {
            ...state.items,
            [productId]: { ...item, quantity: Math.min(quantity, item.stock) },
          },
        }));
      },

      removeItem: (productId) => {
        set((state) => {
          if (!(productId in state.items)) return state;
          const rest = { ...state.items };
          delete rest[productId];
          return { items: rest };
        });
      },

      clear: () => set({ items: {} }),
    }),
    {
      name: "andi-tani-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // Dihidrasi manual di client (CartHydration) agar tidak terjadi
      // hydration mismatch antara render server dan localStorage.
      skipHydration: true,
    },
  ),
);

// Selector turunan
export const selectItemCount = (state: CartState) =>
  Object.values(state.items).reduce((sum, item) => sum + item.quantity, 0);

export const selectSubtotal = (state: CartState) =>
  Object.values(state.items).reduce((sum, item) => sum + item.price * item.quantity, 0);

// Payload untuk RPC create_order
export const toOrderPayload = (items: Record<string, CartItem>) =>
  Object.values(items).map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
  }));
