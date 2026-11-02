import "server-only";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Profil pelanggan yang sedang login, atau null jika belum login.
export async function getCurrentUser() {
  // Data sesi selalu per-request. Supabase memakai Date.now() untuk cek masa
  // berlaku token, jadi tandai eksplisit agar Next.js tidak mencoba prerender.
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const { data: profile } = await supabase.from("users").select("*").eq("id", claims.sub).maybeSingle();
  return {
    supabase,
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
    profile,
  };
}
