"use client";

/*
  The hero: BeRocker as one isometric object. At rest it is three ceramic slabs with the
  BeRocker mark on top; hover it (tap on touch) and it opens into seven plates, one per
  module, each with a card beside it. Adapted from the Syntra hero (21st.dev), recoloured
  with the site tokens and rewritten around BeRocker's modules.

  Every colour is a token: SVG attributes use var(--color-*) and the CSS lives in globals.css.
*/

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { MouseEvent, PointerEvent as ReactPointerEvent, ReactNode, SVGProps } from "react";
import { LazyMotion, animate, domAnimation, m, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import {
  ArrowRight,
  Bot,
  Calculator,
  CalendarCheck2,
  Inbox,
  MessageSquareText,
  MousePointer2,
  PenLine,
  Play,
  Plug,
  Share2,
  Tag,
  Timer,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { FlipLabel, buttonClass } from "@/components/ui";
import { HERO, SITE, STATS } from "@/lib/content";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const C = (name: string) => `var(--color-${name})`;

/* ───────────── Geometry: one 2:1 isometric projection for every face ───────────── */

const ISO_X = 0.866;
const ISO_Y = 0.5;
const CX = 500;
const CY = 500;
const RING_FLATTEN = 0.57;
const RING_RX = [400, 530] as const;
const ARTBOARD = 1000;

type Slab = { half: number; radius: number; top: number; depth: number };
type Point = [number, number];

const BASE: Slab = { half: 168, radius: 40, top: 475, depth: 34 };
const SEAM_GAP = 9;
const MID: Slab = { half: 151, radius: 36, top: BASE.top - SEAM_GAP - 28, depth: 28 };
const CAP: Slab = { half: 101, radius: 28, top: MID.top - 14, depth: 14 };

// Server and browser can disagree in the last float digit, which React reports as a hydration mismatch.
const round = (n: number) => Math.round(n * 100) / 100;

const project = (x: number, y: number, cx = CX, cy = CY): Point => [cx + (x - y) * ISO_X, cy + (x + y) * ISO_Y];

const footprint = (half: number, radius: number, steps = 14): Point[] => {
  const r = Math.min(radius, half);
  const c = half - r;
  const corners: [number, number, number][] = [
    [c, c, 0],
    [-c, c, 90],
    [-c, -c, 180],
    [c, -c, 270],
  ];
  const pts: Point[] = [];
  for (const [ox, oy, start] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = ((start + (90 * i) / steps) * Math.PI) / 180;
      pts.push([ox + r * Math.cos(a), oy + r * Math.sin(a)]);
    }
  }
  return pts;
};

const toPath = (pts: Point[]) => `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`;

const topPath = (slab: Slab, inset = 0, cx = CX, dy = 0) => {
  const half = slab.half - inset;
  const radius = Math.max(slab.radius - inset, 1);
  return toPath(footprint(half, radius).map(([x, y]) => project(x, y, cx, slab.top + dy)));
};

const hull = (points: Point[]): Point[] => {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Point, a: Point, b: Point) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const build = (list: Point[]) => {
    const out: Point[] = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  return [...build(pts), ...build([...pts].reverse())];
};

const bodyPath = (slab: Slab, inset = 0) => {
  const half = slab.half - inset;
  const radius = Math.max(slab.radius - inset, 1);
  const outline = footprint(half, radius);
  const upper = outline.map(([x, y]) => project(x, y, CX, slab.top));
  const lower = outline.map(([x, y]) => project(x, y, CX, slab.top + slab.depth));
  return toPath(hull([...upper, ...lower]));
};

const facePoint = (slab: Slab, side: "left" | "right", u: number, v: number): Point => {
  const { half, top, depth } = slab;
  if (side === "left") {
    const [x, y] = project(-half + 2 * half * u, half, CX, top);
    return [x, y + depth * v];
  }
  const [x, y] = project(half, half - 2 * half * u, CX, top);
  return [x, y + depth * v];
};

const FACE_MATRIX = {
  left: `${ISO_X} ${ISO_Y} 0 1`,
  right: `${ISO_X} ${-ISO_Y} 0 1`,
  top: `${ISO_X} ${ISO_Y} ${-ISO_X} ${ISO_Y}`,
};

const ringPoint = (rx: number, angleDeg: number): Point => {
  const a = (angleDeg * Math.PI) / 180;
  return [round(CX + rx * Math.cos(a)), round(CY + rx * RING_FLATTEN * Math.sin(a))];
};

const ringPath = (rx: number) => {
  const ry = rx * RING_FLATTEN;
  return `M${CX + rx} ${CY}A${rx} ${ry} 0 1 1 ${CX - rx} ${CY}A${rx} ${ry} 0 1 1 ${CX + rx} ${CY}Z`;
};

/* ───────────── The modules: seven plates, bottom to top ───────────── */

type App = { name: string; src?: string; Icon?: LucideIcon };

type Stage = {
  title: string;
  items: string[];
  side: "left" | "right";
  icon?: LucideIcon;
  main?: boolean;
  apps?: App[];
};

const STAGES: Stage[] = [
  { title: "Lead Management", items: ["Every source", "One inbox", "The right rep"], icon: Inbox, side: "right" },
  {
    title: "Loadboards",
    items: ["Super Dispatch", "Central Dispatch", "One click"],
    icon: Share2,
    side: "left",
    apps: [{ name: "Super Dispatch", src: "/img/super-dispatch-mark.svg" }],
  },
  { title: "Dispatch", items: ["Carrier offers", "Dispatch", "Tracking"], icon: Truck, side: "right" },
  {
    title: "AI agents",
    items: ["Answer customers", "Price leads", "Draft follow-ups"],
    side: "left",
    main: true,
    apps: [
      { name: "Answers customers", Icon: MessageSquareText },
      { name: "Prices leads", Icon: Tag },
      { name: "Drafts follow-ups", Icon: PenLine },
    ],
  },
  { title: "Accounting", items: ["Payments", "Carrier payables", "Commissions"], icon: Calculator, side: "right" },
  { title: "Integrations", items: ["Phones", "Email", "Payments", "API"], icon: Plug, side: "left" },
  {
    title: "ChatGPT and Claude",
    items: ["Ask your CRM in plain words"],
    icon: Bot,
    side: "right",
    apps: [
      { name: "ChatGPT", src: "/img/brands/openai.svg" },
      { name: "Claude", src: "/img/brands/claude.svg" },
    ],
  },
];

const MOTION = {
  tiltDegrees: 3.5,
  ringParallax: 12,
  backdropParallax: 5,
  orbitSeconds: [70, 95],
  orbitOpenOpacity: 0.15,
};

const EXPLODE = {
  spring: { stiffness: 105, damping: 25, mass: 1 },
  gap: 80,
  aiLift: 12,
  topPlateY: 200,
  stagger: 0.05,
  // Chosen so every plate's corner sits about the same distance from the centre.
  scales: [0.63, 0.63, 0.63, 0.7, 1.05, 1.05, 1.05],
};

const STAGE_CARDS = {
  left: { edge: -2, width: 31 },
  right: { edge: 0, width: 29 },
  restInset: 10,
  outward: 2,
  beadSeconds: 1.6,
};

// The base slab is three plates, the mid slab is the AI plate, the cap is three.
const PLATE_SLABS: Slab[] = [
  { ...BASE, top: BASE.top + 23, depth: 11 },
  { ...BASE, top: BASE.top + 12, depth: 11 },
  { ...BASE, top: BASE.top, depth: 12 },
  MID,
  { ...CAP, top: CAP.top + 10, depth: 4 },
  { ...CAP, top: CAP.top + 5, depth: 5 },
  { ...CAP, top: CAP.top, depth: 5 },
];
const AI_PLATE = 3;
const LAST = PLATE_SLABS.length - 1;

const TARGET_TOPS = PLATE_SLABS.map(
  (_, i) => EXPLODE.topPlateY + (LAST - i) * EXPLODE.gap - (i === AI_PLATE ? EXPLODE.aiLift : 0),
);
const TRAVEL = PLATE_SLABS.map((slab, i) => TARGET_TOPS[i] - slab.top);
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const plateProgress = (i: number, p: number) => {
  const delay = Math.abs(i - AI_PLATE) * EXPLODE.stagger;
  return clamp((p - delay) / (1 - delay));
};
const plateY = (i: number, p: number) => TRAVEL[i] * plateProgress(i, p);
const plateScale = (i: number, p: number) => 1 + (EXPLODE.scales[i] - 1) * plateProgress(i, p);
const tipOffset = (i: number) => {
  const { half, radius } = PLATE_SLABS[i];
  return 0.866 * (2 * half - 0.586 * radius) * EXPLODE.scales[i];
};
const tipX = (i: number, side: "left" | "right") => CX + (side === "right" ? 1 : -1) * tipOffset(i);
const cornerY = (i: number) => TARGET_TOPS[i] + PLATE_SLABS[i].depth / 2;

/* ───────────── Ceramic parts ───────────── */

function FaceMark({
  slab,
  side,
  u,
  v,
  w,
  h,
  fill,
  glow,
}: {
  slab: Slab;
  side: "left" | "right";
  u: number;
  v: number;
  w: number;
  h: number;
  fill: string;
  glow?: boolean;
}) {
  const [x, y] = facePoint(slab, side, u, v);
  return (
    <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) matrix(${FACE_MATRIX[side]} 0 0)`}>
      {glow && <rect x={-w / 2 - 2} y={-h / 2 - 3} width={w + 4} height={h + 6} rx={h} fill={fill} filter="url(#sh-blur-sm)" opacity="0.75" />}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={fill} />
    </g>
  );
}

function PanelLine({ slab, side, v, from = 0.14, to = 0.86 }: { slab: Slab; side: "left" | "right"; v: number; from?: number; to?: number }) {
  const [x1, y1] = facePoint(slab, side, from, v);
  const [x2, y2] = facePoint(slab, side, to, v);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C("mist")} strokeWidth="0.9" opacity="0.6" />;
}

function Fastener({ slab, x, y }: { slab: Slab; x: number; y: number }) {
  const [px, py] = project(x, y, CX, slab.top);
  return (
    <g transform={`translate(${px.toFixed(2)} ${py.toFixed(2)}) matrix(${FACE_MATRIX.top} 0 0)`}>
      <circle r="6.5" fill="url(#sh-hole)" stroke={C("line-2")} strokeWidth="1" />
    </g>
  );
}

function SlabBody({ slab }: { slab: Slab }) {
  return (
    <g>
      <path d={bodyPath(slab)} fill="url(#sh-side)" />
      <path d={bodyPath(slab)} fill="url(#sh-side-shade)" />
      <path d={bodyPath(slab)} fill="none" stroke={C("line-2")} strokeWidth="1" opacity="0.9" />
    </g>
  );
}

function SlabTop({ slab, groove }: { slab: Slab; groove?: number }) {
  return (
    <g>
      <path d={topPath(slab)} fill="url(#sh-bevel)" stroke={C("line-2")} strokeWidth="1" />
      <path d={topPath(slab, 4.5)} fill="url(#sh-top)" stroke={C("white")} strokeWidth="1" />
      {groove !== undefined && <path d={topPath(slab, groove)} fill="none" stroke={C("line-2")} strokeWidth="1.2" />}
    </g>
  );
}

function Inlay({ slab }: { slab: Slab }) {
  return (
    <>
      <path d={topPath(slab, 19)} fill="url(#sh-inlay)" stroke={C("line")} strokeWidth="1.2" />
      <path d={topPath(slab, 20.5)} fill="none" stroke={C("white")} strokeWidth="1" opacity="0.9" />
    </>
  );
}

// The BeRocker mark, centred on the origin (its own box is 4..56 by 9..37).
const MARK_LEFT =
  "M16.7808 10.6203L5.33263 21.9496C4.77196 22.5045 4.77042 23.4098 5.32919 23.9665L16.2133 34.8114C16.7599 35.356 17.6412 35.365 18.1987 34.8317L22.716 30.5107C23.2928 29.959 23.3022 29.0404 22.7367 28.477L18.2273 23.9838C17.6619 23.4204 17.6712 22.5019 18.2481 21.9501L22.7856 17.6098C23.335 17.0842 24.2008 17.0842 24.7503 17.6098L29.3508 22.0103C29.9029 22.5385 30.7738 22.5355 31.3224 22.0037L35.7857 17.6766C36.3562 17.1236 36.3624 16.2103 35.7996 15.6495L30.7557 10.6237C30.4893 10.3583 30.1286 10.2093 29.7526 10.2093H17.7805C17.4061 10.2093 17.0469 10.357 16.7808 10.6203Z";
const MARK_RIGHT =
  "M43.7235 35.3797L55.1717 24.0504C55.7323 23.4956 55.7339 22.5903 55.1751 22.0335L44.291 11.1886C43.7444 10.644 42.8631 10.635 42.3055 11.1684L37.7883 15.4893C37.2115 16.0411 37.2021 16.9596 37.7676 17.523L42.277 22.0162C42.8424 22.5796 42.8331 23.4982 42.2562 24.0499L37.7187 28.3902C37.1693 28.9158 36.3034 28.9158 35.754 28.3902L31.1535 23.9897C30.6014 23.4616 29.7305 23.4645 29.1819 23.9963L24.7186 28.3234C24.1481 28.8765 24.1418 29.7898 24.7047 30.3506L29.7486 35.3763C30.015 35.6417 30.3757 35.7908 30.7517 35.7908H42.7238C43.0982 35.7908 43.4574 35.6431 43.7235 35.3797Z";
const LOGO_LAYERS = 6;
const LOGO_SCALE = 1.5;

/** The mark as a small solid object standing on the cap: a stepped extrusion and a crisp top. */
function CoreLogo({ x, y }: { x: number; y: number }) {
  const plane = (lift: number) =>
    `translate(${x} ${y - lift}) matrix(${FACE_MATRIX.top} 0 0) rotate(-45) scale(${LOGO_SCALE}) translate(-30.25 -23)`;
  return (
    <g>
      <g transform={`${plane(0)} translate(2 2)`} opacity="0.25" filter="url(#sh-blur-sm)">
        <path d={MARK_LEFT} fill={C("ink-2")} />
        <path d={MARK_RIGHT} fill={C("ink-2")} />
      </g>
      {Array.from({ length: LOGO_LAYERS }, (_, k) => (
        <g key={k} transform={plane(k)}>
          <path d={MARK_LEFT} fill={C("navy")} />
          <path d={MARK_RIGHT} fill={C("accent-ink")} />
        </g>
      ))}
      <g transform={plane(LOGO_LAYERS)}>
        <path d={MARK_LEFT} fill={C("ink")} />
        <path d={MARK_RIGHT} fill={C("accent")} />
      </g>
    </g>
  );
}

function CoreDefs() {
  return (
    <defs>
      <linearGradient id="sh-side" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C("page")} />
        <stop offset="0.46" stopColor={C("page-2")} />
        <stop offset="0.5" stopColor={C("line-2")} />
        <stop offset="1" stopColor={C("line")} />
      </linearGradient>
      <linearGradient id="sh-side-shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.45" stopColor={C("ink-3")} stopOpacity="0" />
        <stop offset="1" stopColor={C("ink-3")} stopOpacity="0.16" />
      </linearGradient>
      <linearGradient id="sh-bevel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C("white")} />
        <stop offset="1" stopColor={C("page-2")} />
      </linearGradient>
      <linearGradient id="sh-top" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stopColor={C("white")} />
        <stop offset="1" stopColor={C("page")} />
      </linearGradient>
      <linearGradient id="sh-inlay" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C("fill")} />
        <stop offset="1" stopColor={C("white")} />
      </linearGradient>
      <linearGradient id="sh-seam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C("accent-line")} />
        <stop offset="0.5" stopColor={C("accent")} />
        <stop offset="1" stopColor={C("accent-line")} />
      </linearGradient>
      <linearGradient id="sh-slot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C("ink-2")} />
        <stop offset="1" stopColor={C("ink-3")} />
      </linearGradient>
      <radialGradient id="sh-hole" cx="0.5" cy="0.4" r="0.7">
        <stop offset="0" stopColor={C("line-2")} />
        <stop offset="1" stopColor={C("page")} />
      </radialGradient>
      <filter id="sh-blur-sm" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
      <filter id="sh-blur-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
      <filter id="sh-blur-spill" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
    </defs>
  );
}

const SEAM: Slab = { half: MID.half - 2, radius: MID.radius - 2, top: MID.top + MID.depth - 1, depth: SEAM_GAP + 1 };

function MidDetails() {
  return (
    <>
      <PanelLine slab={MID} side="left" v={0.78} />
      <PanelLine slab={MID} side="right" v={0.78} />
      <FaceMark slab={MID} side="left" u={0.62} v={0.42} w={34} h={7.5} fill="url(#sh-slot)" />
      <FaceMark slab={MID} side="left" u={0.34} v={0.42} w={5} h={5} fill="url(#sh-slot)" />
      <FaceMark slab={MID} side="left" u={0.42} v={0.42} w={5} h={5} fill="url(#sh-slot)" />
      <FaceMark slab={MID} side="right" u={0.44} v={0.42} w={5} h={5} fill="url(#sh-slot)" />
      <FaceMark slab={MID} side="right" u={0.52} v={0.42} w={5} h={5} fill="url(#sh-slot)" />
      <FaceMark slab={MID} side="right" u={0.68} v={0.42} w={22} h={4.5} fill="url(#sh-slot)" />
      <g className="sh-seam-pulse">
        <FaceMark slab={MID} side="left" u={0.2} v={0.42} w={7} h={2.6} fill={C("accent")} glow />
      </g>
      <Fastener slab={MID} x={0} y={-MID.half + 28} />
      <Fastener slab={MID} x={-MID.half + 28} y={0} />
      <Fastener slab={MID} x={MID.half - 28} y={0} />
      <Fastener slab={MID} x={0} y={MID.half - 28} />
    </>
  );
}

function BaseSlots({ slab }: { slab: Slab }) {
  return (
    <>
      {[0.5, 0.58, 0.66].map((u) => (
        <FaceMark key={`r${u}`} slab={slab} side="right" u={u} v={0.5} w={4.5} h={4.5} fill="url(#sh-slot)" />
      ))}
      {[0.32, 0.4].map((u) => (
        <FaceMark key={`l${u}`} slab={slab} side="left" u={u} v={0.5} w={4.5} h={4.5} fill="url(#sh-slot)" />
      ))}
    </>
  );
}

/** The core at rest: base, mid and cap, a light seam between base and mid, the mark on top. */
function CoreObject(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1000 1000" role="img" aria-label="BeRocker, one platform" {...props}>
      <CoreDefs />
      <SlabBody slab={BASE} />
      <SlabTop slab={BASE} groove={10} />
      <PanelLine slab={BASE} side="left" v={0.3} />
      <PanelLine slab={BASE} side="right" v={0.3} />
      <BaseSlots slab={{ ...BASE, top: BASE.top + 11, depth: 23 }} />

      <g className="sh-seam-pulse">
        <path d={topPath(MID, 4, CX, BASE.top - MID.top)} fill={C("accent")} opacity="0.22" filter="url(#sh-blur-spill)" />
        <path d={bodyPath(SEAM)} fill={C("accent")} opacity="0.55" filter="url(#sh-blur-glow)" />
      </g>
      <path d={bodyPath(SEAM)} fill="url(#sh-seam)" />

      <SlabBody slab={MID} />
      <SlabTop slab={MID} groove={11} />
      <MidDetails />

      <SlabBody slab={CAP} />
      <SlabTop slab={CAP} />
      <Inlay slab={CAP} />
      <CoreLogo x={CX} y={CAP.top} />
    </svg>
  );
}

function CoreShadow(props: SVGProps<SVGSVGElement>) {
  const floor = { ...BASE, top: BASE.top + BASE.depth + 30 };
  return (
    <svg viewBox="0 0 1000 1000" aria-hidden="true" {...props}>
      <defs>
        <filter id="sh-blur-lg" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id="sh-blur-md" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <path d={topPath(floor, -14)} fill={C("ink-3")} opacity="0.2" filter="url(#sh-blur-lg)" />
      <path d={topPath(floor, 6)} fill={C("ink-2")} opacity="0.22" filter="url(#sh-blur-md)" />
    </svg>
  );
}

const NODES: [number, number][] = [
  [118, 132],
  [318, 82],
  [690, 96],
  [884, 188],
  [936, 470],
  [70, 512],
  [150, 858],
  [850, 846],
];

function DepthBackdrop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1000 1000" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="sh-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C("white")} stopOpacity="0.7" />
          <stop offset="1" stopColor={C("white")} stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <g fill="url(#sh-glass)" stroke={C("line")} strokeWidth="1" opacity="0.4">
        <rect width="290" height="250" rx="22" transform="matrix(0.866 -0.5 0 1 232 300)" />
        <rect width="290" height="250" rx="22" transform="matrix(0.866 0.5 0 1 520 150)" />
      </g>
      <g fill={C("white")} stroke={C("line-2")} strokeWidth="1">
        {NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 4 : 3} opacity="0.85" />
        ))}
      </g>
    </svg>
  );
}

const DOTS = Array.from({ length: 26 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  const r = 160 + ((i * 53) % 340);
  return [round(CX + r * Math.cos(a) * 1.02), round(CY + r * Math.sin(a) * RING_FLATTEN * 1.6), 0.8 + (i % 3) * 0.5] as const;
});

function TechnicalBackdrop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1000 1000" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="sh-axis-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C("mist")} stopOpacity="0" />
          <stop offset="0.5" stopColor={C("mist")} stopOpacity="0.45" />
          <stop offset="1" stopColor={C("mist")} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sh-axis-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C("mist")} stopOpacity="0" />
          <stop offset="0.5" stopColor={C("mist")} stopOpacity="0.7" />
          <stop offset="1" stopColor={C("mist")} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={CX - 0.5} y="110" width="1" height="780" fill="url(#sh-axis-v)" />
      <rect x="70" y={CY - 0.5} width="860" height="1" fill="url(#sh-axis-h)" />
      <g fill={C("mist")}>
        {DOTS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} opacity={0.35 + (i % 4) * 0.12} />
        ))}
      </g>
      <g stroke={C("mist")} strokeWidth="1" opacity="0.5">
        {(
          [
            [212, 292],
            [790, 690],
            [860, 430],
            [150, 560],
          ] as const
        ).map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x - 5} ${y}h10M${x} ${y - 5}v10`} />
        ))}
      </g>
    </svg>
  );
}

