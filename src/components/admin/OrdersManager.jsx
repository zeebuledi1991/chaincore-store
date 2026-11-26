import { useEffect, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { listAll, saveRecord } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const STATUSES = ["pending", "awaiting_payment", "paying", "paid", "failed", "expired", "cancelled"];
const EMAIL_STATUSES = ["not_sent", "sent", "failed"];
const label = (value) => String(value || "").replace(/_/g, " ");
const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number(value) || 0
  );

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setOrders(await listAll("Order", "-created_date", 200));
    } catch (error) {
      toast.error("Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const quickStatus = async (order, status) => {
    setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, status } : item)));
    try {
      await saveRecord("Order", order.id, { status });
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Could not update that order.");
      load();
    }
  };

  const openEditor = (order) => {
    setEditing(order);
    setForm({
      status: order.status || "pending",
      email_status: order.email_status || "not_sent",
      license_key: order.license_key || "",
      license_valid_until: order.license_valid_until || "",
      notes: order.notes || "",
    });
  };

  const saveEditor = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveRecord("Order", editing.id, {
        status: form.status,
        email_status: form.email_status,
        license_key: form.license_key.trim(),
        license_valid_until: form.license_valid_until.trim(),
        notes: form.notes,
      });
      toast.success("Order saved");
      setEditing(null);
      load();
    } catch (error) {
      toast.error("Could not save that order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">Orders</p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Every order and its columns</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Status, licence key, validity, delivery state and internal notes are all editable. Payment
        status is still verified with OxaPay before a licence is issued.
      </p>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading orders…
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card/40">
          <table className="w-full min-w-[940px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Placed</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Edit</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-primary">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{order.customer_name || "—"}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {order.customer_email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{order.product_name}</td>
                  <td className="px-4 py-3">{money(order.amount)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {order.created_date
                      ? new Date(order.created_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Select value={order.status} onValueChange={(value) => quickStatus(order, value)}>
                      <SelectTrigger className="h-8 w-[168px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status} className="text-xs">
                            {label(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditor(order)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(next) => !next && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order {editing?.order_number}</DialogTitle>
            <DialogDescription>{editing?.customer_email}</DialogDescription>
          </DialogHeader>

          {form && (
            <form onSubmit={saveEditor} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {label(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Receipt email</Label>
                  <Select
                    value={form.email_status}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, email_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EMAIL_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {label(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="o-key">Licence key</Label>
                <Input
                  id="o-key"
                  value={form.license_key}
                  onChange={(e) => setForm((prev) => ({ ...prev, license_key: e.target.value }))}
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <Label htmlFor="o-valid">Valid until</Label>
                <Input
                  id="o-valid"
                  value={form.license_valid_until}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, license_valid_until: e.target.value }))
                  }
                  placeholder="2027-11-26T00:00:00.000Z"
                />
              </div>

              <div>
                <Label htmlFor="o-notes">Internal notes</Label>
                <Textarea
                  id="o-notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save order
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}