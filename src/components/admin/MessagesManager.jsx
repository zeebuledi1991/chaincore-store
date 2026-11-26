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

const STATUSES = ["new", "read", "replied"];
const label = (value) => String(value || "").replace(/_/g, " ");

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("new");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setMessages(await listAll("ContactMessage", "-created_date", 200));
    } catch (error) {
      toast.error("Could not load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEditor = (message) => {
    setEditing(message);
    setNotes(message.notes || "");
    setStatus(message.status || "new");
  };

  const saveEditor = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveRecord("ContactMessage", editing.id, { status, notes });
      toast.success("Message updated");
      setEditing(null);
      load();
    } catch (error) {
      toast.error("Could not save that message.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">Messages</p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Contact form submissions</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Every enquiry from the contact page, with its status and private notes.
      </p>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading messages…
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card/40">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {message.created_date
                      ? new Date(message.created_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{message.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{message.email}</p>
                  </td>
                  <td className="max-w-[280px] px-4 py-3">
                    <p className="truncate text-muted-foreground">{message.subject}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {label(message.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditor(message)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No messages yet.
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
            <DialogTitle>{editing?.subject}</DialogTitle>
            <DialogDescription>
              {editing?.name} · {editing?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-background/70 p-3 text-sm text-muted-foreground">
            {editing?.message}
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
              <Label htmlFor="m-notes">Notes</Label>
              <Textarea
                id="m-notes"
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