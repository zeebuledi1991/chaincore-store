import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Boxes, Compass, Layers, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import ContentLink from "@/components/content/ContentLink";
import { useContent } from "@/components/content/ContentProvider";
import { Image } from "@/components/ui/image";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About Us — ChainCore Technologies LLC" },
      {
        name: "description",
        content:
          "ChainCore Technologies LLC develops blockchain software, digital tools and multi-network testing solutions. Our mission is to make blockchain technology more accessible.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Compass, titleKey: "about.value1.title", bodyKey: "about.value1.body" },
  { icon: ShieldCheck, titleKey: "about.value2.title", bodyKey: "about.value2.body" },
  { icon: Layers, titleKey: "about.value3.title", bodyKey: "about.value3.body" },
  { icon: Boxes, titleKey: "about.value4.title", bodyKey: "about.value4.body" },
];

const STATS = [
  { valueKey: "about.stat1.value", labelKey: "about.stat1.label" },
  { valueKey: "about.stat2.value", labelKey: "about.stat2.label" },
  { valueKey: "about.stat3.value", labelKey: "about.stat3.label" },
];

function AboutPage() {
  const t = useContent();

  return (
    <>
      <PageHeader
        label={t("about.label")}
        title={t("about.title")}
        description={t("about.description")}
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
              <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                {t("about.mission.title")}
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
                {t("about.mission.paragraph1")}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {t("about.mission.paragraph2")}
              </p>
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border/60 pt-8 sm:grid-cols-3">
                {STATS.map((stat) => (
                  <div key={stat.labelKey}>
                    <dt className="font-mono text-2xl text-foreground">{t(stat.valueKey)}</dt>
                    <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      {t(stat.labelKey)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-border/70">
              <Image
                src={t("site.image.about")}
                alt="Cold-lit architectural interior representing ChainCore engineering infrastructure"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-lg border border-white/10 bg-background/80 px-4 py-3 backdrop-blur">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                  {t("about.image.label")}
                </p>
                <p className="mt-1 font-heading text-sm text-foreground">
                  {t("about.image.caption")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {VALUES.map((value, index) => (
              <div
                key={value.titleKey}
                className="rounded-xl border border-border/70 bg-card/40 p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <value.icon className="h-5 w-5 text-primary" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-base font-semibold text-foreground">
                  {t(value.titleKey)}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                  {t(value.bodyKey)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-xl border border-border/70 bg-card/40 p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{t("about.cta.title")}</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {t("about.cta.body")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ContentLink
                to={t("about.cta.primary.url")}
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground"
              >
                {t("about.cta.primary")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ContentLink>
              <ContentLink
                to={t("about.cta.secondary.url")}
                className="rounded-md border border-border px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground hover:border-primary/50 hover:text-primary"
              >
                {t("about.cta.secondary")}
              </ContentLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}