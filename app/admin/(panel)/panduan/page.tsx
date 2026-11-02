import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";
import CareGuideManager from "@/components/admin/CareGuideManager";
import LoadError from "@/components/shop/LoadError";
import { getAdminContext } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Panduan Perawatan" };

async function AdminCareGuidesPageContent() {
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return null;

  const { data, error } = await ctx.supabase.from("care_guides").select("*").order("name");

  return (
    <>
      <h1 className="mb-6 text-3xl text-brand-primary">Panduan Perawatan</h1>
      {error || !data ? <LoadError what="Panduan" /> : <CareGuideManager guides={data} />}
    </>
  );
}

// Batas Suspense di dalam halaman agar navigasi antar-menu admin tetap instan
export default function AdminCareGuidesPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminCareGuidesPageContent />
    </Suspense>
  );
}