function OrbitalSystem(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1000 1000" aria-hidden="true" {...props}>
      <g fill="none" stroke={C("line-2")} strokeWidth="1">
        <ellipse cx={CX} cy={CY} rx={RING_RX[0]} ry={RING_RX[0] * RING_FLATTEN} opacity="0.9" />
        <ellipse cx={CX} cy={CY} rx={RING_RX[1]} ry={RING_RX[1] * RING_FLATTEN} opacity="0.7" />
      </g>
    </svg>
  );
}

const BEADS: { ring: 0 | 1; angle: number; size: number }[] = [
  { ring: 0, angle: 20, size: 7 },
  { ring: 0, angle: 110, size: 5.5 },
  { ring: 0, angle: 200, size: 8 },
  { ring: 0, angle: 290, size: 6 },
  { ring: 1, angle: 60, size: 6 },
  { ring: 1, angle: 132, size: 8 },
  { ring: 1, angle: 204, size: 5.5 },
  { ring: 1, angle: 276, size: 7 },
  { ring: 1, angle: 348, size: 6.5 },
];

/** A small bead of blue glass: light at the upper left, deep blue at the lower right. */
function Crystal({ size }: { size: number }) {
  return (
    <g filter="url(#sh-crystal-shadow)">
      <circle r={size * 1.55} fill="url(#sh-crystal-halo)" />
      <circle r={size} fill="url(#sh-crystal-body)" />
      <circle r={size} fill="url(#sh-crystal-refract)" />
      <circle r={size - 0.5} fill="none" stroke="url(#sh-crystal-rim)" strokeWidth="1" />
      <ellipse
        cx={-size * 0.32}
        cy={-size * 0.4}
        rx={size * 0.36}
        ry={size * 0.2}
        transform={`rotate(-30 ${-size * 0.32} ${-size * 0.4})`}
        fill={C("white")}
        opacity="0.95"
      />
    </g>
  );
}

