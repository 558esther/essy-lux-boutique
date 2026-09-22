import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AdminAuthProvider>
      <AdminGate />
    </AdminAuthProvider>
  ),
});

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "Add Product",
  "/admin/categories": "Categories",
  "/admin/collections": "Collections",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/homepage": "Homepage",
  "/admin/media": "Media Library",
  "/admin/settings": "Settings",
};

function pageTitleFor(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/admin/products/")) return "Edit Product";
  return "Essy-Lux Admin";
}

function AdminGate() {
  const { user, loading, isAdmin, checkingAdmin, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/admin/login" });
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
            onClick={() => signOut().then(() => navigate({ to: "/admin/login" }))}
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
