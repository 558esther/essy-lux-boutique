import { createFileRoute, Link } from "@tanstack/react-router";
import editorialWoman from "@/assets/editorial-woman.jpg";
import classicTote from "@/assets/bag-classic-tote.jpg";
import { FloralCorner, FloralDivider } from "@/components/Brand";
import { PageHeader } from "@/components/PageHeader";
import { ESSY_LUX_CONFIG } from "@/lib/config";
import { fetchHomepageContent } from "@/lib/queries/catalog";

export const Route = createFileRoute("/about")({
  loader: async () => ({ about: (await fetchHomepageContent()).about }),
  head: () => ({
    meta: [
      { title: "Our Story | ESSY-LUX Luxury Bags" },
      {
        name: "description",
        content:
          "The story behind ESSY-LUX — a luxury women's handbag boutique in Mombasa – Bamburi, Kenya, created for women who carry confidence.",
      },
      { property: "og:title", content: "The Story Behind ESSY-LUX" },
      {
        property: "og:description",
        content: "Feminine elegance, refined details and everyday luxury from Mombasa, Kenya.",
      },
    ],
  }),
  component: About,
});

function About() {
  const { about } = Route.useLoaderData();
  const storyImageSrc = about?.storyImageUrl || editorialWoman;
  const visionImageSrc = about?.visionImageUrl || classicTote;

  return (
    <>
      <PageHeader
        eyebrow="Our Brand"
        title="The story behind Essy-Lux"
        intro="Luxury that feels feminine — created for women who carry confidence wherever they go."
      />

      <section className="relative overflow-hidden py-16 sm:py-20">
        <FloralCorner className="pointer-events-none absolute -right-8 top-8 h-48 w-48 rotate-90 text-beige/60" />
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <img
            src={storyImageSrc}
            alt="Woman holding a warm brown Essy-Lux handbag"
            loading="lazy"
            width={1200}
            height={1504}
            className="w-full object-cover"
          />
          <div>
            <h2 className="section-title">Our story</h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Essy-Lux began with a simple love of beautiful bags — the kind you reach for again and again.
              From our home in {ESSY_LUX_CONFIG.location}, we bring together handbags chosen for their shape,
              their finish and the quiet confidence they give the woman carrying them.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every piece is styled and shared the way we would want to receive it: personally, warmly and with
              real attention to detail.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider className="py-6" />

      <section className="bg-ivory py-16 sm:py-20">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:order-2">
            <h2 className="section-title">Our vision</h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              To be the boutique Kenyan women think of first when they want a handbag that feels elegant,
              feminine and beautifully made — and to make choosing one feel as personal as a conversation.
            </p>
            <Link to="/shop" className="btn-base btn-outline mt-8">
              Shop the collection
            </Link>
          </div>
          <img
            src={visionImageSrc}
            alt="Ivory Essy-Lux tote with brown leather handles"
            loading="lazy"
            width={1024}
            height={1280}
            className="w-full object-cover lg:order-1"
          />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="shell">
          <h2 className="section-title text-center">Our values</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              {
                title: "Elegance",
                text: "We choose shapes and finishes that stay beautiful far beyond one season.",
              },
              {
                title: "Warmth",
                text: "Every order is a conversation. We answer personally, on WhatsApp, as ourselves.",
              },
              {
                title: "Honesty",
                text: "We share what a bag truly is — its size, its finish and its availability.",
              },
            ].map((v) => (
              <div key={v.title} className="text-center">
                <h3 className="font-display text-lg uppercase tracking-[0.14em]">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
