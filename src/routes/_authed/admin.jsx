import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authed/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-5 text-center">
        <ShieldAlert className="h-9 w-9 text-destructive" />
        <h1 className="mt-5 text-2xl font-semibold text-foreground">Administrator access required</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This dashboard is restricted to authorised ChainCore administrators. Your account is signed
          in as {user?.email || "a standard user"}.
        </p>
        <a
          href="mailto:support@chaincore.store"
          className="mt-6 rounded-md border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground hover:border-primary/50"
        >
          Request access
        </a>
      </div>
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}