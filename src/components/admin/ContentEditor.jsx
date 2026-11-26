import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { CONTENT_FIELDS } from "@/lib/content-defaults";
import { listContentRecords, saveContent } from "@/lib/admin-api";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ContentField from "@/components/admin/ContentField";

const GROUPS = (() => {
  const map = new Map();
  CONTENT_FIELDS.forEach((field) => {
    if (!map.has(field.group)) map.set(field.group, []);
    map.get(field.group).push(field);
  });
  return [...map.entries()].map(([name, fields]) => ({ name, fields }));
})();

export default function ContentEditor() {
  const { user } = useAuth();
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(GROUPS[0]?.name || "");
  const [query, setQuery] = useState("");
  const [savingKey, setSavingKey] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listContentRecords();
      setRecords(Object.fromEntries(list.map((record) => [record.key, record])));
    } catch (error) {
      toast.error("Could not load the website content.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (field, value, hidden) => {
    setSavingKey(field.key);
    try {
      const saved = await saveContent(field.key, value, user?.email, hidden);
      setRecords((prev) => ({ ...prev, [field.key]: saved }));
      toast.success(`${field.label} saved`);
    } catch (error) {
      toast.error("Could not save that field. Please try again.");
    } finally {
      setSavingKey(null);
    }
  };

  const editedCount = (fields) =>
    fields.filter((field) => records[field.key]?.value !== undefined && records[field.key]?.value !== null)
      .length;

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return null;
    return CONTENT_FIELDS.filter((field) =>
      `${field.label} ${field.key} ${field.group}`.toLowerCase().includes(needle)
    );
  }, [query]);

  const active = GROUPS.find((entry) => entry.name === group) || GROUPS[0];
  const visible = results || active?.fields || [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            Website content
          </p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Every word on the site</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Edit any headline, paragraph, label, button, link destination or image. Changes go live
            on the storefront immediately, and Reset restores the original copy.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Reload
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search every field — e.g. hero, refund, footer, SEO"
          className="border-0 bg-transparent px-0 focus-visible:ring-0"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {GROUPS.map((entry) => {
              const isActive = !results && entry.name === active?.name;
              const count = editedCount(entry.fields);
              return (
                <button
                  key={entry.name}
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setGroup(entry.name);
                  }}
                  className={`flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors lg:w-full ${
                    isActive
                      ? "border border-primary/30 bg-primary/10 text-primary"
                      : "border border-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <span className="whitespace-nowrap lg:whitespace-normal">{entry.name}</span>
                  <span className="font-mono text-[10px] opacity-70">
                    {count}/{entry.fields.length}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-3">
          {loading && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card/40 p-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading content…
            </div>
          )}

          {!loading && results && (
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {results.length} matching fields
            </p>
          )}

          {!loading &&
            visible.map((field) => (
              <ContentField
                key={field.key}
                field={field}
                record={records[field.key]}
                saving={savingKey === field.key}
                onSave={(value, hidden) => handleSave(field, value, hidden)}
              />
            ))}

          {!loading && results && results.length === 0 && (
            <p className="rounded-xl border border-border bg-card/40 p-6 text-sm text-muted-foreground">
              No field matches “{query}”.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}