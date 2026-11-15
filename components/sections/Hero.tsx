"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Check, ChevronRight, Truck } from "lucide-react";
import Ribbons from "@/components/Ribbons";
import { AppFrame, ButtonLink, Container, FeeNote, buttonClass, ease } from "@/components/ui";
import { DemoButton } from "@/components/DemoProvider";
import { HERO, SITE } from "@/lib/content";

export default function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number, y = 14) =>
    reduce ? {} : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease, delay } };

  return (
    <section id="top" aria-labelledby="hero-title" className="pt-10 sm:pt-14">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)] lg:gap-16">
        <div>
          <motion.a
            href="#ai"
            {...enter(0)}
            className="group inline-flex max-w-full items-center gap-2 rounded-full bg-card py-1 pl-1 pr-3 text-[13px] font-semibold text-ink-2 shadow-card transition-colors hover:text-ink"
          >
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">New</span>
            <span className="truncate">{HERO.eyebrow}</span>
            <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <motion.h1
            id="hero-title"
            {...enter(0.05)}
            className="mt-6 text-balance text-[2.6rem] font-medium leading-[1.04] tracking-[-0.035em] text-ink sm:text-[3.4rem] xl:text-[3.9rem]"
          >
            {HERO.title[0]} {HERO.title[1]}
          </motion.h1>

          <motion.p {...enter(0.1)} className="mt-6 max-w-[46ch] text-pretty text-[17px] leading-[1.6] text-ink-2 sm:text-[19px]">
            {HERO.lede}
          </motion.p>

          <motion.div {...enter(0.15)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={SITE.signUpUrl} size="lg" arrow>
              Start free trial
            </ButtonLink>
            <DemoButton source="hero" className={buttonClass("quiet", "lg")}>
              Book a demo
            </DemoButton>
          </motion.div>

          <motion.ul {...enter(0.2)} className="mt-7 flex flex-col gap-2.5 text-[15px] text-ink-2">
            {HERO.notes.map((n) => (
              <li key={n.text} className="flex items-center gap-2.5">
                <Check aria-hidden="true" className="size-[18px] shrink-0 text-accent" strokeWidth={2.4} />
                <span>
                  {n.text}
                  {n.feeNote && (
                    <>
                      {" "}
                      <FeeNote />
                    </>
                  )}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Product panel: ribbons on navy with the real product on top */}
        <motion.div {...enter(0.15, 24)} className="well-navy relative aspect-[5/4] w-full sm:aspect-[600/520]">
          <Ribbons angle={32} amplitude={0.55} ribbonWidth={0.26} wires={60} glow={0.5} intensity={1} speed={0.5} spin={0.3} quality={0.85} />

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.35 }}
            className="absolute right-[4%] top-[6%] w-[78%]"
          >
            <AppFrame>
              <Image
                src="/img/dashboard.webp"
                alt="The BeRocker broker dashboard: income, commissions, leads in progress, follow-ups and recent payments"
                width={2880}
                height={1800}
                priority
                sizes="(min-width: 1024px) 470px, 78vw"
                className="block h-auto w-full"
              />
            </AppFrame>
          </motion.div>

          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -6, 0] }}
            transition={
              reduce
                ? { duration: 0 }
                : { opacity: { duration: 0.9, ease, delay: 0.55 }, y: { duration: 6, ease: "easeInOut", repeat: Infinity, delay: 1.4 } }
            }
            className="absolute bottom-[6%] left-[4%] w-[54%] min-w-[210px] rounded-[var(--radius-card)] bg-card p-4 shadow-float"
          >
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-ink-3">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 animate-pulse-dot rounded-full bg-accent" />
                New lead · website
              </span>
              <span className="normal-case tracking-normal">just now</span>
            </div>
            <p className="mt-2 text-[15px] font-semibold text-ink">2021 Toyota RAV4</p>
            <p className="text-[13px] text-ink-3">Dallas, TX → Denver, CO</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
              <div className="rounded-lg bg-fill px-2.5 py-2">
                <p className="text-ink-3">AI price</p>
                <p className="font-semibold text-ink">$850</p>
              </div>
              <div className="rounded-lg bg-fill px-2.5 py-2">
                <p className="text-ink-3">Super Dispatch</p>
                <p className="font-semibold text-ink">$820</p>
              </div>
            </div>
            <div className="mt-3 flex h-8 items-center justify-center rounded-lg bg-accent text-[12px] font-semibold text-white">Send quote</div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.75 }}
            className="absolute bottom-[10%] right-[5%] hidden items-center gap-2 rounded-full bg-card py-1.5 pl-1.5 pr-3.5 text-[12px] font-semibold text-ink shadow-float sm:inline-flex"
          >
            <span className="grid size-6 place-items-center rounded-full bg-accent-soft text-accent">
              <Truck aria-hidden="true" className="size-3.5" />
            </span>
            Posted · 3 offers in
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
