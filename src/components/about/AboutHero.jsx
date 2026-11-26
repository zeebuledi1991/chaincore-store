import { useContent } from "@/components/content/ContentProvider";
import { Image } from "@/components/ui/image";

export default function AboutHero() {
  const t = useContent();

  return (
    <section className="relative isolate overflow-hidden border-b border-border/60">
      <div className="absolute inset-0">
        <Image
          src={t("site.image.about")}
          alt="ChainCore Flash product infrastructure"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-5 py-24 text-center sm:px-8 lg:py-32">
        <h1 className="animate-rise text-3xl font-semibold uppercase leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {t("about.hero.title")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {t("about.hero.body")}
        </p>
      </div>
    </section>
  );
}