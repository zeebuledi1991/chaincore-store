import { useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveSiteContent } from "@/lib/content-fns";

export default function ContentEditor({ fields }) {
  const save = useServerFn(saveSiteContent);
  const router = useRouter();
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.key, field.value]))
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const changedCount = fields.filter((field) => values[field.key] !== field.value).length;

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = fields.filter(
      (field) =>
        !term ||
        field.label.toLowerCase().includes(term) ||
        field.group.toLowerCase().includes(term) ||
        String(values[field.key] || "")
          .toLowerCase()
          .includes(term)
    );
    const grouped = new Map();
    for (const field of matches) {
      if (!grouped.has(field.group)) grouped.set(field.group, []);
      grouped.get(field.group).push(field);
    }
    return [...grouped.entries()];
  }, [fields, query, values]);

  async function handleSave() {
    const entries = fields
      .filter((field) => values[field.key] !== field.value)
      .map((field) => ({ key: field.key, value: values[field.key] ?? "" }));
    if (!entries.length) {
      setStatus("Nothing changed yet.");
      return;
    }
    setSaving(true);
    setStatus("");
    try {
      await save({ data: { entries } });
      setStatus(`Saved ${entries.length} change${entries.length === 1 ? "" : "s"}.`);
      router.invalidate();
    } catch (error) {
      setStatus("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="sticky top-0 z-10 flex flex-col gap-3 rounded-xl border border-border/70 bg-card/80 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search text to edit…"
          className="bg-background/60 sm:max-w-xs"
        />
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {status || `${changedCount} unsaved`}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save changes
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {groups.map(([group, groupFields]) => (
          <section key={group} className="rounded-xl border border-border/70 bg-card/40 p-5">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              {group}
            </h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {groupFields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label
                    htmlFor={`content-${field.key}`}
                    className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {field.label}
                  </Label>
                  {field.multiline ? (
                    <Textarea
                      id={`content-${field.key}`}
                      value={values[field.key] ?? ""}
                      onChange={(event) =>
                        setValues((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      rows={3}
                      className="bg-background/60 text-[13px]"
                    />
                  ) : (
                    <Input
                      id={`content-${field.key}`}
                      value={values[field.key] ?? ""}
                      onChange={(event) =>
                        setValues((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      className="bg-background/60 text-[13px]"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
        {!groups.length && (
          <p className="rounded-xl border border-border/70 bg-card/40 p-6 text-sm text-muted-foreground">
            No text matches that search.
          </p>
        )}
      </div>
    </div>
  );
}