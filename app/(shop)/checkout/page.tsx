import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CheckoutClient from "@/components/account/CheckoutClient";
import { Skeleton } from "@/components/ui/Skeleton";
import { getCurrentUser } from "@/lib/auth/user";
import { isProfileComplete } from "@/lib/validation/profile";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

async function Checkout() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk?next=/checkout");
  if (!user.profile) redirect("/akun");

  return <CheckoutClient profile={user.profile} complete={isProfileComplete(user.profile)} />;
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="mb-8 text-4xl text-brand-primary">Checkout</h1>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <Checkout />
      </Suspense>
    </div>
  );
}
