import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, Loader2, Mail, MapPin, Send } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import { useContent } from "@/components/content/ContentProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/lib/server-fns";
import { SUPPORT_EMAIL } from "@/lib/catalog";

export const Route = createFileRoute("/_site/contact-us")({
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

const RESPONSES = [
  { labelKey: "contact.response1.label", valueKey: "contact.response1.value" },
  { labelKey: "contact.response2.label", valueKey: "contact.response2.value" },
  { labelKey: "contact.response3.label", valueKey: "contact.response3.value" },
];

function ContactPage() {
  const t = useContent();
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
    if (form.name.trim().length < 2) return setError(t("contact.error.name"));
    if (!EMAIL_RE.test(form.email.trim())) return setError(t("contact.error.email"));
    if (form.subject.trim().length < 3) return setError(t("contact.error.subject"));
    if (form.message.trim().length < 10) return setError(t("contact.error.message"));

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
      setError(`${t("contact.error.generic")} ${SUPPORT_EMAIL}.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        label={t("contact.label")}
        title={t("contact.title")}
        description={t("contact.description")}
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-card/40 p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                {t("contact.companyLabel")}
              </p>
              <p className="mt-2 font-heading text-lg text-foreground">
                {t("contact.companyName")}
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
                  {t("contact.location")}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/40 p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                {t("contact.responseTitle")}
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                {RESPONSES.map((row) => (
                  <div key={row.labelKey} className="flex items-center justify-between">
                    <dt className="text-muted-foreground">{t(row.labelKey)}</dt>
                    <dd className="font-mono text-[12px] text-foreground/85">{t(row.valueKey)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/50 p-6 sm:p-8">
            {sent ? (
              <div className="flex h-full flex-col items-start justify-center py-10">
                <CheckCircle2 className="h-9 w-9 text-primary" />
                <h2 className="mt-5 text-2xl font-semibold text-foreground">
                  {t("contact.success.title")}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {t("contact.success.bodyLead")}{" "}
                  <span className="text-foreground">{form.email}</span>{" "}
                  {t("contact.success.bodyTail")}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-6 rounded-md border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground hover:border-primary/50 hover:text-primary"
                >
                  {t("contact.success.again")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {t("contact.form.nameLabel")}
                    </Label>
                    <Input
                      id="contact-name"
                      value={form.name}
                      onChange={(event) => update({ name: event.target.value })}
                      autoComplete="name"
                      placeholder={t("contact.form.namePlaceholder")}
                      className="bg-background/60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {t("contact.form.emailLabel")}
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(event) => update({ email: event.target.value })}
                      autoComplete="email"
                      placeholder={t("contact.form.emailPlaceholder")}
                      className="bg-background/60"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-1.5">
                  <Label htmlFor="contact-subject" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {t("contact.form.subjectLabel")}
                  </Label>
                  <Input
                    id="contact-subject"
                    value={form.subject}
                    onChange={(event) => update({ subject: event.target.value })}
                    placeholder={t("contact.form.subjectPlaceholder")}
                    className="bg-background/60"
                  />
                </div>

                <div className="mt-5 space-y-1.5">
                  <Label htmlFor="contact-message" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {t("contact.form.messageLabel")}
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(event) => update({ message: event.target.value })}
                    rows={7}
                    placeholder={t("contact.form.messagePlaceholder")}
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
                      {t("contact.form.sending")}
                    </>
                  ) : (
                    <>
                      {t("contact.form.submit")}
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