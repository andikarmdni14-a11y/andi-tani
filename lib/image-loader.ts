"use client";

// Custom loader next/image.
// Gambar produk disimpan di Supabase Storage dalam 2 varian WebP:
//   <product_id>/full.webp  (lebar 1000px)
//   <product_id>/thumb.webp (lebar 400px)
// URL tersimpan dapat berisi ?v=<timestamp> untuk memaksa refresh cache.
// Parameter ?w= dibutuhkan agar next/image tidak memberi peringatan.

const THUMB_MAX_WIDTH = 400;

type LoaderArgs = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width }: LoaderArgs): string {
  const [path, query = ""] = src.split("?");
  const params = new URLSearchParams(query);
  params.set("w", String(width));

  const finalPath =
    path.endsWith("/full.webp") && width <= THUMB_MAX_WIDTH
      ? path.replace(/\/full\.webp$/, "/thumb.webp")
      : path;

  return `${finalPath}?${params.toString()}`;
}
