"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { ChevronDown, Headset } from "lucide-react";
import { Heading, IconChip, Placeholder, Reveal, Section, buttonClass, ease } from "@/components/ui";
import { DemoButton } from "@/components/DemoProvider";
import { FAQ, SITE } from "@/lib/content";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const uid = useId();

  return (
    <Section id="faq" labelledBy="faq-title" tone="white">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <Heading id="faq-title" title="Before you make the switch." />
          <Reveal delay={0.08} className="mt-8 max-w-[420px]">
            <div className="rounded-[var(--radius-card)] surface p-6">
              <div className="flex items-start gap-4">
                <IconChip>
                  <Headset aria-hidden="true" className="size-[18px]" />
                </IconChip>
                <div>
                  <p className="text-[16px] font-semibold text-ink">Still deciding?</p>
                  <p className="mt-1 text-[15px] leading-6 text-ink-3">Talk to a person who knows auto transport. We&apos;ll answer anything that isn&apos;t here.</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <DemoButton source="faq" className={buttonClass("quiet")}>
                  Book a call
                </DemoButton>
                <a href={SITE.phoneHref} className={buttonClass("quiet")}>
                  {SITE.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.04}>
          <ul className="flex flex-col gap-2">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              const btn = `${uid}-q-${i}`;
              const panel = `${uid}-a-${i}`;
              return (
                <li key={f.q} className="surface rounded-[var(--radius-card)]">
                  <h3>
                    <button
                      id={btn}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panel}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-[16px] font-medium text-ink"
                    >
                      {f.q}
                      <ChevronDown aria-hidden="true" className={`size-5 shrink-0 text-ink-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panel}
                        role="region"
                        aria-labelledby={btn}
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          {f.placeholder ? (
                            <Placeholder note="Placeholder">
                              <p className="text-[15px] leading-7 text-ink-3">{f.a}</p>
                            </Placeholder>
                          ) : (
                            <p className="text-[15px] leading-7 text-ink-3">{f.a}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
