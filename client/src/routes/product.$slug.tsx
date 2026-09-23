import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { FloralDivider, SectionHeading } from "@/components/Brand";
import { ProductGrid } from "@/components/ProductCard";
import { WhatsAppOrderModal } from "@/components/WhatsAppOrderModal";
import { fetchProductBySlug, fetchPublishedProducts, relatedProducts } from "@/lib/queries/catalog";
import { useSettings } from "@/hooks/use-settings";
import { formatPrice } from "@/lib/config";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProductBySlug(params.slug);
    if (!product) throw notFound();
    const allProducts = await fetchPublishedProducts();
    return { product, related: relatedProducts(allProducts, product) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Bag unavailable | ESSY-LUX" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const title = `${product.name} | ESSY-LUX Luxury Bags`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { data: settings } = useSettings();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const wished = isWishlisted(product.id);
  const soldOut = product.stock === 0;

  function handleAdd() {
    addToCart(product, color, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  function selectColor(c: string) {
    setColor(c);
    const index = product.colors.indexOf(c);
    if (product.images[index]) setActiveImage(index);
  }

  return (
    <>
      <div className="shell pt-8">
        <nav aria-label="Breadcrumb" className="text-[0.625rem] spaced text-muted-foreground">
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      <section className="shell grid gap-12 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <div>
          <div className="overflow-hidden bg-cream">
            <img
              src={product.images[activeImage]}
              alt={`${product.name} in ${color}`}
              width={1024}
              height={1280}
              className="fade-soft aspect-[4/5] w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-4">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={activeImage === i}
                  className={`w-20 overflow-hidden border transition-colors ${
                    activeImage === i ? "border-foreground" : "border-transparent hover:border-border"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.newArrival && <p className="eyebrow">New arrival</p>}
          <h1 className="section-title mt-3">{product.name}</h1>
          <p className="mt-5 font-display text-2xl">{formatPrice(product.price)}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {product.description}
          </p>
          <p className="mt-4 text-xs spaced text-muted-foreground">
            {soldOut ? "Currently sold out" : `Available — ${product.stock} in stock`}
          </p>

          <div className="mt-8">
            <p className="font-sans text-[0.625rem] font-medium spaced text-muted-foreground">
              Colour: {color}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => selectColor(c)}
                  aria-pressed={color === c}
                  className={`min-h-10 border px-4 py-2 text-[0.625rem] font-medium spaced transition-colors ${
                    color === c
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-input bg-shell">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="grid h-12 w-12 place-items-center text-lg hover:text-rose-deep"
              >
                −
              </button>
              <span className="w-10 text-center text-sm" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="grid h-12 w-12 place-items-center text-lg hover:text-rose-deep"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={wished}
              className="inline-flex min-h-10 items-center gap-2 text-[0.625rem] font-medium spaced hover:text-rose-deep"
            >
              <Heart
                className={`h-4 w-4 ${wished ? "fill-rose-deep text-rose-deep" : ""}`}
                strokeWidth={1.4}
              />
              {wished ? "Saved" : "Save to wishlist"}
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setOrderOpen(true)}
              className="btn-base btn-whatsapp"
            >
              💬 Order via WhatsApp
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={soldOut}
              className="btn-base btn-outline"
            >
              {soldOut ? "Sold out" : added ? "Added to bag ✓" : "🛍️ Add to bag"}
            </button>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Prefer to order directly? Message {settings?.brand_name ?? "ESSY-LUX"} on WhatsApp at{" "}
            {settings?.phone ?? "0113835508"} — we&apos;ll prepare your order message, you simply press send.
          </p>

          <dl className="mt-12 divide-y divide-border border-y border-border">
            <Detail term="Description" detail={product.description} />
            {product.material && <Detail term="Material" detail={product.material} />}
            <Detail
              term="Care guide"
              detail="Keep away from damp surfaces and direct sunlight for long periods. Wipe gently with a soft dry cloth."
            />
            <Detail
              term="Shipping & returns"
              detail="Delivery arrangements and any applicable fees are confirmed with you on WhatsApp before your order is finalised. For returns or exchanges, please contact Essy-Lux on WhatsApp."
            />
          </dl>
        </div>
      </section>

      <FloralDivider className="py-4" />

      <section className="shell py-16" aria-labelledby="related-title">
        <SectionHeading eyebrow="More to love" title="You may also like" />
        <div className="mt-14">
          <ProductGrid products={related} />
        </div>
      </section>

      <WhatsAppOrderModal
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        product={{ id: product.id, name: product.name, price: product.price, colors: product.colors }}
        initialColor={color}
        initialQuantity={quantity}
      />
    </>
  );
}

function Detail({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="py-5">
      <dt className="font-sans text-[0.625rem] font-medium spaced text-muted-foreground">{term}</dt>
      <dd className="mt-2 text-sm leading-relaxed">{detail}</dd>
    </div>
  );
}
