"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ------------------------------------------------------------------ types */

export interface FlowEndpoint {
  title: string;
  subtitle?: string;
  /** Logo shown in the tile, e.g. <img src="/logos/x.svg" /> or an inline <svg> */
  logo?: React.ReactNode;
  /** Background of the logo tile. Defaults to white (light) / near-black (dark). */
  logoBackground?: string;
  /** Glow / border-sheen color. Defaults to the color of the lines this side sends. */
  accent?: string;
  /** Short status pill, e.g. "Connected" */
  status?: string;
  statusTone?: "ok" | "warn" | "off";
}

export interface FlowItem {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  /** Data flows source -> target for this row. Default true. */
  outbound?: boolean;
  /** Data flows target -> source for this row. Default true. */
  inbound?: boolean;
  onClick?: () => void;
}

export interface IntegrationFlowProps {
  source: FlowEndpoint;
  target: FlowEndpoint;
  items: FlowItem[];
  outboundColor?: string;
  inboundColor?: string;
  /** Legend text. Defaults to "<source> sends" / "<target> sends". */
  outboundLabel?: string;
  inboundLabel?: string;
  showLegend?: boolean;
  lineStyle?: "solid" | "dashed";
  animated?: boolean;
  /** Average seconds between pulses on each line */
  pulseInterval?: number;
  /** Pulse speed in px per second */
  pulseSpeed?: number;
  /** Pulse tail length in px */
  pulseLength?: number;
  /** "auto" follows a `dark` class or data-theme="dark" on <html> */
  theme?: "auto" | "light" | "dark";
  rowGap?: number;
  /**
   * "horizontal": endpoints left and right (the original). "vertical": source on top,
   * target at the bottom, cables in lanes down both sides; built for phones.
   * "auto" (default) goes vertical when the component is narrower than `verticalBelow`.
   */
  layout?: "auto" | "horizontal" | "vertical";
  verticalBelow?: number;
  className?: string;
}

/* --------------------------------------------------------------- geometry */

type Pt = { x: number; y: number };
type Curve = [Pt, Pt, Pt, Pt];
type Seg = { pts: Curve; lut: number[]; len: number; reverse: boolean };
type Line = {
  key: string;
  item: number;
  dir: "out" | "in";
  color: string;
  dA: string;
  dB: string;
  /** source edge, row left, row right, target edge */
  ports: [Pt, Pt, Pt, Pt];
  /** segments in the direction the pulse travels */
  segs: [Seg, Seg];
};
type Pulse = { id: number; key: string; start: number; arrived: boolean };

const LUT_STEPS = 40;
const SAMPLES = 10;
/** distance a pulse "spends" passing behind a row card */
const CARD_GAP = 70;

function hCurve(a: Pt, b: Pt): Curve {
  const mx = a.x + (b.x - a.x) * 0.5;
  return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b];
}

function bez([a, b, c, d]: Curve, t: number): Pt {
  const m = 1 - t;
  const w0 = m * m * m;
  const w1 = 3 * m * m * t;
  const w2 = 3 * m * t * t;
  const w3 = t * t * t;
  return {
    x: w0 * a.x + w1 * b.x + w2 * c.x + w3 * d.x,
    y: w0 * a.y + w1 * b.y + w2 * c.y + w3 * d.y,
  };
}

function makeSeg(pts: Curve, reverse: boolean): Seg {
  const lut = [0];
  let prev = pts[0];
  let len = 0;
  for (let i = 1; i <= LUT_STEPS; i++) {
    const p = bez(pts, i / LUT_STEPS);
    len += Math.hypot(p.x - prev.x, p.y - prev.y);
    lut.push(len);
    prev = p;
  }
  return { pts, lut, len, reverse };
}

/** Point at a 0-1 fraction of the segment, measured by distance, in travel direction. */
function sample(seg: Seg, fraction: number): Pt {
  let f = Math.min(1, Math.max(0, fraction));
  if (seg.reverse) f = 1 - f;
  const target = f * seg.len;
  let i = 1;
  while (i < LUT_STEPS && seg.lut[i] < target) i++;
  const span = seg.lut[i] - seg.lut[i - 1] || 1;
  return bez(seg.pts, (i - 1 + (target - seg.lut[i - 1]) / span) / LUT_STEPS);
}

