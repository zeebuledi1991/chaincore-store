import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Eye, Loader2, Save, Undo2, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import CmsField from "./CmsField";
import CmsHistory from "./CmsHistory";
import {
  discardContentDrafts,
  publishContent,
  resetContentField,
  saveContentDraft,
  setContentHidden,
} from "@/lib/content-fns";

const VIEWS = [
  { id: "pages", label: "Pages", test: () => true },
  {
    id: "forms",
    label: "Forms",
    test: (field) =>
      /^(checkout\.|contact\.(form|error|success)|customOrder\.(form|error|success|preview))/.test(
        field.key
      ),
  },
  {
    id: "links",
    label: "Buttons & links",
    test: (field) =>
      field.type === "url" ||
      /\.(ctaPrimary|ctaSecondary|submit|buy|primary|secondary|link|back|copy|openPayment|again|checking)$/.test(
        field.key
      ),
  },
  { id: "media", label: "Images", test: (field) => field.type === "image" },
  {
    id: "nav",
    label: "Navigation & footer",
    test: (field) => field.key.startsWith("site.nav") || field.key.startsWith("site.footer"),
  },
  { id: "seo", label: "SEO", test: (field) => field.key.startsWith("seo.") },
  { id: "history", label: "History", history: true },
];

const baselineOf = (field) => (field.hasDraft ? field.draft : field.published);

