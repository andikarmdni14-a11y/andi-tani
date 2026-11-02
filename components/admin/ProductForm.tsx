"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { saveProduct } from "@/app/admin/actions";
import {
  FormMessage,
  SelectField,
  TextAreaField,
  TextField,
  primaryButton,
  secondaryButton,
} from "@/components/admin/fields";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/constants";
import { toWebpVariants } from "@/lib/image-resize";
import { createClient } from "@/lib/supabase/client";
import {
  PLANT_STATUS_OPTIONS,
  productSchema,
  type ProductFormValues,
} from "@/lib/validation/admin";
import type { CareGuide, Category, Product } from "@/types/database";

// ?v= memaksa browser & CDN mengambil foto terbaru setelah diganti
function withVersion(url: string) {
  return `${url}?v=${Date.now()}`;
}

type Props = {
  product?: Product;
  categories: Pick<Category, "id" | "name">[];
  careGuides: Pick<CareGuide, "id" | "name">[];
};

export default function ProductForm({ product, categories, careGuides }: Props) {
  const router = useRouter();
  const isNew = !product;
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price,
      stock: product?.stock ?? 0,
      plant_status: product?.plant_status ?? "Siap Jual",
      category_id: product?.category_id ?? "",
      care_guide_id: product?.care_guide_id ?? "",
      is_active: product?.is_active ?? true,
    },
  });

  // Bersihkan blob URL pratinjau saat diganti atau komponen ditutup
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function handleFileChange(next: File | null) {
    setFile(next);
    setPreview(next ? URL.createObjectURL(next) : null);
  }

  async function onSubmit(values: ProductFormValues) {
    setServerError(null);
    const id = product?.id ?? crypto.randomUUID();
    let imageUrl = product?.image_url ?? null;

    try {
      if (file) {
        setStage("Mengompres foto...");
        const variants = await toWebpVariants(file);

        setStage("Mengunggah foto...");
        const storage = createClient().storage.from(PRODUCT_IMAGE_BUCKET);
        const options = { upsert: true, contentType: "image/webp", cacheControl: "31536000" };
        const [full, thumb] = await Promise.all([
          storage.upload(`${id}/full.webp`, variants.full, options),
          storage.upload(`${id}/thumb.webp`, variants.thumb, options),
        ]);
        if (full.error || thumb.error) {
          throw new Error("Foto gagal diunggah. Pastikan akun admin dan koneksi aman, lalu coba lagi.");
        }
        imageUrl = withVersion(storage.getPublicUrl(`${id}/full.webp`).data.publicUrl);
      }

      setStage("Menyimpan produk...");
      const result = await saveProduct({ id, isNew, values, imageUrl });
      if (!result.ok) throw new Error(result.message);

      router.push("/admin/produk");
      router.refresh();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Terjadi kesalahan. Coba lagi.");
      setStage(null);
    }
  }

  const currentImage = preview ?? product?.image_url ?? null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        {serverError && <FormMessage tone="error">{serverError}</FormMessage>}

        <TextField id="name" label="Nama produk" error={errors.name?.message} {...register("name")} />
        <TextAreaField
          id="description"
          label="Deskripsi"
          hint="Ceritakan ukuran, kondisi, dan isi paket. Tanpa emoji."
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="price"
            label="Harga (Rp)"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
          />
          <TextField
            id="stock"
            label="Stok"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            error={errors.stock?.message}
            {...register("stock", { valueAsNumber: true })}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField id="category_id" label="Kategori" error={errors.category_id?.message} {...register("category_id")}>
            <option value="">Pilih kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </SelectField>
          <SelectField
            id="plant_status"
            label="Status"
            hint="Karantina & Pembibitan tidak tampil di katalog."
            error={errors.plant_status?.message}
            {...register("plant_status")}
          >
            {PLANT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </SelectField>
        </div>

        <SelectField
          id="care_guide_id"
          label="Panduan perawatan"
          hint="Opsional. Kelola daftarnya di menu Panduan."
          error={errors.care_guide_id?.message}
          {...register("care_guide_id")}
        >
          <option value="">Tanpa panduan</option>
          {careGuides.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </SelectField>

        <label className="touch-target flex items-center gap-3">
          <input type="checkbox" className="size-5 accent-brand-primary" {...register("is_active")} />
          <span>Tampilkan di toko</span>
        </label>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Foto produk</p>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-border-subtle">
          {currentImage ? (
            preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- pratinjau lokal (blob URL)
              <img src={preview} alt="Pratinjau foto" className="size-full object-cover" />
            ) : (
              <Image src={currentImage} alt="Foto saat ini" fill sizes="280px" className="object-cover" />
            )
          ) : (
            <p className="flex size-full items-center justify-center p-4 text-center text-sm text-text-muted">
              Belum ada foto
            </p>
          )}
        </div>
        <label htmlFor="photo" className={`${secondaryButton} w-full cursor-pointer`}>
          {currentImage ? "Ganti foto" : "Pilih foto"}
        </label>
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-text-muted">
          JPG, PNG, atau WebP, maks. 10 MB. Otomatis dikompres ke WebP sebelum diunggah.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
        <button type="submit" disabled={isSubmitting} className={primaryButton}>
          {isSubmitting ? (stage ?? "Menyimpan...") : isNew ? "Simpan produk" : "Simpan perubahan"}
        </button>
        <Link href="/admin/produk" className={secondaryButton}>Batal</Link>
      </div>
    </form>
  );
}
