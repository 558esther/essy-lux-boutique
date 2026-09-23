import { supabase } from "@/lib/supabase/client";
import type { Category, Collection, StorefrontProduct, StoreSettings } from "@/lib/types";

const PRODUCT_SELECT = `
  id, name, slug, description, price, stock_quantity, colors, material,
  featured, new_arrival, best_seller,
  categories ( name ),
  product_images ( url, is_main, display_order ),
  product_collections ( collections ( slug ) )
`;

type RawProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock_quantity: number;
  colors: { name: string }[] | null;
  material: string | null;
  featured: boolean;
  new_arrival: boolean;
  best_seller: boolean;
  categories: { name: string } | null;
  product_images: { url: string; is_main: boolean; display_order: number }[] | null;
  product_collections: { collections: { slug: string } | null }[] | null;
};

function mapProduct(row: RawProductRow): StorefrontProduct {
  const images = [...(row.product_images ?? [])]
    .sort((a, b) => Number(b.is_main) - Number(a.is_main) || a.display_order - b.display_order)
    .map((img) => img.url);

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    material: row.material,
    price: Number(row.price),
    categoryName: row.categories?.name ?? "Handbag",
    collectionSlugs: (row.product_collections ?? [])
      .map((pc) => pc.collections?.slug)
      .filter((slug): slug is string => Boolean(slug)),
    colors: (row.colors ?? []).map((c) => c.name),
    images: images.length > 0 ? images : ["/placeholder.svg"],
    stock: row.stock_quantity,
    featured: row.featured,
    newArrival: row.new_arrival,
    bestSeller: row.best_seller,
  };
}

export async function fetchPublishedProducts(): Promise<StorefrontProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as RawProductRow[] | null ?? []).map(mapProduct);
}

export async function fetchProductBySlug(slug: string): Promise<StorefrontProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as unknown as RawProductRow) : null;
}

export function relatedProducts(all: StorefrontProduct[], product: StorefrontProduct, limit = 4) {
  return [...all]
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const aMatch = a.collectionSlugs.some((s) => product.collectionSlugs.includes(s)) ? 1 : 0;
      const bMatch = b.collectionSlugs.some((s) => product.collectionSlugs.includes(s)) ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, limit);
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("display_order");
  if (error) throw error;
  return data ?? [];
}

export async function fetchCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("active", true)
    .order("display_order");
  if (error) throw error;
  return data ?? [];
}

export async function fetchCollectionBySlug(slug: string): Promise<Collection | null> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchHomepageContent(): Promise<Record<string, Record<string, string>>> {
  const { data, error } = await supabase.from("homepage_content").select("key, value");
  if (error) throw error;
  const map: Record<string, Record<string, string>> = {};
  for (const row of data ?? []) map[row.key] = row.value as Record<string, string>;
  return map;
}

export async function fetchSettings(): Promise<StoreSettings | null> {
  const { data, error } = await supabase.from("settings").select("*").eq("id", true).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createOrderRequest(input: {
  customerName: string;
  customerPhone: string;
  location: string;
  note?: string;
  items: { productId?: string; productName: string; color: string; quantity: number; price: number }[];
}): Promise<{ orderId: string }> {
  const total = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let customerId: string | null = null;
  const { data: customer } = await supabase
    .from("customers")
    .upsert(
      { name: input.customerName, phone: input.customerPhone, location: input.location },
      { onConflict: "phone" },
    )
    .select("id")
    .maybeSingle();
  customerId = customer?.id ?? null;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      location: input.location,
      note: input.note ?? null,
      total,
      whatsapp_sent: true,
    })
    .select("id")
    .single();
  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId ?? null,
      product_name: item.productName,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    })),
  );
  if (itemsError) throw itemsError;

  return { orderId: order.id as string };
}