const pathD = (c: Curve) =>
  `M ${c[0].x} ${c[0].y} C ${c[1].x} ${c[1].y}, ${c[2].x} ${c[2].y}, ${c[3].x} ${c[3].y}`;

function rgba(color: string, alpha: number): string {
  let hex = color.trim().replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(hex)) {
    return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
  }
  const n = parseInt(hex, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${+alpha.toFixed(3)})`;
}

/* ------------------------------------------------------------------ hooks */

function useDark(theme: "auto" | "light" | "dark"): boolean {
  const [auto, setAuto] = useState(false);
  useEffect(() => {
    if (theme !== "auto") return;
    const root = document.documentElement;
    const read = () =>
      setAuto(root.classList.contains("dark") || root.getAttribute("data-theme") === "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => mo.disconnect();
  }, [theme]);
  return theme === "auto" ? auto : theme === "dark";
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  return reduced;
}

/* ----------------------------------------------------------------- pulses */

interface PulsesProps {
  uid: string;
  lines: Line[];
  interval: number;
  speed: number;
  length: number;
  hovered: number | null;
  onArrive: (end: "source" | "target", color: string) => void;
}

/** Owns the animation loop so the cards never re-render per frame. */
const Pulses = React.memo(function Pulses({
  uid,
  lines,
  interval,
  speed,
  length,
  hovered,
  onArrive,
}: PulsesProps) {
  const [now, setNow] = useState(0);
  const pulses = useRef<Pulse[]>([]);
  const nextSpawn = useRef(new Map<string, number>());
  const nextId = useRef(0);
  const byKey = useMemo(() => new Map(lines.map((l) => [l.key, l])), [lines]);
  const cb = useRef({ onArrive });
  cb.current = { onArrive };

  useEffect(() => {
    const gapMs = Math.max(0.2, interval) * 1000;
    const pxPerMs = Math.max(20, speed) / 1000;
    let raf = 0;

    const frame = (t: number) => {
      for (const line of lines) {
        const due = nextSpawn.current.get(line.key);
        if (due === undefined) {
          nextSpawn.current.set(line.key, t + Math.random() * gapMs * 0.7);
        } else if (t >= due) {
          pulses.current.push({
            id: nextId.current++,
            key: line.key,
            start: t,
            arrived: false,
          });
          nextSpawn.current.set(line.key, t + gapMs * (0.5 + Math.random()));
        }
      }

      pulses.current = pulses.current.filter((p) => {
        const line = byKey.get(p.key);
        if (!line) return false;
        const total = line.segs[0].len + CARD_GAP + line.segs[1].len;
        const head = (t - p.start) * pxPerMs;
        if (!p.arrived && head >= total) {
          p.arrived = true;
          cb.current.onArrive(line.dir === "out" ? "target" : "source", line.color);
        }
        return head - length < total;
      });

      setNow(t);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [lines, byKey, interval, speed, length]);

  const pxPerMs = Math.max(20, speed) / 1000;

  return (
    <>
      {pulses.current.map((p) => {
        const line = byKey.get(p.key);
        if (!line) return null;
        const [s1, s2] = line.segs;
        const head = (now - p.start) * pxPerMs;
        const tail = head - length;
        const dim = hovered !== null && hovered !== line.item ? 0.12 : 1;
        const ranges: [Seg, number, number][] = [
          [s1, 0, s1.len],
          [s2, s1.len + CARD_GAP, s1.len + CARD_GAP + s2.len],
        ];

        return (
          <g key={p.id} opacity={dim}>
            {ranges.map(([seg, lo, hi], si) => {
              const a = Math.max(tail, lo);
              const b = Math.min(head, hi);
              if (b - a < 1 || hi - lo < 1) return null;
              const pts: Pt[] = [];
              for (let i = 0; i <= SAMPLES; i++) {
                const s = a + ((b - a) * i) / SAMPLES;
                pts.push(sample(seg, (s - lo) / (hi - lo)));
              }
              const d = pts.map((pt, i) => `${i ? "L" : "M"} ${pt.x} ${pt.y}`).join(" ");
              const gid = `if-g-${uid}-${p.id}-${si}`;
              const o0 = Math.max(0, (a - tail) / length);
              const o1 = Math.max(0, (b - tail) / length);
              const first = pts[0];
              const last = pts[SAMPLES];
              const headVisible = head >= lo && head <= hi;
              return (
                <g key={si}>
                  <defs>
                    <linearGradient
                      id={gid}
                      gradientUnits="userSpaceOnUse"
                      x1={first.x}
                      y1={first.y}
                      x2={last.x}
                      y2={last.y}
                    >
                      <stop offset="0%" stopColor={line.color} stopOpacity={o0 * o0} />
                      <stop offset="100%" stopColor={line.color} stopOpacity={o1} />
                    </linearGradient>
                  </defs>
                  <path
                    d={d}
                    fill="none"
                    stroke={`url(#${gid})`}
                    strokeWidth={5}
                    strokeLinecap="round"
                    opacity={0.35}
                    filter={`url(#if-blur-${uid})`}
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke={`url(#${gid})`}
                    strokeWidth={1.75}
                    strokeLinecap="round"
                  />
                  {headVisible && (
                    <>
                      <circle
                        cx={last.x}
                        cy={last.y}
                        r={5}
                        fill={line.color}
                        opacity={0.35}
                        filter={`url(#if-blur-${uid})`}
                      />
                      <circle cx={last.x} cy={last.y} r={2} fill={line.color} />
                    </>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </>
  );
});

