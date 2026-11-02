"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

export default function CartHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
  return null;
}
