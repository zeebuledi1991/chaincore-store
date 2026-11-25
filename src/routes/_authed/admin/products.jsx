import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { base44 } from "@/api/base44Client";
import useEntityList from "@/hooks/useEntityList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatUsd } from "@/lib/catalog";

export const Route = createFileRoute("/_authed/admin/products")({
  component: AdminProducts,
});

const EMPTY = {
  name: "",
  price: 0,
  price_label: "",
  tag: "",
  summary: "",
  features: "",
  image_url: "",
  active: true,
};

function AdminProducts() {
  const { items, loading, refresh } = useEntityList("Product", {}, { sort: "sort_order", limit: 50 });
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openEditor(product) {
    setError("");
    setDraft({
      id: product.id,
      name: product.name || "",
      price: product.price || 0,
      price_label: product.price_label || "",
      tag: product.tag || "",
      summary: product.summary || "",
      features: (product.features || []).join("\n"),
      image_url: product.image_url || "",
      active: product.active !== false,
    });
  }

  async function save() {
    if (!draft) return;
    if (draft.name.trim().length < 3) return setError("Enter a product name.");
    setSaving(true);
    setError("");
    try {
      await base44.entities.Product.update(draft.id, {
        name: draft.name.trim(),
        price: Number(draft.price) || 0,
        price_label: draft.price_label.trim() || formatUsd(Number(draft.price) || 0),
        tag: draft.tag.trim(),
        summary: draft.summary.trim(),
        features: draft.features
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        image_url: draft.image_url.trim(),
        active: draft.active,
      });
      setDraft(null);
      await refresh();
    } catch (err) {
      setError("Could not save this product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Product management</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Prices and descriptions here are the live storefront values used at checkout.
      </p>

      <div className="mt-6 grid gap-3">
        {items.map((product) => (
          <div
            key={product.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/70 bg-card/40 p-5"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-base text-foreground">{product.name}</h2>
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  {product.kind}
                </span>
                {product.active === false && (
                  <span className="rounded-full border border-red-400/40 bg-red-400/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-red-300">
                    hidden
                  </span>
                )}
              </div>
              <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
                {product.summary}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-primary">
                {product.price_label || formatUsd(product.price)}
              </span>
              <button
                type="button"
                onClick={() => openEditor(product)}
                className="rounded-md border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground hover:border-primary/50 hover:text-primary"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
        {!loading && !items.length && (
          <p className="rounded-xl border border-border/70 bg-card/40 p-8 text-center text-sm text-muted-foreground">
            No products found.
          </p>
        )}
      </div>

      <Dialog open={!!draft} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-foreground">
              Edit product
            </DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                    Name
                  </Label>
                  <Input
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                    className="bg-background/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                    Badge
                  </Label>
                  <Input
                    value={draft.tag}
                    onChange={(event) => setDraft({ ...draft, tag: event.target.value })}
                    className="bg-background/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                    Price (USD)
                  </Label>
                  <Input
                    type="number"
                    value={draft.price}
                    onChange={(event) =>
                      setDraft({ ...draft, price: event.target.value, price_label: "" })
                    }
                    className="bg-background/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                    Display price
                  </Label>
                  <Input
                    value={draft.price_label}
                    placeholder={formatUsd(Number(draft.price) || 0)}
                    onChange={(event) => setDraft({ ...draft, price_label: event.target.value })}
                    className="bg-background/60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Summary
                </Label>
                <Textarea
                  rows={3}
                  value={draft.summary}
                  onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
                  className="bg-background/60"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Features (one per line)
                </Label>
                <Textarea
                  rows={7}
                  value={draft.features}
                  onChange={(event) => setDraft({ ...draft, features: event.target.value })}
                  className="bg-background/60 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Image URL
                </Label>
                <Input
                  value={draft.image_url}
                  onChange={(event) => setDraft({ ...draft, image_url: event.target.value })}
                  className="bg-background/60 font-mono text-xs"
                />
              </div>

              <label className="flex items-center gap-3 rounded-md border border-border/70 bg-background/40 px-4 py-3">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(event) => setDraft({ ...draft, active: event.target.checked })}
                  className="h-4 w-4 accent-[hsl(184_100%_50%)]"
                />
                <span className="text-[13px] text-foreground/85">Visible in the store</span>
              </label>

              {error && (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-[12px] text-foreground/90">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  className="rounded-md border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="rounded-md bg-primary px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-60"
                >
                  {saving ? "Saving" : "Save product"}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}