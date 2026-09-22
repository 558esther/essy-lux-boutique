import { supabase } from "@/lib/supabase/client";
import type { AdminProduct, ProductColor, ProductStatus } from "@/lib/types";
import { deleteImageByUrl, uploadImageFile } from "./storage";

const ADMIN_PRODUCT_SELECT = `
  *,
  category:categories ( id, name, slug ),
  images:product_images ( id, product_id, url, is_main, color_tag, display_order ),
  product_collections ( collection_id )
`;

type RawRow = Record<string, unknown> & {
  images: AdminProduct["images"];
  product_collections: { collection_id: string }[] | null;
};

function mapAdminProduct(row: RawRow): AdminProduct {
  const { product_collections, ...rest } = row;
  return {
    ...(rest as unknown as AdminProduct),
    price: Number(rest.price),
    images: [...(row.images ?? [])].sort((a, b) => a.display_order - b.display_order),
    collectionIds: (product_collections ?? []).map((pc) => pc.collection_id),
  };
}

export type ProductFilters = {
  search?: string;
  status?: ProductStatus | "all";
  categoryId?: string | "all";
  featured?: boolean;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc" | "stock";
};

export async function listProducts(filters: ProductFilters = {}): Promise<AdminProduct[]> {
  let query = supabase.from("products").select(ADMIN_PRODUCT_SELECT);

  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.categoryId && filters.categoryId !== "all") query = query.eq("category_id", filters.categoryId);
  if (filters.featured) query = query.eq("featured", true);
  if (filters.search?.trim()) {
    const q = filters.search.trim().replace(/[%,]/g, "");
    query = query.or(`name.ilike.%${q}%,sku.ilike.%${q}%`);
  }

  switch (filters.sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "stock":
      query = query.order("stock_quantity", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as RawRow[] | null ?? []).map(mapAdminProduct);
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapAdminProduct(data as unknown as RawRow) : null;
}

export type ProductInput = {
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
  collectionIds: string[];
};

async function syncProductCollections(productId: string, collectionIds: string[]) {
  await supabase.from("product_collections").delete().eq("product_id", productId);
  if (collectionIds.length > 0) {
    const { error } = await supabase
      .from("product_collections")
      .insert(collectionIds.map((collection_id) => ({ product_id: productId, collection_id })));
    if (error) throw error;
  }
}

export async function createProduct(input: ProductInput): Promise<string> {
  const { collectionIds, ...fields } = input;
  const { data, error } = await supabase.from("products").insert(fields).select("id").single();
  if (error) throw error;
  await syncProductCollections(data.id as string, collectionIds);
  return data.id as string;
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  const { collectionIds, ...fields } = input;
  const { error } = await supabase.from("products").update(fields).eq("id", id);
  if (error) throw error;
  await syncProductCollections(id, collectionIds);
}

export async function updateProductStatus(id: string, status: ProductStatus): Promise<void> {
  const { error } = await supabase.from("products").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function archiveProduct(id: string): Promise<void> {
  await updateProductStatus(id, "archived");
}

export async function deleteProductPermanently(id: string): Promise<void> {
  const product = await getProductById(id);
  if (product) {
    await Promise.all(product.images.map((img) => deleteImageByUrl(img.url)));
  }
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProductImage(file: File): Promise<string> {
  return uploadImageFile(file, "products");
}

export async function addProductImage(
  productId: string,
  url: string,
  opts: { isMain?: boolean; colorTag?: string | null; displayOrder?: number } = {},
): Promise<void> {
  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    url,
    is_main: opts.isMain ?? false,
    color_tag: opts.colorTag ?? null,
    display_order: opts.displayOrder ?? 0,
  });
  if (error) throw error;
}

export async function removeProductImage(imageId: string, url: string): Promise<void> {
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) throw error;
  await deleteImageByUrl(url);
}

export async function setMainProductImage(productId: string, imageId: string): Promise<void> {
  await supabase.from("product_images").update({ is_main: false }).eq("product_id", productId);
  const { error } = await supabase.from("product_images").update({ is_main: true }).eq("id", imageId);
  if (error) throw error;
}

/**
 * Reconciles a product's image rows with the final ordered list shown in the
 * editor (index 0 = main). Removed images are deleted from the DB and storage;
 * new ones (no `id` yet) are inserted; the rest just get their order updated.
 */
export async function syncProductImages(
  productId: string,
  current: { id?: string; url: string }[],
  original: AdminProduct["images"],
): Promise<void> {
  const keptIds = new Set(current.filter((c) => c.id).map((c) => c.id));
  const removed = original.filter((img) => !keptIds.has(img.id));
  await Promise.all(removed.map((img) => removeProductImage(img.id, img.url)));

  for (let i = 0; i < current.length; i++) {
    const img = current[i];
    if (img.id) {
      const { error } = await supabase
        .from("product_images")
        .update({ is_main: i === 0, display_order: i })
        .eq("id", img.id);
      if (error) throw error;
    } else {
      await addProductImage(productId, img.url, { isMain: i === 0, displayOrder: i });
    }
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
