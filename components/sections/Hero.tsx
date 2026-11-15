"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Check, ChevronRight, Radio, Truck } from "lucide-react";
import InterferenceRibbons from "@/components/InterferenceRibbons";
import { BrowserFrame, ButtonLink, buttonClass, softEase } from "@/components/ui";
import { DemoButton } from "@/components/DemoProvider";
import { HERO, SITE } from "@/lib/content";

export default function Hero() {
  const reduce = useReducedMotion();
  const visualRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ["start end", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: softEase, delay },
        };

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate m-2 overflow-hidden rounded-[22px] bg-night sm:m-3 sm:rounded-[28px]"
    >
      {/* Fallback when WebGL2 is unavailable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(70%_60%_at_70%_35%,rgba(36,104,242,0.32),transparent_70%),radial-gradient(60%_50%_at_25%_55%,rgba(124,79,232,0.25),transparent_70%)]"
      />
      <InterferenceRibbons
        className="-z-10"
        style={{ position: "absolute", inset: 0, minHeight: 0 }}
        colors={["#2468f2", "#7c4fe8"]}
        backgroundColor="#070b12"
        mode="glow"
        angle={14}
        amplitude={0.5}
        ribbonWidth={0.22}
        wires={64}
        glow={0.55}
        intensity={1.1}
        speed={0.55}
        spin={0.3}
      />
      {/* Keep the headline readable over the brightest strands */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(48%_32%_at_50%_26%,rgba(7,11,18,0.72),transparent_100%)]"
      />
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-5 pb-0 pt-32 text-center sm:px-10 sm:pt-40">
        <motion.a
          href="#ai"
          {...enter(0)}
          className="group inline-flex max-w-full items-center gap-2 rounded-full bg-white/[0.07] py-1 pl-1 pr-3 text-[12px] sm:text-[13px] font-medium text-white/80 ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/[0.12] hover:text-white"
        >
          <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">New</span>
          {HERO.eyebrow}
          <ChevronRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </motion.a>

        <motion.h1
          id="hero-title"
          {...enter(0.06)}
          className="mt-6 text-balance text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-[3.6rem] md:text-[4.4rem]"
        >
          {HERO.title[0]}
          <br />
          <span className="bg-gradient-to-r from-[#8fb4ff] via-white to-[#c4a8ff] bg-clip-text text-transparent">{HERO.title[1]}</span>
        </motion.h1>

        <motion.p {...enter(0.12)} className="mt-6 max-w-[640px] text-pretty text-lg leading-7 text-white/70 sm:text-[1.2rem] sm:leading-8">
          {HERO.lede}
        </motion.p>

        <motion.div {...enter(0.18)} className="mt-9 flex w-full max-w-[340px] flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
          <ButtonLink href={SITE.signUpUrl} size="lg" arrow>
            Start free trial
          </ButtonLink>
          <DemoButton source="hero" className={buttonClass("ghost-dark", "lg")}>
            Book a demo
          </DemoButton>
        </motion.div>

        <motion.ul {...enter(0.24)} className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] text-white/65">
          {HERO.notes.map((n) => (
            <li key={n} className="inline-flex items-center gap-2">
              <span className="grid size-5 place-items-center rounded-full bg-brand/20 text-[#8fb4ff]">
                <Check aria-hidden="true" className="size-3" strokeWidth={3} />
              </span>
              {n}
            </li>
          ))}
        </motion.ul>

        <motion.div
          ref={visualRef}
          initial={reduce ? false : { opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: softEase, delay: 0.3 }}
          className="relative mt-16 w-full max-w-[1080px] sm:mt-20"
        >
          <motion.div style={reduce ? undefined : { y: lift }}>
            <BrowserFrame dark className="translate-y-6 rounded-b-none">
              <Image
                src="/img/dashboard.webp"
                alt="The BeRocker broker dashboard: income, commissions, leads in progress, follow-ups and recent payments"
                width={2880}
                height={1800}
                priority
                sizes="(min-width: 1140px) 1080px, 100vw"
                className="block h-auto w-full"
              />
            </BrowserFrame>
          </motion.div>

          {/* Floating product moments */}
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: softEase, delay: 0.9 }}
            className="absolute -left-2 top-[18%] hidden w-[250px] rounded-2xl bg-white/95 p-3.5 text-left shadow-float ring-1 ring-black/5 backdrop-blur md:block lg:-left-10"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
              <Radio className="size-3.5 text-brand" /> New lead · website
            </div>
            <p className="mt-1.5 text-[15px] font-semibold text-ink">2021 Toyota RAV4</p>
            <p className="text-[13px] text-ink-2">Dallas, TX → Denver, CO</p>
            <div className="mt-2.5 flex items-center justify-between rounded-lg bg-surface px-2.5 py-1.5 text-[12px]">
              <span className="text-ink-3">AI price</span>
              <span className="font-semibold text-ink">$850</span>
            </div>
          </motion.div>
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: softEase, delay: 1.05 }}
            className="absolute -right-2 top-[42%] hidden w-[240px] rounded-2xl bg-white/95 p-3.5 text-left shadow-float ring-1 ring-black/5 backdrop-blur md:block lg:-right-10"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
              <Truck className="size-3.5 text-violet" /> Super Dispatch
            </div>
            <p className="mt-1.5 text-[15px] font-semibold text-ink">Posted · 3 offers in</p>
            <div className="mt-2 flex flex-col gap-1 text-[12px]">
              {[
                ["FastHaul", "$650"],
                ["Prime Auto", "$675"],
              ].map(([c, p]) => (
                <div key={c} className="flex justify-between rounded-md bg-surface px-2.5 py-1">
                  <span className="text-ink-2">{c}</span>
                  <span className="font-semibold text-ink">{p}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-night/70 to-transparent" />
    </section>
  );
}
