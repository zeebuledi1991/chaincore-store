import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveRecord } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image } from "@/components/ui/image";

const EMPTY = {
  name: "",
  slug: "",
  kind: "simulation",
  price: 0,
  price_label: "",
  tag: "",
  summary: "",
  features: "",
  simulated_units: 0,
  image_url: "",
  requires_blockchain: true,
  active: true,
  sort_order: 0,
};

function toForm(product) {
  if (!product) return { ...EMPTY };
  return {
    ...EMPTY,
    ...product,
    features: Array.isArray(product.features) ? product.features.join("\n") : "",
  };
}

export default function ProductForm({ open, product, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(toForm(product));
  }, [open, product]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("A product needs a name and a slug.");
      return;
    }
    setSaving(true);
    try {
      await saveRecord("Product", product?.id, {
        name: form.name.trim(),
        slug: form.slug.trim(),
        kind: form.kind,
        price: Number(form.price) || 0,
        price_label: form.price_label.trim(),
        tag: form.tag.trim(),
        summary: form.summary.trim(),
        features: String(form.features || "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        simulated_units: Number(form.simulated_units) || 0,
        image_url: form.image_url.trim(),
        requires_blockchain: !!form.requires_blockchain,
        active: !!form.active,
        sort_order: Number(form.sort_order) || 0,
      });
      toast.success(product ? "Product updated" : "Product created");
      onSaved();
    } catch (error) {
      toast.error("Could not save that product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "New product"}</DialogTitle>
          <DialogDescription>
            These values feed the product cards, product page and checkout.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="p-name">Name</Label>
              <Input id="p-name" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="p-slug">Slug</Label>
              <Input id="p-slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            </div>
            <div>
              <Label>Kind</Label>
              <Select value={form.kind} onValueChange={(value) => set("kind", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="license">Licence</SelectItem>
                  <SelectItem value="simulation">Simulation package</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="p-tag">Card tag</Label>
              <Input id="p-tag" value={form.tag} onChange={(e) => set("tag", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="p-price">Price (USD)</Label>
              <Input
                id="p-price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="p-price-label">Price label</Label>
              <Input
                id="p-price-label"
                value={form.price_label}
                onChange={(e) => set("price_label", e.target.value)}
                placeholder="$10,000"
              />
            </div>
            <div>
              <Label htmlFor="p-units">Simulated units</Label>
              <Input
                id="p-units"
                type="number"
                min="0"
                value={form.simulated_units}
                onChange={(e) => set("simulated_units", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="p-sort">Sort order</Label>
              <Input
                id="p-sort"
                type="number"
                value={form.sort_order}
                onChange={(e) => set("sort_order", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="p-summary">Summary</Label>
            <Textarea
              id="p-summary"
              rows={3}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="p-features">Features (one per line)</Label>
            <Textarea
              id="p-features"
              rows={6}
              value={form.features}
              onChange={(e) => set("features", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="p-image">Image URL</Label>
            <Input
              id="p-image"
              value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)}
            />
            {form.image_url && (
              <div className="mt-2 h-28 overflow-hidden rounded-lg border border-border bg-background">
                <Image
                  src={form.image_url}
                  alt="Product preview"
                  fittingType="fit"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch
                checked={!!form.requires_blockchain}
                onCheckedChange={(checked) => set("requires_blockchain", checked)}
              />
              Ask for a blockchain at checkout
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch checked={!!form.active} onCheckedChange={(checked) => set("active", checked)} />
              Visible on the storefront
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {product ? "Save changes" : "Create product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}