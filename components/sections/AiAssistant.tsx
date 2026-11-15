"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Bot, Check, PhoneIncoming, Plug, ShieldCheck, Sparkles, Tag, Wrench } from "lucide-react";
import { Placeholder, Reveal, softEase } from "@/components/ui";
import { AI } from "@/lib/content";

function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const show = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: inView ? { opacity: 1, y: 0 } : undefined,
          transition: { duration: 0.5, ease: softEase, delay },
        };

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl bg-[#0b1320] ring-1 ring-white/10 shadow-glow">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-white/85">
          <Sparkles aria-hidden="true" className="size-4 text-[#c4a8ff]" /> Your AI assistant
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-semibold text-[#5fe0a7]">
          <span className="size-1.5 rounded-full bg-[#5fe0a7]" /> BeRocker connected
        </span>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <motion.div {...show(0.1)} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-[15px] text-white">
          {AI.prompt}
        </motion.div>

        <motion.div {...show(0.6)} className="flex flex-wrap items-center gap-2 text-[12px] text-white/50">
          <Wrench aria-hidden="true" className="size-3.5" /> Used BeRocker
          {AI.tools.map((t) => (
            <code key={t} className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-white/70 ring-1 ring-white/10">
              {t}
            </code>
          ))}
        </motion.div>

        <motion.div {...show(1.0)} className="max-w-[94%] text-[15px] leading-6 text-white/85">
          <p>{AI.answerIntro}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {AI.answerItems.map((it, i) => (
              <motion.li
                key={it.lead}
                {...show(1.25 + i * 0.18)}
                className="rounded-xl bg-white/[0.05] p-3 ring-1 ring-white/[0.08]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-semibold text-white">
                    {it.vehicle} <span className="font-normal text-white/50">{it.lead}</span>
                  </span>
                  <span className="shrink-0 text-[12px] text-white/50">{it.route}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-white/60">{it.note}</p>
              </motion.li>
            ))}
          </ul>
          <motion.p {...show(1.75)} className="mt-3">
            {AI.answerOutro}
          </motion.p>
        </motion.div>

        <motion.div {...show(2.1)} className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-[12px] text-white/55 ring-1 ring-white/[0.06]">
          <ShieldCheck aria-hidden="true" className="size-4 text-[#8fb4ff]" />
          Changes are previewed first and only happen after you confirm.
        </motion.div>
      </div>
    </div>
  );
}

const BUILT_IN_ICONS = [Bot, PhoneIncoming, Tag];
const CONNECTED_ICONS = [Plug, Sparkles, ShieldCheck];

export default function AiAssistant() {
  return (
    <section id="ai" aria-labelledby="ai-title" className="relative isolate mx-2 overflow-hidden rounded-[22px] bg-navy text-white sm:mx-3 sm:rounded-[28px]">
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10 opacity-70" />
      <div aria-hidden="true" className="absolute -left-40 top-10 -z-10 size-[520px] rounded-full bg-brand/25 blur-[120px]" />
      <div aria-hidden="true" className="absolute -right-40 bottom-0 -z-10 size-[480px] rounded-full bg-violet/25 blur-[120px]" />

      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-10 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-[15px] font-semibold text-[#8fb4ff]">{AI.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="ai-title" className="mt-3 text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.5rem] md:text-[2.875rem]">
                {AI.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-6">
              <Placeholder note="Confirm claim" inline>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-2 text-[15px] font-semibold text-white ring-1 ring-white/15">
                  <Check aria-hidden="true" className="size-4 text-[#5fe0a7]" strokeWidth={3} />
                  {AI.claim}
                </p>
              </Placeholder>
            </Reveal>
            <Reveal delay={0.14} className="mt-6">
              <p className="max-w-[520px] text-pretty text-lg leading-7 text-white/65">{AI.lede}</p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ChatDemo />
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {[
            { group: AI.builtIn, icons: BUILT_IN_ICONS, accent: "text-[#8fb4ff]" },
            { group: AI.connected, icons: CONNECTED_ICONS, accent: "text-[#c4a8ff]" },
          ].map(({ group, icons, accent }, gi) => (
            <Reveal key={group.title} delay={0.06 * gi}>
              <div className="h-full rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-7">
                <h3 className="text-[17px] font-semibold">{group.title}</h3>
                <ul className="mt-5 flex flex-col gap-4">
                  {group.items.map((it, i) => {
                    const Icon = icons[i];
                    return (
                      <li key={it.title} className="flex gap-3.5">
                        <span className={`grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10 ${accent}`}>
                          <Icon aria-hidden="true" className="size-[18px]" />
                        </span>
                        <span>
                          <span className="block text-[15px] font-semibold text-white">{it.title}</span>
                          <span className="block text-[14px] leading-6 text-white/60">{it.body}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
