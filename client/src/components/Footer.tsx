import { Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { Bloom } from "@/components/Brand";
import { ESSY_LUX_CONFIG } from "@/lib/config";

const shopLinks = [
  { to: "/shop", label: "Shop" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
] as const;

const careLinks = [
  { to: "/shipping-returns", label: "Shipping" },
  { to: "/shipping-returns", label: "Returns" },
  { to: "/contact", label: "Order Support" },
] as const;

export function Footer() {
  const socials = Object.entries(ESSY_LUX_CONFIG.social).filter(([, url]) => url);

  return (
    <footer className="mt-24 bg-chocolate text-background/85">
      <div className="shell grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div>
          <Bloom className="h-4 w-4 text-champagne" />
          <p className="brand-mark mt-3 text-2xl text-background">{ESSY_LUX_CONFIG.brandName}</p>
          <p className="mt-2 font-sans text-[0.5625rem] spaced text-background/60">
            {ESSY_LUX_CONFIG.tagline}
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-champagne" strokeWidth={1.4} />
              {ESSY_LUX_CONFIG.location}
            </p>
            <p className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-champagne" strokeWidth={1.4} />
              <a href={`tel:${ESSY_LUX_CONFIG.phone}`} className="inline-block py-1.5 hover:text-champagne">
                {ESSY_LUX_CONFIG.phone}
              </a>
            </p>
          </div>
        </div>

        <FooterColumn title="Explore">
          {shopLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="inline-block py-1.5 transition-colors hover:text-champagne">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Customer Care">
          {careLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="inline-block py-1.5 transition-colors hover:text-champagne">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/checkout" className="inline-block py-1.5 transition-colors hover:text-champagne">
              Order Review
            </Link>
          </li>
        </FooterColumn>

        <FooterColumn title="Follow">
          {socials.length > 0 ? (
            socials.map(([name, url]) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize transition-colors hover:text-champagne"
                >
                  {name}
                </a>
              </li>
            ))
          ) : (
            <li className="text-background/60">
              Social pages coming soon — reach us on WhatsApp at {ESSY_LUX_CONFIG.phone}.
            </li>
          )}
        </FooterColumn>
      </div>

      <div className="border-t border-background/15">
        <div className="shell flex flex-col gap-3 py-6 text-[0.6875rem] text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {ESSY_LUX_CONFIG.brandName}. All Rights Reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="inline-block py-1.5 hover:text-champagne">
              Privacy Policy
            </Link>
            <Link to="/terms" className="inline-block py-1.5 hover:text-champagne">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-sans text-[0.625rem] font-medium spaced text-champagne">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}
