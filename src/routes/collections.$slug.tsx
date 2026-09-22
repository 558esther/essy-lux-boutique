import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/ProductCard";
import { fetchCollectionBySlug, fetchPublishedProducts } from "@/lib/queries/catalog";

export const Route = createFileRoute("/collections/$slug")({
  loader: async ({ params }) => {
    const collection = await fetchCollectionBySlug(params.slug);
    if (!collection) throw notFound();
    const products = await fetchPublishedProducts();
    return { collection, items: products.filter((p) => p.collectionSlugs.includes(collection.slug)) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Collection unavailable | ESSY-LUX" }, { name: "robots", content: "noindex" }] };
    }
    const { collection } = loaderData;
    const title = `${collection.name} | ESSY-LUX`;
    const description = collection.description ?? `Shop the ${collection.name} from ESSY-LUX.`;
    return {
      meta: [
        { title },
        { name: "description", content: `${description} Shop the ${collection.name} from ESSY-LUX.` },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { collection, items } = Route.useLoaderData();

  return (
    <>
      <PageHeader eyebrow="Collection" title={collection.name} intro={collection.description ?? undefined} />
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
