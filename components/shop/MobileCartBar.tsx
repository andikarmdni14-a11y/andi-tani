"use client";

import { CartIcon } from "@/components/ui/icons";
import { formatRupiah } from "@/lib/format";
import { selectItemCount, selectSubtotal, useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";

// Sticky Cart Recap / Bottom Bar khusus mobile
export default function MobileCartBar() {
  const count = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);
  const openCart = useUiStore((s) => s.openCart);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-surface-light/95 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
      <button
        type="button"
        onClick={openCart}
        aria-haspopup="dialog"
        className="touch-target flex w-full items-center gap-3 rounded-xl bg-brand-primary px-4 text-surface-light"
      >
        <span className="relative">
          <CartIcon />
          {count > 0 && (
            <span key={count} aria-hidden className="absolute -right-2 -top-1.5 flex min-w-5 animate-badge-bounce items-center justify-center rounded-full bg-brand-accent px-1 text-xs font-bold leading-5">
              {count}
            </span>
          )}
        </span>
        <span className="flex-1 text-left text-sm">
          {count > 0 ? `${count} barang` : "Keranjang kosong"}
        </span>
        <span className="font-semibold">{count > 0 ? formatRupiah(subtotal) : "Lihat"}</span>
      </button>
    </div>
  );
}
