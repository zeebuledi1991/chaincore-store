import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, Loader2, Mail, MapPin, Send } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/lib/server-fns";
import { SUPPORT_EMAIL } from "@/lib/catalog";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — ChainCore Technologies LLC" },
      {
        name: "description",
        content:
          "Contact ChainCore Technologies LLC about blockchain software, testing and simulation solutions. Email support@chaincore.store.",
      },
    ],
  }),
  component: ContactPage,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function ContactPage() {
  const send = useServerFn(submitContactMessage);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function update(patch) {
    setForm((current) => ({ ...current, ...patch }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Enter your full name.");
    if (!EMAIL_RE.test(form.email.trim())) return setError("Enter a valid email address.");
    if (form.subject.trim().length < 3) return setError("Add a short subject.");
    if (form.message.trim().length < 10) return setError("Tell us a little more about your inquiry.");

    setLoading(true);
    try {
      await send({
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
      });
      setSent(true);
    } catch (err) {
      setError("We could not send your message. Please email " + SUPPORT_EMAIL + ".");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        label="Contact Us"
        title="Talk to the team building the tooling."
        description="Licence questions, simulation scoping, integration partnerships or delivery support — every message reaches our engineering team directly."
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-card/40 p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                Company
              </p>
              <p className="mt-2 font-heading text-lg text-foreground">
                ChainCore Technologies LLC
              </p>
              <div className="mt-5 space-y-4 border-t border-border/60 pt-5">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-3 text-sm text-foreground/85 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  {SUPPORT_EMAIL}
                </a>
                <p className="flex items-center gap-3 text-sm text-foreground/85">
                  <MapPin className="h-4 w-4 text-primary" />
                  Remote-first · Serving clients globally
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/40 p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                Response times
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">General inquiries</dt>
                  <dd className="font-mono text-[12px] text-foreground/85">&lt; 1 business day</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Licence holders</dt>
                  <dd className="font-mono text-[12px] text-foreground/85">Priority queue</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Order issues</dt>
                  <dd className="font-mono text-[12px] text-foreground/85">Same day</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/50 p-6 sm:p-8">
            {sent ? (
              <div className="flex h-full flex-col items-start justify-center py-10">
                <CheckCircle2 className="h-9 w-9 text-primary" />
                <h2 className="mt-5 text-2xl font-semibold text-foreground">Message sent</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Thank you. Your inquiry is with our team and we will reply to{" "}
                  <span className="text-foreground">{form.email}</span> within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-6 rounded-md border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground hover:border-primary/50 hover:text-primary"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Full name
                    </Label>
                    <Input
                      id="contact-name"
                      value={form.name}
                      onChange={(event) => update({ name: event.target.value })}
                      autoComplete="name"
                      placeholder="Jordan Reyes"
                      className="bg-background/60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Email address
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(event) => update({ email: event.target.value })}
                      autoComplete="email"
                      placeholder="you@company.com"
                      className="bg-background/60"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-1.5">
                  <Label htmlFor="contact-subject" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Subject
                  </Label>
                  <Input
                    id="contact-subject"
                    value={form.subject}
                    onChange={(event) => update({ subject: event.target.value })}
                    placeholder="Licence scoping for a four-network test suite"
                    className="bg-background/60"
                  />
                </div>

                <div className="mt-5 space-y-1.5">
                  <Label htmlFor="contact-message" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(event) => update({ message: event.target.value })}
                    rows={7}
                    placeholder="Describe your project, environment and timeline."
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
                  className="mt-6 inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-7 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_45px_-12px_hsl(184_100%_50%/0.9)] disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}