/** Beads drawn twice, behind and in front of the core, each clipped to its half of the artboard. */
function Particles({ half, animate: run, paused = false, ...props }: SVGProps<SVGSVGElement> & { half: "back" | "front"; animate: boolean; paused?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const clipId = `sh-clip-${half}`;

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (paused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [paused]);

  return (
    <svg ref={ref} viewBox="0 0 1000 1000" aria-hidden="true" {...props}>
      <defs>
        <clipPath id={clipId}>
          {half === "back" ? <rect x="-200" y="-200" width="1400" height={CY + 200} /> : <rect x="-200" y={CY} width="1400" height="700" />}
        </clipPath>
        <linearGradient id={`sh-crystal-body`} x1="0.15" y1="0.1" x2="0.85" y2="0.95">
          <stop offset="0" stopColor={C("accent-soft")} stopOpacity="0.95" />
          <stop offset="0.5" stopColor={C("accent-line")} stopOpacity="0.95" />
          <stop offset="1" stopColor={C("accent")} stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="sh-crystal-refract" cx="0.6" cy="0.78" r="0.45">
          <stop offset="0" stopColor={C("white")} stopOpacity="0.8" />
          <stop offset="1" stopColor={C("white")} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sh-crystal-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C("white")} stopOpacity="0.95" />
          <stop offset="1" stopColor={C("accent-ink")} stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="sh-crystal-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.5" stopColor={C("accent")} stopOpacity="0.12" />
          <stop offset="1" stopColor={C("accent")} stopOpacity="0" />
        </radialGradient>
        <filter id="sh-crystal-shadow" x="-80%" y="-80%" width="260%" height="260%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor={C("accent-ink")} floodOpacity="0.25" />
        </filter>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {BEADS.map((node, i) => {
          const rx = RING_RX[node.ring];
          const [x, y] = ringPoint(rx, node.angle);
          const dur = MOTION.orbitSeconds[node.ring];
          const reverse = node.ring === 1;
          const start = node.angle / 360;
          const begin = -dur * (reverse ? 1 - start : start);
          return (
            <g key={i} transform={run ? undefined : `translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <Crystal size={node.size} />
              {run && (
                <animateMotion
                  dur={`${dur}s`}
                  begin={`${begin}s`}
                  repeatCount="indefinite"
                  path={ringPath(rx)}
                  {...(reverse && { keyPoints: "1;0", keyTimes: "0;1", calcMode: "linear" })}
                />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ───────────── The exploded core ───────────── */

// Extra side thickness each plate grows once apart, so the thin plates read as solid.
const SKIRT = [0, 4, 4, 0, 10, 10, 10];

function Plate({ index, progress, children }: { index: number; progress: MotionValue<number>; children: ReactNode }) {
  const y = useTransform(progress, (v) => plateY(index, v));
  const scale = useTransform(progress, (v) => plateScale(index, v));
  const apart = useTransform(progress, (v) => plateProgress(index, v));
  const shadow = useTransform(apart, (v) => v * 0.16);
  const slab = PLATE_SLABS[index];
  const skirt = SKIRT[index];

  return (
    <m.g style={{ y, scale }}>
      {index > 0 && <m.path d={topPath(slab, -6, CX, slab.depth + 34)} fill={C("ink-2")} filter="url(#sh-blur-spill)" style={{ opacity: shadow }} />}
      {skirt > 0 && (
        <m.g style={{ opacity: apart }}>
          <SlabBody slab={{ ...slab, top: slab.top + slab.depth - 1, depth: skirt + 1 }} />
        </m.g>
      )}
      {children}
    </m.g>
  );
}

/** The plate's number, engraved flat into its top face near the front corner. */
function PlateNumber({ slab, n, main = false }: { slab: Slab; n: number; main?: boolean }) {
  const k = slab.half * 0.56;
  const [x, y] = project(k, k, CX, slab.top);
  const plane = `matrix(${FACE_MATRIX.top} 0 0) rotate(-45)`;
  const label = String(n).padStart(2, "0");
  const text = { textAnchor: "middle" as const, dominantBaseline: "central" as const, fontSize: 25, fontWeight: 600, letterSpacing: 2.5 };
  return (
    <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`} aria-hidden="true">
      <text {...text} transform={`translate(0 0.9) ${plane}`} fill={C("white")} opacity="0.95">
        {label}
      </text>
      <text {...text} transform={plane} fill={main ? C("accent") : C("mist")}>
        {label}
      </text>
    </g>
  );
}

function AiEmphasis({ progress }: { progress: MotionValue<number> }) {
  const on = useTransform(progress, (v) => clamp((v - 0.5) / 0.4));
  const rim = useTransform(on, (v) => v * 0.9);
  const halo = useTransform(on, (v) => v * 0.55);
  const spill = useTransform(halo, (v) => v * 0.35);
  return (
    <g transform={`translate(${CX} ${MID.top}) matrix(${FACE_MATRIX.top} 0 0)`}>
      <m.circle r="86" fill={C("accent")} filter="url(#sh-blur-spill)" style={{ opacity: spill }} />
      <m.circle r="56" fill="none" stroke={C("accent")} strokeWidth="1.4" style={{ opacity: rim }} />
      <m.circle r="38" fill="none" stroke={C("accent")} strokeWidth="1" strokeDasharray="3 6" style={{ opacity: halo }} />
      <m.circle r="9" fill={C("accent")} style={{ opacity: rim }} />
    </g>
  );
}

function ExplodedCore({ progress, ...props }: SVGProps<SVGSVGElement> & { progress: MotionValue<number> }) {
  const strongGlow = useTransform(progress, (v) => clamp((v - 0.4) / 0.5) * 0.6);
  return (
    <svg viewBox="0 0 1000 1000" aria-hidden="true" {...props}>
      <CoreDefs />
      {[0, 1, 2].map((i) => (
        <Plate key={i} index={i} progress={progress}>
          <SlabBody slab={PLATE_SLABS[i]} />
          <SlabTop slab={PLATE_SLABS[i]} groove={10} />
          <PlateNumber slab={PLATE_SLABS[i]} n={i + 1} />
          {i === 0 && <BaseSlots slab={PLATE_SLABS[0]} />}
          {i === 2 && (
            <>
              <PanelLine slab={PLATE_SLABS[2]} side="left" v={0.5} />
              <PanelLine slab={PLATE_SLABS[2]} side="right" v={0.5} />
            </>
          )}
        </Plate>
      ))}

      <Plate index={AI_PLATE} progress={progress}>
        <g className="sh-seam-pulse">
          <path d={topPath(MID, 4, CX, BASE.top - MID.top)} fill={C("accent")} opacity="0.22" filter="url(#sh-blur-spill)" />
          <path d={bodyPath(SEAM)} fill={C("accent")} opacity="0.55" filter="url(#sh-blur-glow)" />
        </g>
        <m.path d={bodyPath(SEAM)} fill={C("accent")} filter="url(#sh-blur-glow)" style={{ opacity: strongGlow }} />
        <path d={bodyPath(SEAM)} fill="url(#sh-seam)" />
        <SlabBody slab={MID} />
        <SlabTop slab={MID} groove={11} />
        <PlateNumber slab={MID} n={AI_PLATE + 1} main />
        <MidDetails />
        <AiEmphasis progress={progress} />
      </Plate>

      {[4, 5].map((i) => (
        <Plate key={i} index={i} progress={progress}>
          <SlabBody slab={PLATE_SLABS[i]} />
          <SlabTop slab={PLATE_SLABS[i]} />
          <Inlay slab={PLATE_SLABS[i]} />
          <PlateNumber slab={PLATE_SLABS[i]} n={i + 1} />
        </Plate>
      ))}

      <Plate index={LAST} progress={progress}>
        <SlabBody slab={PLATE_SLABS[LAST]} />
        <SlabTop slab={PLATE_SLABS[LAST]} />
        <Inlay slab={CAP} />
        <CoreLogo x={CX} y={CAP.top} />
      </Plate>
    </svg>
  );
}

/* ───────────── Module cards and their connectors ───────────── */

function AppMarks({ stage, tiles, className }: { stage: Stage; tiles: boolean; className?: string }) {
  if (!stage.apps?.length) return null;
  return (
    <div className={cx("sh-stage-apps flex shrink-0 items-center", tiles ? "gap-[0.45em]" : "gap-[0.35em]", className)}>
      {stage.apps.map((app) => {
        const mark = app.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={app.src} alt="" width={20} height={20} className={tiles ? "size-[1.2em]" : "size-[1.45em]"} />
        ) : app.Icon ? (
          <app.Icon aria-hidden="true" className="size-[1.15em] text-accent" strokeWidth={1.8} />
        ) : null;
        return tiles ? (
          <span key={app.name} className="grid size-[2.15em] place-items-center rounded-[0.6em] border border-line-2 bg-card shadow-quiet">
            {mark}
          </span>
        ) : (
          <span key={app.name}>{mark}</span>
        );
      })}
      <span className="sr-only">With {stage.apps.map((a) => a.name).join(", ")}</span>
    </div>
  );
}

function StageCardBody({ index }: { index: number }) {
  const stage = STAGES[index];
  const main = !!stage.main;
  const Icon = stage.icon;
  return (
    <div className="grid grid-cols-[1.35em_minmax(0,1fr)_auto] items-start gap-x-[0.5em]">
      <span className="col-start-1 row-start-1 flex h-[1.64em] items-center text-[0.8em] font-semibold tabular-nums text-ink-3">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className={cx("col-start-2 row-start-1 flex flex-wrap items-baseline justify-between gap-x-[0.6em]", main && "col-span-2")}>
        <p className="text-[1.05em] font-semibold leading-[1.25] tracking-[-0.015em] text-ink md:whitespace-nowrap">{stage.title}</p>
        {main && <span className="shrink-0 text-[0.72em] font-bold uppercase tracking-[0.12em] text-accent">Foundation</span>}
      </div>
      {Icon && (
        <span className="col-start-1 row-start-2 mt-[0.4em] flex h-[1.276em] items-center">
          <Icon className="size-[1.2em] text-accent" strokeWidth={1.8} aria-hidden="true" />
        </span>
      )}
      <div className={cx("col-start-2 row-start-2 mt-[0.4em]", main && "col-span-2")}>
        <p className="text-[0.88em] leading-[1.45] text-ink-2">{stage.items.join(" · ")}</p>
        {main && <AppMarks stage={stage} tiles className="mt-[0.75em] justify-end" />}
      </div>
      {!main && <AppMarks stage={stage} tiles={false} className="col-start-3 row-span-2 row-start-1 self-center" />}
    </div>
  );
}

const pct = (n: number) => `${(n / ARTBOARD) * 100}%`;
const cardDirection = (index: number) => (STAGES[index].side === "left" ? -1 : 1);

function StageCard({
  index,
  progress,
  open,
  lit,
  onHover,
}: {
  index: number;
  progress: MotionValue<number>;
  open: boolean;
  lit: boolean;
  onHover: (index: number | null) => void;
}) {
  const opacity = useTransform(progress, [0.35, 0.9], [0, 1]);
  const x = useTransform(progress, [0, 1], [-cardDirection(index) * STAGE_CARDS.restInset, cardDirection(index) * STAGE_CARDS.outward]);
  const stage = STAGES[index];
  const { edge, width } = STAGE_CARDS[stage.side];
  const left = stage.side === "left" ? edge : 100 - edge - width;

  return (
    <li style={{ top: pct(cornerY(index)), left: `${left}%`, width: `${width}%` }} className="absolute -translate-y-1/2">
      <m.div
        style={{ opacity, x }}
        onPointerEnter={(e: ReactPointerEvent) => e.pointerType === "mouse" && onHover(index)}
        onPointerLeave={() => onHover(null)}
        className={cx("sh-stage-card px-[0.9em] py-[0.8em]", open && "pointer-events-auto", lit && "sh-stage-card-lit")}
      >
        <StageCardBody index={index} />
      </m.div>
    </li>
  );
}

function StageCards({
  progress,
  open,
  hovered,
  onHover,
}: {
  progress: MotionValue<number>;
  open: boolean;
  hovered: number | null;
  onHover: (index: number | null) => void;
}) {
  return (
    <ul
      aria-label="What is inside BeRocker"
      aria-hidden={!open}
      className="pointer-events-none absolute inset-0 m-0 hidden list-none p-0 text-[clamp(10.5px,1.8cqw,15px)] md:block"
    >
      {STAGES.map((stage, i) => (
        <StageCard key={stage.title} index={i} progress={progress} open={open} lit={hovered === i} onHover={onHover} />
      ))}
    </ul>
  );
}

const lineEnds = (plate: number, card: number, side: "left" | "right") => {
  const dir = side === "right" ? 1 : -1;
  return { plateX: plate + dir * 7, nodeX: card - dir * 10 };
};

function StageConnector({
  plate,
  card,
  y,
  side,
  index,
  main,
  lit,
  active,
  progress,
}: {
  plate: number;
  card: number;
  y: number;
  side: "left" | "right";
  index: number;
  main: boolean;
  lit: boolean;
  active: boolean;
  progress: MotionValue<number>;
}) {
  const show = useTransform(progress, [0.55, 0.9], [0, 1]);
  const t = useMotionValue(0);
  const { plateX, nodeX } = lineEnds(plate, card, side);
  const beadX = useTransform(t, (k) => nodeX + (plateX - nodeX) * k);
  const beadOpacity = useTransform([t, show], ([k, s]: number[]) => s * Math.sin(Math.PI * k));

  useEffect(() => {
    if (!active) return;
    const controls = animate(t, [0, 1], {
      duration: STAGE_CARDS.beadSeconds,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1.4,
      delay: 0.5 + index * 0.25,
    });
    return () => {
      controls.stop();
      t.set(0);
    };
  }, [active, index, t]);

  return (
    <m.svg aria-hidden="true" viewBox={`0 0 ${ARTBOARD} ${ARTBOARD}`} style={{ opacity: show }} className="pointer-events-none absolute inset-0 size-full overflow-visible">
      <line x1={plateX} x2={nodeX} y1={y} y2={y} stroke={C("line-2")} strokeWidth="1" />
      <m.line
        x1={plateX}
        x2={nodeX}
        y1={y}
        y2={y}
        stroke={C("accent")}
        strokeWidth="1.2"
        initial={false}
        animate={{ opacity: lit ? 0.9 : 0 }}
        transition={{ duration: 0.25 }}
      />
      <circle cx={plateX} cy={y} r="2.6" fill={C("mist")} />
      <m.circle cx={nodeX} cy={y} r={main ? 10 : 8} fill={C("accent")} initial={false} animate={{ opacity: lit || main ? 0.22 : 0.12 }} transition={{ duration: 0.25 }} />
      <circle cx={nodeX} cy={y} r="3.6" fill={C("accent")} />
      <m.circle cx={beadX} cy={y} r="2.6" fill={C("accent")} style={{ opacity: beadOpacity }} />
    </m.svg>
  );
}

function StageConnectors({ progress, active, hovered }: { progress: MotionValue<number>; active: boolean; hovered: number | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {STAGES.map((stage, i) => {
        const { edge, width } = STAGE_CARDS[stage.side];
        const cardEdge = stage.side === "left" ? (edge + width) * 10 : (100 - edge - width) * 10;
        return (
          <StageConnector
            key={stage.title}
            plate={tipX(i, stage.side)}
            card={cardEdge}
            y={cornerY(i)}
            side={stage.side}
            index={i}
            main={!!stage.main}
            lit={hovered === i}
            active={active}
            progress={progress}
          />
        );
      })}
    </div>
  );
}

// On a phone the visual is too narrow for cards beside it, so they sit below it as a list.
function StageList({ reduce }: { reduce: boolean }) {
  return (
    <m.ul
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label="What is inside BeRocker"
      className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 text-[13px] sm:grid-cols-2 md:hidden"
    >
      {STAGES.map((stage, i) => (
        <li key={stage.title} className={cx("sh-stage-card px-[1.05em] py-[0.95em]", stage.main && "sm:col-span-2")}>
          <StageCardBody index={i} />
        </li>
      ))}
    </m.ul>
  );
}

/* ───────────── The visual ───────────── */

const subscribeToVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};
const isPageVisible = () => !document.hidden;
const isPageVisibleOnServer = () => true;
const noopSubscribe = () => () => {};

// False on the server and during hydration, true after: anything that depends on the visitor's
// motion setting waits for it, so the first client render matches the server HTML.
const useHydrated = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

function ParallaxLayer({ x, y, reach, children }: { x: MotionValue<number>; y: MotionValue<number>; reach: number; children: ReactNode }) {
  const tx = useTransform(x, (v) => v * reach);
  const ty = useTransform(y, (v) => v * reach);
  return (
    <m.div style={{ x: tx, y: ty }} className="pointer-events-none absolute inset-0">
      {children}
    </m.div>
  );
}

function Tilted({ rotateX, rotateY, children }: { rotateX: MotionValue<number>; rotateY: MotionValue<number>; children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 [perspective:1400px]">
      <m.div style={{ rotateX, rotateY }} className="absolute inset-0">
        <div className="sh-float absolute inset-0">{children}</div>
      </m.div>
    </div>
  );
}

function CoreVisual() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const pointerType = useRef("mouse");
  const visualRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const prefersReduced = useReducedMotion() ?? false;
  const reduce = hydrated && prefersReduced;
  const onScreen = useInView(visualRef, { initial: true, margin: "40px" });
  const pageVisible = useSyncExternalStore(subscribeToVisibility, isPageVisible, isPageVisibleOnServer);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 55, damping: 18, mass: 0.9 });
  const y = useSpring(py, { stiffness: 55, damping: 18, mass: 0.9 });
  const rotateY = useTransform(x, (v) => v * MOTION.tiltDegrees);

  // 0 = stacked, 1 = apart. One spring drives the plates, connectors, cards and shadow together.
  const target = useMotionValue(0);
  const progress = useSpring(target, reduce ? { duration: 0.01 } : EXPLODE.spring);
  const rotateX = useTransform([y, progress], ([v, p]: number[]) => v * -MOTION.tiltDegrees + p * 4);
  const restOpacity = useTransform(progress, [0, 0.04], [1, 0]);
  const explodedOpacity = useTransform(progress, [0, 0.03], [0, 1]);
  const shadowOpacity = useTransform(progress, [0, 1], [1, 0.55]);
  const orbitOpacity = useTransform(progress, [0, 0.6], [1, MOTION.orbitOpenOpacity]);
  const hintOpacity = useTransform(progress, [0, 0.25], [1, 0]);
  const beadsPaused = open || !onScreen || !pageVisible;

  useEffect(() => {
    target.set(open ? 1 : 0);
  }, [open, target]);

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - box.left) / box.width - 0.5) * 2);
    py.set(((e.clientY - box.top) / box.height - 0.5) * 2);
  };
  const handlePointerLeave = () => {
    px.set(0);
    py.set(0);
    setOpen(false);
  };
  const handleCardHover = (index: number | null) => {
    setHovered(index);
    if (index !== null && !reduce) setOpen(true);
  };
  // A mouse opens it by hovering the core. Touch and keyboard have no hover, so they toggle.
  const handleCoreClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail === 0 || pointerType.current !== "mouse") setOpen((v) => !v);
  };

  return (
    <LazyMotion features={domAnimation}>
      <div
        ref={visualRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="sh-enter @container relative -my-[6%] -ml-[12.5%] aspect-square w-[125%] max-w-none md:mx-auto md:my-0 md:w-full md:max-w-[840px] lg:mx-0 lg:w-[104%] lg:max-w-none"
      >
        <div className="absolute inset-0">
          <div aria-hidden="true" className="sh-halo pointer-events-none absolute inset-[6%]" />
          <div className="sh-fade-edge absolute inset-0">
            <ParallaxLayer x={x} y={y} reach={-MOTION.backdropParallax}>
              <DepthBackdrop className="absolute inset-0 size-full overflow-visible" />
              <TechnicalBackdrop className="absolute inset-0 size-full overflow-visible" />
            </ParallaxLayer>
          </div>

          <ParallaxLayer x={x} y={y} reach={MOTION.ringParallax}>
            <m.div style={{ opacity: orbitOpacity }} className="absolute inset-0">
              <OrbitalSystem className="absolute inset-0 size-full overflow-visible" />
              <Particles half="back" animate={!reduce} paused={beadsPaused} className="absolute inset-0 size-full overflow-visible" />
            </m.div>
          </ParallaxLayer>

          <m.div style={{ opacity: shadowOpacity }} className="absolute inset-0">
            <CoreShadow className="pointer-events-none absolute inset-0 size-full overflow-visible" />
          </m.div>

          <Tilted rotateX={rotateX} rotateY={rotateY}>
            <m.div style={{ opacity: restOpacity }} className="absolute inset-0">
              <CoreObject className="absolute inset-0 size-full overflow-visible" />
            </m.div>
            <m.div style={{ opacity: explodedOpacity }} className="absolute inset-0">
              <ExplodedCore progress={progress} className="absolute inset-0 size-full overflow-visible" />
            </m.div>
            <StageConnectors progress={progress} active={open && !reduce} hovered={hovered} />
          </Tilted>

          <ParallaxLayer x={x} y={y} reach={MOTION.ringParallax}>
            <m.div style={{ opacity: orbitOpacity }} className="absolute inset-0">
              <Particles half="front" animate={!reduce} paused={beadsPaused} className="absolute inset-0 size-full overflow-visible" />
            </m.div>
          </ParallaxLayer>

          <Tilted rotateX={rotateX} rotateY={rotateY}>
            <StageCards progress={progress} open={open} hovered={hovered} onHover={handleCardHover} />
          </Tilted>
        </div>

        <m.p
          aria-hidden="true"
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute left-1/2 top-[84%] m-0 hidden -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium text-ink-3 md:flex"
        >
          <MousePointer2 className="size-3.5 text-accent" strokeWidth={1.8} />
          <span className="[@media(hover:none)]:hidden">Hover to see what is inside</span>
          <span className="hidden [@media(hover:none)]:inline">Tap to see what is inside</span>
        </m.p>

        <button
          type="button"
          aria-expanded={open}
          aria-label="Show the modules inside BeRocker"
          onPointerDown={(e) => {
            pointerType.current = e.pointerType;
          }}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse" && !reduce) setOpen(true);
          }}
          onClick={handleCoreClick}
          onBlur={() => setOpen(false)}
          className="absolute left-[22%] top-[30%] hidden h-[44%] w-[56%] cursor-default rounded-[3rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:block"
        />
      </div>
      <StageList reduce={reduce} />
    </LazyMotion>
  );
}

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
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-6 px-5 pb-12 pt-6 sm:px-10 lg:min-h-[inherit] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:py-10 xl:gap-16">
        <HeroCopy />
        <CoreVisual />
      </div>
    </section>
  );
}
