import { Link, useRouterState } from "@tanstack/react-router";
import {
  ClipboardList,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Package,
  ShieldAlert,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/content", label: "Website content", icon: FileText },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/requests", label: "Custom requests", icon: ClipboardList },
];

function Notice({ title, body, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/60 p-8 text-center">
        <ShieldAlert className="mx-auto h-7 w-7 text-primary" />
        <h1 className="mt-4 text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
        <div className="mt-6 flex justify-center">{children}</div>
      </div>
    </div>
  );
}

export default function AdminShell({ children }) {
  const { user, isLoadingAuth, isAuthenticated, navigateToLogin, logout } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Notice
        title="Sign in required"
        body="The dashboard is only available to the store's administrators."
      >
        <Button onClick={navigateToLogin}>Sign in</Button>
      </Notice>
    );
  }

  if (user?.role !== "admin") {
    return (
      <Notice
        title="Administrators only"
        body={`${user?.email || "This account"} is signed in, but it is not an administrator of this store.`}
      >
        <Button variant="outline" onClick={() => logout()}>
          Sign out
        </Button>
      </Notice>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col lg:flex-row">
        <aside className="border-b border-border bg-card/40 px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="px-2">
            <p className="font-heading text-sm font-semibold tracking-[0.18em] text-foreground">
              CHAINCORE
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              Admin dashboard
            </p>
          </div>

          <nav className="mt-5 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "border border-primary/30 bg-primary/10 text-primary"
                      : "border border-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 flex items-center gap-1 border-t border-border pt-4 lg:mt-auto">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View site
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>

          <p className="mt-4 truncate px-3 font-mono text-[10px] text-muted-foreground/70">
            {user?.email}
          </p>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}