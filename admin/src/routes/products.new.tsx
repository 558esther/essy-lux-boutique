import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProductForm } from "@/components/ProductForm";
import { listAllCategories } from "@/lib/queries/admin-categories";
import { listAllCollections } from "@/lib/queries/admin-collections";

export const Route = createFileRoute("/products/new")({
  component: AdminAddProduct,
});

function AdminAddProduct() {
  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listAllCategories,
  });
  const { data: collections = [] } = useQuery({
    queryKey: ["admin", "collections"],
    queryFn: listAllCollections,
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl uppercase tracking-wide">Add new product</h2>
        <p className="text-sm text-muted-foreground">Fill in the details below, then save to publish it to your store.</p>
      </div>
      <ProductForm categories={categories} collections={collections} />
    </div>
  );
}
