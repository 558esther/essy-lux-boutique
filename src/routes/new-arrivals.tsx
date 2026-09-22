import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals | ESSY-LUX Luxury Bags" },
      {
        name: "description",
        content:
          "Fresh silhouettes and timeless elegance — discover the newest ESSY-LUX handbags in Mombasa, Kenya.",
      },
      { property: "og:title", content: "New Arrivals | ESSY-LUX" },
      { property: "og:description", content: "Fresh silhouettes. Timeless elegance. New ESSY-LUX handbags." },
    ],
  }),
  component: NewArrivals,
});

function NewArrivals() {
  const arrivals = products.filter((p) => p.newArrival);

  return (
    <>
      <PageHeader eyebrow="Just In" title="New arrivals" intro="Fresh silhouettes. Timeless elegance." />
      <section className="shell py-16">
        {arrivals.length > 0 ? (
          <ProductGrid products={arrivals} />
        ) : (
          <div className="border border-border bg-shell px-6 py-20 text-center">
            <h2 className="section-title">New pieces are on the way</h2>
            <Link to="/shop" className="btn-base btn-primary mt-8">
              Explore bags
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
