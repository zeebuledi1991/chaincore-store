import { createFileRoute } from "@tanstack/react-router";
import { base44 } from "@/api/base44Client";
import useEntityList from "@/hooks/useEntityList";
import StatusPill from "@/components/admin/StatusPill";

export const Route = createFileRoute("/_authed/admin/licenses")({
  component: AdminLicenses,
});

function AdminLicenses() {
  const { items, loading, refresh } = useEntityList("License", {}, { limit: 300 });

  async function setStatus(license, status) {
    await base44.entities.License.update(license.id, { status });
    await refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">License management</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Every licence issued at payment confirmation, with its validity window and status.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border/70 bg-card/40">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-b border-border/60">
              {["Licence key", "Customer", "Product", "Environment", "Valid until", "Status", ""].map(
                (head) => (
                  <th
                    key={head}
                    className="px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((license) => (
              <tr key={license.id} className="border-b border-border/40 last:border-0">
                <td className="px-4 py-3 font-mono text-[11px] text-foreground">
                  {license.license_key}
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground/85">
                  <div>{license.customer_name}</div>
                  <div className="text-[11px] text-muted-foreground">{license.customer_email}</div>
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground/85">{license.product_name}</td>
                <td className="px-4 py-3 font-mono text-[11px] uppercase text-muted-foreground">
                  {license.blockchain || "all"}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                  {String(license.valid_until || "").slice(0, 10) || "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusPill value={license.status} />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={license.status}
                    onChange={(event) => setStatus(license, event.target.value)}
                    className="rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground"
                  >
                    <option value="active">active</option>
                    <option value="expired">expired</option>
                    <option value="revoked">revoked</option>
                  </select>
                </td>
              </tr>
            ))}
            {!loading && !items.length && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No licences issued yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}