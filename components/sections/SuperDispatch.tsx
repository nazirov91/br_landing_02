"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { ArrowLeftRight, ArrowRight, BadgeDollarSign, Check, CircleDot, Send, Truck } from "lucide-react";
import { Placeholder, Rail, Reveal, SectionHeading, softEase } from "@/components/ui";
import { SUPER_DISPATCH } from "@/lib/content";

function PricingCompare() {
  const rows = [
    { src: "BeRocker AI", price: "$850", tone: "bg-brand text-white", w: "78%" },
    { src: "Super Dispatch", price: "$820", tone: "bg-white", w: "72%" },
    { src: "Central Dispatch", price: "$875", tone: "bg-white", w: "84%" },
  ];
  return (
    <div className="w-full max-w-[290px] rounded-xl bg-white p-4 text-left shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">2021 RAV4 · Dallas → Denver</p>
      <div className="mt-3 flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.src} className="flex items-center gap-2 text-[12px]">
            <span className="w-[92px] shrink-0 text-ink-2">{r.src}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
              <span className={`block h-full rounded-full ${r.src === "BeRocker AI" ? "bg-brand" : "bg-ink/25"}`} style={{ width: r.w }} />
            </span>
            <span className="w-10 text-right font-semibold text-ink">{r.price}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-[12px]">
        <span className="text-brand-700">Quote sent</span>
        <span className="font-semibold text-brand-700">$850</span>
      </div>
    </div>
  );
}

function PostCard() {
  return (
    <div className="w-full max-w-[290px] rounded-xl bg-white p-4 text-left shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-ink">Load #174203</p>
        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet">Posted</span>
      </div>
      <p className="text-[12px] text-ink-3">Ready to ship · open trailer</p>
      <div className="mt-3 flex flex-col gap-1.5">
        {["Super Dispatch", "Central Dispatch"].map((b) => (
          <div key={b} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-[12px]">
            <span className="text-ink-2">{b}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-success">
              <Check className="size-3.5" strokeWidth={3} /> Live
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-[12px] font-semibold text-white">
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
    <div className="w-full max-w-[290px] rounded-xl bg-white p-4 text-left shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">Shipment timeline</p>
      <ol className="mt-3 flex flex-col gap-2.5">
        {steps.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5 text-[12px]">
            {s.done ? (
              <span className="grid size-5 place-items-center rounded-full bg-success/15 text-success">
                <Check className="size-3" strokeWidth={3} />
              </span>
            ) : (
              <span className="grid size-5 place-items-center rounded-full bg-surface text-ink-3">
                <CircleDot className="size-3" />
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
const TINTS = ["tint-sky", "tint-violet", "tint-mint"];

export default function SuperDispatch() {
  const reduce = useReducedMotion();
  const flowRef = useRef<HTMLDivElement>(null);
  const flowIn = useInView(flowRef, { once: true, margin: "-100px" });

  return (
    <Rail id="super-dispatch" labelledBy="sd-title" innerClassName="py-24 sm:py-28">
      <div className="px-0 sm:px-10">
        <SectionHeading id="sd-title" eyebrow={SUPER_DISPATCH.eyebrow} title={SUPER_DISPATCH.title} lede={SUPER_DISPATCH.lede} />

        {/* Savings callout */}
        <Reveal className="mx-auto mt-12 max-w-[880px]">
          <div className="relative overflow-hidden rounded-3xl bg-navy p-7 text-white sm:p-9">
            <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-60" />
            <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-brand/30 blur-3xl" />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <BadgeDollarSign aria-hidden="true" className="size-7 text-[#8fb4ff]" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-wide text-[#8fb4ff]">Included with every plan</p>
                  <p className="mt-1 text-[1.7rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2rem]">
                    $250 Super Dispatch API fee waived
                  </p>
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-white/40 line-through decoration-2">$250</span>
                <span className="text-5xl font-semibold tracking-[-0.03em]">$0</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Three capability cards */}
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {SUPER_DISPATCH.cards.map((c, i) => {
            const Visual = VISUALS[i];
            return (
              <Reveal key={c.title} delay={0.06 * i} className="flex flex-col">
                <div className={`grid h-[260px] place-items-center rounded-2xl p-6 ${TINTS[i]}`}>
                  <Visual />
                </div>
                <p className="mt-5 px-1 text-[15px] leading-6 text-ink-2">
                  <strong className="font-semibold text-ink">{c.title}.</strong> {c.body}
                </p>
              </Reveal>
            );
          })}
        </div>

        {/* What syncs, both directions */}
        <Reveal className="mt-14">
          <Placeholder note="Confirm sync list">
            <div ref={flowRef} className="grid items-center gap-5 rounded-3xl border border-line bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto_1fr]">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-3">BeRocker sends</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {SUPER_DISPATCH.toSD.map((t, i) => (
                    <motion.li
                      key={t}
                      initial={reduce ? false : { opacity: 0, x: -10 }}
                      animate={flowIn ? { opacity: 1, x: 0 } : undefined}
                      transition={{ duration: 0.5, ease: softEase, delay: 0.1 * i }}
                      className="flex items-center gap-2.5 rounded-xl bg-surface px-4 py-3 text-[15px] text-ink"
                    >
                      <ArrowRight aria-hidden="true" className="size-4 text-brand" /> {t}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center gap-3 py-2 lg:flex-col">
                <span className="rounded-xl bg-ink px-3.5 py-2 text-[13px] font-semibold text-white">BeRocker</span>
                <span className="grid size-11 place-items-center rounded-full bg-brand-50 text-brand ring-1 ring-brand/20">
                  <ArrowLeftRight aria-hidden="true" className="size-5 lg:rotate-90" />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-[13px] font-semibold text-ink ring-1 ring-line-2">
                  <Truck aria-hidden="true" className="size-4 text-violet" /> Super Dispatch
                </span>
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-3">BeRocker receives</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {SUPER_DISPATCH.fromSD.map((t, i) => (
                    <motion.li
                      key={t}
                      initial={reduce ? false : { opacity: 0, x: 10 }}
                      animate={flowIn ? { opacity: 1, x: 0 } : undefined}
                      transition={{ duration: 0.5, ease: softEase, delay: 0.3 + 0.1 * i }}
                      className="flex items-center gap-2.5 rounded-xl bg-surface px-4 py-3 text-[15px] text-ink"
                    >
                      <ArrowRight aria-hidden="true" className="size-4 rotate-180 text-violet" /> {t}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </Placeholder>
        </Reveal>
      </div>
    </Rail>
  );
}
