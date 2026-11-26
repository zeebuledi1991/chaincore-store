import { ArrowRight } from "lucide-react";
import ContentLink from "@/components/content/ContentLink";
import { useContent } from "@/components/content/ContentProvider";
import { Image } from "@/components/ui/image";

const PARAGRAPHS = ["about.team.p1", "about.team.p2", "about.team.p3"];

export default function AboutTeam() {
  const t = useContent();

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {t("about.team.title")}
            </h2>
            <div className="mt-6 space-y-4">
              {PARAGRAPHS.map((key) => (
                <p key={key} className="text-[15px] leading-relaxed text-muted-foreground">
                  {t(key)}
                </p>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <ContentLink
                to={t("about.team.primary.url")}
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground"
              >
                {t("about.team.primary")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ContentLink>
              <ContentLink
                to={t("about.team.secondary.url")}
                className="rounded-md border border-border px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {t("about.team.secondary")}
              </ContentLink>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/70">
            <Image
              src={t("about.team.image")}
              alt="ChainCore engineers reviewing blockchain infrastructure"
              className="aspect-[2/3] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}