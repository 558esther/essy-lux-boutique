import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/config";
import { useShop } from "@/lib/store";
import { WhatsAppOrderModal } from "@/components/WhatsAppOrderModal";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [color, setColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const wished = isWishlisted(product.id);
  const soldOut = product.stock === 0;

  function handleAdd() {
    addToCart(product, color);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden bg-cream">
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name}>
          <img
            src={product.images[0]}
            alt={`${product.name} in ${product.colors.join(", ")}`}
            loading="lazy"
            width={1024}
            height={1280}
            className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.newArrival && <Tag>New</Tag>}
          {soldOut && <Tag>Sold out</Tag>}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wished}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-shell/85 backdrop-blur transition-transform hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${wished ? "fill-rose-deep text-rose-deep" : "text-foreground"}`}
            strokeWidth={1.4}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <h3 className="font-display text-lg leading-snug tracking-wide">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:text-rose-deep">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        <p className="mt-3 font-display text-base">{formatPrice(product.price)}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-pressed={color === c}
              className={`border px-3 py-1.5 text-[0.625rem] font-medium spaced transition-colors ${
                color === c ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-5">
          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut}
            className="btn-base btn-soft min-h-11 py-3 text-[0.625rem]"
          >
            {soldOut ? "Sold out" : added ? "Added to bag ✓" : "🛍️ Add to bag"}
          </button>
          <button
            type="button"
            onClick={() => setOrderOpen(true)}
            className="btn-base btn-whatsapp min-h-11 py-3 text-[0.625rem]"
          >
            💬 Order via WhatsApp
          </button>
        </div>
      </div>

      <WhatsAppOrderModal
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        product={{ name: product.name, price: product.price, colors: product.colors }}
        initialColor={color}
      />
    </article>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-shell/90 px-2.5 py-1 font-sans text-[0.5625rem] font-medium spaced">{children}</span>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
