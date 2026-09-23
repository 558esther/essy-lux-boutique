import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ClipboardList, Heart, Package, PackageCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listProducts } from "@/lib/queries/admin-products";
import { listOrders } from "@/lib/queries/admin-orders";
import { formatPrice } from "@/lib/format";
import { STOREFRONT_URL } from "@/lib/storefront";

export const Route = createFileRoute("/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["admin", "products", "all"],
    queryFn: () => listProducts(),
  });
  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["admin", "orders", "all"],
    queryFn: () => listOrders(),
  });

  const live = products.filter((p) => p.status !== "archived");
  const inStock = live.filter((p) => p.stock_quantity > 0);
  const newArrivals = live.filter((p) => p.new_arrival);
  const featured = live.filter((p) => p.featured);
  const lowStock = live.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold);
  const outOfStock = live.filter((p) => p.stock_quantity === 0);
  const newOrders = orders.filter((o) => o.status === "new");

  const loading = loadingProducts || loadingOrders;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-wide">ESSY-LUX Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">Welcome back — here&apos;s what&apos;s happening in your store.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/products/new">+ Add Product</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/products">Manage Products</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={STOREFRONT_URL} target="_blank" rel="noopener noreferrer">
              View Shop
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/orders">View Orders</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Package} label="Total Products" value={live.length} loading={loading} />
        <StatCard icon={PackageCheck} label="In Stock" value={inStock.length} loading={loading} />
        <StatCard icon={Sparkles} label="New Arrivals" value={newArrivals.length} loading={loading} />
        <StatCard icon={Heart} label="Featured" value={featured.length} loading={loading} />
        <StatCard icon={ClipboardList} label="Order Requests" value={newOrders.length} loading={loading} />
      </div>

      {!loading && lowStock.length > 0 && (
        <Card className="border-[oklch(0.8_0.1_60)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-[oklch(0.4_0.1_60)]">
              <AlertTriangle className="h-4 w-4" /> Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowStock.map((p) => (
              <Link
                key={p.id}
                to="/products/$productId"
                params={{ productId: p.id }}
                className="flex items-center justify-between py-1.5 text-sm hover:underline"
              >
                <span>{p.name}</span>
                <span className="text-muted-foreground">{p.stock_quantity} left</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {!loading && outOfStock.length > 0 && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="h-4 w-4" /> Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {outOfStock.map((p) => (
              <Link
                key={p.id}
                to="/products/$productId"
                params={{ productId: p.id }}
                className="flex items-center justify-between py-1.5 text-sm hover:underline"
              >
                <span>{p.name}</span>
                <span className="text-muted-foreground">0 left</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Latest order requests</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No order requests yet. They&apos;ll appear here once a customer sends an order via WhatsApp.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                  </div>
                  <p>{formatPrice(o.total)}</p>
                </div>
              ))}
              <Link to="/orders" className="inline-block text-xs font-medium text-primary hover:underline">
                View all orders →
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: typeof Package;
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-3xl">{loading ? "—" : value}</p>
        </div>
        <Icon className="h-8 w-8 text-muted-foreground/60" strokeWidth={1.25} />
      </CardContent>
    </Card>
  );
}
