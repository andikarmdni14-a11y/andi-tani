"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormMessage, TextAreaField, TextField, primaryButton } from "@/components/admin/fields";
import { notify } from "@/components/feedback/notify";
import { updateProfile } from "@/lib/actions/account";
import { profileSchema, type ProfileFormInput, type ProfileFormValues } from "@/lib/validation/profile";

type Props = {
  initial: Partial<Record<keyof ProfileFormInput, string | null>>;
  submitLabel?: string;
  onSaved?: () => void;
};

export default function ProfileForm({ initial, submitLabel = "Simpan profil", onSaved }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initial.full_name ?? "",
      phone_number: initial.phone_number ?? "",
      province: initial.province ?? "",
      city: initial.city ?? "",
      district: initial.district ?? "",
      postal_code: initial.postal_code ?? "",
      address_detail: initial.address_detail ?? "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setError(null);
    const result = await updateProfile(values);
    if (!result.ok) return setError(result.message);
    notify("Profil dan alamat tersimpan.");
    router.refresh();
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="full_name" label="Nama lengkap" autoComplete="name" error={errors.full_name?.message} {...register("full_name")} />
        <TextField id="phone_number" label="Nomor WhatsApp" type="tel" inputMode="tel" autoComplete="tel" placeholder="0812 3456 7890" error={errors.phone_number?.message} {...register("phone_number")} />
        <TextField id="province" label="Provinsi" autoComplete="address-level1" error={errors.province?.message} {...register("province")} />
        <TextField id="city" label="Kota/Kabupaten" autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
        <TextField id="district" label="Kecamatan" autoComplete="address-level3" error={errors.district?.message} {...register("district")} />
        <TextField id="postal_code" label="Kode pos" inputMode="numeric" autoComplete="postal-code" error={errors.postal_code?.message} {...register("postal_code")} />
      </div>
      <TextAreaField
        id="address_detail"
        label="Alamat lengkap"
        hint="Nama jalan, nomor rumah, RT/RW, dan patokan."
        autoComplete="street-address"
        error={errors.address_detail?.message}
        {...register("address_detail")}
      />
      <button type="submit" disabled={isSubmitting} className={primaryButton}>
        {isSubmitting ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}
