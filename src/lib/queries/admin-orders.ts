import { supabase } from "@/lib/supabase/client";
import type { AdminOrder, OrderStatus } from "@/lib/types";

export async function listOrders(status?: OrderStatus | "all"): Promise<AdminOrder[]> {
  let query = supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });
  if (status && status !== "all") query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as AdminOrder[];
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}
