import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ESSY_LUX_CONFIG } from "@/lib/config";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns | ESSY-LUX" },
      {
        name: "description",
        content:
          "How delivery and returns work at ESSY-LUX. Delivery arrangements and fees are confirmed on WhatsApp before your order is finalised.",
      },
      { property: "og:title", content: "Shipping & Returns | ESSY-LUX" },
      { property: "og:description", content: "Delivery and returns information for ESSY-LUX orders." },
    ],
  }),
  component: ShippingReturns,
});

const sections = [
  {
    title: "Delivery",
    body: `Delivery is available from ${ESSY_LUX_CONFIG.location}. Delivery arrangements and applicable fees will be confirmed with the customer before the order is finalised.`,
  },
  {
    title: "Delivery timelines",
    body: `Timelines depend on your location and the bag you have chosen. Please contact ${ESSY_LUX_CONFIG.brandName} through WhatsApp on ${ESSY_LUX_CONFIG.phone} for current information.`,
  },
  {
    title: "Returns & exchanges",
    body: `Please contact ${ESSY_LUX_CONFIG.brandName} through WhatsApp regarding returns or exchanges and the applicable conditions.`,
  },
  {
    title: "Order changes",
    body: "If you need to change the colour, quantity or delivery details of an order, message us on WhatsApp as soon as possible and we will help where we can.",
  },
];

function ShippingReturns() {
  return (
    <>
      <PageHeader
        eyebrow="Customer Care"
        title="Shipping &amp; returns"
        intro="Everything here is confirmed personally with you on WhatsApp before your order is finalised."
      />
      <section className="shell max-w-3xl space-y-10 py-14">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-xl uppercase tracking-[0.14em]">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
