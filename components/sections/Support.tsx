import { Check, DatabaseZap, Headset, PlugZap } from "lucide-react";
import { Heading, IconChip, Placeholder, Reveal, Section } from "@/components/ui";
import { QUOTES, SUPPORT } from "@/lib/content";

const ICONS = [DatabaseZap, PlugZap, Headset];

/* Hourline's customer-story block: a big panel, a quote card overlapping its corner, points beside it. */
export default function Support() {
  return (
    <Section id="support" labelledBy="support-title" tone="white">
      <Heading id="support-title" eyebrow={SUPPORT.eyebrow} title={SUPPORT.title} sub={SUPPORT.lede} />

      <Reveal className="well mt-12 flex min-h-[360px] items-center justify-center p-6 pb-24 sm:p-10 sm:pb-32 lg:min-h-[440px] lg:justify-end lg:pb-10 lg:pr-20">
        {/* Onboarding checklist, the way a new brokerage sees it */}
        <div className="w-full max-w-[420px] rounded-[var(--radius-card)] bg-card p-6 shadow-float">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold text-ink">Onboarding · your brokerage</p>
            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-semibold text-accent-ink">3 of 4</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-fill">
            <div className="h-full w-3/4 rounded-full bg-accent" />
          </div>
          <ol className="mt-5 flex flex-col gap-3">
            {SUPPORT.steps.map((s, i) => {
              const done = i < 3;
              return (
                <li key={s} className="flex items-center gap-3 text-[14px]">
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                      done ? "bg-success-soft text-success" : "bg-accent text-white"
                    }`}
                  >
                    {done ? <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={done ? "text-ink-3" : "font-medium text-ink"}>{s}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </Reveal>

      <div className="relative grid gap-6 px-0 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-14 lg:px-10">
        <Reveal className="-mt-16 sm:-mt-24 lg:-mt-40">
          <Placeholder note="Placeholder quote">
            <figure className="rounded-[var(--radius-card)] bg-card p-7 shadow-float">
              <blockquote className="text-pretty text-[17px] font-medium leading-[1.55] text-ink">&ldquo;{QUOTES.support.text}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-[12px] font-bold text-accent-ink">CN</span>
                <span>
                  <span className="block text-[14px] font-semibold text-ink">{QUOTES.support.name}</span>
                  <span className="block text-[13px] text-ink-3">{QUOTES.support.role}</span>
                </span>
              </figcaption>
            </figure>
          </Placeholder>
        </Reveal>

        <div className="grid gap-6 pt-2 sm:grid-cols-3 lg:pt-10">
          {SUPPORT.pillars.map((p, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={p.title} delay={0.05 * i}>
                <IconChip>
                  <Icon aria-hidden="true" className="size-[18px]" />
                </IconChip>
                <h3 className="mt-4 text-[17px] font-medium text-ink">{p.title}</h3>
                <p className="mt-1.5 text-[15px] leading-6 text-ink-3">{p.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
