import { cn } from "@/lib/utils";

export default function SectionIntro({ label, title, description, className, align = "left" }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-primary/60" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
          {label}
        </span>
      </div>
      <h2 className="max-w-2xl text-3xl font-semibold leading-[1.1] text-foreground sm:text-4xl lg:text-[2.9rem]">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}