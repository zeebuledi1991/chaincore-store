import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import BlockchainSelector from "@/components/store/BlockchainSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitCustomOrder } from "@/lib/server-fns";
import { SUPPORT_EMAIL } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/custom-order")({
  head: () => ({
    meta: [
      { title: "Custom Order — ChainCore Technologies LLC" },
      {
        name: "description",
        content:
          "Request a custom simulation volume, licence scope or multi-network testing engagement from ChainCore Technologies LLC.",
      },
    ],
  }),
  component: CustomOrderPage,
});

const UNITS = [
  { id: "K", label: "K", multiplier: 1000 },
  { id: "M", label: "M", multiplier: 1000000 },
  { id: "B", label: "B", multiplier: 1000000000 },
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function CustomOrderPage() {
  const submit = useServerFn(submitCustomOrder);
  const [form, setForm] = useState({
    quantity: "",
    unit: "K",
    name: "",
    email: "",
    blockchain: "",
    requirements: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const multiplier = UNITS.find((unit) => unit.id === form.unit)?.multiplier || 1000;
  const parsedQuantity = Number(form.quantity);
  const previewUnits =
    Number.isFinite(parsedQuantity) && parsedQuantity > 0
      ? Math.round(parsedQuantity * multiplier)
      : 0;

  function update(patch) {
    setForm((current) => ({ ...current, ...patch }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!(parsedQuantity > 0)) return setError("Enter the simulation quantity you need.");
    if (form.name.trim().length < 2) return setError("Enter your full name.");
    if (!EMAIL_RE.test(form.email.trim())) return setError("Enter a valid email address.");
    if (!form.blockchain) return setError("Select your preferred blockchain testing environment.");

    setLoading(true);
    try {
      const response = await submit({
        data: {
          quantity: parsedQuantity,
          unit: form.unit,
          name: form.name.trim(),
          email: form.email.trim(),
          blockchain: form.blockchain,
          requirements: form.requirements.trim(),
        },
      });
      setResult(response);
    } catch (err) {
      setError("We could not submit your request. Please email " + SUPPORT_EMAIL + ".");
    } finally {
      setLoading(false);
    }
  }

  if (result?.success) {
    return (
      <section className="py-24">
        <div className="mx-auto w-full max-w-2xl px-5 text-center sm:px-8">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-6 text-3xl font-semibold text-foreground sm:text-4xl">
            Request received
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Your custom request{" "}
            <span className="font-mono text-foreground">{result.requestNumber}</span> was sent to{" "}
            {SUPPORT_EMAIL}. Our engineering team replies within one business day with a scoped
            proposal.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="rounded-md bg-primary px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground"
            >
              Browse products
            </Link>
            <Link
              to="/"
              className="rounded-md border border-border px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground hover:border-primary/50"
            >
              Back home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        label="Custom Order"
        title="Request a simulation volume built around your workflow."
        description="Tell us the quantity, the environment and any additional requirements. Requests are reviewed by our engineering team, not an automated queue."
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-border/70 bg-card/50 p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="quantity" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Simulation quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantity}
                  onChange={(event) => update({ quantity: event.target.value })}
                  placeholder="25"
                  className="bg-background/60"
                />
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Unit
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {UNITS.map((unit) => (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => update({ unit: unit.id })}
                      aria-pressed={form.unit === unit.id}
                      className={cn(
                        "rounded-md border py-2.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors",
                        form.unit === unit.id
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border/70 bg-background/40 text-muted-foreground hover:border-border"
                      )}
                    >
                      {unit.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="custom-name" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Full name
                </Label>
                <Input
                  id="custom-name"
                  value={form.name}
                  onChange={(event) => update({ name: event.target.value })}
                  autoComplete="name"
                  placeholder="Jordan Reyes"
                  className="bg-background/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="custom-email" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Email address
                </Label>
                <Input
                  id="custom-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => update({ email: event.target.value })}
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="bg-background/60"
                />
              </div>
            </div>

            <div className="mt-5">
              <BlockchainSelector
                value={form.blockchain}
                onChange={(value) => update({ blockchain: value })}
                label="Preferred testing environment"
              />
            </div>

            <div className="mt-5 space-y-1.5">
              <Label htmlFor="requirements" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Additional requirements
              </Label>
              <Textarea
                id="requirements"
                value={form.requirements}
                onChange={(event) => update({ requirements: event.target.value })}
                rows={5}
                placeholder="Contract types, test scenarios, delivery timeline, invoicing requirements."
                className="bg-background/60"
              />
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <p className="text-[13px] leading-relaxed text-foreground/90">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-md bg-primary px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_45px_-12px_hsl(184_100%_50%/0.9)] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending request
                </>
              ) : (
                <>
                  Submit custom request
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Requests are sent to {SUPPORT_EMAIL}. No cryptocurrency is generated and no real USDT
              is promised; all quantities refer to simulated test units.
            </p>
          </form>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border/70 bg-background/60 p-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Request preview
                </p>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              </div>
              <div aria-live="polite" className="mt-5 space-y-3 font-mono text-[12px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">quantity</span>
                  <span className="text-foreground">
                    {form.quantity ? `${form.quantity}${form.unit}` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">units</span>
                  <span className="text-primary">
                    {previewUnits ? previewUnits.toLocaleString("en-US") : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">environment</span>
                  <span className="text-foreground">{form.blockchain || "—"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">contact</span>
                  <span className="max-w-[60%] truncate text-foreground">{form.email || "—"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">requirements</span>
                  <span className="text-foreground">
                    {form.requirements.trim() ? "attached" : "none"}
                  </span>
                </div>
              </div>
              <p className="mt-6 border-t border-border/60 pt-4 text-[12px] leading-relaxed text-muted-foreground">
                Simulated units only. Not genuine transferable USDT.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}