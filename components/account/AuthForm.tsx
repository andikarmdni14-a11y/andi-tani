"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormMessage, TextField, primaryButton, secondaryButton } from "@/components/admin/fields";
import { createClient } from "@/lib/supabase/client";

type Mode = "masuk" | "daftar";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/admin") ? value : "/akun";
}

function authErrorMessage(error: { code?: string; name?: string; status?: number }) {
  // Permintaan tidak sampai ke server Supabase (URL/key salah atau koneksi putus)
  if (error.name === "AuthRetryableFetchError" || error.status === 0) {
    return "Tidak bisa terhubung ke server. Periksa koneksi internet lalu coba lagi.";
  }
  switch (error.code) {
    case "invalid_credentials":
      return "Email atau kata sandi salah.";
    case "email_not_confirmed":
      return "Email belum dikonfirmasi. Cek kotak masuk email Anda.";
    case "user_already_exists":
      return "Email ini sudah terdaftar. Silakan masuk.";
    case "weak_password":
      return "Kata sandi terlalu lemah. Gunakan minimal 8 karakter.";
    case "email_address_not_authorized":
      return "Pendaftaran email sementara belum bisa dipakai. Silakan lanjutkan dengan Google.";
    case "over_email_send_rate_limit":
      return "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.";
    default:
      return "Terjadi kesalahan. Periksa koneksi lalu coba lagi.";
  }
}

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const [mode, setMode] = useState<Mode>("masuk");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(
    searchParams.get("error") ? { tone: "error", text: "Login gagal atau tautan sudah kedaluwarsa. Coba lagi." } : null,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const supabase = createClient();
    setPending(true);
    setMessage(null);

    if (mode === "masuk") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("[auth] signIn:", error.name, error.status, error.code, error.message);
        setPending(false);
        return setMessage({ tone: "error", text: authErrorMessage(error) });
      }
      router.replace(next);
      router.refresh();
      return;
    }

    const fullName = String(form.get("full_name") ?? "").trim();
    if (fullName.length < 2) {
      setPending(false);
      return setMessage({ tone: "error", text: "Nama lengkap minimal 2 karakter." });
    }
    if (password.length < 8) {
      setPending(false);
      return setMessage({ tone: "error", text: "Kata sandi minimal 8 karakter." });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setPending(false);
    if (error) return setMessage({ tone: "error", text: authErrorMessage(error) });

    if (data.session) {
      router.replace(next);
      router.refresh();
    } else {
      setMessage({ tone: "success", text: `Tautan konfirmasi sudah dikirim ke ${email}. Buka email lalu klik tautannya untuk mengaktifkan akun.` });
    }
  }

  async function signInWithGoogle() {
    setPending(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setPending(false);
      setMessage({ tone: "error", text: "Login Google belum bisa digunakan. Coba masuk dengan email." });
    }
  }

  return (
    <div>
      <div role="tablist" aria-label="Pilih aksi" className="mb-6 grid grid-cols-2 rounded-lg bg-border-subtle p-1">
        {(["masuk", "daftar"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setMessage(null);
            }}
            className={`touch-target rounded-md text-sm font-semibold transition-colors duration-300 ${mode === m ? "bg-surface-light text-brand-primary shadow-sm" : "text-text-muted"}`}
          >
            {m === "masuk" ? "Masuk" : "Daftar"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
        {mode === "daftar" && (
          <TextField id="full_name" name="full_name" label="Nama lengkap" autoComplete="name" required />
        )}
        <TextField id="email" name="email" type="email" label="Email" autoComplete="email" required />
        <TextField
          id="password"
          name="password"
          type="password"
          label="Kata sandi"
          hint={mode === "daftar" ? "Minimal 8 karakter." : undefined}
          autoComplete={mode === "masuk" ? "current-password" : "new-password"}
          required
        />
        <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
          {pending ? "Memproses..." : mode === "masuk" ? "Masuk" : "Buat akun"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-text-muted">
        <span className="h-px flex-1 bg-border-subtle" /> atau <span className="h-px flex-1 bg-border-subtle" />
      </div>
      <button type="button" onClick={signInWithGoogle} disabled={pending} className={`${secondaryButton} w-full`}>
        Lanjutkan dengan Google
      </button>
    </div>
  );
}
