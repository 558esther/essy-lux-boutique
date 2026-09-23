import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ClipboardList,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  Package,
  PackagePlus,
  Settings,
  Tags,
  Users,
} from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import { STOREFRONT_URL } from "@/lib/storefront";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/products", label: "Products", icon: Package, exact: false },
  { to: "/products/new", label: "Add Product", icon: PackagePlus, exact: false },
  { to: "/categories", label: "Categories", icon: Tags, exact: false },
  { to: "/collections", label: "Collections", icon: LayoutGrid, exact: false },
  { to: "/orders", label: "Orders", icon: ClipboardList, exact: false },
  { to: "/customers", label: "Customers", icon: Users, exact: false },
  { to: "/homepage", label: "Homepage", icon: Home, exact: false },
  { to: "/media", label: "Media", icon: ImageIcon, exact: false },
  { to: "/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80 hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2 px-1">
      <span className="font-display text-xl uppercase tracking-[0.14em]">Essy-Lux</span>
      <span className="rounded bg-secondary px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-muted-foreground">
        Admin
      </span>
    </Link>
  );
}

export function AdminShell({ children, title }: { children: ReactNode; title?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate({ to: "/login" });
  }

  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-shell px-4 py-6 lg:flex">
        <BrandMark />
        <div className="mt-8 flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="border-t border-border pt-4">
          <p className="truncate px-3 text-xs text-muted-foreground">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-destructive"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border px-4 py-5 text-left">
            <SheetTitle asChild>
              <BrandMark />
            </SheetTitle>
          </SheetHeader>
          <div className="flex h-[calc(100%-5rem)] flex-col justify-between px-4 py-4">
            <NavLinks onNavigate={() => setMobileOpen(false)} />
            <div className="border-t border-border pt-4">
              <a
                href={STOREFRONT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground"
              >
                View shop ↗
              </a>
              <p className="truncate px-3 text-xs text-muted-foreground">{user?.email}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-destructive"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Logout
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-shell px-4 py-4 lg:px-8">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </Button>
          <h1 className="min-w-0 flex-1 truncate font-display text-lg uppercase tracking-[0.1em] sm:text-xl">
            {title}
          </h1>
          <a
            href={STOREFRONT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground sm:block"
          >
            View shop ↗
          </a>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
