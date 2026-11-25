import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import Brand from "@/components/site/Brand";
import ContentLink from "@/components/content/ContentLink";
import { useContent } from "@/components/content/ContentProvider";
import { SUPPORT_EMAIL } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "site.nav.home", urlKey: "site.nav.home.url" },
  { key: "site.nav.products", urlKey: "site.nav.products.url" },
  { key: "site.nav.about", urlKey: "site.nav.about.url" },
  { key: "site.nav.privacy", urlKey: "site.nav.privacy.url" },
  { key: "site.nav.contact", urlKey: "site.nav.contact.url" },
];

export default function SiteHeader() {
  const t = useContent();
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
            {NAV_LINKS.map((item) => {
              const target = t(item.urlKey);
              const isActive = target === "/" ? pathname === "/" : pathname.startsWith(target);
              return (
                <ContentLink
                  key={item.key}
                  to={target}
                  className={cn(
                    "relative rounded-md px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:text-foreground",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t(item.key)}
                </ContentLink>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ContentLink
              to={t("site.nav.custom.url")}
              className="group relative overflow-hidden rounded-md border border-primary/40 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              {t("site.nav.custom")}
            </ContentLink>
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
            {NAV_LINKS.map((item, index) => (
              <ContentLink
                key={item.key}
                to={t(item.urlKey)}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between border-b border-border/60 py-5 font-heading text-2xl text-foreground"
              >
                {t(item.key)}
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  0{index + 1}
                </span>
              </ContentLink>
            ))}
            <ContentLink
              to={t("site.nav.custom.url")}
              onClick={() => setOpen(false)}
              className="mt-8 rounded-md bg-primary px-5 py-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground"
            >
              {t("site.nav.customMobile")}
            </ContentLink>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-4 text-center font-mono text-[11px] tracking-[0.16em] text-muted-foreground"
            >
              {SUPPORT_EMAIL}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}