import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/ProductCard";
import { fetchPublishedProducts } from "@/lib/queries/catalog";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  loader: async () => ({ products: await fetchPublishedProducts() }),
  head: () => ({
    meta: [
      { title: "Your Wishlist | ESSY-LUX" },
      {
        name: "description",
        content: "Save the Essy-Lux handbags you love and come back to them whenever you're ready.",
      },
      { property: "og:title", content: "Your Wishlist | ESSY-LUX" },
      { property: "og:description", content: "The Essy-Lux pieces you've saved for later." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { products } = Route.useLoaderData();
  const { wishlist } = useShop();
  const saved = products.filter((p) => wishlist.includes(p.id));

  if (saved.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Saved Pieces" title="Your wishlist is waiting" />
        <section className="shell pb-24 text-center">
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            Save the pieces you love and come back to them whenever you&apos;re ready.
          </p>
          <Link to="/shop" className="btn-base btn-primary mt-8">
            Explore collection
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Saved Pieces" title="Your wishlist" />
      <section className="shell py-16">
        <ProductGrid products={saved} />
      </section>
    </>
  );
}
