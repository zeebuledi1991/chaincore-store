import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ShieldAlert } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import ProductCard from "@/components/site/ProductCard";
import { Image } from "@/components/ui/image";
import { listProducts } from "@/lib/server-fns";
import { PRODUCTS } from "@/lib/catalog";

export const Route = createFileRoute("/_site/products/")({
  loader: async () => {
    try {
      const products = await listProducts();
      return { products: products.length ? products : PRODUCTS };
    } catch (error) {
      return { products: PRODUCTS };
    }
  },
  head: () => ({
    meta: [
    { title: "Products — ChainCore Technologies LLC" },
    {
      name: "description",
      content:
      "Complete software licence and simulation packages for blockchain testing across BNB Chain, Ethereum, Solana and TRON."
    }]

  }),
  component: ProductsPage
});

function ProductsPage() {
  const { products } = Route.useLoaderData();
  const license = products.find((product) => product.kind === "license") || products[0];
  const packages = products.filter((product) => product !== license);

  return (
    <>
      <PageHeader
        label="Product Store"
        title="Software licenses and Flash USDT packages."
        description="Every price below is the final price in USD. Licenses are delivered by email after payment is verified; Flash packages will be provided on the blockchain you select.">
        
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-primary" /> Server-verified payment
          </span>
          <span className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-primary" /> Email delivery
          </span>
          <span className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-primary" /> OxaPay crypto checkout
          </span>
        </div>
      </PageHeader>

      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          {license &&
          <div className="grid gap-8 rounded-2xl border border-primary/25 bg-card/50 p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12 lg:p-10">
              <div className="relative overflow-hidden rounded-xl border border-border/70">
                <Image
                src={license.image}
                alt={license.name}
                className="aspect-[4/3] w-full object-cover" />
              
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary-foreground">
                  Flagship licence
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                  {license.tag}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
                  {license.name}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {license.summary}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {license.features.slice(0, 5).map((feature) =>
                <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                )}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <span className="font-heading text-3xl font-semibold text-foreground">
                    {license.priceLabel}
                  </span>
                  <Link
                  to="/products/$slug"
                  params={{ slug: license.slug }}
                  className="group inline-flex items-center gap-2.5 rounded-md bg-primary px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_45px_-12px_hsl(184_100%_50%/0.9)]">
                  
                    Buy now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          }

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((product, index) =>
            <ProductCard key={product.slug} product={product} index={index} />
            )}
          </div>

          




















          
        </div>
      </section>
    </>);

}