import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Send } from "lucide-react";
import useEntityList from "@/hooks/useEntityList";
import StatusPill from "@/components/admin/StatusPill";
import { formatUsd } from "@/lib/catalog";
import { adminResendOrderEmail, adminVerifyOrder } from "@/lib/server-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authed/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const { items, loading, refresh } = useEntityList("Order");
  const verify = useServerFn(adminVerifyOrder);
  const resend = useServerFn(adminResendOrderEmail);
  const [active, setActive] = useState(null);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  async function runVerify(order) {
    setBusy("verify");
    setMessage("");
    try {
      const result = await verify({ data: { orderId: order.id } });
      setMessage(result?.error || `OxaPay status: ${result?.status || "unknown"}`);
      await refresh();
    } catch (error) {
      setMessage("Could not verify this order.");
    } finally {
      setBusy("");
    }
  }

  async function runResend(order) {
    setBusy("resend");
    setMessage("");
    try {
      const result = await resend({ data: { orderId: order.id } });
      setMessage(
        result?.error
          ? result.error
          : `Customer email: ${result.emailStatus} · Admin alert: ${result.adminStatus}`
      );
      await refresh();
    } catch (error) {
      setMessage("Could not re-send the receipt.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Order history</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Payment status is verified server-side with OxaPay, never from a browser redirect.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground hover:border-primary/50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border/70 bg-card/40">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-border/60">
              {["Order", "Date", "Customer", "Product", "Amount", "Status", "Email", ""].map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((order) => (
              <tr key={order.id} className="border-b border-border/40 last:border-0">
                <td className="px-4 py-3 font-mono text-[11px] text-foreground/85">
                  {order.order_number}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                  {String(order.created_date).slice(0, 10)}
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground/85">
                  <div>{order.customer_name}</div>
                  <div className="text-[11px] text-muted-foreground">{order.customer_email}</div>
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground/85">{order.product_name}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-foreground">
                  {formatUsd(order.amount)}
                </td>
                <td className="px-4 py-3">
                  <StatusPill value={order.status} />
                </td>
                <td className="px-4 py-3">
                  <StatusPill value={order.email_status || "not_sent"} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setActive(order);
                      setMessage("");
                    }}
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary hover:underline"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
            {!loading && !items.length && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-lg border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-foreground">
              {active?.order_number}
            </DialogTitle>
          </DialogHeader>
          {active && (
            <div className="space-y-4">
              <dl className="divide-y divide-border/60 rounded-lg border border-border/70">
                {[
                  ["Customer", active.customer_name],
                  ["Email", active.customer_email],
                  ["Product", active.product_name],
                  ["Amount", formatUsd(active.amount)],
                  ["Environment", active.blockchain || "All networks"],
                  ["Simulated units", active.simulated_units || "—"],
                  ["Wallet address", active.wallet_address || "Not provided"],
                  ["OxaPay track id", active.track_id || "Not created"],
                  ["Licence key", active.license_key || "Not issued"],
                  ["Valid until", active.license_valid_until ? String(active.license_valid_until).slice(0, 10) : "—"],
                  ["Paid at", active.paid_at ? String(active.paid_at).slice(0, 19).replace("T", " ") : "—"],
                  ["Notes", active.notes || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 px-4 py-2.5">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="max-w-[60%] break-words text-right text-[12px] text-foreground/90">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>

              {message && (
                <p className="rounded-md border border-border/70 bg-background/60 px-3 py-2 font-mono text-[11px] text-foreground/85">
                  {message}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => runVerify(active)}
                  disabled={busy === "verify"}
                  className="inline-flex items-center gap-2 rounded-md border border-primary/40 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary hover:bg-primary/10 disabled:opacity-60"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${busy === "verify" ? "animate-spin" : ""}`} />
                  Verify with OxaPay
                </button>
                <button
                  type="button"
                  onClick={() => runResend(active)}
                  disabled={busy === "resend"}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground hover:border-primary/50 disabled:opacity-60"
                >
                  <Send className="h-3.5 w-3.5" />
                  Re-send receipt
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}