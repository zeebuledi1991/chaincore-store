import { Link } from "@tanstack/react-router";

export default function Brand({ compact = false }) {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/5 transition-colors duration-300 group-hover:border-primary/60">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2.6 20.6 7.3v9.4L12 21.4 3.4 16.7V7.3L12 2.6Z"
            stroke="hsl(184 100% 50%)"
            strokeWidth="1.1"
          />
          <path
            d="M12 7.4 16.6 10v4.2L12 16.6 7.4 14.2V10L12 7.4Z"
            stroke="hsl(184 100% 50% / 0.55)"
            strokeWidth="1"
          />
          <circle cx="12" cy="12" r="1.5" fill="hsl(184 100% 50%)" />
        </svg>
        <span className="pointer-events-none absolute inset-0 rounded-lg bg-primary/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[15px] font-semibold tracking-[0.28em] text-foreground">
          CHAINCORE
        </span>
        {!compact && (
          <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            Technologies LLC
          </span>
        )}
      </span>
    </Link>
  );
}