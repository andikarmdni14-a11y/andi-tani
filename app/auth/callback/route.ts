import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Tujuan redirect setelah login Google (OAuth PKCE).
// Daftarkan URL ini di Supabase: Authentication > URL Configuration > Redirect URLs.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/akun";
  // Cegah open redirect ke domain lain
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/masuk?error=oauth`);
}
