import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  buildCartOrderMessage,
  buildSingleOrderMessage,
  formatPrice,
  openWhatsApp,
  type OrderLine,
} from "@/lib/config";
import { useSettings } from "@/hooks/use-settings";
import { createOrderRequest } from "@/lib/queries/catalog";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Single-product order: the color/quantity selectors stay editable. */
  product?: { id?: string; name: string; price: number; colors: string[] };
  initialColor?: string;
  initialQuantity?: number;
  /** Cart order: fixed lines, no color/quantity editing. */
  lines?: OrderLine[];
};

type Errors = Partial<Record<"name" | "phone" | "location", string>>;

export function WhatsAppOrderModal({
  open,
  onClose,
  product,
  initialColor,
  initialQuantity = 1,
  lines,
}: Props) {
  const [color, setColor] = useState(initialColor ?? product?.colors[0] ?? "");
  const [quantity, setQuantity] = useState(initialQuantity);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { data: settings } = useSettings();

  useEffect(() => {
    if (!open) return;
    setColor(initialColor ?? product?.colors[0] ?? "");
    setQuantity(initialQuantity);
    setErrors({});
    setReady(false);
  }, [open, initialColor, initialQuantity, product]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const orderLines: OrderLine[] =
    lines ?? (product ? [{ name: product.name, color, quantity, price: product.price, productId: product.id }] : []);
  const total = orderLines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  function validate(): boolean {
    const next: Errors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!phone.trim()) next.phone = "Please enter your phone number.";
    else if (!/^[0-9+\s-]{9,15}$/.test(phone.trim())) next.phone = "Please enter a valid phone number.";
    if (!location.trim()) next.location = "Please enter your delivery location.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleContinue() {
    if (!validate()) return;
    setSubmitting(true);
    const customer = { name: name.trim(), phone: phone.trim(), location: location.trim(), note };
    const messageSettings = settings
      ? {
          brand_name: settings.brand_name,
          tagline: settings.tagline,
          currency: settings.currency,
          whatsapp_greeting: settings.whatsapp_greeting,
          whatsapp_closing: settings.whatsapp_closing,
        }
      : undefined;
    const message =
      orderLines.length > 1
        ? buildCartOrderMessage(orderLines, customer, messageSettings)
        : buildSingleOrderMessage(orderLines[0], customer, {
            ...messageSettings,
            orderMessageTemplate: settings?.order_message_template,
          });

    try {
      await createOrderRequest({
        customerName: customer.name,
        customerPhone: customer.phone,
        location: customer.location,
        note: customer.note,
        items: orderLines.map((l) => ({
          productId: l.productId,
          productName: l.name,
          color: l.color,
          quantity: l.quantity,
          price: l.price,
        })),
      });
    } catch (err) {
      // The order request record is a courtesy log for the admin dashboard —
      // WhatsApp is still the real order channel, so we don't block on this.
      console.error("Could not save order request", err);
    }

    openWhatsApp(message, settings?.whatsapp_number);
    setSubmitting(false);
    setReady(true);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button aria-label="Close order form" className="absolute inset-0 bg-chocolate/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        className="fade-soft relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto bg-ivory shadow-[0_20px_60px_rgba(58,36,29,0.18)]"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-ivory px-6 py-5">
          <div>
            <h2 id="order-modal-title" className="font-display text-xl tracking-wide">
              🌸 Complete your order
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              We&apos;ll prepare the message — you press send in WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center hover:text-rose-deep"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="border border-border bg-shell p-5">
            {orderLines.map((line, i) => (
              <div key={`${line.name}-${line.color}-${i}`} className="flex items-start justify-between gap-4 py-1.5 text-sm">
                <span className="min-w-0">
                  <span className="block font-medium">{line.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {line.color} · Qty {line.quantity}
                  </span>
                </span>
                <span className="shrink-0 whitespace-nowrap">{formatPrice(line.price * line.quantity)}</span>
              </div>
            ))}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="eyebrow">Order total</span>
              <span className="font-display text-lg">{formatPrice(total)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Delivery to be confirmed on WhatsApp.</p>
          </div>

          {product && !lines && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="order-color">Color</Label>
                <select
                  id="order-color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="field"
                >
                  {product.colors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="order-qty">Quantity</Label>
                <div className="flex items-center border border-input bg-shell">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="grid h-12 w-12 place-items-center text-lg hover:text-rose-deep"
                  >
                    −
                  </button>
                  <span id="order-qty" className="flex-1 text-center text-sm">
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
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Field
              id="order-name"
              label="Full name"
              value={name}
              onChange={setName}
              error={errors.name}
              placeholder="Your name"
              autoComplete="name"
            />
            <Field
              id="order-phone"
              label="Phone number"
              value={phone}
              onChange={setPhone}
              error={errors.phone}
              placeholder="07XX XXX XXX"
              type="tel"
              autoComplete="tel"
            />
            <Field
              id="order-location"
              label="Delivery location"
              value={location}
              onChange={setLocation}
              error={errors.location}
              placeholder="Town / estate"
            />
            <div>
              <Label htmlFor="order-note">Optional note</Label>
              <textarea
                id="order-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything we should know?"
                className="field resize-none"
              />
            </div>
          </div>

          {ready && (
            <p className="border border-rose bg-rose/25 px-4 py-3 text-sm" role="status">
              ✓ Order request created. WhatsApp is now open with your message — please press{" "}
              <strong>Send</strong> there so {settings?.brand_name ?? "Essy-Lux"} actually receives it.
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleContinue}
              disabled={submitting}
              className="btn-base btn-whatsapp flex-1"
            >
              {submitting ? "Preparing…" : "💬 Continue to WhatsApp"}
            </button>
            <button type="button" onClick={onClose} className="btn-base btn-outline flex-1">
              ← Edit order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-sans text-[0.625rem] font-medium spaced text-muted-foreground">
      {children}
    </label>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
