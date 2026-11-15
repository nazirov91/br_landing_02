"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Check, ChevronRight, Radio, Truck } from "lucide-react";
import Ribbons from "@/components/Ribbons";
import { AppFrame, ButtonLink, Container, FeeNote, buttonClass, ease } from "@/components/ui";
import { DemoButton } from "@/components/DemoProvider";
import { HERO, SITE } from "@/lib/content";

/*
  The one showpiece on an otherwise calm page: a navy panel with the ribbons sweeping across,
  and the real product rising out of its bottom edge onto the page.
*/
export default function Hero() {
  const reduce = useReducedMotion();
  const productRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: productRef, offset: ["start end", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const drift = useTransform(scrollYProgress, [0, 1], [24, -56]);

  const enter = (delay: number, y = 16) =>
    reduce ? {} : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease, delay } };

  return (
    <section id="top" aria-labelledby="hero-title" className="relative px-2 pt-2 sm:px-3 sm:pt-3">
      {/* Panel stops above the product's bottom edge, so the product sits half on the page */}
      <div className="well-navy absolute inset-x-2 top-2 bottom-[18%] sm:inset-x-3 sm:top-3 sm:bottom-[24%] lg:bottom-[230px]">
        <Ribbons angle={-14} amplitude={0.5} ribbonWidth={0.24} wires={64} glow={0.55} intensity={1.1} speed={0.55} spin={0.3} />
        <div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-navy/85 via-navy/75 to-transparent sm:hidden" />
      </div>

      <Container className="relative flex flex-col items-center pt-20 text-center sm:pt-28">
        <motion.a
          href="#ai"
          {...enter(0)}
          className="group inline-flex max-w-full items-center gap-2 rounded-full bg-navy-2 py-1 pl-1 pr-3 text-[13px] font-semibold text-mist ring-1 ring-navy-line transition-colors hover:text-white"
        >
          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">New</span>
          <span className="truncate">{HERO.eyebrow}</span>
          <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </motion.a>

        <motion.h1
          id="hero-title"
          {...enter(0.06)}
          className="mt-7 text-balance text-[2.75rem] font-medium leading-[1.02] tracking-[-0.04em] text-white sm:text-[4rem] lg:text-[4.75rem]"
        >
          {HERO.title[0]}
          <br />
          {HERO.title[1]}
        </motion.h1>

        <motion.p {...enter(0.12)} className="mt-6 max-w-[620px] text-pretty text-[17px] leading-[1.6] text-mist sm:text-[19px]">
          {HERO.lede}
        </motion.p>

        <motion.div {...enter(0.18)} className="mt-9 flex w-full max-w-[340px] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <ButtonLink href={SITE.signUpUrl} size="lg" arrow>
            Start free trial
          </ButtonLink>
          <DemoButton source="hero" className={buttonClass("quiet-dark", "lg")}>
            Book a demo
          </DemoButton>
        </motion.div>

        <motion.ul {...enter(0.24)} className="mt-7 flex flex-col items-start gap-x-7 gap-y-2.5 text-left text-[15px] text-mist md:flex-row md:items-center">
          {HERO.notes.map((n) => (
            <li key={n.text} className="flex items-start gap-2.5">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                <Check aria-hidden="true" className="size-3" strokeWidth={3} />
              </span>
              <span>
                {n.text}
                {n.feeNote && (
                  <>
                    {" "}
                    <FeeNote dark />
                  </>
                )}
              </span>
            </li>
          ))}
        </motion.ul>

        {/* Product, rising out of the panel */}
        <motion.div
          ref={productRef}
          initial={reduce ? false : { opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.3 }}
          className="relative mt-14 w-full max-w-[1060px] sm:mt-20"
        >
          <motion.div style={reduce ? undefined : { y: lift }}>
            <AppFrame className="text-left">
              <Image
                src="/img/dashboard.webp"
                alt="The BeRocker broker dashboard: income, commissions, leads in progress, follow-ups and recent payments"
                width={2880}
                height={1800}
                priority
                sizes="(min-width: 1120px) 1060px, 100vw"
                className="block h-auto w-full"
              />
            </AppFrame>
          </motion.div>

          {/* Floating product moments */}
          <motion.div
            aria-hidden="true"
            style={reduce ? undefined : { y: drift }}
            className="absolute -left-3 top-[14%] hidden w-[250px] md:block lg:-left-12"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.9 }}
              className="rounded-[var(--radius-card)] bg-card p-4 text-left shadow-float"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 animate-pulse-dot rounded-full bg-accent" />
                  New lead · website
                </span>
                <Radio className="size-3.5 text-accent" />
              </div>
              <p className="mt-2 text-[15px] font-semibold text-ink">2021 Toyota RAV4</p>
              <p className="text-[13px] text-ink-3">Dallas, TX → Denver, CO</p>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-fill px-3 py-2 text-[12px]">
                <span className="text-ink-3">AI price</span>
                <span className="font-semibold text-ink">$850</span>
              </div>
              <div className="mt-2.5 flex h-8 items-center justify-center rounded-lg bg-accent text-[12px] font-semibold text-white">Send quote</div>
            </motion.div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            style={reduce ? undefined : { y: drift }}
            className="absolute -right-3 top-[40%] hidden w-[240px] md:block lg:-right-12"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease, delay: 1.05 }}
              className="rounded-[var(--radius-card)] bg-card p-4 text-left shadow-float"
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                <Truck className="size-3.5 text-accent" /> Super Dispatch
              </div>
              <p className="mt-2 text-[15px] font-semibold text-ink">Posted · 3 offers in</p>
              <div className="mt-2.5 flex flex-col gap-1.5 text-[12px]">
                {[
                  ["FastHaul", "$650", true],
                  ["Prime Auto", "$675", false],
                  ["RoadStar", "$700", false],
                ].map(([c, p, best]) => (
                  <div key={String(c)} className={`flex justify-between rounded-md px-2.5 py-1.5 ${best ? "bg-accent-soft" : "bg-fill"}`}>
                    <span className={best ? "font-medium text-accent-ink" : "text-ink-2"}>{c}</span>
                    <span className={`font-semibold ${best ? "text-accent-ink" : "text-ink"}`}>{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
