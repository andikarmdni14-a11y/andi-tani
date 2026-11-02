import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Gambar sudah di-resize ke WebP saat upload (thumb 400px & full 1000px),
    // jadi optimasi Vercel tidak dipakai. Loader hanya memilih varian.
    loaderFile: "./lib/image-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
