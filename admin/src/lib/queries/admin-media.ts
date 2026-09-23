import { supabase } from "@/lib/supabase/client";
import type { MediaItem } from "@/lib/types";
import { deleteImageByUrl, uploadImageFile } from "./storage";

export async function listMedia(): Promise<MediaItem[]> {
  const { data, error } = await supabase.from("media").select("*").order("uploaded_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function uploadMedia(file: File, usageContext: string): Promise<MediaItem> {
  const url = await uploadImageFile(file, "media");
  const { data, error } = await supabase
    .from("media")
    .insert({ url, file_name: file.name, file_type: file.type, usage_context: usageContext })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMedia(id: string, url: string): Promise<void> {
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw error;
  await deleteImageByUrl(url);
}
