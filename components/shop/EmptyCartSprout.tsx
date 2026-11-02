// Animasi tunas tumbuh untuk keranjang kosong (PRD #63)
export default function EmptyCartSprout() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden className="mx-auto size-28">
      <path d="M30 96h60l-6 18H36z" className="fill-brand-accent/80" />
      <rect x="26" y="88" width="68" height="10" rx="3" className="fill-brand-accent" />
      <g className="origin-[60px_88px] animate-sprout">
        <path d="M60 88V52" className="stroke-brand-primary" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M60 62c0-14 10-22 26-22 0 15-10 22-26 22Z" className="fill-brand-primary" />
        <path d="M60 70c0-11-8-18-21-18 0 12 8 18 21 18Z" className="fill-brand-primary/70" />
      </g>
    </svg>
  );
}
