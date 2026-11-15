"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { Placeholder, Rail, Reveal, SectionHeading, buttonClass, softEase } from "@/components/ui";
import { DemoButton } from "@/components/DemoProvider";
import { FAQ, SITE } from "@/lib/content";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const uid = useId();

  return (
    <Rail id="faq" labelledBy="faq-title" innerClassName="py-24 sm:py-28">
      <div className="grid gap-12 px-0 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading
            id="faq-title"
            align="left"
            eyebrow="Questions"
            title="Before you make the switch."
            lede="The things brokers ask us most before they move over. Anything else, ask a person."
          />
          <Reveal delay={0.16} className="mt-7 flex flex-wrap gap-3">
            <DemoButton source="faq" className={buttonClass("light")}>
              Ask during a demo
            </DemoButton>
            <a href={SITE.phoneHref} className={buttonClass("light")}>
              Call {SITE.phone}
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <ul className="flex flex-col">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              const btn = `${uid}-q-${i}`;
              const panel = `${uid}-a-${i}`;
              const answer = <p className="pb-6 pr-10 text-[15px] leading-7 text-ink-2">{f.a}</p>;
              return (
                <li key={f.q} className="border-b border-line first:border-t">
                  <h3>
                    <button
                      id={btn}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panel}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold text-ink transition-colors hover:text-brand"
                    >
                      {f.q}
                      <Plus
                        aria-hidden="true"
                        className={`size-5 shrink-0 text-ink-3 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      />
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
                        transition={{ duration: 0.35, ease: softEase }}
                        className="overflow-hidden"
                      >
                        {f.placeholder ? (
                          <Placeholder note="Placeholder" className="mb-6">
                            <p className="pr-10 text-[15px] leading-7 text-ink-2">{f.a}</p>
                          </Placeholder>
                        ) : (
                          answer
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Rail>
  );
}
