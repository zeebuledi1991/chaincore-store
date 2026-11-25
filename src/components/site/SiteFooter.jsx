import Brand from "@/components/site/Brand";
import ContentLink from "@/components/content/ContentLink";
import { useContent } from "@/components/content/ContentProvider";
import { SUPPORT_EMAIL } from "@/lib/catalog";

const NAVIGATE = [
  { key: "site.nav.home", urlKey: "site.nav.home.url" },
  { key: "site.nav.products", urlKey: "site.nav.products.url" },
  { key: "site.nav.about", urlKey: "site.nav.about.url" },
  { key: "site.nav.contact", urlKey: "site.nav.contact.url" },
  { key: "site.nav.custom", urlKey: "site.nav.custom.url" },
];

const LEGAL = [
  { labelKey: "site.footer.legal.privacy", urlKey: "site.footer.legal.privacy.url" },
  { labelKey: "site.footer.legal.returns", urlKey: "site.footer.legal.returns.url" },
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
                <li key={item.key}>
                  <ContentLink
                    to={t(item.urlKey)}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {t(item.key)}
                  </ContentLink>
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
                <li key={item.labelKey}>
                  <ContentLink
                    to={t(item.urlKey)}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {t(item.labelKey)}
                  </ContentLink>
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