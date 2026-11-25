import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { base44 } from "@/api/base44Client";
import StatusPill from "@/components/admin/StatusPill";
import { formatUsd } from "@/lib/catalog";

export const Route = createFileRoute("/_authed/admin/")({
  component: AdminOverview,
});

function StatCard({ label, value, hint, accent }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/40 p-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-heading text-2xl ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
      {hint && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [statusRows, paidRows, newInquiries, newRequests, failedEmails, orders] =
        await Promise.all([
          base44.entities.Order.aggregate({ groupBy: "status" }),
          base44.entities.Order.aggregate({ query: { status: "paid" }, sum: ["amount"] }),
          base44.entities.ContactMessage.count({ status: "new" }),
          base44.entities.CustomOrder.count({ status: "new" }),
          base44.entities.Order.count({ email_status: "failed" }),
          base44.entities.Order.list({ sort: "-created_date", limit: 6 }),
        ]);
      if (!active) return;
      const byStatus = Object.fromEntries((statusRows?.rows || []).map((row) => [row.status, row.count]));
      const total = (statusRows?.rows || []).reduce((sum, row) => sum + row.count, 0);
      setStats({
        total,
        paid: byStatus.paid || 0,
        pending:
          (byStatus.awaiting_payment || 0) + (byStatus.pending || 0) + (byStatus.paying || 0),
        failed: byStatus.failed || 0,
        revenue: paidRows?.rows?.[0]?.sum_amount || 0,
        inquiries: newInquiries,
        requests: newRequests,
        failedEmails,
      });
      setRecent(orders?.items || []);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Live view of orders, payments and inbound requests.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={stats ? stats.total : "—"} />
        <StatCard label="Confirmed payments" value={stats ? stats.paid : "—"} accent />
        <StatCard label="Pending payments" value={stats ? stats.pending : "—"} />
        <StatCard
          label="Confirmed revenue"
          value={stats ? formatUsd(stats.revenue) : "—"}
          accent
        />
        <StatCard label="New inquiries" value={stats ? stats.inquiries : "—"} />
        <StatCard label="Custom requests" value={stats ? stats.requests : "—"} />
        <StatCard
          label="Email delivery issues"
          value={stats ? stats.failedEmails : "—"}
          hint="Receipts that failed to send"
        />
        <StatCard label="Failed orders" value={stats ? stats.failed : "—"} />
      </div>

      <div className="mt-8 rounded-xl border border-border/70 bg-card/40">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2 className="font-heading text-base font-semibold text-foreground">Recent orders</h2>
          <Link
            to="/admin/orders"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-border/60">
                {["Order", "Product", "Amount", "Status", "Email"].map((head) => (
                  <th
                    key={head}
                    className="px-5 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => (
                <tr key={order.id} className="border-b border-border/40 last:border-0">
                  <td className="px-5 py-3 font-mono text-[11px] text-foreground/85">
                    {order.order_number}
                  </td>
                  <td className="px-5 py-3 text-[13px] text-foreground/85">{order.product_name}</td>
                  <td className="px-5 py-3 font-mono text-[12px] text-foreground">
                    {formatUsd(order.amount)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill value={order.status} />
                  </td>
                  <td className="px-5 py-3 text-[12px] text-muted-foreground">
                    {order.email_status || "not_sent"}
                  </td>
                </tr>
              ))}
              {!recent.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}