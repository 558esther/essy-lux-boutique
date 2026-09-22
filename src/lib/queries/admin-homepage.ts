import { supabase } from "@/lib/supabase/client";

export type HomepageSections = Record<string, Record<string, string>>;

export async function getAllHomepageSections(): Promise<HomepageSections> {
  const { data, error } = await supabase.from("homepage_content").select("key, value");
  if (error) throw error;
  const map: HomepageSections = {};
  for (const row of data ?? []) map[row.key] = row.value as Record<string, string>;
  return map;
}

export async function saveHomepageSection(key: string, value: Record<string, string>): Promise<void> {
  const { error } = await supabase
    .from("homepage_content")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}
