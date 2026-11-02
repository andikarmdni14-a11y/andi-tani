import type { Metadata } from "next";
import { DM_Serif_Display, Karla } from "next/font/google";
import CartHydration from "@/components/providers/CartHydration";
import AppToaster from "@/components/feedback/AppToaster";
import "./globals.css";

const heading = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const body = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Andi Tani - Teman Hijau",
    template: "%s | Andi Tani",
  },
  description:
    "Tanaman hias, pupuk, dan perlengkapan berkebun. Teman setia bikin sudut rumah jadi adem dan hidup.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${heading.variable} ${body.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <CartHydration />
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
