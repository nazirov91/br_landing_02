"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";
import { BadgeDollarSign, Check, Lock } from "lucide-react";
import { ButtonLink, Rail, Reveal, SectionHeading, buttonClass, softEase } from "@/components/ui";
import { DemoButton } from "@/components/DemoProvider";
import { PRICING, SITE } from "@/lib/content";

type Billing = "annual" | "monthly";

function Rolling({ value, className }: { value: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`relative inline-flex overflow-hidden ${className ?? ""}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={reduce ? false : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: softEase }}
          className="inline-block tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("annual");
  const reduce = useReducedMotion();
  const uid = useId();
  const radios = useRef<(HTMLButtonElement | null)[]>([]);
  const options: { key: Billing; label: string; badge?: string }[] = [
    { key: "annual", label: "Annual", badge: "Save 20%" },
    { key: "monthly", label: "Monthly" },
  ];
  const annual = billing === "annual";
  const perMonth = annual ? PRICING.annualTotal / 12 : PRICING.monthly;

  const onKey = (e: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const idx = options.findIndex((o) => o.key === billing);
    const next = (idx + step + options.length) % options.length;
    setBilling(options[next].key);
    radios.current[next]?.focus();
  };

  return (
    <Rail id="pricing" labelledBy="pricing-title" innerClassName="py-24 sm:py-28">
      <div className="px-0 sm:px-10">
        <SectionHeading id="pricing-title" eyebrow={PRICING.eyebrow} title={PRICING.title} lede={PRICING.lede} />

        <Reveal className="mt-10 flex justify-center">
          <div role="radiogroup" aria-label="Billing period" onKeyDown={onKey} className="relative inline-flex rounded-xl bg-surface p-1 text-[14px] font-semibold">
            {options.map((o, i) => {
              const on = o.key === billing;
              return (
                <button
                  key={o.key}
                  ref={(el) => {
                    radios.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setBilling(o.key)}
                  className={`relative h-10 rounded-lg px-5 transition-colors ${on ? "text-ink" : "text-ink-3 hover:text-ink"}`}
                >
                  {on && (
                    <motion.span
                      layoutId={`${uid}-billing`}
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                      className="absolute inset-0 rounded-lg bg-white shadow-card"
                    />
                  )}
                  <span className="relative inline-flex items-center gap-2">
                    {o.label}
                    {o.badge && <span className="rounded-full bg-success/12 px-1.5 py-0.5 text-[11px] font-bold text-success">{o.badge}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[1040px] gap-5 lg:grid-cols-[1.25fr_1fr]">
          {/* Pro */}
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl bg-white p-7 shadow-float ring-1 ring-brand/25 sm:p-9">
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-48 tint-sky opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[22px] font-semibold text-ink">Pro</h3>
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[12px] font-semibold text-white">{PRICING.trialDays} days free</span>
                </div>
                <p className="mt-1 text-[15px] text-ink-2">Everything BeRocker does, from day one.</p>

                <div className="mt-7 flex items-end gap-2">
                  <span className="text-[3.4rem] font-semibold leading-none tracking-[-0.04em] text-ink">
                    <Rolling value={money(perMonth)} />
                  </span>
                  <span className="pb-1.5 text-[15px] text-ink-3">/ month</span>
                </div>
                <p className="mt-2 min-h-6 text-[14px] text-ink-2" aria-live="polite">
                  {annual ? (
                    <>
                      Billed annually at <strong className="text-ink">{money(PRICING.annualTotal)}</strong>{" "}
                      <span className="text-ink-3 line-through">{money(PRICING.annualFullPrice)}</span>{" "}
                      <span className="font-semibold text-success">You save {money(PRICING.annualFullPrice - PRICING.annualTotal)}</span>
                    </>
                  ) : (
                    <>Billed monthly. Switch to annual and pay {money(PRICING.annualTotal / 12)}/month.</>
                  )}
                </p>

                {/* Seat breakdown */}
                <dl className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-line text-center">
                  {[
                    { k: "Base license", v: "+ 1 seat" },
                    { k: "Additional seats", v: `$${PRICING.seat}/each` },
                    { k: "More than 5 seats", v: `$${PRICING.seatBulk}/each` },
                  ].map((s, i) => (
                    <div key={s.k} className={`bg-white/80 px-2 py-3.5 ${i ? "border-l border-line" : ""}`}>
                      <dt className="text-[12px] text-ink-3">{s.k}</dt>
                      <dd className={`mt-0.5 text-[15px] font-semibold ${i === 2 ? "text-success" : "text-ink"}`}>{s.v}</dd>
                    </div>
                  ))}
                </dl>

                {/* Fee waiver beside the price */}
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-navy px-4 py-3.5 text-white">
                  <BadgeDollarSign aria-hidden="true" className="size-6 shrink-0 text-[#8fb4ff]" />
                  <p className="text-[14px] leading-5">
                    <strong className="font-semibold">Super Dispatch API included free.</strong>{" "}
                    <span className="text-white/65">Normally $250, waived on every plan.</span>
                  </p>
                </div>

                <ButtonLink href={`${SITE.signUpUrl}?billing=${billing}`} size="lg" arrow className="mt-6 w-full">
                  Start {PRICING.trialDays}-day free trial
                </ButtonLink>
                <p className="mt-2.5 text-center text-[13px] text-ink-3">No charge today. Cancel any time during the trial.</p>

                <ul className="mt-7 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {PRICING.proFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] leading-5 text-ink">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Enterprise */}
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-line bg-surface p-7 sm:p-9">
              <h3 className="text-[22px] font-semibold text-ink">Enterprise</h3>
              <p className="mt-1 text-[15px] text-ink-2">For larger brokerages with their own requirements.</p>
              <p className="mt-7 text-[2.4rem] font-semibold leading-none tracking-[-0.03em] text-ink">Let&apos;s talk</p>
              <p className="mt-2 text-[14px] text-ink-2">Custom pricing, shaped around your operation.</p>
              <DemoButton source="pricing-enterprise" plan="enterprise" className={buttonClass("dark", "lg", "mt-7 w-full")}>
                Talk to us
              </DemoButton>
              <ul className="mt-7 flex flex-col gap-2.5">
                {PRICING.enterpriseFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] leading-5 text-ink">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-2" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-7 text-[13px] text-ink-3">Super Dispatch API subscription included free ($250 value).</p>
            </div>
          </Reveal>
        </div>

        {/* Compact security strip */}
        <Reveal className="mx-auto mt-12 max-w-[1040px]">
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-line-2 px-6 py-5 sm:flex-row sm:justify-between">
            <p className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
              <Lock aria-hidden="true" className="size-4 text-brand" /> Security and compliance
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-5">
              {PRICING.compliance.map((c) => (
                <li key={c.alt}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt={c.alt} loading="lazy" className="h-8 w-auto opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" />
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-center text-[13px] text-ink-3">BeRocker does not sell, generate or offer leads to customers.</p>
        </Reveal>
      </div>
    </Rail>
  );
}
