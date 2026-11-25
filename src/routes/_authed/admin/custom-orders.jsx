import { createFileRoute } from "@tanstack/react-router";
import { base44 } from "@/api/base44Client";
import useEntityList from "@/hooks/useEntityList";
import StatusPill from "@/components/admin/StatusPill";

export const Route = createFileRoute("/_authed/admin/custom-orders")({
  component: AdminCustomOrders,
});

const STATUSES = ["new", "reviewing", "quoted", "closed"];

function AdminCustomOrders() {
  const { items, loading, refresh } = useEntityList("CustomOrder");

  async function setStatus(request, status) {
    await base44.entities.CustomOrder.update(request.id, { status });
    await refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Custom order requests</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Inquiries submitted through the custom order engine, including requested volumes and
        environments.
      </p>

      <div className="mt-6 grid gap-3">
        {items.map((request) => (
          <div key={request.id} className="rounded-xl border border-border/70 bg-card/40 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[11px] text-primary">
                    {request.request_number}
                  </span>
                  <StatusPill value={request.status} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {String(request.created_date).slice(0, 10)}
                  </span>
                </div>
                <h2 className="mt-2 font-heading text-base text-foreground">{request.name}</h2>
                <a
                  href={`mailto:${request.email}`}
                  className="text-[12px] text-muted-foreground hover:text-primary"
                >
                  {request.email}
                </a>
              </div>
              <select
                value={request.status}
                onChange={(event) => setStatus(request, event.target.value)}
                className="rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Quantity
                </p>
                <p className="mt-1 font-mono text-[13px] text-foreground">
                  {request.quantity}
                  {request.unit}
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Units
                </p>
                <p className="mt-1 font-mono text-[13px] text-foreground">
                  {Number(request.requested_units || 0).toLocaleString("en-US")}
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Environment
                </p>
                <p className="mt-1 font-mono text-[13px] uppercase text-foreground">
                  {request.blockchain}
                </p>
              </div>
            </div>

            {request.requirements && (
              <p className="mt-4 rounded-md border border-border/60 bg-background/40 p-3 text-[12px] leading-relaxed text-muted-foreground">
                {request.requirements}
              </p>
            )}
          </div>
        ))}
        {!loading && !items.length && (
          <p className="rounded-xl border border-border/70 bg-card/40 p-8 text-center text-sm text-muted-foreground">
            No custom requests yet.
          </p>
        )}
      </div>
    </div>
  );
}