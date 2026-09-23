export type ProductStatus = "draft" | "published" | "out_of_stock" | "archived";

export type OrderStatus =
  | "new"
  | "confirmed"
  | "processing"
  | "ready_for_delivery"
  | "delivered"
  | "cancelled";

export type ProductColor = { name: string };

export type ProductImageRow = {
  id: string;
  product_id: string;
  url: string;
  is_main: boolean;
  color_tag: string | null;
  display_order: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  display_order: number;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  display_order: number;
  active: boolean;
};

/** Full admin-side product record, close to the `products` table shape. */
export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: string | null;
  sku: string | null;
  stock_quantity: number;
  colors: ProductColor[];
  sizes: string[];
  material: string | null;
  status: ProductStatus;
  featured: boolean;
  new_arrival: boolean;
  best_seller: boolean;
  available_for_sale: boolean;
  low_stock_threshold: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: string;
  updated_at: string;
  images: ProductImageRow[];
  category?: Category | null;
  collectionIds: string[];
};

/** Lightweight shape used by the public storefront pages. */
export type StorefrontProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  material: string | null;
  price: number;
  categoryName: string;
  collectionSlugs: string[];
  colors: string[];
  images: string[];
  stock: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
};

export type MediaItem = {
  id: string;
  url: string;
  file_name: string;
  file_type: string;
  usage_context: string | null;
  uploaded_at: string;
};

export type StoreSettings = {
  brand_name: string;
  tagline: string;
  phone: string;
  whatsapp_number: string;
  location: string;
  currency: string;
  whatsapp_greeting: string;
  whatsapp_closing: string;
  order_message_template: string;
  low_stock_threshold: number;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  location: string | null;
  created_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  color: string | null;
  quantity: number;
  price: number;
  subtotal: number;
};

export type AdminOrder = {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  location: string | null;
  note: string | null;
  total: number;
  status: OrderStatus;
  whatsapp_sent: boolean;
  created_at: string;
  updated_at: string;
  items: OrderItemRow[];
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  draft: "Draft",
  published: "Published",
  out_of_stock: "Out of stock",
  archived: "Archived",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  processing: "Processing",
  ready_for_delivery: "Ready for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const CATEGORY_OPTIONS = [
  "Tote",
  "Satchel",
  "Crossbody",
  "Shoulder Bag",
  "Handbag",
  "Mini Bag",
  "Clutch",
  "Other",
] as const;
