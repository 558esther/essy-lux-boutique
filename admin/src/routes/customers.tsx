import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listCustomers } from "@/lib/queries/admin-customers";

export const Route = createFileRoute("/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: listCustomers,
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl uppercase tracking-wide">Customers</h2>
        <p className="text-xs text-muted-foreground">
          Built from order requests customers have created — no data is collected beyond what they submit.
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-border bg-shell md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Last order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  Loading customers…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No customers yet — they appear here after their first order request.
                </TableCell>
              </TableRow>
            )}
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.location ?? "—"}</TableCell>
                <TableCell>{c.orderCount}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {!isLoading && customers.length === 0 && (
          <p className="rounded-lg border border-border bg-shell py-8 text-center text-sm text-muted-foreground">No customers yet — they appear here after their first order request.</p>
        )}
        {isLoading && <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>}
        {customers.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-shell p-3 text-sm">
            <p className="font-medium">{c.name}</p>
            <a href={`tel:${c.phone}`} className="inline-block py-1 text-xs text-primary underline">
              {c.phone}
            </a>
            <p className="mt-1 text-xs text-muted-foreground">{c.location ?? "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {c.orderCount} {c.orderCount === 1 ? "order" : "orders"} · last:{" "}
              {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
