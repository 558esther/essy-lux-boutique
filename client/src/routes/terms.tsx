import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ESSY_LUX_CONFIG } from "@/lib/config";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | ESSY-LUX" },
      {
        name: "description",
        content: "The terms that apply when you browse ESSY-LUX and place a handbag order through WhatsApp.",
      },
      { property: "og:title", content: "Terms & Conditions | ESSY-LUX" },
      { property: "og:description", content: "Terms for browsing and ordering at ESSY-LUX." },
    ],
  }),
  component: Terms,
});

const sections = [
  {
    title: "About this website",
    body: `This website presents handbags offered by ${ESSY_LUX_CONFIG.brandName}, based in ${ESSY_LUX_CONFIG.location}.`,
  },
  {
    title: "Orders",
    body: "Adding a bag to your bag or preparing a WhatsApp message is a request, not a confirmed order. An order is confirmed only once Essy-Lux has replied to you on WhatsApp confirming availability, delivery and payment.",
  },
  {
    title: "Prices",
    body: "Prices are shown in Kenyan Shillings and may change. Delivery is quoted separately and confirmed with you before your order is finalised.",
  },
  {
    title: "Payments",
    body: "No payment is taken on this website. Payment arrangements are agreed with you directly on WhatsApp.",
  },
  {
    title: "Product images",
    body: "Images are styled for presentation. Colours can appear slightly different on different screens.",
  },
  {
    title: "Contact",
    body: `For any question about these terms, contact us on WhatsApp at ${ESSY_LUX_CONFIG.phone}.`,
  },
];

function Terms() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms &amp; conditions" />
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
