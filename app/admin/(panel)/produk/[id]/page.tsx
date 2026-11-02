import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import LoadError from "@/components/shop/LoadError";
import { getAdminContext } from "@/lib/auth/admin";
import { getProductFormOptions } from "@/lib/data/admin";
import { UUID_PATTERN } from "@/lib/constants";

export const metadata: Metadata = { title: "Ubah Produk" };

async function EditProductPageContent(props: PageProps<"/admin/produk/[id]">) {
  const { id } = await props.params;
  if (!UUID_PATTERN.test(id)) notFound();

  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return null;

  const [{ data: product, error }, options] = await Promise.all([
    ctx.supabase.from("products").select("*").eq("id", id).maybeSingle(),
    getProductFormOptions(ctx.supabase),
  ]);

  if (!error && !product) notFound();

  return (
    <>
      <h1 className="mb-6 text-3xl text-brand-primary">Ubah produk</h1>
      {error || !product || !options ? (
        <LoadError what="Data produk" />
      ) : (
        <ProductForm product={product} categories={options.categories} careGuides={options.careGuides} />
      )}
    </>
  );
}

// Batas Suspense di dalam halaman agar navigasi antar-menu admin tetap instan
export default function EditProductPage(props: PageProps<"/admin/produk/[id]">) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <EditProductPageContent {...props} />
    </Suspense>
  );
}
