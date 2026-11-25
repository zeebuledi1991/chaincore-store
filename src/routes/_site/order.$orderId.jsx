import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, Clock, Copy, Loader2, Mail, RefreshCw } from "lucide-react";
import { getOrderStatus } from "@/lib/server-fns";
import { useContent } from "@/components/content/ContentProvider";
import { SUPPORT_EMAIL } from "@/lib/catalog";

export const Route = createFileRoute("/_site/order/$orderId")({
  head: () => ({
    meta: [
      { title: "Order status — ChainCore Technologies LLC" },
      { name: "description", content: "Track the payment status of your ChainCore order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderStatusPage,
});

const FINAL = ["paid", "failed", "expired", "cancelled"];

function OrderStatusPage() {
  const t = useContent();
  const { orderId } = Route.useParams();
  const fetchStatus = useServerFn(getOrderStatus);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result = await fetchStatus({ data: { orderId } });
        if (!active) return;
        setOrder(result);
        setLoading(false);
        if (result?.found && !FINAL.includes(result.status)) {
          timer.current = setTimeout(load, 9000);
        }
      } catch (error) {
        if (!active) return;
        setOrder({ found: false });
        setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [orderId, fetchStatus]);

  async function copyKey() {
    if (!order?.licenseKey) return;
    await navigator.clipboard.writeText(order.licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl items-center justify-center px-5">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!order?.found) {
    return (
      <div className="mx-auto w-full max-w-2xl px-5 py-24 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
        <h1 className="mt-5 text-2xl font-semibold text-foreground">{t("order.notFound.title")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("order.notFound.body")} {SUPPORT_EMAIL}.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-md border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground hover:border-primary/50"
        >
          {t("order.back")}
        </Link>
      </div>
    );
  }

  const paid = order.status === "paid";
  const pending = ["pending", "awaiting_payment", "paying"].includes(order.status);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-primary/60" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
            {t("order.label")} {order.orderNumber}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-semibold text-foreground sm:text-4xl">
          {paid
            ? t("order.title.paid")
            : pending
              ? t("order.title.pending")
              : order.status === "expired"
                ? t("order.title.expired")
                : t("order.title.failed")}
        </h1>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-border/70 bg-card/50 p-4">
          {paid ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          ) : pending ? (
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          )}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {paid
              ? `${t("order.body.paidLead")} ${order.email}.`
              : pending
                ? t("order.body.pending")
                : t("order.body.failed")}
          </p>
        </div>

        <dl className="mt-8 divide-y divide-border/60 rounded-xl border border-border/70 bg-card/40">
          {[
            { label: t("order.rows.product"), value: order.productName },
            { label: t("order.rows.amount"), value: `$${Number(order.amount).toLocaleString("en-US")} USD` },
            { label: t("order.rows.environment"), value: order.blockchain || t("order.allNetworks") },
            order.units ? { label: t("order.rows.units"), value: order.units.toLocaleString("en-US") } : null,
            { label: t("order.rows.status"), value: order.status.replace(/_/g, " ") },
          ]
            .filter(Boolean)
            .map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-6 px-5 py-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="text-right text-sm capitalize text-foreground">{row.value}</dd>
              </div>
            ))}
        </dl>

        {paid && order.licenseKey && (
          <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
              {t("order.licenseTitle")}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xl tracking-[0.08em] text-foreground">
                {order.licenseKey}
              </p>
              <button
                type="button"
                onClick={copyKey}
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? t("order.copied") : t("order.copy")}
              </button>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              {t("order.licenseNoteLead")} {String(order.licenseValidUntil).slice(0, 10)}.{" "}
              {t("order.licenseNoteTail")}
            </p>
          </div>
        )}

        {order.emailStatus === "failed" && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-[13px] leading-relaxed text-foreground/85">
              {t("order.emailFailedLead")} {SUPPORT_EMAIL} ({order.orderNumber}){" "}
              {t("order.emailFailedTail")}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/products"
            className="rounded-md border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            {t("order.back")}
          </Link>
          {pending && (
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              {t("order.checking")}
            </span>
          )}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-primary"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}