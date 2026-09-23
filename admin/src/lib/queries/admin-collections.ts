import { supabase } from "@/lib/supabase/client";
import type { Collection } from "@/lib/types";
import { slugify } from "./admin-products";

export async function listAllCollections(): Promise<(Collection & { productCount: number })[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*, product_collections(count)")
    .order("display_order");
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    ...row,
    productCount: row.product_collections?.[0]?.count ?? 0,
  }));
}

export type CollectionInput = {
  name: string;
  description: string | null;
  cover_image_url: string | null;
  display_order: number;
  active: boolean;
};

export async function createCollection(input: CollectionInput): Promise<string> {
  const { data, error } = await supabase
    .from("collections")
    .insert({ ...input, slug: slugify(input.name) })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateCollection(id: string, input: CollectionInput): Promise<void> {
  const { error } = await supabase
    .from("collections")
    .update({ ...input, slug: slugify(input.name) })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCollection(id: string): Promise<void> {
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) throw error;
}

export async function getCollectionProductIds(collectionId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("product_collections")
    .select("product_id")
    .eq("collection_id", collectionId);
  if (error) throw error;
  return (data ?? []).map((r) => r.product_id);
}

export async function setCollectionProducts(collectionId: string, productIds: string[]): Promise<void> {
  await supabase.from("product_collections").delete().eq("collection_id", collectionId);
  if (productIds.length > 0) {
    const { error } = await supabase
      .from("product_collections")
      .insert(productIds.map((product_id) => ({ product_id, collection_id: collectionId })));
    if (error) throw error;
  }
}
