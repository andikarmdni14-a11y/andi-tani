"use client";

import { useEffect, useState, type ReactNode } from "react";

// Header yang menyusut + efek kaca buram saat halaman digulir (PRD #65)
export default function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="group/header sticky top-0 z-30 bg-brand-primary transition-[background-color,box-shadow] duration-300 data-[scrolled=true]:bg-brand-primary/90 data-[scrolled=true]:shadow-md data-[scrolled=true]:backdrop-blur-md"
    >
      {children}
    </header>
  );
}
