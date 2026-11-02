import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";
import CategoryManager from "@/components/admin/CategoryManager";
import LoadError from "@/components/shop/LoadError";
import { getAdminContext } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Kategori" };

async function AdminCategoriesPageContent() {
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return null;

  const { data, error } = await ctx.supabase.from("categories").select("*").order("created_at");

  return (
    <>
      <h1 className="mb-6 text-3xl text-brand-primary">Kategori</h1>
      {error || !data ? <LoadError what="Kategori" /> : <CategoryManager categories={data} />}
    </>
  );
}

// Batas Suspense di dalam halaman agar navigasi antar-menu admin tetap instan
export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminCategoriesPageContent />
    </Suspense>
  );
}
