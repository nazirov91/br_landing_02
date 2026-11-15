"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Bot, Check, MessageSquareText, PhoneIncoming, Plug, ShieldCheck, Sparkles, Tag, Wrench } from "lucide-react";
import { Eyebrow, IconChip, Placeholder, Reveal, Section, ease } from "@/components/ui";
import { AI } from "@/lib/content";

function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const show = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: inView ? { opacity: 1, y: 0 } : undefined, transition: { duration: 0.45, ease, delay } };

  return (
    <div ref={ref} className="w-full max-w-[460px] overflow-hidden rounded-[var(--radius-card)] bg-card shadow-float">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink">
          <Sparkles aria-hidden="true" className="size-4 text-accent" /> Your AI assistant
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success">
          <span className="size-1.5 rounded-full bg-success" /> BeRocker connected
        </span>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <motion.p {...show(0.1)} className="ml-auto max-w-[85%] rounded-[14px] rounded-br-[4px] bg-accent px-4 py-2.5 text-[15px] text-white">
          {AI.prompt}
        </motion.p>

        <motion.div {...show(0.5)} className="flex flex-wrap items-center gap-2 text-[12px] text-ink-3">
          <Wrench aria-hidden="true" className="size-3.5" /> Used BeRocker
          {AI.tools.map((t) => (
            <code key={t} className="rounded-md bg-fill px-1.5 py-0.5 font-mono text-[11px] text-ink-2">
              {t}
            </code>
          ))}
        </motion.div>

        <motion.div {...show(0.85)} className="text-[15px] leading-6 text-ink">
          <p>{AI.answerIntro}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {AI.answerItems.map((it, i) => (
              <motion.li key={it.lead} {...show(1.05 + i * 0.15)} className="rounded-[12px] bg-fill p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-semibold text-ink">{it.vehicle}</span>
                  <span className="shrink-0 text-[12px] text-ink-3">{it.route}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-ink-3">
                  {it.lead} · {it.note}
                </p>
              </motion.li>
            ))}
          </ul>
          <motion.p {...show(1.5)} className="mt-3">
            {AI.answerOutro}
          </motion.p>
        </motion.div>

        <motion.p {...show(1.8)} className="flex items-center gap-2 rounded-[12px] bg-accent-soft px-3 py-2.5 text-[12px] text-accent-ink">
          <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
          Changes are previewed first and only happen after you confirm.
        </motion.p>
      </div>
    </div>
  );
}

const BUILT_IN_ICONS = [Bot, PhoneIncoming, Tag];
const CONNECTED_ICONS = [Plug, MessageSquareText, ShieldCheck];

export default function AiAssistant() {
  return (
    <Section id="ai" labelledBy="ai-title">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="well-navy order-2 grid place-items-center px-5 py-12 sm:px-10 sm:py-16 lg:order-1">
          <ChatDemo />
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <Eyebrow>{AI.eyebrow}</Eyebrow>
          <h2 id="ai-title" className="mt-5 text-balance text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.4rem] lg:text-[2.75rem]">
            {AI.title}
          </h2>
          <div className="mt-5">
            <Placeholder note="Confirm claim" inline>
              <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-[14px] font-semibold text-accent-ink">
                <Check aria-hidden="true" className="size-4" strokeWidth={3} />
                {AI.claim}
              </p>
            </Placeholder>
          </div>
          <p className="mt-5 max-w-[50ch] text-pretty text-[17px] leading-[1.6] text-ink-3 sm:text-[19px]">{AI.lede}</p>

          <ul className="mt-8 flex flex-col gap-3">
            {AI.examples.map((q) => (
              <li key={q} className="flex items-center gap-3 text-[15px] text-ink-2">
                <kbd className="inline-flex h-7 shrink-0 items-center rounded-md bg-card px-2 font-sans text-[12px] font-semibold text-ink shadow-quiet">Ask</kbd>
                {q}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-3 md:grid-cols-2">
        {[
          { group: AI.builtIn, icons: BUILT_IN_ICONS },
          { group: AI.connected, icons: CONNECTED_ICONS },
        ].map(({ group, icons }, gi) => (
          <Reveal key={group.title} delay={0.05 * gi}>
            <div className="h-full rounded-[var(--radius-panel)] bg-card p-7 shadow-card sm:p-8">
              <h3 className="text-[18px] font-medium text-ink">{group.title}</h3>
              <ul className="mt-6 flex flex-col gap-5">
                {group.items.map((it, i) => {
                  const Icon = icons[i];
                  return (
                    <li key={it.title} className="flex gap-4">
                      <IconChip>
                        <Icon aria-hidden="true" className="size-[18px]" />
                      </IconChip>
                      <span>
                        <span className="block text-[15px] font-semibold text-ink">{it.title}</span>
                        <span className="mt-0.5 block text-[15px] leading-6 text-ink-3">{it.body}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
