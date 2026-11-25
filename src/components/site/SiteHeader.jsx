import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import Brand from "@/components/site/Brand";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About Us", to: "/about" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Contact Us", to: "/contact" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "border-b transition-all duration-500",
          scrolled
            ? "border-border/70 bg-background/85 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Brand />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative rounded-md px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:text-foreground",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/custom-order"
              className="group relative overflow-hidden rounded-md border border-primary/40 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              Custom Order
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-md border border-border/70 text-foreground lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-xl lg:hidden">
          <div className="flex h-[72px] items-center justify-between px-5">
            <Brand />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-md border border-border/70"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-6 flex flex-col px-5" aria-label="Mobile">
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between border-b border-border/60 py-5 font-heading text-2xl text-foreground"
              >
                {item.label}
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  0{index + 1}
                </span>
              </Link>
            ))}
            <Link
              to="/custom-order"
              onClick={() => setOpen(false)}
              className="mt-8 rounded-md bg-primary px-5 py-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground"
            >
              Submit Custom Request
            </Link>
            <a
              href="mailto:support@chaincore.store"
              className="mt-4 text-center font-mono text-[11px] tracking-[0.16em] text-muted-foreground"
            >
              support@chaincore.store
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}