import { createFileRoute, Link } from "@tanstack/react-router";
import { Gem, HandHeart, Sparkles, Star, Sun } from "lucide-react";
import heroImage from "@/assets/hero-essylux.jpg";
import editorialWoman from "@/assets/editorial-woman.jpg";
import bannerRoses from "@/assets/banner-roses.jpg";
import { Bloom, FloralCorner, FloralDivider, SectionHeading } from "@/components/Brand";
import { ProductGrid } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { fetchCollections, fetchHomepageContent, fetchPublishedProducts } from "@/lib/queries/catalog";
import { ESSY_LUX_CONFIG } from "@/lib/config";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [products, collections, homepage] = await Promise.all([
      fetchPublishedProducts(),
      fetchCollections(),
      fetchHomepageContent(),
    ]);
    return { products, collections, homepage };
  },
  head: () => ({
    meta: [
      { title: "ESSY-LUX | Luxury Women's Handbags in Mombasa, Kenya" },
      {
        name: "description",
        content:
          "Discover ESSY-LUX luxury women's handbags designed for elegance, confidence and timeless style in Mombasa, Kenya. Order easily on WhatsApp.",
      },
      { property: "og:title", content: "ESSY-LUX | Luxury Women's Handbags" },
      {
        property: "og:description",
        content:
          "Elegant handbags for women who carry confidence. Shop the Essy-Lux collections in Mombasa – Bamburi, Kenya.",
      },
    ],
  }),
  component: Home,
});

const whyEssyLux = [
  {
    icon: Gem,
    title: "Elegant design",
    text: "Thoughtfully styled pieces designed to complement your personal style.",
  },
  {
    icon: Sparkles,
    title: "Quality details",
    text: "A focus on refined finishes and beautiful details.",
  },
  {
    icon: Sun,
    title: "Everyday luxury",
    text: "Elegant bags designed to move with you.",
  },
  {
    icon: HandHeart,
    title: "Feminine confidence",
    text: "Pieces created to make every woman feel beautifully herself.",
  },
];

/** Shown until the admin sets real testimonials in Admin → Homepage → Testimonials. */
const DEFAULT_TESTIMONIALS = [
  { quote: "Beautiful, elegant and exactly what I was looking for.", author: "Customer" },
  { quote: "The finishing is lovely and it goes with everything I wear.", author: "Customer" },
  { quote: "Ordering on WhatsApp was so simple and the bag is gorgeous.", author: "Customer" },
];

