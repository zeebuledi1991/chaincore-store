import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, RotateCcw, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

export default function ContentField({ field, record, saving, onSave }) {
  const published = record?.value ?? field.default;
  const hidden = !!record?.hidden;
  const edited = record?.value !== undefined && record?.value !== null;
  const [value, setValue] = useState(published);

  useEffect(() => {
    setValue(record?.value ?? field.default);
  }, [record?.value, field.default]);

  const dirty = value !== published;
  const isImage = field.type === "image";
  const isMultiline = field.multiline || String(field.default || "").length > 90;

  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{field.label}</p>
          <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground/70">
            {field.key}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {edited && (
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
              Edited
            </span>
          )}
          {hidden && (
            <span className="rounded-full border border-border bg-accent px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              Hidden
            </span>
          )}
        </div>
      </div>

      {isImage && (
        <div className="mt-3 overflow-hidden rounded-lg border border-border/70 bg-background">
          <Image
            src={value}
            alt={field.label}
            fittingType="fit"
            className="h-24 w-full object-contain"
          />
        </div>
      )}

      <div className="mt-3">
        {isMultiline && !isImage ? (
          <Textarea
            value={value}
            rows={3}
            onChange={(event) => setValue(event.target.value)}
            className="bg-background/70 text-sm"
          />
        ) : (
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="bg-background/70 text-sm"
          />
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          onClick={() => onSave(value, hidden)}
          disabled={!dirty || saving}
          className="h-8 gap-1.5"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSave(field.default, false)}
          disabled={saving || (!edited && !hidden)}
          className="h-8 gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSave(value, !hidden)}
          disabled={saving}
          className="h-8 gap-1.5 text-muted-foreground"
        >
          {hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {hidden ? "Show on site" : "Hide from site"}
        </Button>
      </div>
    </div>
  );
}