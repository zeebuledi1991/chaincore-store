import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Compass, Layers, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/catalog";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About Us — ChainCore Technologies LLC" },
      {
        name: "description",
        content:
          "ChainCore Technologies LLC develops blockchain software, digital tools and multi-network testing solutions. Our mission is to make blockchain technology more accessible.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Compass,
    title: "Clarity over jargon",
    body: "Every engagement starts with a written scope. If a behaviour cannot be described precisely, it is not ready to build.",
  },
  {
    icon: ShieldCheck,
    title: "Verification before trust",
    body: "Simulation and testing are treated as first-class deliverables, not an afterthought once the software is live.",
  },
  {
    icon: Layers,
    title: "Multi-network by default",
    body: "Our tooling assumes BNB Chain, Ethereum, Solana and TRON from day one rather than bolting networks on later.",
  },
  {
    icon: Boxes,
    title: "Accessible engineering",
    body: "Complex infrastructure should be usable by teams that are not blockchain specialists.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        label="About Us"
        title="A technology company built around verifiable blockchain engineering."
        description="ChainCore Technologies LLC is a technology-focused company dedicated to developing innovative blockchain software, digital tools, and multi-network testing solutions."
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
              <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                Our mission is to make blockchain technology more accessible through modern software
                development and reliable technology solutions.
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
                Blockchain infrastructure is powerful and unforgiving. A single mispriced call, an
                unchecked token flow or an untested contract path can cost more than the system was
                built to handle. We exist to reduce that risk with software that can be inspected,
                rehearsed and validated before it carries real value.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Our work spans smart contract engineering, simulation tooling and multi-network
                validation across BNB Chain, Ethereum, Solana and TRON. We build for engineering
                teams, product organisations and technology partners who need to explain exactly how
                a system behaves — to auditors, to counterparties, and to themselves.
              </p>
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border/60 pt-8 sm:grid-cols-3">
                {[
                  { value: "04", label: "Networks supported" },
                  { value: "180", label: "Day validation period" },
                  { value: "12", label: "Month licence term" },
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

            <div className="relative overflow-hidden rounded-xl border border-border/70">
              <Image
                src={IMAGES.facility}
                alt="Cold-lit architectural interior representing ChainCore engineering infrastructure"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-lg border border-white/10 bg-background/80 px-4 py-3 backdrop-blur">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                  Engineering standard
                </p>
                <p className="mt-1 font-heading text-sm text-foreground">
                  Specified, simulated, then shipped.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {VALUES.map((value, index) => (
              <div
                key={value.title}
                className="rounded-xl border border-border/70 bg-card/40 p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <value.icon className="h-5 w-5 text-primary" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-base font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                  {value.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-xl border border-border/70 bg-card/40 p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Work with ChainCore</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Review the product store, or send a scoped requirement and let our team respond with
                a proposal.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground"
              >
                Explore products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="rounded-md border border-border px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground hover:border-primary/50 hover:text-primary"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}