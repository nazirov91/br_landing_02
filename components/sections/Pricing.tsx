"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { BadgeDollarSign, Check, Lock } from "lucide-react";
import { ButtonLink, FeeNote, Heading, Reveal, Section, buttonClass, ease } from "@/components/ui";
import { DemoButton } from "@/components/DemoProvider";
import { useTabs } from "@/lib/useTabs";
import { PRICING, SITE } from "@/lib/content";

type Billing = "annual" | "monthly";
const OPTIONS: { key: Billing; label: string; badge?: string }[] = [
  { key: "annual", label: "Annual", badge: "Save 20%" },
  { key: "monthly", label: "Monthly" },
];
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

function Rolling({ value }: { value: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-flex overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={reduce ? false : { y: "90%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-90%", opacity: 0 }}
          transition={{ duration: 0.35, ease }}
          className="inline-block tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Pricing() {
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();
  const uid = useId();
  const radios = useTabs(OPTIONS.length, idx, setIdx);
  const billing = OPTIONS[idx].key;
  const annual = billing === "annual";
  const perMonth = annual ? PRICING.annualTotal / 12 : PRICING.monthly;

  return (
    <Section id="pricing" labelledBy="pricing-title">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <Heading id="pricing-title" eyebrow={PRICING.eyebrow} title={PRICING.title} sub={PRICING.lede} />
        <Reveal>
          <div role="radiogroup" aria-label="Billing period" onKeyDown={radios.onKeyDown} className="inline-flex rounded-[12px] bg-page-2 p-1">
            {OPTIONS.map((o, i) => {
              const on = i === idx;
              return (
                <button
                  key={o.key}
                  ref={radios.ref(i)}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setIdx(i)}
                  className={`relative h-10 rounded-[9px] px-4 text-[14px] font-semibold transition-colors ${on ? "text-ink" : "text-ink-3 hover:text-ink"}`}
                >
                  {on && (
                    <motion.span
                      layoutId={`${uid}-billing`}
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                      className="absolute inset-0 rounded-[9px] bg-card shadow-card"
                    />
                  )}
                  <span className="relative inline-flex items-center gap-2">
                    {o.label}
                    {o.badge && <span className="rounded-full bg-success-soft px-1.5 py-0.5 text-[11px] font-bold text-success">{o.badge}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Pro */}
        <Reveal>
          <div className="relative h-full rounded-[var(--radius-panel)] surface p-7 sm:p-9">
            <span aria-hidden="true" className="absolute inset-x-8 -top-px h-0.5 rounded-full bg-accent" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[22px] font-medium text-ink">Pro</h3>
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent-ink">{PRICING.trialDays} days free</span>
            </div>
            <p className="mt-1 text-[15px] text-ink-3">Everything BeRocker does, from day one.</p>

            <div className="mt-7 flex items-end gap-2">
              <span className="text-[3.25rem] font-medium leading-none tracking-[-0.04em] text-ink">
                <Rolling value={money(perMonth)} />
              </span>
              <span className="pb-1.5 text-[15px] text-ink-3">/ month</span>
            </div>
            <p className="mt-2 min-h-6 text-[14px] text-ink-3" aria-live="polite">
              {annual ? (
                <>
                  Billed annually at <span className="font-semibold text-ink">{money(PRICING.annualTotal)}</span>{" "}
                  <span className="line-through">{money(PRICING.annualFullPrice)}</span>{" "}
                  <span className="font-semibold text-success">You save {money(PRICING.annualFullPrice - PRICING.annualTotal)}</span>
                </>
              ) : (
                <>Billed monthly. Switch to annual and pay {money(PRICING.annualTotal / 12)}/month.</>
              )}
            </p>

            <dl className="mt-6 grid grid-cols-3 overflow-hidden rounded-[var(--radius-card)] bg-fill text-center">
              {[
                { k: "Base license", v: "+ 1 seat" },
                { k: "Additional seats", v: `$${PRICING.seat}/each` },
                { k: "More than 5 seats", v: `$${PRICING.seatBulk}/each` },
              ].map((s, i) => (
                <div key={s.k} className={`px-2 py-4 ${i ? "border-l border-line" : ""}`}>
                  <dt className="text-[12px] text-ink-3">{s.k}</dt>
                  <dd className={`mt-0.5 text-[15px] font-semibold ${i === 2 ? "text-success" : "text-ink"}`}>{s.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-3 flex items-center gap-3 rounded-[var(--radius-card)] bg-accent-soft px-4 py-3.5">
              <BadgeDollarSign aria-hidden="true" className="size-6 shrink-0 text-accent" />
              <p className="text-[14px] leading-5 text-accent-ink">
                <span className="font-semibold">Super Dispatch API included free.</span> Normally $250. <FeeNote />
              </p>
            </div>

            <ButtonLink href={`${SITE.signUpUrl}?billing=${billing}`} size="lg" arrow className="mt-6 w-full">
              Start {PRICING.trialDays}-day free trial
            </ButtonLink>
            <p className="mt-2.5 text-center text-[13px] text-ink-3">No charge today. Cancel any time during the trial.</p>

            <ul className="mt-8 grid gap-x-6 gap-y-3 border-t border-line pt-7 sm:grid-cols-2">
              {PRICING.proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] leading-5 text-ink">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Enterprise */}
        <Reveal delay={0.06}>
          <div className="flex h-full flex-col rounded-[var(--radius-panel)] surface p-7 sm:p-9">
            <h3 className="text-[22px] font-medium text-ink">Enterprise</h3>
            <p className="mt-1 text-[15px] text-ink-3">Your operation. Your requirements. For larger brokerages that need more control.</p>
            <p className="mt-7 text-[2.5rem] font-medium leading-none tracking-[-0.03em] text-ink">Let&apos;s talk</p>
            <p className="mt-2 text-[14px] text-ink-3">Custom pricing around your operation.</p>
            <DemoButton source="pricing-enterprise" plan="enterprise" className={buttonClass("quiet", "lg", "mt-7 w-full")}>
              Talk to us
            </DemoButton>
            <ul className="mt-8 flex flex-col gap-3 border-t border-line pt-7">
              {PRICING.enterpriseFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] leading-5 text-ink">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-8 text-[13px] text-ink-3">
              Super Dispatch API subscription included free ($250 value). <FeeNote />
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-3">
        <div className="flex flex-col items-center gap-5 rounded-[var(--radius-card)] surface px-6 py-5 sm:flex-row sm:justify-between">
          <p className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
            <Lock aria-hidden="true" className="size-4 text-accent" /> Security and compliance
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-6">
            {PRICING.compliance.map((c) => (
              <li key={c.alt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.alt} loading="lazy" className="h-8 w-auto opacity-75 grayscale" />
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-[13px] text-ink-3">{PRICING.finePrint}</p>
      </Reveal>
    </Section>
  );
}
