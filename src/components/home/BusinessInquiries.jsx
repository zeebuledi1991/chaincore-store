import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/catalog";

export default function BusinessInquiries() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/50 p-8 sm:p-12 lg:p-16">
          <div className="absolute inset-0 mesh-grid opacity-50" aria-hidden="true" />
          <div
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-primary/60" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                  Business Inquiries
                </span>
              </div>
              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.1] text-foreground sm:text-4xl">
                Custom volumes, enterprise licensing and integration partnerships.
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                Tell us your simulation quantity, target network and delivery requirements. Our
                engineering team will respond with a scoped proposal.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/custom-order"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-shadow duration-300 hover:shadow-[0_0_40px_-12px_hsl(184_100%_50%/0.9)]"
                >
                  Submit Custom Request
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2.5 rounded-md border border-border px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-background/60 p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                Direct line
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-3 flex items-center gap-3 font-heading text-lg text-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 text-primary" />
                {SUPPORT_EMAIL}
              </a>
              <dl className="mt-6 space-y-3 border-t border-border/60 pt-5">
                <div className="flex items-center justify-between">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Response
                  </dt>
                  <dd className="font-mono text-[11px] text-foreground/85">&lt; 1 business day</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Payments
                  </dt>
                  <dd className="font-mono text-[11px] text-foreground/85">Crypto · OxaPay</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Entity
                  </dt>
                  <dd className="font-mono text-[11px] text-foreground/85">LLC · Global</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}