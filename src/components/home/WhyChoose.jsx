import { FileCheck2, GaugeCircle, LifeBuoy, ShieldCheck } from "lucide-react";
import SectionIntro from "@/components/site/SectionIntro";

const REASONS = [
{
  icon: FileCheck2,
  title: "Engineered, not assembled",
  body: "Each module is reviewed against a written specification, so licensing terms and delivered functionality stay aligned."
},
{
  icon: ShieldCheck,
  title: "Validation before production",
  body: "Simulation functionality carries a 180-day validation period, giving your team a documented window to verify behaviour."
},
{
  icon: GaugeCircle,
  title: "No usage throttling",
  body: "Within the agreed licence scope there are no usage limitations during the licence period — no metered surprises."
},
{
  icon: LifeBuoy,
  title: "Direct engineering support",
  body: "Licence holders reach the engineers who built the tooling, not a scripted support queue."
}];


export default function WhyChoose() {
  return (
    <section className="relative border-b border-border/60 py-20 lg:py-28 hidden">
      <div className="absolute inset-0 mesh-grid opacity-40 hidden" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionIntro
            label="Why Choose ChainCore"
            title="Technology decisions should survive scrutiny."
            description="We build for teams that need to explain exactly how a system behaves — to auditors, to partners, and to themselves." />
          

          <div className="grid gap-4 sm:grid-cols-2">
            {REASONS.map((reason, index) =>
            <div
              key={reason.title}
              className="group rounded-xl border border-border/70 bg-card/40 p-6 transition-colors duration-500 hover:border-primary/40">
              
                <div className="flex items-center justify-between">
                  <reason.icon className="h-5 w-5 text-primary" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-base font-semibold text-foreground">
                  {reason.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                  {reason.body}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}