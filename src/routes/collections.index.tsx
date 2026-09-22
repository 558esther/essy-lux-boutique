import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { collections, products } from "@/data/products";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "The Collections | ESSY-LUX Luxury Bags" },
      {
        name: "description",
        content:
          "Explore the ESSY-LUX edits — Classic, Feminine, Signature and Everyday handbags for women in Kenya.",
      },
      { property: "og:title", content: "The Collections | ESSY-LUX" },
      {
        property: "og:description",
        content: "Four curated handbag edits from ESSY-LUX: Classic, Feminine, Signature and Everyday.",
      },
    ],
  }),
  component: CollectionsIndex,
});

function CollectionsIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Curated Edits"
        title="Explore the collections"
        intro="Four edits, each with its own mood — all of them unmistakably Essy-Lux."
      />
      <section className="shell space-y-20 py-16">
        {collections.map((c, i) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <article
              key={c.slug}
              className={`group grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? "lg:[&>a]:order-2" : ""
              }`}
            >
              <Link
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="overflow-hidden bg-cream"
                aria-label={c.name}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
              </Link>
              <div>
                <p className="eyebrow">{count} pieces</p>
                <h2 className="section-title mt-4">{c.name}</h2>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {c.description}
                </p>
                <Link to="/collections/$slug" params={{ slug: c.slug }} className="btn-base btn-outline mt-8">
                  Explore the edit
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
