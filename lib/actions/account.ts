"use server";

import { getCurrentUser } from "@/lib/auth/user";
import { profileSchema, type ProfileFormInput } from "@/lib/validation/profile";

export type ProfileActionResult = { ok: true } | { ok: false; message: string };

export async function updateProfile(input: ProfileFormInput): Promise<ProfileActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Sesi berakhir. Silakan masuk ulang." };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Data belum lengkap atau tidak valid." };

  // Kolom role tidak pernah dikirim dari sini (juga dijaga trigger di database)
  const { error } = await user.supabase.from("users").update(parsed.data).eq("id", user.id);
  if (error) return { ok: false, message: "Gagal menyimpan profil. Coba lagi." };

  return { ok: true };
}