export default function CmsEditor({ fields, revisions }) {
  const router = useRouter();
  const saveDraft = useServerFn(saveContentDraft);
  const publish = useServerFn(publishContent);
  const discard = useServerFn(discardContentDrafts);
  const reset = useServerFn(resetContentField);
  const setHidden = useServerFn(setContentHidden);

  const [view, setView] = useState("pages");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState("");
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.key, baselineOf(field)]))
  );

  const signature = fields
    .map((field) => `${field.key}:${field.published}:${field.draft}:${field.hidden}`)
    .join("|");
  const [loadedSignature, setLoadedSignature] = useState(signature);

  useEffect(() => {
    if (signature === loadedSignature) return;
    setValues(Object.fromEntries(fields.map((field) => [field.key, baselineOf(field)])));
    setLoadedSignature(signature);
  }, [signature, loadedSignature, fields]);

  const dirtyFields = useMemo(
    () => fields.filter((field) => values[field.key] !== baselineOf(field)),
    [fields, values]
  );
  const pendingDrafts = fields.filter((field) => field.hasDraft).length;

  const activeView = VIEWS.find((item) => item.id === view) || VIEWS[0];

  const groups = useMemo(() => {
    if (activeView.history) return [];
    const term = query.trim().toLowerCase();
    const grouped = new Map();
    for (const field of fields) {
      if (!activeView.test(field)) continue;
      const value = String(values[field.key] ?? "");
      if (
        term &&
        !field.label.toLowerCase().includes(term) &&
        !field.group.toLowerCase().includes(term) &&
        !value.toLowerCase().includes(term)
      ) {
        continue;
      }
      if (!grouped.has(field.group)) grouped.set(field.group, []);
      grouped.get(field.group).push(field);
    }
    return [...grouped.entries()];
  }, [fields, activeView, query, values]);

  function setValue(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSaveDrafts() {
    if (!dirtyFields.length) {
      setStatus("No unpublished edits to save.");
      return;
    }
    setBusy("save");
    setStatus("");
    try {
      const result = await saveDraft({
        data: { entries: dirtyFields.map((field) => ({ key: field.key, value: values[field.key] ?? "" })) },
      });
      setStatus(`Saved ${result.saved} draft change${result.saved === 1 ? "" : "s"}. Press Publish to go live.`);
      router.invalidate();
    } catch (error) {
      setStatus("Could not save drafts. Please try again.");
    } finally {
      setBusy("");
    }
  }

  async function handlePublish() {
    setBusy("publish");
    setStatus("");
    try {
      if (dirtyFields.length) {
        await saveDraft({
          data: {
            entries: dirtyFields.map((field) => ({ key: field.key, value: values[field.key] ?? "" })),
          },
        });
      }
      const result = await publish();
      setStatus(
        result.published
          ? `Published ${result.published} change${result.published === 1 ? "" : "s"} to the live website.`
          : "Nothing new to publish."
      );
      router.invalidate();
    } catch (error) {
      setStatus("Could not publish. Please try again.");
    } finally {
      setBusy("");
    }
  }

  async function handleDiscard() {
    setBusy("discard");
    try {
      const result = await discard();
      setStatus(`Discarded ${result.discarded} draft change${result.discarded === 1 ? "" : "s"}.`);
      router.invalidate();
    } catch (error) {
      setStatus("Could not discard drafts.");
    } finally {
      setBusy("");
    }
  }

  async function handleReset(field) {
    try {
      await reset({ data: { key: field.key } });
      setStatus(`"${field.label}" reset to its original text.`);
      router.invalidate();
    } catch (error) {
      setStatus("Could not reset that element.");
    }
  }

  async function handleToggleHidden(field) {
    try {
      await setHidden({ data: { key: field.key, hidden: !field.hidden } });
      router.invalidate();
    } catch (error) {
      setStatus("Could not change visibility.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Website CMS</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every element of the live website — {fields.length} items across {new Set(fields.map((field) => field.group)).size} sections —
            with its current published value. Edit, save as draft, preview, then publish.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
          <span className="rounded-full border border-border/70 px-3 py-1.5 text-muted-foreground">
            {pendingDrafts} in draft
          </span>
          <span className="rounded-full border border-primary/30 px-3 py-1.5 text-primary">
            {dirtyFields.length} unsaved
          </span>
        </div>
      </div>

      <div className="sticky top-0 z-10 mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-card/90 p-3 backdrop-blur">
        <button
          type="button"
          onClick={() => window.open("/?preview=draft", "_blank", "noopener")}
          className="inline-flex items-center gap-1.5 rounded-md border border-border/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview draft
        </button>
        <button
          type="button"
          onClick={handleSaveDrafts}
          disabled={Boolean(busy)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60"
        >
          {busy === "save" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save drafts
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={Boolean(busy)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy === "publish" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <UploadCloud className="h-3.5 w-3.5" />
          )}
          Publish changes
        </button>
        <button
          type="button"
          onClick={handleDiscard}
          disabled={Boolean(busy) || !pendingDrafts}
          className="inline-flex items-center gap-1.5 rounded-md border border-border/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Discard drafts
        </button>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
        >
          View live site
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
              view === item.id
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border/70 bg-background/40 text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {status && (
        <p className="mt-4 rounded-md border border-border/70 bg-card/40 px-3 py-2 text-[12px] text-foreground/85">
          {status}
        </p>
      )}

      {activeView.history ? (
        <div className="mt-6">
          <CmsHistory revisions={revisions} />
        </div>
      ) : (
        <>
          <div className="mt-4">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by element, section or current text…"
              className="bg-background/60 sm:max-w-sm"
            />
          </div>

          <div className="mt-6 space-y-6">
            {groups.map(([group, groupFields]) => (
              <section key={group} className="rounded-xl border border-border/70 bg-card/40 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                    {group}
                  </h2>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
                    {groupFields.length}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {groupFields.map((field) => (
                    <CmsField
                      key={field.key}
                      field={field}
                      value={values[field.key] ?? ""}
                      onChange={(value) => setValue(field.key, value)}
                      onReset={() => handleReset(field)}
                      onToggleHidden={() => handleToggleHidden(field)}
                    />
                  ))}
                </div>
              </section>
            ))}
            {!groups.length && (
              <p className="rounded-xl border border-border/70 bg-card/40 p-6 text-sm text-muted-foreground">
                No element matches that search.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}