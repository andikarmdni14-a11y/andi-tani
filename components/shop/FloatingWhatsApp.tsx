import { WhatsAppIcon } from "@/components/ui/icons";

const WA_NUMBER = (process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER ?? "").replace(/\D/g, "");
const MESSAGE = "Halo Andi Tani, saya mau tanya soal tanaman.";

// Tombol WhatsApp melayang dengan riak ping (PRD #66)
export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tanya admin lewat WhatsApp"
      className="fixed bottom-24 right-4 z-30 flex size-14 items-center justify-center rounded-full bg-brand-primary text-surface-light shadow-lg md:bottom-6 md:right-6"
    >
      <span aria-hidden className="absolute inset-0 animate-wa-pulse rounded-full bg-brand-primary" />
      <WhatsAppIcon className="relative size-7" />
    </a>
  );
}
