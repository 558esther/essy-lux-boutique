import { FloralCorner } from "@/components/Brand";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ivory py-16 sm:py-20">
      <FloralCorner className="pointer-events-none absolute -left-6 bottom-0 h-40 w-40 text-beige/70" />
      <FloralCorner className="pointer-events-none absolute -right-6 top-0 h-40 w-40 rotate-180 text-beige/70" />
      <div className="shell relative rise text-center">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="section-title mt-4">{title}</h1>
        {intro && (
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
