import { supabase } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";
import { slugify } from "./admin-products";

export async function listAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("display_order");
  if (error) throw error;
  return data ?? [];
}

export type CategoryInput = {
  name: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  display_order: number;
};

export async function createCategory(input: CategoryInput): Promise<void> {
  const { error } = await supabase.from("categories").insert({ ...input, slug: slugify(input.name) });
  if (error) throw error;
}

export async function updateCategory(id: string, input: CategoryInput): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .update({ ...input, slug: slugify(input.name) })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}
