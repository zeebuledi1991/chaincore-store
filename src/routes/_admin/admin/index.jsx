import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Loader2, Mail, Package, ShoppingBag } from "lucide-react";
import { listAll } from "@/lib/admin-api";

export const Route = createFileRoute("/_admin/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — ChainCore admin" }] }),
  component: AdminOverview,
});

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function Stat({ label, value, icon: Icon, to }) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <Icon className="h-4 w-4 text-primary/70" />
      </div>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
      <span className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground group-hover:text-primary">
        Manage <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

function AdminOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [orders, products, messages, requests] = await Promise.all([
          listAll("Order", "-created_date", 200),
          listAll("Product", "sort_order", 100),
          listAll("ContactMessage", "-created_date", 200),
          listAll("CustomOrder", "-created_date", 200),
        ]);
        if (!active) return;
        setData({ orders, products, messages, requests });
      } catch (error) {
        if (active) setData({ orders: [], products: [], messages: [], requests: [] });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading dashboard…
      </div>
    );
  }

  const paid = data.orders.filter((order) => order.status === "paid");
  const revenue = paid.reduce((total, order) => total + Number(order.amount || 0), 0);
  const newMessages = data.messages.filter((message) => message.status === "new").length;
  const newRequests = data.requests.filter((request) => request.status === "new").length;

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">Overview</p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Store control room</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Edit every word of the website, every product column, and follow each order, message and
        custom request from one place.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Paid revenue" value={money(revenue)} icon={ShoppingBag} to="/admin/orders" />
        <Stat label="Orders" value={data.orders.length} icon={ShoppingBag} to="/admin/orders" />
        <Stat label="Products" value={data.products.length} icon={Package} to="/admin/products" />
        <Stat
          label="New messages"
          value={newMessages}
          icon={Mail}
          to="/admin/messages"
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Stat
          label="New custom requests"
          value={newRequests}
          icon={ClipboardList}
          to="/admin/requests"
        />
        <Link
          to="/admin/content"
          className="group flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-5 transition-colors hover:border-primary/60"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              Website content
            </p>
            <p className="mt-2 text-sm text-foreground">Edit every word and image on the site</p>
          </div>
          <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Latest orders</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card/40">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.slice(0, 6).map((order) => (
              <tr key={order.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-primary">{order.order_number}</td>
                <td className="px-4 py-3 text-muted-foreground">{order.customer_email || "—"}</td>
                <td className="px-4 py-3">{order.product_name}</td>
                <td className="px-4 py-3">{money(order.amount)}</td>
                <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {String(order.status || "").replace(/_/g, " ")}
                </td>
              </tr>
            ))}
            {data.orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}