"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin/pesanan", label: "Pesanan" },
  { href: "/admin/produk", label: "Produk" },
  { href: "/admin/kategori", label: "Kategori" },
  { href: "/admin/panduan", label: "Panduan" },
];

// Gaya tautan disamakan dengan navigasi toko: Karla 15-16px, medium, garis terakota
const linkBase =
  "touch-target relative inline-flex shrink-0 items-center font-body text-[15px] font-medium transition-colors duration-300 md:text-base after:absolute after:inset-x-0 after:bottom-1.5 after:h-0.5 after:origin-left after:rounded-full after:bg-brand-accent after:transition-transform after:duration-300 after:ease-out";

export default function AdminNav({ email }: { email: string | null }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 bg-brand-primary text-surface-light shadow-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-3 py-3">
          <Link href="/admin/pesanan" className="flex shrink-0 items-center gap-3 rounded-lg" aria-label="Dashboard Admin Andi Tani">
            <Image src="/logo-light.webp" alt="" width={56} height={44} className="h-11 w-auto" />
            <span className="hidden border-l border-surface-light/30 pl-3 font-heading text-xl sm:inline">Dashboard Admin</span>
          </Link>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            {email && (
              <span className="hidden max-w-56 truncate text-sm text-surface-light/80 lg:inline" title={email}>
                {email}
              </span>
            )}
            <Link
              href="/"
              className="touch-target inline-flex items-center rounded-lg px-3 text-[15px] font-medium text-surface-light/85 transition-colors duration-300 hover:bg-surface-light/10 hover:text-surface-light"
            >
              Lihat toko
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="touch-target rounded-lg border border-surface-light/40 px-4 text-[15px] font-semibold transition-colors duration-300 hover:bg-surface-light hover:text-brand-primary"
            >
              Keluar
            </button>
          </div>
        </div>

        <nav aria-label="Menu admin" className="-mx-4 overflow-x-auto px-4 pb-1">
          <ul className="flex gap-6 md:gap-8">
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`${linkBase} ${
                      active
                        ? "text-surface-light after:scale-x-100"
                        : "text-surface-light/85 after:scale-x-0 hover:text-surface-light hover:after:scale-x-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
