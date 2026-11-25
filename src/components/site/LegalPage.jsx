export default function LegalPage({ label, title, intro, updated, sections }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                {label}
              </span>
            </div>
            <h1 className="mt-6 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{intro}</p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Last updated {updated}
            </p>
            <nav className="mt-8 hidden border-t border-border/60 pt-5 lg:block" aria-label="On this page">
              <ul className="space-y-2.5">
                {sections.map((section, index) => (
                  <li key={section.title}>
                    <a
                      href={`#section-${index + 1}`}
                      className="flex gap-3 text-[13px] text-muted-foreground transition-colors hover:text-primary"
                    >
                      <span className="font-mono text-[10px] text-primary/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="space-y-10">
            {sections.map((section, index) => (
              <article
                key={section.title}
                id={`section-${index + 1}`}
                className="scroll-mt-28 border-b border-border/60 pb-8 last:border-0"
              >
                <h2 className="flex items-baseline gap-3 font-heading text-lg font-semibold text-foreground">
                  <span className="font-mono text-[11px] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 pl-8">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-[14px] leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="mt-3 space-y-2">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-2.5 text-[14px] leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}