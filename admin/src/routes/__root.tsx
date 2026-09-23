import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/auth";
import { AdminShell } from "@/components/AdminShell";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [{ title: "ESSY-LUX Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: RootComponent,
});

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/products/new": "Add Product",
  "/categories": "Categories",
  "/collections": "Collections",
  "/orders": "Orders",
  "/customers": "Customers",
  "/homepage": "Homepage",
  "/media": "Media Library",
  "/settings": "Settings",
};

function pageTitleFor(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/products/")) return "Edit Product";
  return "Essy-Lux Admin";
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <RouteSwitch />
      </AdminAuthProvider>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

/** The login page bypasses the authenticated shell entirely — everything else goes through the gate. */
function RouteSwitch() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/login") return <Outlet />;
  return <AdminGate />;
}

function AdminGate() {
  const { user, loading, isAdmin, checkingAdmin, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || (user && checkingAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading ESSY-LUX Admin…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Redirecting to sign in…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm rounded-lg border border-border bg-shell p-8 text-center">
          <p className="font-display text-xl uppercase tracking-wide">Access denied</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account ({user.email}) is signed in but isn&apos;t set up as an ESSY-LUX admin. Ask an
            existing admin to grant access, or promote it from the Supabase SQL editor.
          </p>
          <button
            type="button"
            onClick={() => signOut().then(() => navigate({ to: "/login" }))}
            className="btn-base btn-outline mt-6"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminShell title={pageTitleFor(pathname)}>
      <Outlet />
    </AdminShell>
  );
}
