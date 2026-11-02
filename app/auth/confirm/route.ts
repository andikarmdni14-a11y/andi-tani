import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Konfirmasi email via token_hash (bekerja walau tautan dibuka di perangkat lain).
// Perlu template email Supabase diubah, lihat README bagian Login.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next") ?? "/akun";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/akun";

  const redirectTo = request.nextUrl.clone();
  redirectTo.search = "";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      redirectTo.pathname = next;
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = "/masuk";
  redirectTo.searchParams.set("error", "confirm");
  return NextResponse.redirect(redirectTo);
}
