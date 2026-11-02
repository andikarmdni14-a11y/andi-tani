"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Belanja" },
  { href: "/#kategori", label: "Kategori" },
  { href: "/panduan", label: "Panduan Perawatan" },
];

// Versi aktif-penanda (butuh URL, dirender di dalam Suspense)
export default function NavLinks() {
  return <NavLinkList activePath={usePathname()} />;
}

function isActive(href: string, pathname?: string) {
  if (!pathname || href.includes("#")) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

// Versi statis untuk fallback saat URL belum tersedia
export function NavLinkList({ activePath }: { activePath?: string }) {
  return (
    <ul className="-mx-4 flex gap-6 overflow-x-auto px-4 md:mx-0 md:gap-8 md:px-0">
      {LINKS.map((link) => {
        const active = isActive(link.href, activePath);
        return (
          <li key={link.href} className="shrink-0">
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`touch-target relative inline-flex items-center font-body text-[15px] font-medium transition-colors duration-300 md:text-base
                after:absolute after:inset-x-0 after:bottom-1.5 after:h-0.5 after:origin-left after:rounded-full after:bg-brand-accent after:transition-transform after:duration-300 after:ease-out
                ${active ? "text-surface-light after:scale-x-100" : "text-surface-light/85 after:scale-x-0 hover:text-surface-light hover:after:scale-x-100"}`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
