"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { getAdminContext } from "@/lib/auth/admin";
import { CATALOG_TAG, PRODUCT_IMAGE_BUCKET } from "@/lib/constants";
import {
  careGuideSchema,
  categorySchema,
  idSchema,
  productSchema,
  type CareGuideFormValues,
  type CategoryFormValues,
  type ProductFormValues,
} from "@/lib/validation/admin";

export type ActionResult = { ok: true } | { ok: false; message: string };

const FORBIDDEN: ActionResult = {
  ok: false,
  message: "Sesi admin berakhir atau akun bukan admin. Silakan masuk ulang.",
};
const INVALID: ActionResult = { ok: false, message: "Data tidak valid. Periksa kembali isian form." };

async function requireAdmin() {
  const ctx = await getAdminContext();
  return ctx.status === "admin" ? ctx.supabase : null;
}

function dbError(code: string | undefined, fallback: string): ActionResult {
  if (code === "23505") return { ok: false, message: "Nama ini sudah dipakai. Gunakan nama lain." };
  if (code === "23503") return { ok: false, message: fallback };
  return { ok: false, message: "Gagal menyimpan ke database. Coba lagi." };
}

// ---------- Produk ----------

export async function saveProduct(input: {
  id: string;
  isNew: boolean;
  values: ProductFormValues;
  imageUrl: string | null;
}): Promise<ActionResult> {
  const supabase = await requireAdmin();
  if (!supabase) return FORBIDDEN;

  const id = idSchema.safeParse(input.id);
  const values = productSchema.safeParse(input.values);
  if (!id.success || !values.success) return INVALID;

  // URL gambar hanya boleh menunjuk ke folder produk ini di bucket resmi
  const allowedPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${id.data}/full.webp`;
  if (input.imageUrl !== null && !input.imageUrl.startsWith(allowedPrefix)) return INVALID;

  const row = {
    ...values.data,
    description: values.data.description || null,
    care_guide_id: values.data.care_guide_id || null,
    image_url: input.imageUrl,
  };

  const { error } = input.isNew
    ? await supabase.from("products").insert({ id: id.data, ...row })
    : await supabase.from("products").update(row).eq("id", id.data);

  if (error) return dbError(error.code, "Kategori atau panduan yang dipilih sudah tidak ada.");

  updateTag(CATALOG_TAG);
  return { ok: true };
}

export async function setProductActive(productId: string, isActive: boolean): Promise<ActionResult> {
  const supabase = await requireAdmin();
  if (!supabase) return FORBIDDEN;

  const id = idSchema.safeParse(productId);
  if (!id.success) return INVALID;

  const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", id.data);
  if (error) return dbError(error.code, "Produk tidak ditemukan.");

  updateTag(CATALOG_TAG);
  return { ok: true };
}

// ---------- Kategori ----------

export async function saveCategory(input: { id?: string; values: CategoryFormValues }): Promise<ActionResult> {
  const supabase = await requireAdmin();
  if (!supabase) return FORBIDDEN;

  const values = categorySchema.safeParse(input.values);
  if (!values.success) return INVALID;
  const row = { name: values.data.name, description: values.data.description || null };

  let error;
  if (input.id) {
    const id = idSchema.safeParse(input.id);
    if (!id.success) return INVALID;
    ({ error } = await supabase.from("categories").update(row).eq("id", id.data));
  } else {
    ({ error } = await supabase.from("categories").insert(row));
  }
  if (error) return dbError(error.code, "Kategori tidak ditemukan.");

  updateTag(CATALOG_TAG);
  return { ok: true };
}

export async function deleteCategory(categoryId: string): Promise<ActionResult> {
  const supabase = await requireAdmin();
  if (!supabase) return FORBIDDEN;

  const id = idSchema.safeParse(categoryId);
  if (!id.success) return INVALID;

  const { error } = await supabase.from("categories").delete().eq("id", id.data);
  if (error) {
    return dbError(
      error.code,
      "Kategori ini masih dipakai produk. Pindahkan produknya ke kategori lain dulu.",
    );
  }

  updateTag(CATALOG_TAG);
  return { ok: true };
}

// ---------- Panduan Perawatan ----------

export async function saveCareGuide(input: { id?: string; values: CareGuideFormValues }): Promise<ActionResult> {
  const supabase = await requireAdmin();
  if (!supabase) return FORBIDDEN;

  const values = careGuideSchema.safeParse(input.values);
  if (!values.success) return INVALID;
  const v = values.data;
  const row = {
    name: v.name,
    light_requirement: v.light_requirement || null,
    watering_frequency: v.watering_frequency || null,
    fertilizer_type: v.fertilizer_type || null,
    difficulty_level: v.difficulty_level || null,
  };

  let error;
  if (input.id) {
    const id = idSchema.safeParse(input.id);
    if (!id.success) return INVALID;
    ({ error } = await supabase.from("care_guides").update(row).eq("id", id.data));
  } else {
    ({ error } = await supabase.from("care_guides").insert(row));
  }
  if (error) return dbError(error.code, "Panduan tidak ditemukan.");

  updateTag(CATALOG_TAG);
  return { ok: true };
}

export async function deleteCareGuide(guideId: string): Promise<ActionResult> {
  const supabase = await requireAdmin();
  if (!supabase) return FORBIDDEN;

  const id = idSchema.safeParse(guideId);
  if (!id.success) return INVALID;

  // Produk yang memakai panduan ini otomatis menjadi tanpa panduan (ON DELETE SET NULL)
  const { error } = await supabase.from("care_guides").delete().eq("id", id.data);
  if (error) return dbError(error.code, "Panduan tidak ditemukan.");

  updateTag(CATALOG_TAG);
  return { ok: true };
}

// ---------- Pesanan ----------

const shippingSchema = z
  .number({ error: "Ongkir wajib diisi angka." })
  .int("Ongkir harus bilangan bulat.")
  .min(0, "Ongkir tidak boleh minus.")
  .max(10_000_000, "Ongkir terlalu besar.");

export async function confirmOrder(orderCode: string, shippingCost: number): Promise<ActionResult> {
  const supabase = await requireAdmin();
  if (!supabase) return FORBIDDEN;

  const cost = shippingSchema.safeParse(shippingCost);
  if (!cost.success) return { ok: false, message: cost.error.issues[0]?.message ?? "Ongkir tidak valid." };

  // Validasi stok & pengurangan stok terjadi atomik di fungsi database
  const { error } = await supabase.rpc("confirm_order", {
    p_order_code: orderCode,
    p_shipping_cost: cost.data,
  });
  if (error) return { ok: false, message: error.message };

  updateTag(CATALOG_TAG);
  return { ok: true };
}

export async function cancelOrder(orderCode: string): Promise<ActionResult> {
  const supabase = await requireAdmin();
  if (!supabase) return FORBIDDEN;

  const { error } = await supabase.rpc("cancel_order", { p_order_code: orderCode });
  if (error) return { ok: false, message: error.message };

  updateTag(CATALOG_TAG);
  return { ok: true };
}
