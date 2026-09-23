import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/StatusBadge";
import { listOrders, updateOrderStatus } from "@/lib/queries/admin-orders";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders", statusFilter],
    queryFn: () => listOrders(statusFilter),
  });

  async function handleStatusChange(id: string, status: OrderStatus) {
    await updateOrderStatus(id, status);
    toast.success("Order status updated.");
    queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl uppercase tracking-wide">Orders</h2>
          <p className="max-w-2xl text-xs text-muted-foreground">
            These are order <strong>requests</strong> customers created on the site before opening WhatsApp.
            An order appearing here means a request was saved — it does not confirm the customer actually
            pressed Send in WhatsApp. Always confirm the order on WhatsApp before processing it.
          </p>
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | "all")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-border bg-shell md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  Loading orders…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No order requests yet.
                </TableCell>
              </TableRow>
            )}
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{o.id.slice(0, 8)}</TableCell>
                <TableCell className="font-medium">{o.customer_name}</TableCell>
                <TableCell>{o.customer_phone}</TableCell>
                <TableCell className="max-w-[16rem]">
                  {o.items.map((i) => `${i.product_name} (${i.color ?? "—"}) ×${i.quantity}`).join(", ")}
                </TableCell>
                <TableCell>{formatPrice(o.total)}</TableCell>
                <TableCell>{o.location ?? "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Select value={o.status} onValueChange={(v) => handleStatusChange(o.id, v as OrderStatus)}>
                    <SelectTrigger className="h-8 w-40 text-xs">
                      <SelectValue>
                        <OrderStatusBadge status={o.status} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {!isLoading && orders.length === 0 && (
          <p className="rounded-lg border border-border bg-shell py-8 text-center text-sm text-muted-foreground">No order requests yet.</p>
        )}
        {isLoading && <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>}
        {orders.map((o) => (
          <div key={o.id} className="rounded-lg border border-border bg-shell p-3 text-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium">{o.customer_name}</p>
                <a href={`tel:${o.customer_phone}`} className="inline-block py-1 text-xs text-primary underline">
                  {o.customer_phone}
                </a>
              </div>
              <p className="shrink-0 font-medium">{formatPrice(o.total)}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {o.items.map((i) => `${i.product_name} (${i.color ?? "—"}) ×${i.quantity}`).join(", ")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {o.location ?? "—"} · {new Date(o.created_at).toLocaleDateString()}
            </p>
            <div className="mt-3">
              <Select value={o.status} onValueChange={(v) => handleStatusChange(o.id, v as OrderStatus)}>
                <SelectTrigger className="h-10 w-full text-xs">
                  <SelectValue>
                    <OrderStatusBadge status={o.status} />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
