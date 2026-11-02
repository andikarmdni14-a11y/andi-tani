import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import OrderSummary from "@/components/account/OrderSummary";
import ProfileForm from "@/components/account/ProfileForm";
import SignOutButton from "@/components/account/SignOutButton";
import { primaryButton } from "@/components/admin/fields";
import { Skeleton } from "@/components/ui/Skeleton";
import { getCurrentUser } from "@/lib/auth/user";
import { ORDER_WITH_ITEMS, type OrderWithItems } from "@/lib/data/orders";

export const metadata: Metadata = { title: "Akun Saya", robots: { index: false } };

async function Account() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk?next=/akun");

  const { data } = await user.supabase
    .from("orders")
    .select(ORDER_WITH_ITEMS)
    .order("created_at", { ascending: false })
    .limit(20);
  const orders = (data ?? []) as unknown as OrderWithItems[];

  return (
    <>
      {user.profile?.role === "admin" && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-primary/30 bg-brand-primary/5 p-5">
          <div>
            <p className="font-semibold text-brand-primary">Akun ini terdaftar sebagai admin</p>
            <p className="text-sm text-text-muted">Kelola pesanan, produk, kategori, dan panduan dari dashboard.</p>
          </div>
          <Link href="/admin/pesanan" className={primaryButton}>Buka Dashboard Admin</Link>
        </div>
      )}
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <section aria-labelledby="judul-profil">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="judul-profil" className="text-2xl">Profil & alamat pengiriman</h2>
            {user.email && <p className="text-sm text-text-muted">{user.email}</p>}
          </div>
          <SignOutButton />
        </div>
        <ProfileForm initial={user.profile ?? {}} />
      </section>

      <section aria-labelledby="judul-pesanan">
        <h2 id="judul-pesanan" className="mb-4 text-2xl">Pesanan saya</h2>
        {orders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-subtle p-6 text-center text-sm text-text-muted">
            Belum ada pesanan.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderSummary key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
    </>
  );
}

export default function AkunPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="mb-8 text-4xl text-brand-primary">Akun Saya</h1>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <Account />
      </Suspense>
    </div>
  );
}
