"use client";

import { CartIcon } from "@/components/ui/icons";
import { selectItemCount, useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";

// Ikon keranjang di header + lencana yang memantul saat jumlah berubah (PRD #59)
export default function CartButton() {
  const count = useCartStore(selectItemCount);
  const openCart = useUiStore((s) => s.openCart);

  return (
    <button
      type="button"
      onClick={openCart}
      className="touch-target relative inline-flex items-center justify-center rounded-lg text-surface-light hover:bg-surface-light/10"
      aria-label={`Buka keranjang, ${count} barang`}
      aria-haspopup="dialog"
    >
      <CartIcon />
      {count > 0 && (
        <span
          key={count}
          aria-hidden
          className="absolute right-0 top-1 flex min-w-5 animate-badge-bounce items-center justify-center rounded-full bg-brand-accent px-1 text-xs font-bold leading-5"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
