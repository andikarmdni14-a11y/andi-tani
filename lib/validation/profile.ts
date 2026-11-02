import { z } from "zod";

const text = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, min <= 1 ? `${label} wajib diisi.` : `${label} minimal ${min} karakter.`)
    .max(max, `${label} maksimal ${max} karakter.`);

// Nomor HP Indonesia: 08xx / 628xx / +628xx (spasi & tanda hubung diabaikan)
export const phoneSchema = z
  .string()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .pipe(z.string().regex(/^(\+62|62|0)8\d{7,12}$/, "Nomor HP tidak valid. Contoh: 0812 3456 7890"));

export const profileSchema = z.object({
  full_name: text("Nama lengkap", 2, 80),
  phone_number: phoneSchema,
  province: text("Provinsi", 1, 60),
  city: text("Kota/Kabupaten", 1, 60),
  district: text("Kecamatan", 1, 60),
  postal_code: z.string().trim().regex(/^\d{5}$/, "Kode pos terdiri dari 5 angka."),
  address_detail: text("Alamat lengkap", 10, 300),
});

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileFormValues = z.output<typeof profileSchema>;

export function isProfileComplete(profile: Partial<Record<keyof ProfileFormValues, string | null>>) {
  return profileSchema.safeParse(
    Object.fromEntries(Object.entries(profile).map(([k, v]) => [k, v ?? ""])),
  ).success;
}
