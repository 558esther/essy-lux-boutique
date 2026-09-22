import { supabase } from "@/lib/supabase/client";
import type { StoreSettings } from "@/lib/types";

export async function getSettings(): Promise<StoreSettings> {
  const { data, error } = await supabase.from("settings").select("*").eq("id", true).single();
  if (error) throw error;
  return data;
}

export async function updateSettings(input: Partial<StoreSettings>): Promise<void> {
  const { error } = await supabase.from("settings").update(input).eq("id", true);
  if (error) throw error;
}
