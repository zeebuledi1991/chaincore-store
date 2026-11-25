import { Image } from "@/components/ui/image";
import SectionIntro from "@/components/site/SectionIntro";
import { useContent } from "@/components/content/ContentProvider";
import { BLOCKCHAINS, IMAGES } from "@/lib/catalog";

export default function Networks() {
  const t = useContent();
  return (
    <section className="relative border-b border-border/60 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionIntro
          label={t("home.networks.label")}
          title={t("home.networks.title")}
          description={t("home.networks.description")}
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-xl border border-border/70">
            <Image
              src={IMAGES.networks}
              alt="Abstract network topology of four connected nodes"
              className="h-full min-h-[260px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/85 via-background/20 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
                Multi-network
              </p>
              <p className="mt-2 max-w-xs font-heading text-lg text-foreground">
                {t("home.networks.caption")}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {BLOCKCHAINS.map((chain) => (
              <div
                key={chain.id}
                className="group relative overflow-hidden rounded-xl border border-border/70 bg-card/40 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/70"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: chain.color }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    {chain.ticker}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-base font-semibold text-foreground">
                  {chain.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {t(`home.networks.${chain.id}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}