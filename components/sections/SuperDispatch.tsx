"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { ArrowLeftRight, ArrowRight, Check, CircleDot, Gauge, Send, Truck } from "lucide-react";
import { FeeNote, Heading, Placeholder, Reveal, Section, ease } from "@/components/ui";
import { useTabs } from "@/lib/useTabs";
import { SUPER_DISPATCH } from "@/lib/content";

function PricingCompare() {
  const rows = [
    { src: "BeRocker AI", price: "$850", w: "78%", main: true },
    { src: "Super Dispatch", price: "$820", w: "72%" },
    { src: "Central Dispatch", price: "$875", w: "84%" },
  ];
  return (
    <div className="w-full max-w-[320px] rounded-[var(--radius-card)] bg-card p-5 shadow-float">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">2021 RAV4 · Dallas → Denver</p>
      <div className="mt-4 flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.src} className="flex items-center gap-3 text-[13px]">
            <span className="w-[104px] shrink-0 text-ink-2">{r.src}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-fill">
              <span className={`block h-full rounded-full ${r.main ? "bg-accent" : "bg-line-2"}`} style={{ width: r.w }} />
            </span>
            <span className="w-11 text-right font-semibold text-ink">{r.price}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-[10px] bg-accent-soft px-3 py-2.5 text-[13px]">
        <span className="font-medium text-accent-ink">Quote sent</span>
        <span className="font-semibold text-accent-ink">$850</span>
      </div>
    </div>
  );
}

function PostCard() {
  return (
    <div className="w-full max-w-[320px] rounded-[var(--radius-card)] bg-card p-5 shadow-float">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold text-ink">Load #174203</p>
        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent-ink">Posted</span>
      </div>
      <p className="text-[13px] text-ink-3">Ready to ship · open trailer</p>
      <div className="mt-4 flex flex-col gap-2">
        {["Super Dispatch", "Central Dispatch"].map((b) => (
          <div key={b} className="flex items-center justify-between rounded-[10px] bg-fill px-3 py-2.5 text-[13px]">
            <span className="text-ink-2">{b}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-success">
              <Check className="size-3.5" strokeWidth={3} /> Live
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-accent px-3.5 text-[13px] font-semibold text-white">
        <Send className="size-3.5" /> Post to both
      </div>
    </div>
  );
}

function DispatchCard() {
  const steps = [
    { label: "Offer accepted · FastHaul $650", done: true },
    { label: "Dispatched", done: true },
    { label: "Picked up", done: true },
    { label: "Delivered", done: false },
  ];
  return (
    <div className="w-full max-w-[320px] rounded-[var(--radius-card)] bg-card p-5 shadow-float">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">Shipment timeline</p>
      <ol className="mt-4 flex flex-col gap-3">
        {steps.map((s) => (
          <li key={s.label} className="flex items-center gap-3 text-[13px]">
            {s.done ? (
              <span className="grid size-6 place-items-center rounded-full bg-success-soft text-success">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            ) : (
              <span className="grid size-6 place-items-center rounded-full bg-fill text-ink-3">
                <CircleDot className="size-3.5" />
              </span>
            )}
            <span className={s.done ? "text-ink" : "text-ink-3"}>{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const VISUALS = [PricingCompare, PostCard, DispatchCard];
const ICONS = [Gauge, Send, Truck];

export default function SuperDispatch() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const uid = useId();
  const tabs = useTabs(SUPER_DISPATCH.cards.length, active, setActive);
  const card = SUPER_DISPATCH.cards[active];
  const Visual = VISUALS[active];

  return (
    <Section id="super-dispatch" labelledBy="sd-title">
      <Heading id="sd-title" eyebrow={SUPER_DISPATCH.eyebrow} title={SUPER_DISPATCH.title} sub={SUPER_DISPATCH.lede} />

      <Reveal className="mt-12">
        <div role="tablist" aria-label="Super Dispatch features" onKeyDown={tabs.onKeyDown} className="grid gap-3 sm:grid-cols-3">
          {SUPER_DISPATCH.cards.map((c, i) => {
            const on = i === active;
            const Icon = ICONS[i];
            return (
              <button
                key={c.title}
                ref={tabs.ref(i)}
                role="tab"
                id={`${uid}-tab-${i}`}
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative rounded-[var(--radius-card)] p-5 text-left transition-[background-color,box-shadow] duration-150 ${
                  on ? "bg-card shadow-card" : "shadow-[inset_0_0_0_1px_var(--color-line-2)] hover:bg-card/60"
                }`}
              >
                {on && <span aria-hidden="true" className="absolute inset-x-5 -top-px h-0.5 rounded-full bg-accent" />}
                <Icon aria-hidden="true" className={`size-[22px] ${on ? "text-accent" : "text-ink-3"}`} />
                <span className="mt-4 block text-[17px] font-medium text-ink">{c.title}</span>
                <span className="mt-1 block text-[15px] leading-snug text-ink-3">{c.short}</span>
              </button>
            );
          })}
        </div>

        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-10 rounded-[var(--radius-panel)] bg-card p-7 shadow-card sm:p-9">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease }}
              >
                <h3 className="text-balance text-[24px] font-medium leading-tight tracking-[-0.015em] text-ink">{card.title}.</h3>
                <p className="mt-3 max-w-[46ch] text-[16px] leading-[1.65] text-ink-2">{card.body}</p>
              </motion.div>
            </AnimatePresence>

            {/* Fee waiver, beside every Super Dispatch tab */}
            <div className="flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wide text-accent">Included with every plan</p>
                <p className="mt-1.5 text-[17px] font-medium text-ink">
                  Super Dispatch API fee waived <FeeNote />
                </p>
              </div>
              <p className="flex items-baseline gap-2.5">
                <span className="text-[22px] font-medium text-ink-3 line-through decoration-2">$250</span>
                <span className="text-[44px] font-medium leading-none tracking-[-0.03em] text-ink">$0</span>
              </p>
            </div>
          </div>

          <div className="well grid min-h-[340px] place-items-center p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                className="grid w-full place-items-center"
                initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.35, ease }}
              >
                <Visual />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      {/* What syncs, both directions */}
      <Reveal className="mt-3">
        <Placeholder note="Confirm sync list">
          <div className="grid items-center gap-6 rounded-[var(--radius-panel)] bg-card p-7 shadow-card sm:p-9 lg:grid-cols-[1fr_auto_1fr]">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-3">BeRocker sends</p>
              <ul className="mt-3 flex flex-col gap-2">
                {SUPER_DISPATCH.toSD.map((t) => (
                  <li key={t} className="flex items-center gap-2.5 rounded-[10px] bg-fill px-4 py-3 text-[15px] text-ink">
                    <ArrowRight aria-hidden="true" className="size-4 text-accent" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center gap-3 lg:flex-col">
              <span className="rounded-[10px] bg-navy px-3.5 py-2 text-[13px] font-semibold text-white">BeRocker</span>
              <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
                <ArrowLeftRight aria-hidden="true" className="size-5 lg:rotate-90" />
              </span>
              <span className="rounded-[10px] bg-card px-3.5 py-2 text-[13px] font-semibold text-ink shadow-quiet">Super Dispatch</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-3">BeRocker receives</p>
              <ul className="mt-3 flex flex-col gap-2">
                {SUPER_DISPATCH.fromSD.map((t) => (
                  <li key={t} className="flex items-center gap-2.5 rounded-[10px] bg-fill px-4 py-3 text-[15px] text-ink">
                    <ArrowRight aria-hidden="true" className="size-4 rotate-180 text-accent" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Placeholder>
      </Reveal>
    </Section>
  );
}
