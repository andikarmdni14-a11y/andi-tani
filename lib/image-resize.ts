// Konversi foto ke 2 varian WebP di browser admin sebelum upload,
// tanpa library tambahan (Canvas API bawaan browser).

const VARIANTS = { full: 1000, thumb: 400 } as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export type WebpVariants = { full: Blob; thumb: Blob };

async function resize(bitmap: ImageBitmap, targetWidth: number): Promise<Blob> {
  const width = Math.min(targetWidth, bitmap.width);
  const height = Math.round((bitmap.height / bitmap.width) * width);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Browser tidak bisa memproses gambar.");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82),
  );
  if (!blob || blob.type !== "image/webp") {
    throw new Error(
      "Browser ini belum bisa mengubah foto ke WebP. Gunakan Chrome atau Edge versi terbaru.",
    );
  }
  return blob;
}

export async function toWebpVariants(file: File): Promise<WebpVariants> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar (JPG, PNG, atau WebP).");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran foto maksimal 10 MB.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    const [full, thumb] = await Promise.all([
      resize(bitmap, VARIANTS.full),
      resize(bitmap, VARIANTS.thumb),
    ]);
    return { full, thumb };
  } finally {
    bitmap.close();
  }
}
