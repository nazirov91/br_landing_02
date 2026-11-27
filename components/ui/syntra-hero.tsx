"use client";

/*
  The hero: the Syntra hero layout (21st.dev) in BeRocker colours, with BeRocker OS as its
  visual: BeRocker as the operating system for auto transport, a desktop whose dock holds the
  modules as apps and whose windows play one shipment through them. Copy on the left, the OS
  on the right, an isometric floor grid behind both with a soft spotlight that follows the cursor.

  Every colour is a token: SVG attributes use var(--color-*) and the CSS lives in globals.css.
*/

import { useEffect, useRef } from "react";
import type { SVGProps } from "react";
import { ArrowRight, CalendarCheck2, Inbox, Play, Timer } from "lucide-react";
import BeRockerOS from "@/components/ui/berocker-os";
import { FlipLabel, buttonClass } from "@/components/ui";
import { HERO, SITE, STATS } from "@/lib/content";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const C = (name: string) => `var(--color-${name})`;

/* ───────────── Floor grid with a spotlight that follows the cursor ───────────── */

const CELL = { w: 84, h: 48 };
const SPOT = 340;

function FloorGrid({ id, stroke, strokeWidth = 0.8, ...props }: SVGProps<SVGSVGElement> & { id: string; stroke: string; strokeWidth?: number }) {
  return (
    <svg aria-hidden="true" width="100%" height="100%" {...props}>
      <defs>
        <pattern id={id} width={CELL.w} height={CELL.h} patternUnits="userSpaceOnUse">
          <path
            d={`M0 ${CELL.h / 2}L${CELL.w / 2} 0L${CELL.w} ${CELL.h / 2}M0 ${CELL.h / 2}L${CELL.w / 2} ${CELL.h}L${CELL.w} ${CELL.h / 2}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function HeroFloor() {
  const ref = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const litRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const spot = spotRef.current;
    const lit = litRef.current;
    const section = el?.parentElement;
    if (!el || !spot || !lit || !section) return;

    const resize = new ResizeObserver(([entry]) => {
      lit.style.width = `${entry.contentRect.width}px`;
      lit.style.height = `${entry.contentRect.height}px`;
    });
    resize.observe(section);

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = section.getBoundingClientRect();
        const x = e.clientX - box.left - SPOT / 2;
        const y = e.clientY - box.top - SPOT / 2;
        spot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        lit.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
        el.dataset.spot = "on";
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.dataset.spot = "off";
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" data-spot="off" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <FloorGrid id="sh-floor-cell" stroke={C("line-2")} className="sh-floor absolute inset-0" />
      <div ref={spotRef} style={{ width: SPOT, height: SPOT }} className="sh-floor-spot">
        <div ref={litRef} className="sh-floor-lit">
          <FloorGrid id="sh-floor-cell-lit" stroke={C("accent")} strokeWidth={1} className="block size-full" />
        </div>
      </div>
    </div>
  );
}

/* ───────────── Copy ───────────── */

const METRIC_ICONS = [Inbox, CalendarCheck2, Timer];
const rise = (delay: number) => ({ style: { animationDelay: `${delay}s` } });

function HeroCopy() {
  return (
    <div className="flex flex-col justify-center">
      <p {...rise(0.1)} className="sh-rise flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink-3">
        <span aria-hidden="true" className="sh-dot size-2 rounded-full bg-accent" />
        {HERO.eyebrow}
      </p>

      <h1 id="hero-title" {...rise(0.18)} className="sh-rise sh-h1 mt-7 font-medium text-ink">
        <span className="block">{HERO.title[0]}</span>
        <span className="block text-accent">{HERO.title[1]}</span>
      </h1>

      <p {...rise(0.3)} className="sh-rise mt-7 max-w-[32rem] text-pretty text-[17px] leading-[1.6] text-ink-2 lg:text-[19px]">
        {HERO.lede}
      </p>

      <div {...rise(0.4)} className="sh-rise mt-9 flex flex-wrap items-center gap-3">
        <a href={SITE.signUpUrl} className={buttonClass("primary", "lg", "sh-flip")}>
          <FlipLabel className="gap-2.5">
            Start free trial
            <ArrowRight className="size-[18px]" strokeWidth={2} aria-hidden="true" />
          </FlipLabel>
        </a>
        <a href="#product" className={buttonClass("quiet", "lg", "sh-flip")}>
          <FlipLabel className="gap-3">
            <span className="grid size-5 place-items-center rounded-full border border-ink">
              <Play className="size-2.5 fill-current" strokeWidth={0} aria-hidden="true" />
            </span>
            See how it works
          </FlipLabel>
        </a>
      </div>
      <p {...rise(0.46)} className="sh-rise mt-4 text-[14px] text-ink-3">
        {HERO.note}
      </p>

      <dl {...rise(0.58)} className="sh-rise mt-10 grid grid-cols-3 sm:flex sm:items-stretch lg:mt-16">
        {STATS.map(({ value, label }, i) => {
          const Icon = METRIC_ICONS[i] ?? Inbox;
          return (
            <div
              key={label}
              className={cx(
                "flex flex-col items-start gap-2 pr-3 sm:flex-row sm:items-center sm:gap-3 sm:pr-8",
                i > 0 && "border-l border-line-2 pl-4 sm:pl-8",
              )}
            >
              <Icon className="size-8 shrink-0 text-ink" strokeWidth={1.25} aria-hidden="true" />
              <div className="flex flex-col">
                <dd className="order-1 text-[15px] font-semibold leading-5 text-ink">{value}</dd>
                <dt className="order-2 text-[13px] leading-5 text-ink-3 sm:whitespace-nowrap">{label}</dt>
              </div>
            </div>
          );
        })}
      </dl>
    </div>
  );
}


/* ───────────── The section ───────────── */

export default function SyntraHero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="sh-hero sh-bg relative isolate overflow-x-clip">
      <HeroFloor />
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-5 pb-14 pt-6 sm:px-10 lg:min-h-[inherit] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:py-10 xl:gap-16">
        <HeroCopy />
        <BeRockerOS className="sh-enter mx-auto w-full max-w-[600px] lg:mx-0 lg:justify-self-end" />
      </div>
    </section>
  );
}
