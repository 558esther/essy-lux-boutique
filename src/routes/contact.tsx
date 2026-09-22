import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ESSY_LUX_CONFIG, buildEnquiryMessage, openWhatsApp } from "@/lib/config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ESSY-LUX | Luxury Bags, Mombasa" },
      {
        name: "description",
        content:
          "Get in touch with ESSY-LUX in Mombasa – Bamburi, Kenya. Call or message us on WhatsApp at 0113835508 for orders and support.",
      },
      { property: "og:title", content: "Contact ESSY-LUX" },
      { property: "og:description", content: "We would love to hear from you — Mombasa – Bamburi, Kenya." },
    ],
  }),
  component: Contact,
});

type Errors = Partial<Record<"name" | "email" | "phone" | "subject" | "message", string>>;

const subjects = ["Customer care", "Order support", "General questions", "Collaborations"];

function Contact() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: subjects[0],
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [ready, setReady] = useState(false);

  function set(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.phone.trim()) next.phone = "Please enter your phone number.";
    else if (!/^[0-9+\s-]{9,15}$/.test(values.phone.trim()))
      next.phone = "Please enter a valid phone number.";
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!values.message.trim()) next.message = "Please enter your message.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    openWhatsApp(
      buildEnquiryMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        subject: values.subject,
        message: values.message.trim(),
      }),
    );
    setReady(true);
  }

  return (
    <>
      <PageHeader eyebrow="Contact" title="Get in touch" intro="We would love to hear from you." />

      <section className="shell grid gap-12 py-14 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <p className="brand-mark text-2xl">{ESSY_LUX_CONFIG.brandName}</p>
          <p className="mt-2 text-[0.5625rem] spaced text-muted-foreground">{ESSY_LUX_CONFIG.tagline}</p>

          <ul className="mt-8 space-y-5 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-deep" strokeWidth={1.4} />
              {ESSY_LUX_CONFIG.location}
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-rose-deep" strokeWidth={1.4} />
              <a href={`tel:${ESSY_LUX_CONFIG.phone}`} className="hover:text-rose-deep">
                {ESSY_LUX_CONFIG.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-deep" strokeWidth={1.4} />
              WhatsApp available on the same number
            </li>
          </ul>

          <div className="mt-10 space-y-5 border-t border-border pt-8">
            {[
              { title: "Customer care", text: "Questions about a bag, a colour or a size." },
              { title: "Order support", text: "Help with an order you have already placed." },
              { title: "General questions", text: "Anything else you would like to ask us." },
              { title: "Collaborations", text: "Styling, content and partnership enquiries." },
            ].map((b) => (
              <div key={b.title}>
                <h2 className="text-[0.625rem] font-medium spaced text-rose-deep">{b.title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{b.text}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} noValidate className="border border-border bg-shell p-7 sm:p-9">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="c-name" label="Full name" value={values.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="name" />
            <Field
              id="c-email"
              label="Email (optional)"
              type="email"
              value={values.email}
              onChange={(v) => set("email", v)}
              error={errors.email}
              autoComplete="email"
            />
            <Field
              id="c-phone"
              label="Phone number"
              type="tel"
              value={values.phone}
              onChange={(v) => set("phone", v)}
              error={errors.phone}
              autoComplete="tel"
              placeholder="07XX XXX XXX"
            />
            <div>
              <Label htmlFor="c-subject">Subject</Label>
              <select
                id="c-subject"
                value={values.subject}
                onChange={(e) => set("subject", e.target.value)}
                className="field"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <Label htmlFor="c-message">Message</Label>
            <textarea
              id="c-message"
              rows={5}
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "c-message-error" : undefined}
              className="field resize-none"
            />
            {errors.message && (
              <p id="c-message-error" className="mt-1.5 text-xs text-destructive">
                {errors.message}
              </p>
            )}
          </div>

          {ready && (
            <p className="mt-6 border border-rose bg-rose/25 px-4 py-3 text-sm" role="status">
              WhatsApp is ready with your message. Please review it and press send so Essy-Lux receives it.
            </p>
          )}

          <button type="submit" className="btn-base btn-whatsapp mt-7 w-full">
            Send message
          </button>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Your message is prepared in WhatsApp and sent only when you press send there.
          </p>
        </form>
      </section>
    </>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[0.625rem] font-medium spaced text-muted-foreground">
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
      <Label htmlFor={id}>{label}</Label>
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
