import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/ProductCard";
import { allColors, allStyles, collections, products } from "@/data/products";

type Search = { q?: string; category?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Luxury Handbags | ESSY-LUX" },
      {
        name: "description",
        content:
          "Browse all ESSY-LUX handbags — totes, satchels, crossbody bags and clutches. Filter by colour, style and price, and order on WhatsApp.",
      },
      { property: "og:title", content: "Shop Luxury Handbags | ESSY-LUX" },
      {
        property: "og:description",
        content: "Browse the full ESSY-LUX handbag collection and order easily on WhatsApp.",
      },
    ],
  }),
  component: Shop,
});

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

function Shop() {
  const { q, category: initialCategory } = Route.useSearch();
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [color, setColor] = useState("all");
  const [style, setStyle] = useState("all");
  const [maxPrice, setMaxPrice] = useState(6000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<(typeof sortOptions)[number]["value"]>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const query = q?.trim().toLowerCase() ?? "";
    let list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (color !== "all" && !p.colors.includes(color)) return false;
      if (style !== "all" && p.style !== style) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && p.stock === 0) return false;
      if (
        query &&
        !`${p.name} ${p.description} ${p.style} ${p.category} ${p.colors.join(" ")}`
          .toLowerCase()
          .includes(query)
      )
        return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return Number(b.newArrival) - Number(a.newArrival);
      return Number(b.featured) - Number(a.featured);
    });

    return list;
  }, [q, category, color, style, maxPrice, inStockOnly, sort]);

  return (
    <>
      <PageHeader
        eyebrow="The Boutique"
        title={q ? `Search: ${q}` : "Shop all bags"}
        intro={
          q
            ? undefined
            : "Every Essy-Lux piece is chosen for its shape, its finish and the way it makes you feel."
        }
      />

      <section className="shell py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs spaced text-muted-foreground">
            {results.length} {results.length === 1 ? "bag" : "bags"}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              className="btn-base btn-soft min-h-11 px-5 py-3 text-[0.625rem] lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} /> Filters
            </button>
            <label htmlFor="sort" className="sr-only">
              Sort products
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="field w-auto py-2.5 text-xs"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
          <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`} aria-label="Filters">
            <div className="space-y-8 border border-border bg-shell p-6">
              <FilterGroup label="Category">
                <Choice active={category === "all"} onClick={() => setCategory("all")}>
                  All
                </Choice>
                {collections.map((c) => (
                  <Choice
                    key={c.slug}
                    active={category === c.slug}
                    onClick={() => setCategory(c.slug)}
                  >
                    {c.name}
                  </Choice>
                ))}
              </FilterGroup>

              <FilterGroup label="Colour">
                <Choice active={color === "all"} onClick={() => setColor("all")}>
                  All
                </Choice>
                {allColors.map((c) => (
                  <Choice key={c} active={color === c} onClick={() => setColor(c)}>
                    {c}
                  </Choice>
                ))}
              </FilterGroup>

              <FilterGroup label="Style">
                <Choice active={style === "all"} onClick={() => setStyle("all")}>
                  All
                </Choice>
                {allStyles.map((s) => (
                  <Choice key={s} active={style === s} onClick={() => setStyle(s)}>
                    {s}
                  </Choice>
                ))}
              </FilterGroup>

              <div>
                <label
                  htmlFor="price"
                  className="font-sans text-[0.625rem] font-medium spaced text-muted-foreground"
                >
                  Max price: KES {maxPrice.toLocaleString("en-KE")}
                </label>
                <input
                  id="price"
                  type="range"
                  min={3000}
                  max={6000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-4 w-full accent-[var(--color-rose-deep)]"
                />
              </div>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-4 w-4 accent-[var(--color-rose-deep)]"
                />
                Available now only
              </label>
            </div>
          </aside>

          <div>
            {results.length > 0 ? (
              <ProductGrid products={results} />
            ) : (
              <div className="border border-border bg-shell px-6 py-20 text-center">
                <h2 className="section-title">No bags found</h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  Try another search or explore our collections.
                </p>
                <Link to="/collections" className="btn-base btn-primary mt-8">
                  Explore collections
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="font-sans text-[0.625rem] font-medium spaced text-muted-foreground">{label}</legend>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-3 py-1.5 text-[0.625rem] font-medium spaced transition-colors ${
        active ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
      }`}
    >
      {children}
    </button>
  );
}
