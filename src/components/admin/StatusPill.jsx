import { cn } from "@/lib/utils";

const TONES = {
  paid: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  sent: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  active: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  replied: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  awaiting_payment: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  pending: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  paying: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  new: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  reviewing: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  read: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  quoted: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  failed: "border-red-400/40 bg-red-400/10 text-red-300",
  revoked: "border-red-400/40 bg-red-400/10 text-red-300",
  expired: "border-white/20 bg-white/5 text-muted-foreground",
  cancelled: "border-white/20 bg-white/5 text-muted-foreground",
  closed: "border-white/20 bg-white/5 text-muted-foreground",
  not_sent: "border-white/20 bg-white/5 text-muted-foreground",
};

export default function StatusPill({ value, className }) {
  const tone = TONES[value] || "border-border bg-background/60 text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em]",
        tone,
        className
      )}
    >
      {String(value || "unknown").replace(/_/g, " ")}
    </span>
  );
}