import { useEffect, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { listAll, saveRecord } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
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

const STATUSES = ["new", "reviewing", "quoted", "closed"];
const label = (value) => String(value || "").replace(/_/g, " ");

export default function RequestsManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setRequests(await listAll("CustomOrder", "-created_date", 200));
    } catch (error) {
      toast.error("Could not load custom requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEditor = (request) => {
    setEditing(request);
    setStatus(request.status || "new");
    setNotes(request.notes || "");
  };

  const saveEditor = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveRecord("CustomOrder", editing.id, { status, notes });
      toast.success("Request updated");
      setEditing(null);
      load();
    } catch (error) {
      toast.error("Could not save that request.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">Custom requests</p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Volume and licence requests</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Every custom order submitted from the storefront, with quantity, network and requirements.
      </p>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading requests…
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card/40">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-4 py-3">Request</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Network</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-primary">
                    {request.request_number}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{request.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{request.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {Number(request.requested_units || 0).toLocaleString("en-US")}
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {request.blockchain}
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {label(request.status)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditor(request)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No custom requests yet.
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
            <DialogTitle>{editing?.request_number}</DialogTitle>
            <DialogDescription>
              {editing?.name} · {editing?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 rounded-lg border border-border bg-background/70 p-3 text-sm">
            <p className="text-muted-foreground">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                Quantity
              </span>{" "}
              {editing?.quantity} {editing?.unit} ·{" "}
              {Number(editing?.requested_units || 0).toLocaleString("en-US")} units
            </p>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {editing?.requirements || "No additional requirements."}
            </p>
          </div>

          <form onSubmit={saveEditor} className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {label(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="r-notes">Notes</Label>
              <Textarea
                id="r-notes"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Close
              </Button>
              <Button type="submit" disabled={saving} className="gap-2">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}