import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { base44 } from "@/api/base44Client";
import useEntityList from "@/hooks/useEntityList";
import StatusPill from "@/components/admin/StatusPill";

export const Route = createFileRoute("/_authed/admin/inquiries")({
  component: AdminInquiries,
});

const STATUSES = ["new", "read", "replied"];

function AdminInquiries() {
  const { items, loading, refresh } = useEntityList("ContactMessage");

  async function setStatus(message, status) {
    await base44.entities.ContactMessage.update(message.id, { status });
    await refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Customer inquiries</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Messages submitted through the contact form.
      </p>

      <div className="mt-6 grid gap-3">
        {items.map((message) => (
          <div key={message.id} className="rounded-xl border border-border/70 bg-card/40 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusPill value={message.status} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {String(message.created_date).slice(0, 10)}
                  </span>
                </div>
                <h2 className="mt-2 font-heading text-base text-foreground">{message.subject}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
                  <span>{message.name}</span>
                  <a
                    href={`mailto:${message.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-primary"
                  >
                    <Mail className="h-3 w-3" />
                    {message.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={message.status}
                  onChange={(event) => setStatus(message, event.target.value)}
                  className="rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent("Re: " + message.subject)}`}
                  className="rounded-md border border-primary/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary hover:bg-primary/10"
                >
                  Reply
                </a>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line border-t border-border/60 pt-4 text-[13px] leading-relaxed text-muted-foreground">
              {message.message}
            </p>
          </div>
        ))}
        {!loading && !items.length && (
          <p className="rounded-xl border border-border/70 bg-card/40 p-8 text-center text-sm text-muted-foreground">
            No inquiries yet.
          </p>
        )}
      </div>
    </div>
  );
}