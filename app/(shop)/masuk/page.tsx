import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "@/components/account/AuthForm";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false },
};

export default function MasukPage() {
  return (
    <div className="mx-auto max-w-sm px-4 pt-12">
      <h1 className="text-4xl text-brand-primary">Halo, teman hijau</h1>
      <p className="mb-8 mt-2 text-text-muted">
        Masuk atau buat akun untuk menyimpan alamat pengiriman dan melacak pesanan.
      </p>
      <Suspense>
        <AuthForm />
      </Suspense>
    </div>
  );
}
