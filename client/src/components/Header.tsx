import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/Brand";
import { useShop } from "@/lib/store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { cartCount, wishlist } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate({ to: "/shop", search: { q } });
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled ? "border-border bg-ivory/95 shadow-[0_1px_20px_rgba(90,56,43,0.06)] backdrop-blur" : "border-border/60 bg-ivory"
      }`}
    >
      <div className="shell grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4 lg:py-5">
        <div className="flex items-center gap-2 lg:hidden">
          <IconButton label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu className="h-5 w-5" strokeWidth={1.4} />
          </IconButton>
        </div>

        <div className="hidden lg:block">
          <Logo size="md" />
        </div>

        <nav className="hidden justify-center gap-8 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex justify-center lg:hidden">
          <Logo size="sm" withTagline={false} />
        </div>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <IconButton label="Search bags" onClick={() => setSearchOpen((v) => !v)}>
            <Search className="h-5 w-5" strokeWidth={1.4} />
          </IconButton>
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlist.length} items`}
            className="relative grid h-10 w-10 place-items-center transition-colors hover:text-rose-deep"
          >
            <Heart className="h-5 w-5" strokeWidth={1.4} />
            {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
          </Link>
          <Link
            to="/cart"
            aria-label={`Shopping bag, ${cartCount} items`}
            className="relative grid h-10 w-10 place-items-center transition-colors hover:text-rose-deep"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
            {cartCount > 0 && <Badge>{cartCount}</Badge>}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-shell">
          <form onSubmit={submitSearch} className="shell flex items-center gap-3 py-4" role="search">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.4} />
            <label htmlFor="site-search" className="sr-only">
              Search bags
            </label>
            <input
              id="site-search"
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tote, satchel, crossbody, blush pink…"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground/70"
            />
            <button type="submit" className="btn-base btn-primary min-h-10 px-5 py-2 text-[0.625rem]">
              Search
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-chocolate/30"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fade-soft absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-ivory px-7 pb-10 pt-6">
            <div className="flex items-center justify-between">
              <Logo size="sm" />
              <IconButton label="Close menu" onClick={() => setMenuOpen(false)}>
                <X className="h-5 w-5" strokeWidth={1.4} />
              </IconButton>
            </div>
            <nav className="mt-10 flex flex-col gap-6" aria-label="Mobile">
              {NAV.map((item) => (
                <Link key={item.to} to={item.to} className="nav-link text-xs">
                  {item.label}
                </Link>
              ))}
              <span className="h-px bg-border" />
              <Link to="/wishlist" className="nav-link text-xs">
                Wishlist
              </Link>
              <Link to="/cart" className="nav-link text-xs">
                Shopping Bag
              </Link>
              <Link to="/faq" className="nav-link text-xs">
                FAQ
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center transition-colors hover:text-rose-deep"
    >
      {children}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute right-0.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-deep px-1 font-sans text-[0.5625rem] font-semibold text-shell">
      {children}
    </span>
  );
}
