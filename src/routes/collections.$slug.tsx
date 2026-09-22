import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/ProductCard";
import { collections, products } from "@/data/products";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const collection = collections.find((c) => c.slug === params.slug);
    if (!collection) throw notFound();
    return { collection };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Collection unavailable | ESSY-LUX" }, { name: "robots", content: "noindex" }] };
    }
    const { collection } = loaderData;
    const title = `${collection.name} | ESSY-LUX`;
    return {
      meta: [
        { title },
        { name: "description", content: `${collection.description} Shop the ${collection.name} from ESSY-LUX.` },
        { property: "og:title", content: title },
        { property: "og:description", content: collection.description },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { collection } = Route.useLoaderData();
  const items = products.filter((p) => p.category === collection.slug);

  return (
    <>
      <PageHeader eyebrow="Collection" title={collection.name} intro={collection.description} />
      <section className="shell py-16">
        {items.length > 0 ? (
          <ProductGrid products={items} />
        ) : (
          <div className="border border-border bg-shell px-6 py-20 text-center">
            <h2 className="section-title">This edit is being styled</h2>
            <Link to="/shop" className="btn-base btn-primary mt-8">
              Explore all bags
            </Link>
          </div>
        )}
        <div className="mt-16 text-center">
          <Link to="/collections" className="nav-link">
            All collections
          </Link>
        </div>
      </section>
    </>
  );
}
