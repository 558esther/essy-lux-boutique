import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ESSY_LUX_CONFIG } from "@/lib/config";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | ESSY-LUX" },
      {
        name: "description",
        content:
          "How to order ESSY-LUX handbags on WhatsApp, where we are located, colour choices, availability and delivery.",
      },
      { property: "og:title", content: "Frequently Asked Questions | ESSY-LUX" },
      { property: "og:description", content: "Answers about ordering, delivery and availability at ESSY-LUX." },
    ],
  }),
  component: Faq,
});

const contactLine = `Please contact ${ESSY_LUX_CONFIG.brandName} through WhatsApp on ${ESSY_LUX_CONFIG.phone} for current information.`;

const faqs = [
  {
    q: "How do I place an order?",
    a: "Choose your bag, select the colour and quantity, then tap “Order via WhatsApp”. Fill in your name, phone number and delivery location and we'll prepare your order message — you simply press send in WhatsApp.",
  },
  {
    q: "Can I order through WhatsApp?",
    a: `Yes — WhatsApp is our main ordering channel. You can also message us directly on ${ESSY_LUX_CONFIG.phone}.`,
  },
  { q: "Where is Essy-Lux located?", a: `We are based in ${ESSY_LUX_CONFIG.location}.` },
  {
    q: "How do I choose a bag colour?",
    a: "Each bag lists its available colours on the product page. Select one before adding to your bag or ordering, and we'll confirm it with you.",
  },
  {
    q: "How do I know if an item is available?",
    a: "Product pages show current availability. We always reconfirm availability on WhatsApp before your order is finalised.",
  },
  { q: "How is delivery arranged?", a: `Delivery is available. Delivery arrangements and any applicable fees are confirmed with you before your order is finalised. ${contactLine}` },
  { q: "What payment methods are available?", a: `Payments are not processed on this website. ${contactLine}` },
  { q: "Can I cancel my order?", a: contactLine },
  { q: "Can I exchange a bag?", a: contactLine },
];

function Faq() {
  return (
    <>
      <PageHeader eyebrow="Help" title="Frequently asked questions" />
      <section className="shell max-w-3xl py-14">
        <dl className="divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <div key={f.q} className="py-7">
              <dt className="font-display text-lg leading-snug">{f.q}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
