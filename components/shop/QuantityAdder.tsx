"use client";

import { useState } from "react";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import type { CartItem } from "@/store/cart-store";

export default function QuantityAdder({ product }: { product: Omit<CartItem, "quantity"> }) {
  const [quantity, setQuantity] = useState(1);
  const max = Math.max(product.stock, 1);

  if (product.stock <= 0) {
    return <AddToCartButton product={product} />;
  }

  return (
    <div className="flex gap-3">
      <div className="flex items-center rounded-lg border border-border-subtle">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1}
          className="touch-target inline-flex items-center justify-center disabled:text-border-subtle"
          aria-label="Kurangi jumlah"
        >
          <MinusIcon />
        </button>
        <span className="w-10 text-center font-semibold" aria-live="polite" aria-label={`Jumlah ${quantity}`}>
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(max, q + 1))}
          disabled={quantity >= max}
          className="touch-target inline-flex items-center justify-center disabled:text-border-subtle"
          aria-label="Tambah jumlah"
        >
          <PlusIcon />
        </button>
      </div>
      <AddToCartButton product={product} quantity={quantity} className="flex-1" />
    </div>
  );
}
