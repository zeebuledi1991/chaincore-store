import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import Brand from "@/components/site/Brand";
import {
  ArrowUpRight,
  FileText,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  PenLine,
  Receipt,
} from "lucide-react";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: Receipt },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/licenses", label: "Licenses", icon: KeyRound },
  { to: "/admin/custom-orders", label: "Custom Requests", icon: FileText },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/content", label: "Website CMS", icon: PenLine },
];

export default function AdminShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-border/70 bg-card/40 lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-5">
            <Brand compact />
            <span className="rounded-full border border-primary/30 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
              Admin
            </span>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                activeProps={{
                  className: "border-primary/40 bg-primary/10 text-primary",
                }}
                className="flex shrink-0 items-center gap-2.5 rounded-md border border-transparent px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-border/70 hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden border-t border-border/60 px-5 py-5 lg:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Signed in
            </p>
            <p className="mt-1.5 truncate text-[13px] text-foreground">{user?.email}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"
              >
                View store
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="border-b border-border/70 px-5 py-4 lg:px-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              ChainCore Command Center
            </p>
          </div>
          <div className="px-5 py-8 lg:px-8">{children ?? <Outlet />}</div>
        </div>
      </div>
    </div>
  );
}