"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Check, Laptop, Smartphone } from "lucide-react";
import { BrowserFrame, Rail, Reveal, SectionHeading, softEase } from "@/components/ui";
import { WORKFLOW, type WorkflowStep } from "@/lib/content";

function StepMedia({ step, play }: { step: WorkflowStep; play: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) v.play().catch(() => {});
    else v.pause();
  }, [play]);

  if (!step.video) {
    return (
      <Image src={step.poster} alt={step.alt} width={2880} height={1800} sizes="(min-width: 1024px) 680px, 100vw" className="block h-auto w-full" />
    );
  }
  return (
    <video
      ref={ref}
      key={step.key}
      className="block aspect-[3/2] h-auto w-full bg-white object-contain"
      poster={step.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={step.alt}
    >
      <source src={step.video.webm} type="video/webm" />
      <source src={step.video.mp4} type="video/mp4" />
    </video>
  );
}

export default function Workflow() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const reduce = useReducedMotion();
  const mediaRef = useRef<HTMLDivElement>(null);
  const inView = useInView(mediaRef, { margin: "-15% 0px" });
  const step = WORKFLOW[active];

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in map) next = (active + map[e.key] + WORKFLOW.length) % WORKFLOW.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = WORKFLOW.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
    tabs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <Rail id="product" labelledBy="product-title" innerClassName="py-24 sm:py-28">
      <div className="px-0 sm:px-10">
        <SectionHeading
          id="product-title"
          align="left"
          eyebrow="How it works"
          title={
            <>
              From first inquiry
              <br className="hidden sm:block" /> to dispatched load.
            </>
          }
          lede="Follow one shipment through BeRocker: it comes in, gets priced, turns into a conversation, a booking and a dispatched load, without leaving the CRM."
        />

        <Reveal className="mt-12">
          <div className="rounded-3xl tint-slate p-2 sm:p-3">
            <div
              role="tablist"
              aria-label="Lead to dispatch steps"
              onKeyDown={onKey}
              className="flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {WORKFLOW.map((s, i) => {
                const on = i === active;
                return (
                  <button
                    key={s.key}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    id={`${uid}-tab-${s.key}`}
                    aria-selected={on}
                    aria-controls={`${uid}-panel`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`relative min-w-[176px] shrink-0 snap-start rounded-2xl px-4 py-3.5 text-left transition-colors lg:min-w-0 ${
                      on ? "text-ink" : "text-ink-2 hover:bg-white/50"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId={`${uid}-thumb`}
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }}
                        className="absolute inset-0 rounded-2xl bg-white shadow-card"
                      />
                    )}
                    <span className="relative flex items-center gap-2.5">
                      <span
                        className={`grid size-6 shrink-0 place-items-center rounded-md text-[12px] font-bold ${
                          on ? "bg-brand text-white" : "bg-white/70 text-ink-3 ring-1 ring-line"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="text-[15px] font-semibold">{s.label}</span>
                    </span>
                    <span className="relative mt-1 block pl-[34px] text-[13px] leading-5 text-ink-3">{s.short}</span>
                  </button>
                );
              })}
            </div>

            <div
              id={`${uid}-panel`}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${step.key}`}
              className="mt-2 grid gap-8 rounded-[20px] bg-white/60 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step.key}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: softEase }}
                >
                  <p className="text-[13px] font-semibold uppercase tracking-wide text-brand">
                    Step {active + 1} of {WORKFLOW.length}
                  </p>
                  <h3 className="mt-2 text-balance text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[1.9rem]">{step.title}</h3>
                  <p className="mt-3 text-pretty text-[16px] leading-7 text-ink-2">{step.body}</p>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {step.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[15px] text-ink">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
                          <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <div ref={mediaRef}>
                <BrowserFrame>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={step.key}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <StepMedia step={step} play={inView && !reduce} />
                    </motion.div>
                  </AnimatePresence>
                </BrowserFrame>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[15px] text-ink-2">
            <span className="inline-flex items-center gap-1.5 text-ink">
              <Laptop aria-hidden="true" className="size-4 text-brand" />
              <Smartphone aria-hidden="true" className="size-4 text-brand" />
              Desktop, tablet and phone.
            </span>
            The same full workspace everywhere, with nothing stripped away.
          </p>
        </Reveal>
      </div>
    </Rail>
  );
}
