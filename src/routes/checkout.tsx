import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  ESSY_LUX_CONFIG,
  buildCartOrderMessage,
  formatPrice,
  openWhatsApp,
  type OrderLine,
} from "@/lib/config";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Order Review | ESSY-LUX" },
      {
        name: "description",
        content:
          "Review your Essy-Lux order details and send them to us on WhatsApp to confirm availability, delivery and payment.",
      },
      { property: "og:title", content: "Order Review | ESSY-LUX" },
      { property: "og:description", content: "Review your Essy-Lux order and hand it over on WhatsApp." },
    ],
  }),
  component: Checkout,
});

type Errors = Partial<Record<"name" | "phone" | "location", string>>;

function Checkout() {
  const { detailedCart, subtotal } = useShop();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [ready, setReady] = useState(false);

  const lines: OrderLine[] = detailedCart.map(({ item, product }) => ({
    name: product.name,
    color: item.color,
    quantity: item.quantity,
    price: product.price,
  }));

  if (lines.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Order Review" title="Your bag is waiting" />
        <section className="shell pb-24 text-center">
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Add a bag you love and your order review will appear here.
          </p>
          <Link to="/shop" className="btn-base btn-primary mt-8">
            Explore bags
          </Link>
        </section>
      </>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!phone.trim()) next.phone = "Please enter your phone number.";
    else if (!/^[0-9+\s-]{9,15}$/.test(phone.trim())) next.phone = "Please enter a valid phone number.";
    if (!location.trim()) next.location = "Please enter your delivery location.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    openWhatsApp(
      buildCartOrderMessage(lines, {
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        note,
      }),
    );
    setReady(true);
  }

  return (
    <>
      <PageHeader
        eyebrow="Order Review"
        title="Review &amp; send your order"
        intro="Essy-Lux orders are confirmed on WhatsApp. Check your details below, then continue to WhatsApp and press send."
      />

      <section className="shell grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <form onSubmit={submit} noValidate className="space-y-10">
          <fieldset>
            <legend className="font-display text-xl uppercase tracking-[0.14em]">Contact information</legend>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id="co-name" label="Full name" value={name} onChange={setName} error={errors.name} autoComplete="name" />
              <Field
                id="co-phone"
                label="Phone number"
                value={phone}
                onChange={setPhone}
                error={errors.phone}
                type="tel"
                autoComplete="tel"
                placeholder="07XX XXX XXX"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl uppercase tracking-[0.14em]">Delivery information</legend>
            <div className="mt-6 space-y-5">
              <Field
                id="co-location"
                label="Delivery location"
                value={location}
                onChange={setLocation}
                error={errors.location}
                placeholder="Town / estate"
              />
              <div>
                <label htmlFor="co-note" className="mb-2 block text-[0.625rem] font-medium spaced text-muted-foreground">
                  Note (optional)
                </label>
                <textarea
                  id="co-note"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything we should know about your order?"
                  className="field resize-none"
                />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Delivery is available. Delivery arrangements and any applicable fees are confirmed with you on
                WhatsApp before your order is finalised.
              </p>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl uppercase tracking-[0.14em]">WhatsApp order</legend>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              We don&apos;t take card or mobile-money payments on this site. Your order message is prepared for
              you and opened in WhatsApp — {ESSY_LUX_CONFIG.brandName} will confirm availability, delivery and
              payment with you there.
            </p>
            {ready && (
              <p className="mt-5 border border-rose bg-rose/25 px-4 py-3 text-sm" role="status">
                WhatsApp is ready with your order message. Please review it and press send so Essy-Lux receives
                your order.
              </p>
            )}
            <button type="submit" className="btn-base btn-whatsapp mt-7 w-full sm:w-auto">
              💬 Continue to WhatsApp
            </button>
          </fieldset>
        </form>

        <aside className="h-fit border border-border bg-shell p-7">
          <h2 className="font-display text-xl uppercase tracking-[0.14em]">Order summary</h2>
          <ul className="mt-6 space-y-4">
            {detailedCart.map(({ item, product }) => (
              <li key={`${item.productId}-${item.color}`} className="flex gap-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="h-20 w-16 shrink-0 object-cover"
                />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm">{formatPrice(product.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-7 space-y-3 border-t border-border pt-6 text-sm">
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
          <Link to="/cart" className="nav-link mt-7 inline-block">
            ← Edit bag
          </Link>
        </aside>
      </section>
    </>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.625rem] font-medium spaced text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
