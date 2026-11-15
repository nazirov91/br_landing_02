import { DatabaseZap, Headset, PlugZap } from "lucide-react";
import { Placeholder, Rail, Reveal, SectionHeading } from "@/components/ui";
import { QUOTES, SUPPORT } from "@/lib/content";

const ICONS = [DatabaseZap, PlugZap, Headset];

export default function Support() {
  return (
    <Rail id="support" labelledBy="support-title" innerClassName="py-24 sm:py-28">
      <div className="px-0 sm:px-10">
        <SectionHeading id="support-title" eyebrow={SUPPORT.eyebrow} title={SUPPORT.title} lede={SUPPORT.lede} />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {SUPPORT.pillars.map((p, i) => {
            const Icon = ICONS[i];
            const body = (
              <div className="flex h-full flex-col rounded-2xl bg-surface p-6 sm:p-7">
                <span className="grid size-11 place-items-center rounded-xl bg-white text-brand shadow-card">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-5 text-[18px] font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-6 text-ink-2">{p.body}</p>
                {p.placeholderNote && (
                  <Placeholder note="Placeholder" className="mt-4">
                    <p className="rounded-lg bg-white px-3 py-2 text-[13px] text-ink-3">{p.placeholderNote}.</p>
                  </Placeholder>
                )}
              </div>
            );
            return (
              <Reveal key={p.title} delay={0.06 * i} className="h-full">
                {body}
              </Reveal>
            );
          })}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="h-full rounded-2xl border border-line bg-white p-6 sm:p-7">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-3">How onboarding runs</p>
              <ol className="mt-5 flex flex-col">
                {SUPPORT.steps.map((s, i) => (
                  <li key={s} className="relative flex gap-4 pb-5 last:pb-0">
                    {i < SUPPORT.steps.length - 1 && <span aria-hidden="true" className="absolute left-[13px] top-7 h-[calc(100%-20px)] w-px bg-line-2" />}
                    <span className="relative grid size-7 shrink-0 place-items-center rounded-full bg-brand text-[12px] font-bold text-white">{i + 1}</span>
                    <span className="pt-0.5 text-[15px] text-ink">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <Placeholder note="Placeholder quote" className="h-full">
              <figure className="flex h-full flex-col justify-between rounded-2xl tint-sky p-7 sm:p-8">
                <blockquote className="text-pretty text-[1.3rem] font-medium leading-snug tracking-[-0.01em] text-ink">
                  &ldquo;{QUOTES.support.text}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-white text-[13px] font-bold text-brand-700 shadow-card">CN</span>
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">{QUOTES.support.name}</span>
                    <span className="block text-[13px] text-ink-2">{QUOTES.support.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Placeholder>
          </Reveal>
        </div>
      </div>
    </Rail>
  );
}
