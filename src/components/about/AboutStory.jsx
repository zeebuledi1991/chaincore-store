import { useContent } from "@/components/content/ContentProvider";
import { Image } from "@/components/ui/image";

const PARAGRAPHS = [
  "about.story.p1",
  "about.story.p2",
  "about.story.p3",
  "about.story.p4",
  "about.story.p5",
  "about.story.p6",
];

export default function AboutStory() {
  const t = useContent();

  return (
    <section className="border-t border-border/60 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-xl border border-border/70">
          <Image
            src={t("about.story.image")}
            alt="ChainCore Flash product development"
            className="aspect-[16/9] w-full"
          />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                {t("about.story.label")}
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-semibold uppercase leading-tight text-foreground sm:text-4xl">
              {t("about.story.title")}
            </h2>
          </div>

          <div className="space-y-5">
            {PARAGRAPHS.map((key) => (
              <p key={key} className="text-[15px] leading-relaxed text-muted-foreground">
                {t(key)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}