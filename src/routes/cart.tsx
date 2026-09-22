import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { WhatsAppOrderModal } from "@/components/WhatsAppOrderModal";
import { formatPrice, type OrderLine } from "@/lib/config";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag | ESSY-LUX" },
      {
        name: "description",
        content: "Review the handbags in your Essy-Lux bag and send your order on WhatsApp.",
      },
      { property: "og:title", content: "Your Bag | ESSY-LUX" },
      { property: "og:description", content: "Review your Essy-Lux selection and order on WhatsApp." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { detailedCart, subtotal, updateQuantity, removeFromCart } = useShop();
  const [orderOpen, setOrderOpen] = useState(false);

  const lines: OrderLine[] = detailedCart.map(({ item, product }) => ({
    name: product.name,
    color: item.color,
    quantity: item.quantity,
    price: product.price,
  }));

  if (detailedCart.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Shopping Bag" title="Your bag is waiting" />
        <section className="shell pb-24 text-center">
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            Discover something beautiful for your next look.
          </p>
          <Link to="/shop" className="btn-base btn-primary mt-8">
            Explore bags
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Shopping Bag" title="Your bag" />
      <section className="shell grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <ul className="divide-y divide-border border-y border-border">
          {detailedCart.map(({ item, product }) => (
            <li key={`${item.productId}-${item.color}`} className="flex gap-5 py-6">
              <Link
                to="/product/$slug"
                params={{ slug: product.slug }}
                className="w-24 shrink-0 overflow-hidden bg-cream sm:w-28"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="aspect-[4/5] w-full object-cover"
                />
              </Link>
              <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <h2 className="font-display text-lg leading-snug">
                    <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:text-rose-deep">
                      {product.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-xs spaced text-muted-foreground">{item.color}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center border border-input bg-shell">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.name}`}
                        onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)}
                        className="grid h-10 w-10 place-items-center hover:text-rose-deep"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${product.name}`}
                        onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)}
                        className="grid h-10 w-10 place-items-center hover:text-rose-deep"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId, item.color)}
                      aria-label={`Remove ${product.name} from bag`}
                      className="inline-flex items-center gap-2 text-[0.625rem] spaced text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.4} /> Remove
                    </button>
                  </div>
                </div>
                <p className="font-display text-base sm:text-right">
                  {formatPrice(product.price * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-border bg-shell p-7">
          <h2 className="font-display text-xl uppercase tracking-[0.14em]">Order summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Delivery</dt>
              <dd>To be confirmed</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-4 font-display text-lg">
              <dt>Total</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Delivery is available. Please confirm delivery details with Essy-Lux through WhatsApp.
          </p>
          <div className="mt-7 flex flex-col gap-3">
            <button type="button" onClick={() => setOrderOpen(true)} className="btn-base btn-whatsapp">
              💬 Order via WhatsApp
            </button>
            <Link to="/checkout" className="btn-base btn-primary">
              Review order
            </Link>
            <Link to="/shop" className="btn-base btn-outline">
              Continue shopping
            </Link>
          </div>
        </aside>
      </section>

      <WhatsAppOrderModal open={orderOpen} onClose={() => setOrderOpen(false)} lines={lines} />
    </>
  );
}
