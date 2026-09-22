import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductStatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { listProducts, archiveProduct, deleteProductPermanently } from "@/lib/queries/admin-products";
import { listAllCategories } from "@/lib/queries/admin-categories";
import { formatPrice } from "@/lib/config";
import type { AdminProduct } from "@/lib/types";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProductsList,
});

type FilterKey = "all" | "in_stock" | "out_of_stock" | "new_arrivals" | "featured" | "best_sellers" | "draft" | "archived";

function AdminProductsList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [categoryId, setCategoryId] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "price-asc" | "price-desc" | "stock">("newest");
  const [archiveTarget, setArchiveTarget] = useState<AdminProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products", "all"],
    queryFn: () => listProducts(),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listAllCategories,
  });

  const results = useMemo(() => {
    let list = [...products];
    if (categoryId !== "all") list = list.filter((p) => p.category_id === categoryId);
    switch (filter) {
      case "in_stock":
        list = list.filter((p) => p.stock_quantity > 0);
        break;
      case "out_of_stock":
        list = list.filter((p) => p.stock_quantity === 0);
        break;
      case "new_arrivals":
        list = list.filter((p) => p.new_arrival);
        break;
      case "featured":
        list = list.filter((p) => p.featured);
        break;
      case "best_sellers":
        list = list.filter((p) => p.best_seller);
        break;
      case "draft":
        list = list.filter((p) => p.status === "draft");
        break;
      case "archived":
        list = list.filter((p) => p.status === "archived");
        break;
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.name, p.sku ?? "", p.category?.name ?? ""].join(" ").toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return a.created_at.localeCompare(b.created_at);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock":
          return a.stock_quantity - b.stock_quantity;
        default:
          return b.created_at.localeCompare(a.created_at);
      }
    });
    return list;
  }, [products, filter, categoryId, search, sort]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
  }

  async function handleArchive() {
    if (!archiveTarget) return;
    await archiveProduct(archiveTarget.id);
    toast.success(`${archiveTarget.name} moved to archived.`);
    invalidate();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteProductPermanently(deleteTarget.id);
    toast.success(`${deleteTarget.name} deleted.`);
    invalidate();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl uppercase tracking-wide">Products</h2>
        <Button asChild size="sm">
          <Link to="/admin/products/new">+ Add Product</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU or category…"
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as FilterKey)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All products</SelectItem>
            <SelectItem value="in_stock">In stock</SelectItem>
            <SelectItem value="out_of_stock">Out of stock</SelectItem>
            <SelectItem value="new_arrivals">New arrivals</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="best_sellers">Best sellers</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="stock">Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-shell">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>New</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                  Loading products…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && results.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                  No products match these filters yet.
                </TableCell>
              </TableRow>
            )}
            {results.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <img
                    src={p.images[0]?.url ?? "/placeholder.svg"}
                    alt=""
                    className="h-12 w-10 rounded object-cover"
                  />
                </TableCell>
                <TableCell className="max-w-[14rem] truncate font-medium">{p.name}</TableCell>
                <TableCell>{p.category?.name ?? "—"}</TableCell>
                <TableCell>{formatPrice(p.price)}</TableCell>
                <TableCell className={p.stock_quantity === 0 ? "text-destructive" : undefined}>
                  {p.stock_quantity}
                </TableCell>
                <TableCell>
                  <ProductStatusBadge status={p.stock_quantity === 0 ? "out_of_stock" : p.status} />
                </TableCell>
                <TableCell>{p.featured ? "✓" : "—"}</TableCell>
                <TableCell>{p.new_arrival ? "✓" : "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/admin/products/$productId" params={{ productId: p.id }}>
                        Edit
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <a href={`/product/${p.slug}`} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                    {p.status !== "archived" && (
                      <Button size="sm" variant="ghost" onClick={() => setArchiveTarget(p)}>
                        Archive
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(p)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={Boolean(archiveTarget)}
        onOpenChange={(open) => !open && setArchiveTarget(null)}
        title="Archive this product?"
        description={`"${archiveTarget?.name}" will be hidden from the shop but kept in your records. You can restore it any time by editing it.`}
        confirmLabel="Archive"
        destructive={false}
        onConfirm={handleArchive}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete product?"
        description={`Are you sure you want to remove "${deleteTarget?.name}" from ESSY-LUX? This permanently deletes it and its images. Consider Archive instead if you might need it again.`}
        confirmLabel="Delete product"
        onConfirm={handleDelete}
      />
    </div>
  );
}
