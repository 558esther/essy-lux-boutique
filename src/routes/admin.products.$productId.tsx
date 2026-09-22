import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/queries/admin-products";
import { listAllCategories } from "@/lib/queries/admin-categories";
import { listAllCollections } from "@/lib/queries/admin-collections";

export const Route = createFileRoute("/admin/products/$productId")({
  component: AdminEditProduct,
});

function AdminEditProduct() {
  const { productId } = Route.useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ["admin", "products", productId],
    queryFn: () => getProductById(productId),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listAllCategories,
  });
  const { data: collections = [] } = useQuery({
    queryKey: ["admin", "collections"],
    queryFn: listAllCollections,
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading product…</p>;
  }

  if (!product) {
    return (
      <div className="rounded-lg border border-border bg-shell p-8 text-center">
        <p className="font-display text-lg">Product not found</p>
        <Link to="/admin/products" className="mt-4 inline-block text-sm text-primary hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl uppercase tracking-wide">Edit product</h2>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm product={product} categories={categories} collections={collections} />
    </div>
  );
}
