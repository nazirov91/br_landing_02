"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Check, Laptop, Smartphone } from "lucide-react";
import { AppFrame, Heading, Reveal, Section, ease } from "@/components/ui";
import { useTabs } from "@/lib/useTabs";
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
    return <Image src={step.poster} alt={step.alt} width={2880} height={1800} sizes="(min-width: 1024px) 640px, 100vw" className="block h-auto w-full" />;
  }
  return (
    <video
      ref={ref}
      className="block aspect-[3/2] h-auto w-full bg-card object-contain"
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
  const uid = useId();
  const reduce = useReducedMotion();
  const tabs = useTabs(WORKFLOW.length, active, setActive);
  const mediaRef = useRef<HTMLDivElement>(null);
  const inView = useInView(mediaRef, { margin: "-15% 0px" });
  const step = WORKFLOW[active];

  return (
    <Section id="product" labelledBy="product-title">
      <Heading
        id="product-title"
        eyebrow="02 / The day-to-day, connected"
        title="From new lead to next load."
        sub="Every step in one CRM. Every conversation with its shipment."
      />

      <Reveal className="well mt-12 p-3 sm:p-4">
        <div
          role="tablist"
          aria-label="Lead to dispatch steps"
          onKeyDown={tabs.onKeyDown}
          className="flex snap-x gap-2 overflow-x-auto [scrollbar-width:none] lg:grid lg:grid-cols-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {WORKFLOW.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.key}
                ref={tabs.ref(i)}
                role="tab"
                id={`${uid}-tab-${s.key}`}
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative min-w-[180px] shrink-0 snap-start rounded-[14px] px-4 py-3.5 text-left transition-colors lg:min-w-0 ${
                  on ? "" : "hover:bg-card/50"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId={`${uid}-thumb`}
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                    className="absolute inset-0 rounded-[14px] bg-card shadow-card"
                  >
                    <span aria-hidden="true" className="absolute inset-x-4 -top-px h-0.5 rounded-full bg-accent" />
                  </motion.span>
                )}
                <span className="relative flex items-center gap-2.5">
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-md text-[12px] font-bold ${
                      on ? "bg-accent text-white" : "bg-card text-ink-3 shadow-quiet"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[15px] font-semibold text-ink">{s.label}</span>
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
          className="grid gap-8 px-3 pb-4 pt-8 sm:px-6 sm:pb-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-12 lg:pt-10"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.key}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
            >
              <h3 className="text-balance text-[24px] font-medium leading-tight tracking-[-0.015em] text-ink sm:text-[28px]">{step.title}</h3>
              <p className="mt-3 text-pretty text-[16px] leading-[1.65] text-ink-2">{step.body}</p>
              <ul className="mt-6 flex flex-col gap-3">
                {step.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[15px] text-ink">
                    <Check aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-accent" strokeWidth={2.4} />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div ref={mediaRef}>
            <AppFrame>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step.key} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <StepMedia step={step} play={inView && !reduce} />
                </motion.div>
              </AnimatePresence>
            </AppFrame>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-5">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-ink-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-ink">
            <Laptop aria-hidden="true" className="size-4 text-accent" />
            <Smartphone aria-hidden="true" className="size-4 text-accent" />
            Desktop, tablet and phone.
          </span>
          The same full workspace everywhere, with nothing stripped away.
        </p>
      </Reveal>
    </Section>
  );
}
