import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/home/Hero";
import Technology from "@/components/home/Technology";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Networks from "@/components/home/Networks";
import WhyChoose from "@/components/home/WhyChoose";
import BusinessInquiries from "@/components/home/BusinessInquiries";
import { listProducts } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/")({
  loader: async () => {
    try {
      const products = await listProducts();
      return { products };
    } catch (error) {
      return { products: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "ChainCore Technologies LLC — Powering the Future of Digital Innovation" },
      {
        name: "description",
        content:
          "ChainCore Technologies LLC delivers blockchain software development, testing and simulation tooling for BNB Chain, Ethereum, Solana and TRON.",
      },
      { property: "og:title", content: "ChainCore Technologies LLC" },
      {
        property: "og:description",
        content:
          "Blockchain software, testing solutions and multi-network development tools. Powering the Future of Digital Innovation.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { products } = Route.useLoaderData();
  return (
    <>
      <Hero />
      <Technology />
      <FeaturedProducts products={products} />
      <Networks />
      <WhyChoose />
      <BusinessInquiries />
    </>
  );
}