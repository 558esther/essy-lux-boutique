import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [{ title: "ESSY-LUX Admin | Sign In" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AdminAuthProvider>
      <AdminLogin />
    </AdminAuthProvider>
  ),
});

function AdminLogin() {
  const { user, loading, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin" });
  }, [loading, user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) {
      setError("Incorrect email or password. Please try again.");
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.96_0.017_84.6)] px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-border bg-shell p-8 shadow-sm">
        <div className="text-center">
          <p className="font-display text-2xl uppercase tracking-[0.14em]">ESSY-LUX Admin</p>
          <p className="mt-2 text-sm text-muted-foreground">Manage your luxury handbag store.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Email / Username
            </label>
            <Input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Password
            </label>
            <Input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <label className="flex items-center gap-2">
              <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
              Remember me
            </label>
            <button
              type="button"
              onClick={() =>
                setError(
                  "Password resets aren't wired up yet — ask another admin, or reset it from the Supabase dashboard under Authentication.",
                )
              }
              className="hover:text-foreground hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
