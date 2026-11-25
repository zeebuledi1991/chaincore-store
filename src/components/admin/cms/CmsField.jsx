import { useState } from "react";
import { Eye, EyeOff, Loader2, RotateCcw, Upload } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

export default function CmsField({ field, value, onChange, onReset, onToggleHidden }) {
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const baseline = field.hasDraft ? field.draft : field.published;
  const changed = value !== baseline;

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadPublicFile({ file });
      if (result?.file_url) onChange(result.file_url);
    } finally {
      setUploading(false);
    }
  }

  function handleReset() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    setConfirming(false);
    onReset();
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-3.5 transition-colors",
        changed ? "border-primary/40 bg-primary/5" : "border-border/60 bg-background/40"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <Label className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {field.label}
          </Label>
          {field.hasDraft && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
              Live: <span className="text-foreground/80">{field.published || "—"}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            {field.type}
          </span>
          <button
            type="button"
            onClick={onToggleHidden}
            title={field.hidden ? "Show on the website" : "Hide from the website"}
            className={cn(
              "inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
              field.hidden
                ? "border-destructive/50 text-destructive"
                : "border-border/70 text-muted-foreground hover:text-foreground"
            )}
          >
            {field.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {field.hidden ? "Hidden" : "Visible"}
          </button>
          {field.isOverride && (
            <button
              type="button"
              onClick={handleReset}
              className={cn(
                "inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                confirming
                  ? "border-destructive/50 text-destructive"
                  : "border-border/70 text-muted-foreground hover:text-foreground"
              )}
            >
              <RotateCcw className="h-3 w-3" />
              {confirming ? "Confirm" : "Reset"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-2.5">
        {field.type === "image" ? (
          <div className="flex items-start gap-3">
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded border border-border/70 bg-card/60">
              <Image src={value} alt="" fittingType="fill" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="https://…"
                className="bg-background/60 text-[12px]"
              />
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-border/70 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground">
                {uploading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Upload className="h-3 w-3" />
                )}
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        ) : field.multiline ? (
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={3}
            className="bg-background/60 text-[13px]"
          />
        ) : (
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="bg-background/60 text-[13px]"
          />
        )}
      </div>

      {field.hidden && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-destructive">
          Hidden on the live website
        </p>
      )}
    </div>
  );
}