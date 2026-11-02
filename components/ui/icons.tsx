// Ikon garis sederhana (inline SVG, tanpa library tambahan).
type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  viewBox: "0 0 24 24",
};

export function CartIcon({ className = "size-6" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" />
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
    </svg>
  );
}

export function SearchIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  );
}

export function SunIcon({ className = "size-6" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </svg>
  );
}

export function DropIcon({ className = "size-6" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5s6 6.4 6 10.7a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5Z" />
    </svg>
  );
}

export function SproutIcon({ className = "size-6" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21v-9" />
      <path d="M12 12c0-4 3-6.5 7.5-6.5 0 4.5-3 6.5-7.5 6.5Z" />
      <path d="M12 14.5c0-3.2-2.4-5.2-6-5.2 0 3.6 2.4 5.2 6 5.2Z" />
    </svg>
  );
}

export function GaugeIcon({ className = "size-6" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="m12 17 3.5-5" />
    </svg>
  );
}

export function ChevronIcon({ className = "size-5", direction = "right" }: IconProps & { direction?: "left" | "right" }) {
  return (
    <svg {...base} className={className}>
      <path d={direction === "right" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} />
    </svg>
  );
}

export function PlusIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function CheckIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...base} strokeWidth={2.25} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function CloseIcon({ className = "size-6" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function UserIcon({ className = "size-6" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5" />
    </svg>
  );
}

export function TrashIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />
    </svg>
  );
}

// Logo WhatsApp disederhanakan (bentuk gelembung + gagang telepon)
export function WhatsAppIcon({ className = "size-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 2.2a9.7 9.7 0 0 0-8.3 14.8L2.4 21.6l4.7-1.2A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.3Z" />
    </svg>
  );
}
