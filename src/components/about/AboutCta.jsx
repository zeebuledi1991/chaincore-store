import { ArrowRight } from "lucide-react";
import ContentLink from "@/components/content/ContentLink";
import { useContent } from "@/components/content/ContentProvider";

export default function AboutCta() {
  const t = useContent();

  return (
    <section className="pb-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-card/60 px-6 py-14 text-center sm:px-12">
          <div className="radial-fade pointer-events-none absolute inset-0" />
          <div className="relative">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
              {t("about.cta.label")}
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold uppercase leading-tight text-foreground sm:text-4xl">
              {t("about.cta.title")}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("about.cta.body")}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ContentLink
                to={t("about.cta.primary.url")}
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground"
              >
                {t("about.cta.primary")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ContentLink>
              <ContentLink
                to={t("about.cta.secondary.url")}
                className="rounded-md border border-border px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {t("about.cta.secondary")}
              </ContentLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}