"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import EmptyCartSprout from "@/components/shop/EmptyCartSprout";
import ProductImage from "@/components/shop/ProductImage";
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { formatRupiah } from "@/lib/format";
import { selectItemCount, selectSubtotal, useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";

// Laci keranjang dari kanan (PRD #59). Memakai <dialog> bawaan browser:
// fokus terkunci di dalam laci, tombol Esc menutup, latar belakang tidak bisa diklik.
export default function CartDrawer() {
  const ref = useRef<HTMLDialogElement>(null);
  const open = useUiStore((s) => s.cartOpen);
  const closeCart = useUiStore((s) => s.closeCart);

  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const count = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);
  const list = Object.values(items);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="judul-keranjang"
      onClose={closeCart}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
      className="cart-drawer fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-md bg-surface-light p-0 text-text-primary"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
          <h2 id="judul-keranjang" className="text-2xl text-brand-primary">
            Keranjang {count > 0 && <span className="font-body text-base text-text-muted">({count})</span>}
          </h2>
          <button type="button" onClick={closeCart} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-border-subtle" aria-label="Tutup keranjang">
            <CloseIcon />
          </button>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <EmptyCartSprout />
            <p className="mt-4 font-heading text-2xl text-brand-primary">Keranjang masih kosong</p>
            <p className="mt-1 text-sm text-text-muted">Pilih teman hijau pertamamu, nanti tunasnya tumbuh di sini.</p>
            <Link
              href="/produk"
              onClick={closeCart}
              className="touch-target mt-6 inline-flex items-center rounded-lg bg-brand-accent px-6 font-semibold text-surface-light hover:bg-brand-primary"
            >
              Mulai belanja
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border-subtle overflow-y-auto px-5">
              {list.map((item) => (
                <li key={item.productId} className="flex gap-3 py-4">
                  <ProductImage src={item.imageUrl} alt={item.name} sizes="80px" className="size-20 shrink-0 rounded-lg text-2xl" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/produk/${item.productId}`} onClick={closeCart} className="font-semibold leading-snug hover:text-brand-primary">
                      {item.name}
                    </Link>
                    <p className="text-sm text-text-muted">{formatRupiah(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-border-subtle">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="touch-target inline-flex items-center justify-center"
                          aria-label={`Kurangi ${item.name}`}
                        >
                          <MinusIcon />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="touch-target inline-flex items-center justify-center disabled:text-border-subtle"
                          aria-label={`Tambah ${item.name}`}
                        >
                          <PlusIcon />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="touch-target ml-auto inline-flex items-center justify-center rounded-lg text-text-muted hover:text-brand-accent"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                    {item.quantity >= item.stock && (
                      <p className="mt-1 text-xs text-text-muted">Sudah batas stok ({item.stock})</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border-subtle px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-xl font-semibold">{formatRupiah(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-text-muted">Ongkir dihitung admin dan dikabari lewat WhatsApp.</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="touch-target mt-4 flex w-full items-center justify-center rounded-lg bg-brand-accent font-semibold text-surface-light hover:bg-brand-primary"
              >
                Checkout via WhatsApp
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
