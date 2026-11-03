"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setProductActive } from "@/app/admin/actions";
import { secondaryButton } from "@/components/admin/fields";

export default function ProductActiveToggle({
  id,
  isActive,
  name,
  className = "",
}: {
  id: string;
  isActive: boolean;
  name: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={className}>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await setProductActive(id, !isActive);
            if (!result.ok) setError(result.message);
            else router.refresh();
          })
        }
        className={`${secondaryButton} w-full`}
        aria-label={`${isActive ? "Nonaktifkan" : "Aktifkan"} ${name}`}
      >
        {pending ? "Menyimpan..." : isActive ? "Nonaktifkan" : "Aktifkan"}
      </button>
      {error && <p role="alert" className="mt-1 text-xs text-brand-accent">{error}</p>}
    </div>
  );
}
