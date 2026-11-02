import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import CartButton from "@/components/shop/CartButton";
import NavLinks, { NavLinkList } from "@/components/shop/NavLinks";
import StickyHeader from "@/components/shop/StickyHeader";
import { SearchIcon, UserIcon } from "@/components/ui/icons";

export default function SiteHeader() {
  return (
    <StickyHeader>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-2 py-3 transition-[padding] duration-300 group-data-[scrolled=true]/header:py-1.5 md:gap-3">
          <Link href="/" className="shrink-0 rounded-lg" aria-label="Andi Tani, ke beranda">
            <Image
              src="/logo-light.webp"
              alt=""
              width={64}
              height={50}
              preload
              className="h-12 w-auto transition-[height] duration-300 group-data-[scrolled=true]/header:h-9"
            />
          </Link>

          <form action="/produk" role="search" className="relative ml-auto flex-1 md:max-w-sm">
            <label htmlFor="cari" className="sr-only">Cari produk</label>
            <input
              id="cari"
              name="q"
              type="search"
              placeholder="Cari tanaman atau pupuk"
              className="h-11 w-full rounded-lg bg-surface-light pl-4 pr-11 text-sm text-text-primary placeholder:text-text-muted"
            />
            <button type="submit" className="touch-target absolute inset-y-0 right-0 inline-flex items-center justify-center text-text-muted" aria-label="Cari">
              <SearchIcon />
            </button>
          </form>

          <Link href="/akun" className="touch-target inline-flex items-center justify-center rounded-lg text-surface-light hover:bg-surface-light/10" aria-label="Akun saya">
            <UserIcon />
          </Link>
          <CartButton />
        </div>
        <nav aria-label="Menu utama" className="pb-1">
          <Suspense fallback={<NavLinkList />}>
            <NavLinks />
          </Suspense>
        </nav>
      </div>
    </StickyHeader>
  );
}