function Home() {
  const { products, collections, homepage } = Route.useLoaderData();
  const featured = products.filter((p) => p.featured);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const mostLoved = products.filter((p) => p.bestSeller).slice(0, 4);

  const hero = homepage.hero;
  const heroHeading = hero?.heading ?? "Luxury,\ncarried beautifully.";
  const heroDescription =
    hero?.description ??
    "Discover elegant handbags designed to complement your style, confidence and everyday beauty.";
  const heroButtonText = hero?.buttonText ?? "Shop the collection";
  const heroImageSrc = hero?.imageUrl || heroImage;

  const banner = homepage.banner;
  const bannerHeading = banner?.heading ?? "Carry your confidence.";
  const bannerSubtext = banner?.subtext ?? "Luxury is not only what you wear. It is how you carry yourself.";

  const newsletterSection = homepage.newsletter;

  const testimonialRows = homepage.testimonials
    ? [1, 2, 3]
        .map((i) => ({
          quote: homepage.testimonials[`quote${i}`],
          author: homepage.testimonials[`author${i}`],
        }))
        .filter((t) => t.quote?.trim())
    : DEFAULT_TESTIMONIALS;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ivory">
        <div className="shell grid items-center gap-10 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-24">
          <div className="rise max-w-xl">
            <Bloom className="h-5 w-5 text-champagne" />
            <p className="brand-mark mt-5 text-3xl sm:text-4xl">{ESSY_LUX_CONFIG.brandName}</p>
            <h1 className="mt-6 whitespace-pre-line font-display text-[clamp(2rem,6vw,3.5rem)] font-light uppercase leading-[1.08] tracking-[0.06em]">
              {heroHeading}
            </h1>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {heroDescription}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="btn-base btn-primary">
                {heroButtonText}
              </Link>
              <Link to="/new-arrivals" className="btn-base btn-outline">
                Explore new arrivals
              </Link>
            </div>
          </div>

          <div className="fade-soft relative">
            <img
              src={heroImageSrc}
              alt="Ivory Essy-Lux handbag with brown leather handles styled on cream silk with blush pink roses"
              width={1600}
              height={1200}
              className="w-full object-cover shadow-[0_24px_70px_rgba(90,56,43,0.12)]"
            />
            <Bloom className="sway absolute -left-4 -top-4 h-10 w-10 text-blush/70" />
            <Bloom className="sway absolute -bottom-5 right-6 h-8 w-8 text-champagne/70" />
          </div>
        </div>
      </section>

      {/* THE ESSY-LUX WOMAN */}
      <section className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="essylux-woman">
        <FloralCorner className="pointer-events-none absolute -left-8 top-10 h-48 w-48 text-beige/60" />
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <img
            src={editorialWoman}
            alt="Woman in a cream dress holding a warm brown Essy-Lux handbag"
            loading="lazy"
            width={1200}
            height={1504}
            className="w-full object-cover"
          />
          <div>
            <p className="eyebrow">Our Woman</p>
            <h2 id="essylux-woman" className="section-title mt-4">
              The Essy-Lux woman
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Essy-Lux celebrates feminine elegance through beautifully styled handbags created for women who
              carry confidence wherever they go.
            </p>
            <p className="mt-4 font-display text-xl leading-relaxed">
              &ldquo;Elegance you can carry — beautiful bags for beautiful moments.&rdquo;
            </p>
            <Link to="/about" className="btn-base btn-outline mt-9">
              Discover our story
            </Link>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="bg-ivory py-20 sm:py-28" aria-labelledby="collections-title">
        <div className="shell">
          <SectionHeading
            eyebrow="Curated Edits"
            title="Explore the collections"
            intro="Four edits, one quiet idea — luxury that feels feminine."
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {collections.map((c) => (
              <article key={c.slug} className="group">
                <Link
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  className="relative block overflow-hidden bg-cream"
                >
                  <img
                    src={c.cover_image_url ?? "/placeholder.svg"}
                    alt={c.name}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                  <span className="absolute inset-0 bg-chocolate/0 transition-colors duration-500 group-hover:bg-chocolate/15" />
                </Link>
                <div className="pt-6 transition-transform duration-500 group-hover:translate-x-1">
                  <h3 className="font-display text-xl uppercase tracking-[0.12em]">{c.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                  <Link
                    to="/collections/$slug"
                    params={{ slug: c.slug }}
                    className="nav-link mt-4 inline-block"
                  >
                    Explore
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNATURE BAGS */}
      <section className="py-20 sm:py-28" aria-labelledby="signature-bags">
        <div className="shell">
          <SectionHeading eyebrow="Featured" title="Signature bags" />
          <div className="mt-14">
            <ProductGrid products={featured} />
          </div>
          <div className="mt-14 text-center">
            <Link to="/shop" className="btn-base btn-outline">
              View all bags
            </Link>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-ivory py-20 sm:py-28" aria-labelledby="home-new-arrivals">
        <div className="shell">
          <SectionHeading
            eyebrow="Just In"
            title="New arrivals"
            intro="Fresh silhouettes. Timeless elegance."
          />
          <div className="mt-14">
            <ProductGrid products={newArrivals} />
          </div>
        </div>
      </section>

      {/* CARRY YOUR CONFIDENCE */}
      <section className="relative isolate overflow-hidden" aria-labelledby="confidence-title">
        <img
          src={bannerRoses}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1920}
          height={912}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ivory/55" />
        <div className="shell relative py-24 text-center sm:py-32">
          <h2 id="confidence-title" className="section-title">
            {bannerHeading}
          </h2>
          <p className="mx-auto mt-6 max-w-md font-display text-xl leading-relaxed">{bannerSubtext}</p>
          <Link to="/shop" className="btn-base btn-primary mt-9">
            Shop Essy-Lux
          </Link>
        </div>
      </section>

      {/* WHY ESSY-LUX */}
      <section className="py-20 sm:py-28" aria-labelledby="why-title">
        <div className="shell">
          <SectionHeading eyebrow="The Essy-Lux Promise" title="Why Essy-Lux" />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {whyEssyLux.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <Icon className="mx-auto h-7 w-7 text-rose-deep" strokeWidth={1.1} />
                <h3 className="mt-5 font-display text-base uppercase tracking-[0.14em]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOST LOVED */}
      <section className="bg-ivory py-20 sm:py-28" aria-labelledby="most-loved">
        <div className="shell">
          <SectionHeading eyebrow="Best Sellers" title="Most loved" />
          <div className="mt-14">
            <ProductGrid products={mostLoved} />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28" aria-labelledby="testimonials-title">
        <div className="shell">
          <SectionHeading eyebrow="Kind Words" title="Loved by our customers" />
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {testimonialRows.map((t) => (
              <figure key={t.quote} className="border border-border bg-shell p-8">
                <div className="flex gap-1 text-champagne" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-champagne" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="mt-5 font-display text-lg leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-xs spaced text-muted-foreground">— {t.author}</figcaption>
              </figure>
            ))}
          </div>
          {testimonialRows === DEFAULT_TESTIMONIALS && (
            <p className="mt-8 text-center text-xs text-muted-foreground">
              These are placeholder notes shown as examples. Add genuine reviews from Admin → Homepage →
              Testimonials.
            </p>
          )}
        </div>
      </section>

      {/* SOCIAL */}
      <section className="bg-ivory py-20 sm:py-28" aria-labelledby="social-title">
        <div className="shell">
          <SectionHeading
            eyebrow={ESSY_LUX_CONFIG.instagramHandle}
            title="Follow the Essy-Lux journey"
          />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[...products.slice(0, 5), products[1]].map((p, i) => (
              <img
                key={`${p.id}-${i}`}
                src={p.images[0]}
                alt={p.name}
                loading="lazy"
                width={1024}
                height={1280}
                className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            {ESSY_LUX_CONFIG.social.instagram ? (
              <a
                href={ESSY_LUX_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-outline"
              >
                Follow us
              </a>
            ) : (
              <p className="text-xs text-muted-foreground">
                Our social pages aren&apos;t linked yet — message us on WhatsApp at {ESSY_LUX_CONFIG.phone}.
              </p>
            )}
          </div>
          <FloralDivider className="mt-16" />
        </div>
      </section>

      <Newsletter heading={newsletterSection?.heading} description={newsletterSection?.description} />
    </>
  );
}
