import { supabase } from "@/lib/supabase/client";
import type { Customer } from "@/lib/types";

export type CustomerWithStats = Customer & { orderCount: number; lastOrderAt: string | null };

export async function listCustomers(): Promise<CustomerWithStats[]> {
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const { data: orders } = await supabase
    .from("orders")
    .select("customer_id, created_at")
    .order("created_at", { ascending: false });

  return (customers ?? []).map((c) => {
    const theirOrders = (orders ?? []).filter((o) => o.customer_id === c.id);
    return {
      ...c,
      orderCount: theirOrders.length,
      lastOrderAt: theirOrders[0]?.created_at ?? null,
    };
  });
}
