import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Info } from "lucide-react";
import { Image } from "@/components/ui/image";
import CheckoutPanel from "@/components/store/CheckoutPanel";
import { useContent } from "@/components/content/ContentProvider";
import { listProducts } from "@/lib/server-fns";
import { PRODUCTS, formatUsd } from "@/lib/catalog";

export const Route = createFileRoute("/_site/products/$slug")({
  loader: async ({ params }) => {
    let products = PRODUCTS;
    try {
      const loaded = await listProducts();
      if (loaded.length) products = loaded;
    } catch (error) {
      products = PRODUCTS;
    }
    const product = products.find((item) => item.slug === params.slug);
    if (!product) throw notFound();
    return { product, related: products.filter((item) => item.slug !== params.slug).slice(0, 3) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product?.name || "Product"} — ChainCore Technologies LLC` },
      {
        name: "description",
        content:
          loaderData?.product?.summary ||
          "Blockchain software licences and simulation packages from ChainCore Technologies LLC.",
      },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const t = useContent();
  const { product, related } = Route.useLoaderData();

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("product.back")}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <div className="relative overflow-hidden rounded-xl border border-border/70">
              <Image
                src={product.image}
                alt={product.name}
                fittingType="fit"
                className="aspect-[16/10] w-full bg-card/40 object-contain p-6"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/90 backdrop-blur">
                {product.tag}
              </span>
            </div>

            <h1 className="mt-8 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {product.summary}
            </p>

            {product.simulatedUnits ? (
              <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border/70 bg-card/40 p-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                    {t("product.unitsLabel")}
                  </p>
                  <p className="mt-1.5 font-heading text-xl text-foreground">
                    {product.simulatedUnits.toLocaleString("en-US")}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                    {t("product.priceLabel")}
                  </p>
                  <p className="mt-1.5 font-heading text-xl text-primary">
                    {product.priceLabel || formatUsd(product.price)}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-8">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {t("product.included")}
              </h2>
              <ul className="mt-4 space-y-3">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 border-b border-border/50 pb-3 text-sm leading-relaxed text-foreground/85 last:border-0"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {product.kind === "simulation" && (
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/5 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-[13px] leading-relaxed text-foreground/85">
                  {t("product.note")}
                </p>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <CheckoutPanel product={product} />
            <div className="mt-4 rounded-xl border border-border/70 bg-card/30 p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                {t("product.deliveryTitle")}
              </p>
              <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
                {(product.kind === "simulation"
                  ? [
                      t("product.delivery.flash.1"),
                      t("product.delivery.flash.2"),
                      t("product.delivery.flash.3"),
                      t("product.delivery.flash.4"),
                    ]
                  : [
                      t("product.delivery.license.1"),
                      t("product.delivery.license.2"),
                      t("product.delivery.license.3"),
                    ]
                ).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-border/60 pt-10">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {t("product.related")}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to="/products/$slug"
                  params={{ slug: item.slug }}
                  className="group rounded-lg border border-border/70 bg-card/40 p-5 transition-colors hover:border-primary/40"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    {item.tag}
                  </p>
                  <p className="mt-2 font-heading text-base text-foreground">{item.name}</p>
                  <p className="mt-1 font-mono text-sm text-primary">{item.priceLabel}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}