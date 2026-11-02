"use client";

import { useRouter } from "next/navigation";
import { secondaryButton } from "@/components/admin/fields";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className={secondaryButton}
      onClick={async () => {
        await createClient().auth.signOut();
        router.replace("/");
        router.refresh();
      }}
    >
      Keluar
    </button>
  );
}
