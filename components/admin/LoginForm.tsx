"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormMessage, TextField, primaryButton } from "@/components/admin/fields";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const nextParam = searchParams.get("next") ?? "";
  const next = nextParam.startsWith("/admin") ? nextParam : "/admin/pesanan";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);

    const { error } = await createClient().auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });

    if (error) {
      setPending(false);
      setError(
        error.code === "invalid_credentials"
          ? "Email atau kata sandi salah."
          : "Gagal masuk. Periksa koneksi lalu coba lagi.",
      );
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <TextField id="email" name="email" type="email" label="Email" autoComplete="email" required />
      <TextField id="password" name="password" type="password" label="Kata sandi" autoComplete="current-password" required />
      <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
        {pending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
