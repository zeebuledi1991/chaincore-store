import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { listAll, removeRecord, saveRecord } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Image } from "@/components/ui/image";
import ProductForm from "@/components/admin/ProductForm";

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number(value) || 0
  );

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setProducts(await listAll("Product", "sort_order", 100));
    } catch (error) {
      toast.error("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (product, active) => {
    setProducts((prev) => prev.map((item) => (item.id === product.id ? { ...item, active } : item)));
    try {
      await saveRecord("Product", product.id, { active });
    } catch (error) {
      toast.error("Could not update that product.");
      load();
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    try {
      await removeRecord("Product", product.id);
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      toast.success("Product deleted");
    } catch (error) {
      toast.error("Could not delete that product.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">Products</p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Store catalogue</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every column the storefront reads — name, slug, price, tag, summary, features, image,
            units and ordering — is editable here.
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> New product
        </Button>
      </div>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading products…
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card/40">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Kind</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Live</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-14 shrink-0 overflow-hidden rounded-md border border-border/70 bg-background">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fittingType="fit"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{product.name}</p>
                        <p className="truncate font-mono text-[10px] text-muted-foreground">
                          /{product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {product.kind}
                  </td>
                  <td className="px-4 py-3">{money(product.price)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.simulated_units ? Number(product.simulated_units).toLocaleString("en-US") : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{product.sort_order ?? 0}</td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={product.active !== false}
                      onCheckedChange={(checked) => toggleActive(product, checked)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditing(product);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => remove(product)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No products yet. Create the first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ProductForm
        open={open}
        product={editing}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false);
          load();
        }}
      />
    </div>
  );
}