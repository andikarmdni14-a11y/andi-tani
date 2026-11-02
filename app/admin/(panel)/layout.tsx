import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { Skeleton } from "@/components/ui/Skeleton";
import { getAdminContext } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin Andi Tani" },
  robots: { index: false, follow: false },
};

async function AdminGate({ children }: { children: React.ReactNode }) {
  const ctx = await getAdminContext();
  if (ctx.status === "guest") redirect("/admin/login");

  if (ctx.status === "forbidden") {
    return (
      <main className="mx-auto max-w-md flex-1 px-4 py-16 text-center">
        <h1 className="text-3xl text-brand-primary">Akses ditolak</h1>
        <p className="mt-2 text-text-muted">
          Akun {ctx.email ?? "ini"} belum terdaftar sebagai admin. Minta pemilik toko menetapkan role admin
          lewat Supabase.
        </p>
      </main>
    );
  }

  return (
    <>
      <AdminNav email={ctx.email} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </>
  );
}

function AdminSkeleton() {
  return (
    <div role="status" aria-label="Memuat dashboard">
      <div className="h-[116px] bg-brand-primary" />
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-8">
        <Skeleton className="h-9 w-48" />
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
