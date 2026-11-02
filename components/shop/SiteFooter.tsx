import Image from "next/image";
import Link from "next/link";

const WA_NUMBER = (process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER ?? "").replace(/\D/g, "");

export default function SiteFooter() {
  return (
    <footer className="mt-20 bg-brand-primary pb-20 text-surface-light md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <Image src="/logo-light.webp" alt="Andi Tani" width={77} height={60} className="h-15 w-auto" />
          <p className="mt-2 max-w-xs text-sm text-surface-light/80">
            Teman setia bikin sudut rumah jadi adem dan hidup.
          </p>
        </div>
        <div>
          <p className="font-semibold">Belanja</p>
          <ul className="mt-2 space-y-1 text-sm text-surface-light/80">
            <li><Link href="/produk" className="hover:text-surface-light">Semua produk</Link></li>
            <li><Link href="/panduan" className="hover:text-surface-light">Panduan perawatan</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Butuh bantuan?</p>
          <p className="mt-2 text-sm text-surface-light/80">
            Tanya stok, cara rawat, atau status pesanan lewat WhatsApp.
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target mt-3 inline-flex items-center rounded-lg border border-surface-light/40 px-4 text-sm font-semibold hover:bg-surface-light hover:text-brand-primary"
          >
            Chat admin di WhatsApp
          </a>
        </div>
      </div>
      <p className="border-t border-surface-light/15 py-4 text-center text-xs text-surface-light/60">
        Andi Tani (Teman Hijau)
      </p>
    </footer>
  );
}
