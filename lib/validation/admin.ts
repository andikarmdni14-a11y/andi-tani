import { z } from "zod";

// Dipakai bersama oleh form (React Hook Form) dan Server Action.

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} maksimal ${max} karakter.`);

const optionalText = (label: string, max: number) =>
  z.string().trim().max(max, `${label} maksimal ${max} karakter.`);

const wholeNumber = (label: string, max: number) =>
  z
    .number({ error: `${label} wajib diisi angka.` })
    .int(`${label} harus bilangan bulat.`)
    .min(0, `${label} tidak boleh minus.`)
    .max(max, `${label} maksimal ${max.toLocaleString("id-ID")}.`);

export const PLANT_STATUS_OPTIONS = [
  "Siap Jual",
  "Karantina",
  "Pembibitan",
  "Produk Umum",
] as const;

export const productSchema = z.object({
  name: requiredText("Nama produk", 120),
  description: optionalText("Deskripsi", 2000),
  price: wholeNumber("Harga", 100_000_000),
  stock: wholeNumber("Stok", 100_000),
  plant_status: z.enum(PLANT_STATUS_OPTIONS, { error: "Pilih status produk." }),
  category_id: z.uuid({ error: "Pilih kategori." }),
  // String kosong berarti tanpa panduan perawatan
  care_guide_id: z.union([z.uuid(), z.literal("")]),
  is_active: z.boolean(),
});
export type ProductFormValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: requiredText("Nama kategori", 60),
  description: optionalText("Deskripsi", 160),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;

export const careGuideSchema = z.object({
  name: requiredText("Nama panduan", 80),
  light_requirement: optionalText("Kebutuhan cahaya", 120),
  watering_frequency: optionalText("Jadwal siram", 120),
  fertilizer_type: optionalText("Jenis pupuk", 120),
  difficulty_level: optionalText("Tingkat kesulitan", 40),
});
export type CareGuideFormValues = z.infer<typeof careGuideSchema>;

export const idSchema = z.uuid();