/* -------------------------------------------------------------- component */

export default function IntegrationFlow({
  source,
  target,
  items,
  outboundColor = "#2b73ff",
  inboundColor = "#12a568",
  outboundLabel,
  inboundLabel,
  showLegend = true,
  lineStyle = "solid",
  animated = true,
  pulseInterval = 8,
  pulseSpeed = 240,
  pulseLength = 140,
  theme = "auto",
  rowGap = 14,
  layout = "auto",
  verticalBelow = 680,
  className = "",
}: IntegrationFlowProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const dark = useDark(theme);
  const reducedMotion = useReducedMotion();
  const motion = animated && !reducedMotion;

  const wrapRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  const [narrow, setNarrow] = useState(false);
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (layout !== "auto" || !el) return;
    const read = () => setNarrow(el.clientWidth < verticalBelow);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout, verticalBelow]);
  const vertical = layout === "vertical" || (layout === "auto" && narrow);

  const [hovered, setHovered] = useState<number | null>(null);
  const [lines, setLines] = useState<Line[]>([]);

  // Which directions each row has. Serialised so measuring only re-runs on real changes.
  const shape = items
    .map((it) => `${it.outbound === false ? 0 : 1}${it.inbound === false ? 0 : 1}`)
    .join("|");

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const src = sourceRef.current;
    const tgt = targetRef.current;
    if (!wrap || !src || !tgt) return;
    const o = wrap.getBoundingClientRect();
    const rel = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { l: r.left - o.left, r: r.right - o.left, t: r.top - o.top, b: r.bottom - o.top, h: r.height };
    };
    const s = rel(src);
    const t = rel(tgt);

    const flags = shape.split("|").map((f) => ({ out: f[0] === "1", inn: f[1] === "1" }));
    const defs: { item: number; dir: "out" | "in" }[] = [];
    flags.forEach((f, i) => {
      if (f.out) defs.push({ item: i, dir: "out" });
      if (f.inn) defs.push({ item: i, dir: "in" });
    });

    const n = defs.length;

    if (vertical) {
      // Lanes down the left edge (source -> rows) and the right edge (rows -> target).
      // The first row takes the inner left lane and the outer right lane, so no cables cross.
      const list = listRef.current;
      if (!list) return;
      const L = rel(list);
      const lIn = L.l - 5;
      const lOut = s.l + 4;
      const rOut = t.r - 4;
      const rIn = L.r + 5;
      const stepL = n > 1 ? Math.min(3, (lIn - lOut) / (n - 1)) : 0;
      const stepR = n > 1 ? Math.min(3, (rOut - rIn) / (n - 1)) : 0;
      const nextV: Line[] = [];
      defs.forEach((def, k) => {
        const el = rowRefs.current[def.item];
        if (!el) return;
        const r = rel(el);
        const both = flags[def.item].out && flags[def.item].inn;
        const y = r.t + r.h / 2 + (both ? (def.dir === "out" ? -5 : 5) : 0);
        const xl = lIn - k * stepL;
        const xr = rOut - k * stepR;
        const a: Curve = [{ x: xl, y: s.b }, { x: xl, y }, { x: xl, y }, { x: r.l, y }];
        const b: Curve = [{ x: r.r, y }, { x: xr, y }, { x: xr, y }, { x: xr, y: t.t }];
        const out = def.dir === "out";
        nextV.push({
          key: `${def.item}-${def.dir}`,
          item: def.item,
          dir: def.dir,
          color: out ? outboundColor : inboundColor,
          dA: pathD(a),
          dB: pathD(b),
          // Only the row ports: fourteen dots at each end would crowd a phone screen.
          ports: [a[3], a[3], b[0], b[0]],
          segs: out ? [makeSeg(a, false), makeSeg(b, false)] : [makeSeg(b, true), makeSeg(a, true)],
        });
      });
      setLines(nextV);
      return;
    }

    const fan = (box: { t: number; h: number }, k: number) => {
      const spacing = n > 1 ? Math.min(9, (box.h * 0.62) / (n - 1)) : 0;
      return box.t + box.h / 2 + (k - (n - 1) / 2) * spacing;
    };

    const next: Line[] = [];
    defs.forEach((def, k) => {
      const el = rowRefs.current[def.item];
      if (!el) return;
      const r = rel(el);
      const both = flags[def.item].out && flags[def.item].inn;
      const y = r.t + r.h / 2 + (both ? (def.dir === "out" ? -5 : 5) : 0);
      const a = hCurve({ x: s.r, y: fan(s, k) }, { x: r.l, y });
      const b = hCurve({ x: r.r, y }, { x: t.l, y: fan(t, k) });
      const out = def.dir === "out";
      next.push({
        key: `${def.item}-${def.dir}`,
        item: def.item,
        dir: def.dir,
        color: out ? outboundColor : inboundColor,
        dA: pathD(a),
        dB: pathD(b),
        ports: [a[0], a[3], b[0], b[3]],
        segs: out ? [makeSeg(a, false), makeSeg(b, false)] : [makeSeg(b, true), makeSeg(a, true)],
      });
    });
    setLines(next);
  }, [shape, outboundColor, inboundColor, vertical]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (listRef.current) ro.observe(listRef.current);
    if (sourceRef.current) ro.observe(sourceRef.current);
    if (targetRef.current) ro.observe(targetRef.current);
    return () => ro.disconnect();
  }, [measure, items.length, rowGap]);

  const onArrive = useCallback((end: "source" | "target", color: string) => {
    const el = end === "source" ? sourceRef.current : targetRef.current;
    el?.animate?.(
      [
        { boxShadow: `0 0 0 0 ${rgba(color, 0.45)}` },
        { boxShadow: `0 0 0 14px ${rgba(color, 0)}` },
      ],
      { duration: 900, easing: "ease-out" }
    );
  }, []);

  /* ---- tokens ---- */
  const c = dark
    ? {
        text: "#f1f2f4",
        muted: "#9aa0ab",
        card: "linear-gradient(180deg, #17191e 0%, #111317 100%)",
        cardSolid: "#131519",
        border: "rgba(255,255,255,0.09)",
        borderHover: "rgba(255,255,255,0.24)",
        frame: "rgba(255,255,255,0.12)",
        surface: "linear-gradient(180deg, #191b21 0%, #0e0f13 100%)",
        tile: "#0b0d12",
        tileBorder: "rgba(255,255,255,0.1)",
        iconBg: "rgba(255,255,255,0.05)",
        ok: "#3ddc97",
        warn: "#f5b54a",
        line: 0.36,
        halo: 0.3,
        shadow: "0 1px 2px rgba(0,0,0,0.5)",
        shadowHover: "0 10px 28px rgba(0,0,0,0.55)",
        nodeShadow: "0 18px 40px -18px rgba(0,0,0,0.9)",
      }
    : {
        // Light theme reads the site's design tokens (app/globals.css), so the map
        // matches the rest of the page. Only the dark theme above keeps its own values.
        text: "var(--color-ink)",
        muted: "var(--color-ink-3)",
        card: "var(--color-card)",
        cardSolid: "var(--color-card)",
        border: "var(--color-line)",
        borderHover: "var(--color-line-2)",
        frame: "var(--color-line)",
        surface: "linear-gradient(180deg, var(--color-card) 0%, var(--color-page) 100%)",
        tile: "var(--color-card)",
        tileBorder: "var(--color-line)",
        iconBg: "var(--color-fill)",
        ok: "var(--color-success)",
        warn: "var(--color-flag-ink)",
        line: 0.32,
        halo: 0.2,
        shadow: "var(--shadow-card)",
        shadowHover: "var(--shadow-float)",
        nodeShadow: "var(--shadow-float)",
      };

  const spin = `if-spin-${uid}`;
  const ping = `if-ping-${uid}`;
  const float = `if-float-${uid}`;

  const renderEndpoint = (
    ep: FlowEndpoint,
    ref: React.RefObject<HTMLDivElement | null>,
    column: number,
    fallbackAccent: string,
    delay: string
  ) => {
    const accent = ep.accent ?? fallbackAccent;
    const tone = ep.statusTone ?? "ok";
    const toneColor = tone === "ok" ? c.ok : tone === "warn" ? c.warn : c.muted;
    return (
      <div
        ref={ref}
        style={{
          gridColumn: vertical ? undefined : column,
          position: "relative",
          zIndex: 1,
          alignSelf: vertical ? "stretch" : "center",
          borderRadius: 26,
        }}
      >
        {/* soft halo behind the node */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: -34,
            display: vertical ? "none" : undefined,
            borderRadius: "50%",
            background: `radial-gradient(closest-side, ${rgba(accent, c.halo)}, ${rgba(accent, 0)})`,
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />
        {/* 1px frame with a light sweeping around it */}
        <div
          style={{
            position: "relative",
            borderRadius: 26,
            padding: 1.5,
            overflow: "hidden",
            background: c.frame,
            boxShadow: c.nodeShadow,
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 460,
              height: 460,
              margin: -230,
              background: `conic-gradient(from 0deg, ${rgba(accent, 0)} 0deg, ${rgba(accent, 0)} 230deg, ${rgba(accent, 0.95)} 330deg, ${rgba(accent, 0)} 360deg)`,
              animation: motion ? `${spin} 7s linear infinite` : undefined,
              animationDelay: delay,
            }}
          />
          <div
            style={{
              position: "relative",
              borderRadius: 24.5,
              background: c.surface,
              padding: vertical ? "10px 12px" : "26px 16px 22px",
              display: "flex",
              flexDirection: vertical ? "row" : "column",
              alignItems: "center",
              textAlign: vertical ? "left" : "center",
              gap: vertical ? 12 : 6,
              overflow: "hidden",
            }}
          >
            {/* tinted wash + top highlight inside the card */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(120% 70% at 50% 0%, ${rgba(accent, dark ? 0.16 : 0.09)}, ${rgba(accent, 0)} 70%)`,
                pointerEvents: "none",
              }}
            />
            {ep.logo && (
              <div
                style={{
                  position: "relative",
                  flex: "none",
                  width: vertical ? 40 : 64,
                  height: vertical ? 40 : 64,
                  marginBottom: vertical ? 0 : 10,
                  animation: motion ? `${float} 6s ease-in-out infinite` : undefined,
                  animationDelay: delay,
                }}
              >
                {motion &&
                  [0, 1].map((k) => (
                    <span
                      key={k}
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 20,
                        border: `1.5px solid ${rgba(accent, 0.55)}`,
                        animation: `${ping} 3.2s cubic-bezier(0.2, 0.6, 0.3, 1) infinite`,
                        animationDelay: `${k * 1.6}s`,
                        opacity: 0,
                      }}
                    />
                  ))}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                    borderRadius: 20,
                    background: ep.logoBackground ?? c.tile,
                    border: `1px solid ${c.tileBorder}`,
                    boxShadow: `0 10px 24px -8px ${rgba(accent, 0.55)}, inset 0 1px 0 rgba(255,255,255,${dark ? 0.08 : 0.9})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: vertical ? 7 : 12,
                    overflow: "hidden",
                  }}
                >
                  {ep.logo}
                </div>
              </div>
            )}
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: vertical ? "flex-start" : "center",
                gap: vertical ? 2 : 6,
                flex: vertical ? 1 : undefined,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: vertical ? 15 : 16.5,
                  fontWeight: 650,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                }}
              >
                {ep.title}
              </div>
              {ep.subtitle && (
                <div style={{ fontSize: 12.5, lineHeight: 1.4, color: c.muted }}>{ep.subtitle}</div>
              )}
            </div>
            {ep.status && (
              <div
                style={{
                  position: "relative",
                  flex: "none",
                  marginTop: vertical ? 0 : 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "4px 10px 4px 9px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  color: toneColor,
                  background: rgba(toneColor, dark ? 0.14 : 0.1),
                  border: `1px solid ${rgba(toneColor, 0.22)}`,
                }}
              >
                <span style={{ position: "relative", width: 6, height: 6 }}>
                  {motion && tone === "ok" && (
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: "currentColor",
                        animation: `${ping} 2s ease-out infinite`,
                      }}
                    />
                  )}
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: "currentColor",
                    }}
                  />
                </span>
                {ep.status}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const lineOpacity = (item: number) => (hovered === null ? c.line : hovered === item ? 0.95 : 0.08);
  const svgBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: "visible",
    pointerEvents: "none",
  };

  const arrow = (color: string, flip: boolean, on: boolean) => (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      aria-hidden
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        opacity: on ? 1 : 0.18,
        color: on ? color : "currentColor",
        filter: on ? `drop-shadow(0 0 4px ${rgba(color, 0.55)})` : undefined,
      }}
    >
      <path
        d="M1.5 6h14M11.5 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div ref={rootRef} className={className} style={{ color: c.text, fontFamily: "inherit", width: "100%" }}>
      <style>{`
        @keyframes ${spin} { to { transform: rotate(360deg); } }
        @keyframes ${ping} { 0% { transform: scale(1); opacity: 0.6; } 80%, 100% { transform: scale(1.55); opacity: 0; } }
        @keyframes ${float} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
      `}</style>

      <div
        ref={wrapRef}
        style={
          vertical
            ? { position: "relative", display: "flex", flexDirection: "column", gap: 18, padding: "12px 10px 16px" }
            : {
                position: "relative",
                display: "grid",
                gridTemplateColumns:
                  "minmax(130px, 200px) minmax(48px, 1fr) minmax(240px, 370px) minmax(48px, 1fr) minmax(130px, 200px)",
                alignItems: "center",
                padding: "34px",
              }
        }
      >
        {/* lines + pulses, behind the cards */}
        <svg aria-hidden style={svgBase}>
          <defs>
            <filter id={`if-blur-${uid}`} x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          {lines.map((l) => (
            <g
              key={l.key}
              fill="none"
              stroke={l.color}
              strokeLinecap="round"
              strokeWidth={hovered === l.item ? 1.75 : 1.25}
              strokeDasharray={lineStyle === "dashed" ? "3 5" : undefined}
              opacity={lineOpacity(l.item)}
              style={{ transition: "opacity 200ms, stroke-width 200ms" }}
            >
              <path d={l.dA} />
              <path d={l.dB} />
            </g>
          ))}
          {motion && lines.length > 0 && (
            <Pulses
              uid={uid}
              lines={lines}
              interval={pulseInterval}
              speed={pulseSpeed}
              length={pulseLength}
              hovered={hovered}
              onArrive={onArrive}
            />
          )}
        </svg>

        {renderEndpoint(source, sourceRef, 1, outboundColor, "0s")}

        <div
          ref={listRef}
          style={{
            gridColumn: vertical ? undefined : 3,
            margin: vertical ? "0 22px" : undefined,
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: vertical ? Math.min(rowGap, 6) : rowGap,
          }}
        >
          {items.map((it, i) => {
            const active = hovered === i;
            const hasOut = it.outbound !== false;
            const hasIn = it.inbound !== false;
            const mix =
              hasOut && hasIn
                ? `linear-gradient(135deg, ${rgba(outboundColor, 0.16)}, ${rgba(inboundColor, 0.16)})`
                : rgba(hasOut ? outboundColor : inboundColor, 0.14);
            return (
              <button
                key={it.id ?? i}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                type="button"
                onClick={it.onClick}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered((h) => (h === i ? null : h))}
                style={{
                  all: "unset",
                  boxSizing: "border-box",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: vertical ? 9 : 12,
                  padding: vertical ? "6px 10px 6px 6px" : "9px 14px 9px 9px",
                  borderRadius: vertical ? 12 : 15,
                  background: c.card,
                  border: `1px solid ${active ? c.borderHover : c.border}`,
                  boxShadow: active ? c.shadowHover : c.shadow,
                  transform: active ? "translateY(-1px) scale(1.012)" : "none",
                  transition: "border-color 180ms, box-shadow 180ms, transform 180ms",
                  cursor: it.onClick ? "pointer" : "default",
                  fontFamily: "inherit",
                  color: c.text,
                }}
              >
                {it.icon && (
                  <span
                    style={{
                      flex: "none",
                      width: vertical ? 30 : 36,
                      height: vertical ? 30 : 36,
                      borderRadius: vertical ? 9 : 11,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: active ? mix : c.iconBg,
                      color: active ? c.text : c.muted,
                      boxShadow: `inset 0 0 0 1px ${c.border}`,
                      transition: "background 180ms, color 180ms",
                    }}
                  >
                    {it.icon}
                  </span>
                )}
                <span style={{ flex: 1, minWidth: 0, paddingLeft: it.icon ? 0 : 4 }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: vertical ? 13.5 : 14.5,
                      fontWeight: 600,
                      letterSpacing: "-0.005em",
                      lineHeight: vertical ? 1.25 : 1.3,
                    }}
                  >
                    {it.title}
                  </span>
                  {it.subtitle && (
                    <span
                      style={{
                        display: "block",
                        marginTop: vertical ? 1 : 2,
                        fontSize: vertical ? 11.5 : 12.5,
                        lineHeight: 1.35,
                        color: c.muted,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {it.subtitle}
                    </span>
                  )}
                </span>
                <span
                  aria-label={
                    hasOut && hasIn ? "Two-way" : hasOut ? `From ${source.title}` : `From ${target.title}`
                  }
                  style={{
                    flex: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    color: c.muted,
                  }}
                >
                  {arrow(outboundColor, false, hasOut)}
                  {arrow(inboundColor, true, hasIn)}
                </span>
              </button>
            );
          })}
        </div>

        {renderEndpoint(target, targetRef, 5, inboundColor, "-3.5s")}

        {/* connection ports, on top of the card edges */}
        <svg aria-hidden style={{ ...svgBase, zIndex: 2 }}>
          {lines.map((l) => {
            const on = hovered === null || hovered === l.item;
            return (
              <g
                key={l.key}
                stroke={l.color}
                strokeWidth={1.5}
                opacity={on ? 1 : 0.2}
                style={{ transition: "opacity 200ms", fill: c.cardSolid }}
              >
                {l.ports.map((pt, k) => (
                  <circle key={k} cx={pt.x} cy={pt.y} r={hovered === l.item ? 3.5 : 2.75} />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {showLegend && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "6px 22px",
            fontSize: 12.5,
            color: c.muted,
          }}
        >
          {[
            [outboundColor, outboundLabel ?? `${source.title} sends`],
            [inboundColor, inboundLabel ?? `${target.title} sends`],
          ].map(([color, label]) => (
            <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 18,
                  height: 2,
                  borderRadius: 2,
                  background: color,
                  boxShadow: `0 0 6px ${rgba(color, 0.6)}`,
                }}
              />
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
