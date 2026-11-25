import { Boxes, FlaskConical, Network } from "lucide-react";
import SectionIntro from "@/components/site/SectionIntro";

const CAPABILITIES = [
{
  icon: Boxes,
  index: "01",
  title: "Blockchain Software Development",
  body: "Smart contract systems, custody tooling and on-chain integrations built to a written specification and reviewed module by module."
},
{
  icon: FlaskConical,
  index: "02",
  title: "The Provided USDT",
  body: "This usdt will work on any wallet or exchnage.\xA0"
},
{
  icon: Network,
  index: "03",
  title: "Multi-Network Tooling",
  body: "One interface across BNB Chain, Ethereum, Solana and TRON with shared telemetry, unified reporting and a single audit trail."
}];


export default function Technology() {
  return (
    <section className="relative border-b border-border/60 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionIntro
            label="Our Technology"
            title="Infrastructure engineered for verifiable behaviour."
            description="Every ChainCore product is built around one principle: nothing touches production until its behaviour has been proven in a controlled environment." />
          
          <div className="hidden shrink-0 border-l border-border/60 pl-6 lg:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Stack
            </p>
            <p className="mt-2 font-mono text-sm text-foreground/85">
              EVM · SVM · TRON VM
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CAPABILITIES.map((item, index) =>
          <div
            key={item.title}
            className="group relative overflow-hidden rounded-xl border border-border/70 bg-card/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/70"
            style={{ animationDelay: `${index * 90}ms` }}>
            
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-lg border border-primary/25 bg-primary/5 text-primary transition-colors duration-500 group-hover:border-primary/60">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  {item.index}
                </span>
              </div>
              <h3 className="mt-6 font-heading text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          )}
        </div>
      </div>
    </section>);

}