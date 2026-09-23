import { useState } from "react";
import { FloralDivider } from "@/components/Brand";
import { ESSY_LUX_CONFIG } from "@/lib/config";

export function Newsletter({
  heading = "Join the Essy-Lux list",
  description = "Be the first to discover new collections, beautiful new arrivals and special updates.",
}: {
  heading?: string;
  description?: string;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError("Please enter a valid email address.");
      setSaved(false);
      return;
    }
    setError("");
    setSaved(true);
    setEmail("");
  }

  return (
    <section className="bg-cream py-20" aria-labelledby="newsletter-title">
      <div className="shell max-w-xl text-center">
        <FloralDivider className="mb-8" />
        <h2 id="newsletter-title" className="section-title">
          {heading}
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "newsletter-error" : undefined}
            className="field flex-1"
          />
          <button type="submit" className="btn-base btn-primary">
            Subscribe
          </button>
        </form>
        {error && (
          <p id="newsletter-error" className="mt-3 text-xs text-destructive">
            {error}
          </p>
        )}
        {saved && (
          <p className="mt-3 text-xs text-muted-foreground" role="status">
            Thank you. Our mailing list isn&apos;t connected yet — for updates now, message{" "}
            {ESSY_LUX_CONFIG.brandName} on WhatsApp at {ESSY_LUX_CONFIG.phone}.
          </p>
        )}
      </div>
    </section>
  );
}
