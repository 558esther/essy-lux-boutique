/**
 * The admin dashboard is deployed separately from the customer-facing site,
 * so "View shop" / "View product" links need the storefront's own URL
 * rather than a relative path.
 */
export const STOREFRONT_URL = (import.meta.env.VITE_STOREFRONT_URL as string | undefined) ?? "https://essylux.com";

export function storefrontProductUrl(slug: string): string {
  return `${STOREFRONT_URL.replace(/\/$/, "")}/product/${slug}`;
}
