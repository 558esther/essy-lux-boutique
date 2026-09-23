import { Link } from "@tanstack/react-router";
import { ESSY_LUX_CONFIG } from "@/lib/config";

/** Text-based ESSY-LUX wordmark with the small floral bloom mark. */
export function Logo({
  size = "md",
  tone = "default",
  withTagline = true,
}: {
  size?: "sm" | "md" | "lg";
  tone?: "default" | "cream";
  withTagline?: boolean;
}) {
  const nameSize =
    size === "lg" ? "text-4xl sm:text-5xl" : size === "sm" ? "text-lg" : "text-2xl sm:text-[1.7rem]";
  const color = tone === "cream" ? "text-background" : "text-foreground";

  return (
    <Link to="/" className={`group inline-flex flex-col items-center ${color}`} aria-label="ESSY-LUX home">
      <Bloom className={`mb-1 ${size === "sm" ? "h-3 w-3" : "h-4 w-4"} text-champagne`} />
      <span className={`brand-mark leading-none ${nameSize}`}>{ESSY_LUX_CONFIG.brandName}</span>
      {withTagline && (
        <span
          className={`mt-1.5 font-sans ${size === "sm" ? "text-[0.5rem]" : "text-[0.5625rem]"} font-medium spaced opacity-70`}
        >
          {ESSY_LUX_CONFIG.tagline}
        </span>
      )}
    </Link>
  );
}

/** Fine botanical bloom mark used as a brand detail. */
export function Bloom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 13c0-3.6-2.2-6.4-5-8 .4 3.4 1.9 6.3 5 8Zm0 0c0-3.6 2.2-6.4 5-8-.4 3.4-1.9 6.3-5 8Zm0 0c-2.6-1.2-5.3-1.2-7.8-.1 2.6 2.1 5.4 2.5 7.8.1Zm0 0c2.6-1.2 5.3-1.2 7.8-.1-2.6 2.1-5.4 2.5-7.8.1Zm0 0v9"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Decorative divider: a fine rule broken by a small bloom. */
export function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-border sm:w-24" />
      <Bloom className="h-4 w-4 text-champagne" />
      <span className="h-px w-16 bg-border sm:w-24" />
    </div>
  );
}

/** Soft floral line-art corner used sparingly as a section detail. */
export function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.8">
        <path d="M4 156C24 120 42 96 74 74c26-18 46-34 58-62" />
        <path d="M74 74c-14-6-26-4-36 6 12 6 26 5 36-6Z" />
        <path d="M74 74c6-14 4-27-6-37-6 13-5 27 6 37Z" />
        <path d="M108 44c-12-3-22 0-29 9 11 4 22 1 29-9Z" />
        <path d="M108 44c4-11 2-22-7-29-3 11 0 22 7 29Z" />
        <path d="M44 110c-11-2-20 1-26 9 10 3 20 0 26-9Z" />
      </g>
    </svg>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-title mt-4">{title}</h2>
      {intro && <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">{intro}</p>}
    </div>
  );
}
