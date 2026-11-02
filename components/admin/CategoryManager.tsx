"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import {
  FormMessage,
  TextField,
  dangerButton,
  primaryButton,
  secondaryButton,
} from "@/components/admin/fields";
import { categorySchema, type CategoryFormValues } from "@/lib/validation/admin";
import type { Category } from "@/types/database";

const EMPTY: CategoryFormValues = { name: "", description: "" };

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | null>(null);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [pendingDelete, startDelete] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema), defaultValues: EMPTY });

  function startEdit(category: Category | null) {
    setEditing(category);
    setMessage(null);
    reset(category ? { name: category.name, description: category.description ?? "" } : EMPTY);
  }

  async function onSubmit(values: CategoryFormValues) {
    const result = await saveCategory({ id: editing?.id, values });
    if (!result.ok) return setMessage({ tone: "error", text: result.message });
    setMessage({ tone: "success", text: editing ? "Kategori diperbarui." : "Kategori ditambahkan." });
    startEdit(null);
    router.refresh();
  }

  function handleDelete(category: Category) {
    if (!window.confirm(`Hapus kategori "${category.name}"?`)) return;
    startDelete(async () => {
      const result = await deleteCategory(category.id);
      if (!result.ok) return setMessage({ tone: "error", text: result.message });
      setMessage({ tone: "success", text: "Kategori dihapus." });
      if (editing?.id === category.id) startEdit(null);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <ul className="order-2 divide-y divide-border-subtle rounded-2xl border border-border-subtle lg:order-1">
        {categories.length === 0 && (
          <li className="p-6 text-center text-text-muted">Belum ada kategori.</li>
        )}
        {categories.map((category) => (
          <li key={category.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{category.name}</p>
              {category.description && <p className="text-sm text-text-muted">{category.description}</p>}
            </div>
            <button type="button" onClick={() => startEdit(category)} className={secondaryButton}>Ubah</button>
            <button type="button" disabled={pendingDelete} onClick={() => handleDelete(category)} className={dangerButton}>
              Hapus
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="order-1 space-y-4 rounded-2xl border border-border-subtle p-5 lg:order-2">
        <h2 className="text-xl">{editing ? `Ubah: ${editing.name}` : "Tambah kategori"}</h2>
        {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
        <TextField id="cat-name" label="Nama" error={errors.name?.message} {...register("name")} />
        <TextField
          id="cat-desc"
          label="Deskripsi singkat"
          hint="Tampil di bawah ikon kategori, misal: Biar ruangan adem"
          error={errors.description?.message}
          {...register("description")}
        />
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
