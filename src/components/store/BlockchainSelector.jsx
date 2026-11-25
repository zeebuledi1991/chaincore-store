import { BLOCKCHAINS } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export default function BlockchainSelector({ value, onChange, label = "Testing environment" }) {
  return (
    <div>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-label={label}
        className="mt-2.5 grid grid-cols-2 gap-2.5"
      >
        {BLOCKCHAINS.map((chain) => {
          const active = value === chain.id;
          return (
            <button
              key={chain.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(chain.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-primary/60 bg-primary/10"
                  : "border-border/70 bg-background/40 hover:border-border"
              )}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: chain.color }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block truncate font-heading text-[13px] text-foreground">
                  {chain.name}
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  {chain.ticker}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}