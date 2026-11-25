import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { BLOCKCHAINS, IMAGES } from "@/lib/catalog";

const TICKER = [
  "BNB Chain",
  "Ethereum",
  "Solana",
  "TRON",
  "Blockchain Testing",
  "Simulation Tooling",
  "Multi-Network Validation",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 mesh-grid opacity-70" aria-hidden="true" />
      <div className="absolute inset-0 radial-fade" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-24">
        <div className="animate-rise">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/80">
              ChainCore Technologies LLC
            </span>
          </div>

          <h1 className="mt-7 text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-[4.1rem]">
            Powering the Future of{" "}
            <span className="text-glow bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Digital Innovation
            </span>
            .
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Discover innovative blockchain software, testing solutions, and multi-network
            development tools — engineered for teams that need verifiable behaviour before a
            single transaction reaches mainnet.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-7 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_50px_-10px_hsl(184_100%_50%/0.8)]"
            >
              Explore Products
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2.5 rounded-md border border-border bg-card/40 px-7 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors duration-300 hover:border-primary/50 hover:text-primary"
            >
              Contact Us
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-7">
            {[
              { value: "04", label: "Networks" },
              { value: "180", label: "Day validation" },
              { value: "12", label: "Month license" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono text-2xl text-foreground">{stat.value}</dt>
                <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative animate-rise" style={{ animationDelay: "160ms" }}>
          <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card">
            <Image
              src={IMAGES.hero}
              alt="Abstract silver blockchain ledger filaments lit in cyan"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/4.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-scan bg-gradient-to-b from-transparent via-primary/10 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/10 bg-background/80 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                  Simulation Engine
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Live
                </span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {BLOCKCHAINS.map((chain) => (
                  <div
                    key={chain.id}
                    className="rounded border border-white/10 px-2 py-2 text-center"
                  >
                    <div className="font-mono text-[10px] text-foreground">{chain.ticker}</div>
                    <div
                      className="mx-auto mt-1.5 h-0.5 w-6 rounded-full"
                      style={{ backgroundColor: chain.color }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-primary/10 blur-3xl" />
        </div>
      </div>

      <div className="relative flex overflow-hidden border-t border-border/60 bg-card/30 py-3.5">
        <div className="flex w-max animate-ticker items-center gap-10 pr-10">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center gap-10 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
            >
              {item}
              <ArrowUpRight className="h-3 w-3 text-primary/50" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}