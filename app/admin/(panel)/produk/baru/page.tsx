import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";
import ProductForm from "@/components/admin/ProductForm";
import EmptyState from "@/components/ui/EmptyState";
import LoadError from "@/components/shop/LoadError";
import { getAdminContext } from "@/lib/auth/admin";
import { getProductFormOptions } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Tambah Produk" };

async function NewProductPageContent() {
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return null;

  const options = await getProductFormOptions(ctx.supabase);

  return (
    <>
      <h1 className="mb-6 text-3xl text-brand-primary">Tambah produk</h1>
      {!options ? (
        <LoadError what="Data kategori" />
      ) : options.categories.length === 0 ? (
        <EmptyState
          title="Buat kategori dulu"
          description="Setiap produk wajib punya kategori."
          action={{ href: "/admin/kategori", label: "Kelola kategori" }}
        />
      ) : (
        <ProductForm categories={options.categories} careGuides={options.careGuides} />
      )}
    </>
  );
}

// Batas Suspense di dalam halaman agar navigasi antar-menu admin tetap instan
export default function NewProductPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <NewProductPageContent />
    </Suspense>
  );
}
