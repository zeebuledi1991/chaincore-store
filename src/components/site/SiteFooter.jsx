import { Link } from "@tanstack/react-router";
import Brand from "@/components/site/Brand";
import { useContent } from "@/components/content/ContentProvider";
import { SUPPORT_EMAIL } from "@/lib/catalog";

const NAVIGATE = [
  { key: "site.nav.home", to: "/" },
  { key: "site.nav.products", to: "/products" },
  { key: "site.nav.about", to: "/about" },
  { key: "site.nav.contact", to: "/contact" },
  { key: "site.nav.custom", to: "/custom-order" },
];

const LEGAL = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Returns Policy", to: "/returns-policy" },
];

export default function SiteFooter() {
  const t = useContent();
  return (
    <footer className="relative mt-24 border-t border-border/70 bg-card/30">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Brand />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("site.footer.tagline")}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t("site.footer.status")}
              </span>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
              {t("site.footer.navigate")}
            </h2>
            <ul className="mt-5 space-y-3">
              {NAVIGATE.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
              {t("site.footer.policies")}
            </h2>
            <ul className="mt-5 space-y-3">
              {LEGAL.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
              {t("site.footer.contact")}
            </h2>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-5 block font-heading text-lg text-foreground transition-colors hover:text-primary"
            >
              {SUPPORT_EMAIL}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("site.footer.company")}
              <br />
              {t("site.footer.response")}
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
            {t("site.footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}