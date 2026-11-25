import { cn } from "@/lib/utils";

export default function PageHeader({ label, title, description, children, className }) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border/60", className)}>
      <div className="absolute inset-0 mesh-grid opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 radial-fade" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-primary/60" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
            {label}
          </span>
        </div>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-[3.4rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}