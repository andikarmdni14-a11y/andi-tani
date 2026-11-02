"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { deleteCareGuide, saveCareGuide } from "@/app/admin/actions";
import {
  FormMessage,
  TextField,
  dangerButton,
  primaryButton,
  secondaryButton,
} from "@/components/admin/fields";
import { careGuideSchema, type CareGuideFormValues } from "@/lib/validation/admin";
import type { CareGuide } from "@/types/database";

const EMPTY: CareGuideFormValues = {
  name: "",
  light_requirement: "",
  watering_frequency: "",
  fertilizer_type: "",
  difficulty_level: "",
};

function toValues(guide: CareGuide): CareGuideFormValues {
  return {
    name: guide.name,
    light_requirement: guide.light_requirement ?? "",
    watering_frequency: guide.watering_frequency ?? "",
    fertilizer_type: guide.fertilizer_type ?? "",
    difficulty_level: guide.difficulty_level ?? "",
  };
}

export default function CareGuideManager({ guides }: { guides: CareGuide[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<CareGuide | null>(null);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [pendingDelete, startDelete] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CareGuideFormValues>({ resolver: zodResolver(careGuideSchema), defaultValues: EMPTY });

  function startEdit(guide: CareGuide | null) {
    setEditing(guide);
    setMessage(null);
    reset(guide ? toValues(guide) : EMPTY);
  }

  async function onSubmit(values: CareGuideFormValues) {
    const result = await saveCareGuide({ id: editing?.id, values });
    if (!result.ok) return setMessage({ tone: "error", text: result.message });
    setMessage({ tone: "success", text: editing ? "Panduan diperbarui." : "Panduan ditambahkan." });
    startEdit(null);
    router.refresh();
  }

  function handleDelete(guide: CareGuide) {
    if (!window.confirm(`Hapus panduan "${guide.name}"? Produk yang memakainya akan menjadi tanpa panduan.`)) return;
    startDelete(async () => {
      const result = await deleteCareGuide(guide.id);
      if (!result.ok) return setMessage({ tone: "error", text: result.message });
      setMessage({ tone: "success", text: "Panduan dihapus." });
      if (editing?.id === guide.id) startEdit(null);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <ul className="order-2 divide-y divide-border-subtle rounded-2xl border border-border-subtle lg:order-1">
        {guides.length === 0 && <li className="p-6 text-center text-text-muted">Belum ada panduan.</li>}
        {guides.map((guide) => (
          <li key={guide.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{guide.name}</p>
              <p className="text-sm text-text-muted">
                {[guide.light_requirement, guide.watering_frequency, guide.difficulty_level].filter(Boolean).join(" / ") ||
                  "Detail belum diisi"}
              </p>
            </div>
            <button type="button" onClick={() => startEdit(guide)} className={secondaryButton}>Ubah</button>
            <button type="button" disabled={pendingDelete} onClick={() => handleDelete(guide)} className={dangerButton}>
              Hapus
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="order-1 space-y-4 rounded-2xl border border-border-subtle p-5 lg:order-2">
        <h2 className="text-xl">{editing ? `Ubah: ${editing.name}` : "Tambah panduan"}</h2>
        {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
        <TextField id="cg-name" label="Nama panduan" hint="Misal: Monstera & Philodendron" error={errors.name?.message} {...register("name")} />
        <TextField id="cg-light" label="Kebutuhan cahaya" hint="Misal: Cahaya terang tidak langsung" error={errors.light_requirement?.message} {...register("light_requirement")} />
        <TextField id="cg-water" label="Jadwal siram" hint="Misal: 2-3 kali seminggu" error={errors.watering_frequency?.message} {...register("watering_frequency")} />
        <TextField id="cg-fert" label="Jenis pupuk" hint="Misal: NPK cair sebulan sekali" error={errors.fertilizer_type?.message} {...register("fertilizer_type")} />
        <TextField id="cg-diff" label="Tingkat kesulitan" hint="Misal: Mudah" error={errors.difficulty_level?.message} {...register("difficulty_level")} />
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={isSubmitting} className={primaryButton}>
            {isSubmitting ? "Menyimpan..." : editing ? "Simpan perubahan" : "Tambah"}
          </button>
          {editing && (
            <button type="button" onClick={() => startEdit(null)} className={secondaryButton}>Batal</button>
          )}
        </div>
      </form>
    </div>
  );
}
