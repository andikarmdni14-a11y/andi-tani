"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cancelOrder, confirmOrder } from "@/app/admin/actions";
import { dangerButton, primaryButton } from "@/components/admin/fields";
import { notify } from "@/components/feedback/notify";
import type { OrderStatus } from "@/types/database";

export default function OrderActions({ code, status }: { code: string; status: OrderStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [shipping, setShipping] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (status === "cancelled") return null;

  function run(action: () => Promise<{ ok: boolean; message?: string }>, success: string) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.message ?? "Gagal memproses pesanan.");
        return;
      }
      notify(success);
      router.refresh();
    });
  }

  return (
    <div className="mt-4 border-t border-border-subtle pt-4">
      {error && (
        <p role="alert" className="mb-3 rounded-lg bg-brand-accent/10 px-3 py-2 text-sm text-brand-accent">{error}</p>
      )}
      <div className="flex flex-wrap items-end gap-2">
        {status === "pending" && (
          <>
            <div>
              <label htmlFor={`ongkir-${code}`} className="text-xs font-semibold">Ongkir (Rp)</label>
              <input
                id={`ongkir-${code}`}
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                placeholder="0"
                className="mt-1 h-11 w-32 rounded-lg border border-border-subtle bg-surface-light px-3"
              />
            </div>
            <button
              type="button"
              disabled={pending}
              className={primaryButton}
              onClick={() =>
                run(
                  () => confirmOrder(code, shipping === "" ? Number.NaN : Number(shipping)),
                  `Pesanan ${code} dikonfirmasi, stok sudah dikurangi.`,
                )
              }
            >
              {pending ? "Memproses..." : "Konfirmasi Pesanan"}
            </button>
          </>
        )}
        <button
          type="button"
          disabled={pending}
          className={dangerButton}
          onClick={() => {
            const note = status === "completed" ? " Stok akan dikembalikan." : "";
            if (!window.confirm(`Batalkan pesanan ${code}?${note}`)) return;
            run(() => cancelOrder(code), `Pesanan ${code} dibatalkan.`);
          }}
        >
          Batalkan
        </button>
      </div>
    </div>
  );
}
