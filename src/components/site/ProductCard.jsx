import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Layers } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useContent } from "@/components/content/ContentProvider";
import { cn } from "@/lib/utils";

export default function ProductCard({ product, index = 0 }) {
  const t = useContent();
  const isLicense = product.kind === "license";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card/50 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/80",
        isLicense && "glow-cyan"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fittingType="fit"
          className="h-full w-full object-contain p-5 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/90 backdrop-blur">
          {product.tag}
        </div>
        {isLicense && (
          <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary-foreground">
            {t("products.card.flagship")}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-lg font-semibold leading-tight text-foreground">
            {product.name}
          </h3>
          <div className="text-right">
            <div className="font-mono text-xl font-medium text-primary">{product.priceLabel}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {product.unitLabel || t("products.card.currency")}
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.summary}</p>

        {product.simulatedUnits > 0 && (
          <div className="mt-5 flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-3 py-2.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-[11px] tracking-[0.08em] text-foreground/85">
              {new Intl.NumberFormat("en-US").format(product.simulatedUnits)}{" "}
              {t("products.card.units")}
            </span>
          </div>
        )}

        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="mt-6 inline-flex items-center justify-between gap-2 border-t border-border/70 pt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/85 transition-colors hover:text-primary"
        >
          {t("products.card.view")}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}