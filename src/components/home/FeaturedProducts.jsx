import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import SectionIntro from "@/components/site/SectionIntro";
import ProductCard from "@/components/site/ProductCard";
import { useContent } from "@/components/content/ContentProvider";
import { PRODUCTS } from "@/lib/catalog";

export default function FeaturedProducts({ products }) {
  const t = useContent();
  const catalog = products && products.length ? products : PRODUCTS;
  return (
    <section className="relative border-b border-border/60 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionIntro
            label={t("home.products.label")}
            title={t("home.products.title")}
            description={t("home.products.description")}
          />
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 self-start font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary lg:self-auto"
          >
            {t("home.products.link")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}