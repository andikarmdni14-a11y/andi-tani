// Ikon garis khusus per kategori. Kategori baru dari admin memakai ikon daun.
type Props = { name: string; className?: string };

const svgProps = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ICONS: Record<string, React.ReactNode> = {
  // Bunga dengan kelopak
  "Tanaman Hias": (
    <>
      <circle cx="16" cy="11" r="2.4" />
      <path d="M16 8.6c0-3 1.6-4.6 0-6-1.6 1.4 0 3 0 6ZM18.4 11c3 0 4.6 1.6 6 0-1.4-1.6-3 0-6 0ZM13.6 11c-3 0-4.6-1.6-6 0 1.4 1.6 3 0 6 0ZM17.7 12.7c2.1 2.1 2.1 4.4 4.2 4.2.2-2.1-2.1-2.1-4.2-4.2ZM14.3 12.7c-2.1 2.1-2.1 4.4-4.2 4.2-.2-2.1 2.1-2.1 4.2-4.2Z" />
      <path d="M16 13.4V29M16 23c-2.5-2.6-5.5-2.8-7.5-1.6 1.6 2.4 4.6 3 7.5 1.6ZM16 21c2.2-2.2 4.8-2.4 6.6-1.4-1.4 2.1-4 2.6-6.6 1.4Z" />
    </>
  ),
  // Daun lebar bercorak (Aglaonema)
  Aglaonema: (
    <>
      <path d="M16 29c-6-5-8.5-12-5-20 7 3 8.5 10.5 5 20Z" />
      <path d="M16 29c5-3.5 9-9.5 7.5-17-6.5 1.5-9 8-7.5 17Z" />
      <path d="M12.8 13.5c1.2 3.6 2.4 8.4 3.2 15.5M21.3 15.5c-2.2 3.6-4.4 8.1-5.3 13.5" />
    </>
  ),
  // Daun sirih berbentuk hati + tetes
  "Tanaman Obat": (
    <>
      <path d="M16 28C9 23 5.5 17 7.6 12.3 9.4 8.5 13.7 8.6 16 11.6c2.3-3 6.6-3.1 8.4.7C26.5 17 23 23 16 28Z" />
      <path d="M16 11.6V28M16 17l-4-2.5M16 21.5l4.5-3" />
      <path d="M25 3.5s-2.4 2.6-2.4 4.2a2.4 2.4 0 0 0 4.8 0c0-1.6-2.4-4.2-2.4-4.2Z" />
    </>
  ),
  // Jeruk dengan daun
  "Buah & Rempah": (
    <>
      <circle cx="15" cy="19" r="9" />
      <path d="M15 10c.4-2.5 1.8-4.6 4-5.5M18 7.5c3-2.4 6.5-1.8 8 .2-2.6 2.3-5.6 2.1-8-.2Z" />
      <path d="M11 16.5h.01M18.5 22.5h.01M12.5 23h.01M19 15.5h.01" strokeWidth="2.4" />
    </>
  ),
  // Pot terakota dengan tunas
  Pot: (
    <>
      <path d="M7 17h18l-2.4 11H9.4L7 17Z" />
      <path d="M6 14.5h20V17H6z" />
      <path d="M16 14.5V9M16 10.5c0-3.4 2.4-5.4 6-5.4 0 3.6-2.4 5.4-6 5.4ZM16 12c0-2.6-2-4.2-4.8-4.2 0 2.8 2 4.2 4.8 4.2Z" />
    </>
  ),
  // Kantong pupuk
  Pupuk: (
    <>
      <path d="M9 8.5h14l1.5 19.5h-17L9 8.5Z" />
      <path d="M9 8.5 10.5 4h11L23 8.5" />
      <path d="M16 23v-5.5M16 19.5c0-2.6 1.8-4 4.4-4 0 2.6-1.8 4-4.4 4ZM16 20.8c0-2-1.4-3.2-3.4-3.2 0 2 1.4 3.2 3.4 3.2Z" />
    </>
  ),
  // Botol semprot
  "Pembasmi Hama": (
    <>
      <path d="M11 13.5h9v14.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V13.5Z" />
      <path d="M12.5 13.5V10h6v3.5M12.5 10l-1-4h8.5l2.5 2.5h-3.5V10" />
      <path d="M24.5 6.5h.01M27 9h.01M24.5 11.5h.01" strokeWidth="2.4" />
      <path d="M13.5 20h4M13.5 23.5h4" />
    </>
  ),
  // Gundukan tanah + sekop
  "Media Tanam": (
    <>
      <path d="M3.5 27c2.5-6 6.5-9 12.5-9s10 3 12.5 9H3.5Z" />
      <path d="M10 23.5h.01M15 21.5h.01M20.5 23h.01M13 25h.01" strokeWidth="2.4" />
      <path d="M21 16.5 26.5 5M24.4 9.4l3.6 1.7M22 18.5c-1.8-.9-2.4-2.6-1.7-4.2l1.3-2.7 3.8 1.8-1.3 2.7c-.7 1.6-2.3 2.2-2.1 2.4Z" />
    </>
  ),
};

const FALLBACK = (
  <>
    <path d="M16 29c-7-4-10-11-6-20 8 2 11 10 6 20Z" />
    <path d="M10.5 11c2.5 5 4.5 10.5 5.5 18" />
  </>
);

export default function CategoryIcon({ name, className = "size-10" }: Props) {
  return (
    <svg {...svgProps} className={className}>
      {ICONS[name] ?? FALLBACK}
    </svg>
  );
}
