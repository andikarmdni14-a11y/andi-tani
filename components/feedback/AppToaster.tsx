"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  // Di mobile digeser ke atas agar tidak menutupi bar keranjang bawah
  return (
    <Toaster
      position="bottom-center"
      offset={24}
      mobileOffset={{ bottom: 96 }}
      toastOptions={{ unstyled: true }}
    />
  );
}
