"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { notify } from "@/components/feedback/notify";
import { CheckIcon } from "@/components/ui/icons";
import { useCartStore, type CartItem } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";

type Props = {
  product: Omit<CartItem, "quantity">;
  quantity?: number;
  className?: string;
};

type Ripple = { id: number; x: number; y: number };

// Morphing button (PRD #58): teks berubah menjadi ikon centang + efek riak
export default function AddToCartButton({ product, quantity = 1, className = "" }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);
  const [done, setDone] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(timer);
  }, [done]);

  const outOfStock = product.stock <= 0;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ripple = { id: event.timeStamp, x: event.clientX - rect.left, y: event.clientY - rect.top };
    setRipples((r) => [...r, ripple]);
    setTimeout(() => setRipples((r) => r.filter((item) => item.id !== ripple.id)), 650);

    const result = addItem(product, quantity);
    if (result === "added") {
      setDone(true);
      notify(`${product.name} masuk keranjang.`, "success", { label: "Lihat", onClick: openCart });
    } else if (result === "limited") {
      notify(`Stok ${product.name} hanya ${product.stock}. Jumlah di keranjang sudah maksimal.`, "error");
    }
  }

  return (
    <button
      type="button"
      disabled={outOfStock}
      onClick={handleClick}
      aria-label={outOfStock ? `${product.name} stok habis` : `Tambah ${product.name} ke keranjang`}
      className={`touch-target relative w-full overflow-hidden rounded-lg px-4 text-sm font-semibold text-surface-light transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-border-subtle disabled:text-text-muted ${
        done ? "bg-brand-primary" : "bg-brand-accent hover:bg-brand-primary"
      } ${className}`}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden
          className="pointer-events-none absolute size-10 -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-surface-light"
          style={{ left: r.x, top: r.y }}
        />
      ))}
      {outOfStock ? (
        "Stok habis"
      ) : done ? (
        <span className="inline-flex animate-check-in items-center gap-1.5">
          <CheckIcon />
          <span className="sr-only">Berhasil ditambahkan</span>
        </span>
      ) : (
        "Tambah ke Keranjang"
      )}
    </button>
  );
}
