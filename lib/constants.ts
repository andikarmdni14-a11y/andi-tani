export const PRODUCTS_PER_PAGE = 12;
export const FEATURED_LIMIT = 8;
export const CATALOG_TAG = "catalog";
export const PRODUCT_IMAGE_BUCKET = "product-images";

// Status yang boleh tampil & dibeli pelanggan
export const SELLABLE_STATUSES = ["Siap Jual", "Produk Umum"] as const;

export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
