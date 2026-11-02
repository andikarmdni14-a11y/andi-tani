import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
};

// Foto produk dengan cadangan berupa inisial nama jika belum ada foto.
export default function ProductImage({ src, alt, sizes, preload, className = "" }: Props) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-border-subtle font-heading text-5xl text-text-muted ${className}`}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-border-subtle ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
    </div>
  );
}
