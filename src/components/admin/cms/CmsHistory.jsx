import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { History, RotateCcw } from "lucide-react";
import { restoreContentRevision } from "@/lib/content-fns";

const ACTION_COLORS = {
  publish: "border-primary/40 text-primary",
  restore: "border-secondary/40 text-secondary",
  reset: "border-border/70 text-muted-foreground",
};

export default function CmsHistory({ revisions }) {
  const restore = useServerFn(restoreContentRevision);
  const router = useRouter();

  async function handleRestore(id) {
    await restore({ data: { id } });
    router.invalidate();
  }

  if (!revisions.length) {
    return (
      <p className="rounded-xl border border-border/70 bg-card/40 p-6 text-sm text-muted-foreground">
        No published changes yet. Every publish is recorded here so you can restore an earlier
        version.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {revisions.map((revision) => (
        <div
          key={revision.id}
          className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/40 p-3.5"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-medium text-foreground">{revision.label}</span>
              <span
                className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                  ACTION_COLORS[revision.action] || ACTION_COLORS.publish
                }`}
              >
                {revision.action}
              </span>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
              <span className="text-foreground/70">{revision.previousValue || "—"}</span>
              {" → "}
              <span className="text-foreground/90">{revision.publishedValue || "—"}</span>
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {new Date(revision.createdAt).toLocaleString("en-US", {
                timeZone: "America/New_York",
                dateStyle: "medium",
                timeStyle: "short",
              })}
              {revision.changedBy ? ` · ${revision.changedBy}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleRestore(revision.id)}
            className="inline-flex items-center gap-1.5 rounded border border-border/70 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <RotateCcw className="h-3 w-3" />
            Restore
          </button>
        </div>
      ))}
      <p className="flex items-center gap-2 pt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <History className="h-3 w-3" />
        Showing the 40 most recent changes
      </p>
    </div>
  );
}