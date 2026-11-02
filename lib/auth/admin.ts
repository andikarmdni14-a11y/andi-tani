import "server-only";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type AdminContext =
  | { status: "guest" }
  | { status: "forbidden"; email: string | null }
  | { status: "admin"; email: string | null; supabase: Awaited<ReturnType<typeof createClient>> };

// Memastikan user login DAN ber-role admin (dicek di database, bukan dari klien).
export async function getAdminContext(): Promise<AdminContext> {
  // Data sesi selalu per-request. Supabase memakai Date.now() untuk cek masa
  // berlaku token, jadi tandai eksplisit agar Next.js tidak mencoba prerender.
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return { status: "guest" };

  const email = typeof claims.email === "string" ? claims.email : null;
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) return { status: "forbidden", email };

  return { status: "admin", email, supabase };
}
