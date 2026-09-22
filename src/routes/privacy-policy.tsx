import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ESSY_LUX_CONFIG } from "@/lib/config";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | ESSY-LUX" },
      {
        name: "description",
        content: "How ESSY-LUX handles the details you share when ordering a handbag on WhatsApp.",
      },
      { property: "og:title", content: "Privacy Policy | ESSY-LUX" },
      { property: "og:description", content: "How ESSY-LUX handles your information." },
    ],
  }),
  component: Privacy,
});

const sections = [
  {
    title: "Information you share",
    body: "When you prepare an order or an enquiry, you enter your name, phone number, delivery location and an optional note. These details are placed into a WhatsApp message on your own device.",
  },
  {
    title: "How your details reach us",
    body: "This website does not send anything by itself and does not store your details on a server. Your message reaches Essy-Lux only when you press send inside WhatsApp.",
  },
  {
    title: "Saved on your device",
    body: "Your shopping bag and wishlist are kept in your own browser so they are still there when you return. You can clear them by emptying your bag and wishlist or clearing your browser data.",
  },
  {
    title: "How we use your details",
    body: "We use the details in your message only to confirm availability, arrange delivery and complete your order.",
  },
  {
    title: "Questions",
    body: `For any question about your information, contact ${ESSY_LUX_CONFIG.brandName} on WhatsApp at ${ESSY_LUX_CONFIG.phone}.`,
  },
];

function Privacy() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy policy" />
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
