import CartDrawer from "@/components/shop/CartDrawer";
import FloatingWhatsApp from "@/components/shop/FloatingWhatsApp";
import MobileCartBar from "@/components/shop/MobileCartBar";
import SiteFooter from "@/components/shop/SiteFooter";
import SiteHeader from "@/components/shop/SiteHeader";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingWhatsApp />
      <MobileCartBar />
      <CartDrawer />
    </>
  );
}
