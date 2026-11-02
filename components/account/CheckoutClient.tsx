"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProfileForm from "@/components/account/ProfileForm";
import { primaryButton, secondaryButton } from "@/components/admin/fields";
import { notify } from "@/components/feedback/notify";
import EmptyCartSprout from "@/components/shop/EmptyCartSprout";
import ProductImage from "@/components/shop/ProductImage";
import { formatRupiah } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { formatAddress } from "@/lib/whatsapp";
import { selectSubtotal, toOrderPayload, useCartStore } from "@/store/cart-store";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["users"]["Row"];

export default function CheckoutClient({ profile, complete }: { profile: Profile; complete: boolean }) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore(selectSubtotal);
  const [editing, setEditing] = useState(!complete);
  const [submitting, setSubmitting] = useState(false);
  const list = Object.values(items);

  if (list.length === 0) {
    return (
      <div className="py-12 text-center">
        <EmptyCartSprout />
        <p className="mt-4 font-heading text-2xl text-brand-primary">Keranjang masih kosong</p>
        <Link href="/produk" className={`${primaryButton} mt-6`}>Mulai belanja</Link>
      </div>
    );
  }

  async function placeOrder() {
    setSubmitting(true);
    const { data, error } = await createClient().rpc("create_order", { p_items: toOrderPayload(items) });
    if (error || !data) {
      setSubmitting(false);
      // Pesan error dari database sudah berbahasa Indonesia
      notify(error?.message ?? "Gagal membuat pesanan. Coba lagi.", "error");
      return;
    }
    clear();
    router.push(`/checkout/sukses?kode=${data.order_code}`);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <section aria-labelledby="judul-alamat">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="judul-alamat" className="text-2xl">Alamat pengiriman</h2>
          {complete && !editing && (
            <button type="button" onClick={() => setEditing(true)} className={secondaryButton}>Ubah</button>
          )}
        </div>
        {editing ? (
          <>
            {!complete && (
              <p className="mb-4 text-sm text-text-muted">Lengkapi data berikut sekali saja, berikutnya tersimpan otomatis.</p>
            )}
            <ProfileForm initial={profile} submitLabel="Simpan alamat" onSaved={() => setEditing(false)} />
          </>
        ) : (
          <div className="rounded-2xl border border-border-subtle p-5 text-sm leading-relaxed">
            <p className="font-semibold">{profile.full_name}</p>
            <p>{profile.phone_number}</p>
            <p className="mt-1 text-text-muted">
              {formatAddress({
                address_detail: profile.address_detail ?? "",
                district: profile.district ?? "",
                city: profile.city ?? "",
                province: profile.province ?? "",
                postal_code: profile.postal_code ?? "",
              })}
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="judul-ringkasan" className="h-fit rounded-2xl border border-border-subtle p-5 lg:sticky lg:top-32">
        <h2 id="judul-ringkasan" className="text-2xl">Ringkasan</h2>
        <ul className="mt-4 divide-y divide-border-subtle">
          {list.map((item) => (
            <li key={item.productId} className="flex gap-3 py-3">
              <ProductImage src={item.imageUrl} alt={item.name} sizes="56px" className="size-14 shrink-0 rounded-lg text-xl" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">{item.name}</p>
                <p className="text-text-muted">{item.quantity} x {formatRupiah(item.price)}</p>
              </div>
              <p className="text-sm font-semibold">{formatRupiah(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-border-subtle pt-3">
          <span className="text-text-muted">Subtotal</span>
          <span className="text-lg font-semibold">{formatRupiah(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-text-muted">
          Harga final dihitung ulang dari data toko. Ongkir diinformasikan admin lewat WhatsApp.
        </p>
        <button
          type="button"
          onClick={placeOrder}
          disabled={!complete || editing || submitting}
          className="touch-target mt-5 flex w-full items-center justify-center rounded-lg bg-brand-accent font-semibold text-surface-light hover:bg-brand-primary disabled:cursor-not-allowed disabled:bg-border-subtle disabled:text-text-muted"
        >
          {submitting ? "Membuat pesanan..." : "Buat Pesanan"}
        </button>
        {(!complete || editing) && (
          <p className="mt-2 text-center text-xs text-text-muted">Simpan alamat pengiriman terlebih dahulu.</p>
        )}
      </section>
    </div>
  );
}
