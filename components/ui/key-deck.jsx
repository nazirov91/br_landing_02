"use client";
/* eslint-disable */
/*
  Key Deck: six BeRocker modules on one AI foundation, drawn as a 3D keyboard in CSS.
  Ported as-is from the "BeRocker Key Deck" artboard. Tap (or click) to lift the keys
  and show how each module connects; tap again to close.
*/
import { Fragment, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Sparkles } from "lucide-react";

var noop = () => () => {};
var df = Math.SQRT1_2,
  ff = Math.sin(Math.PI / 3),
  pf = ({ x: e, y: t, z: n }) => [(e - t) * df, (e + t) * df * 0.5 - n * ff],
  Z = 480,
  mf = `polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)`;
function hf({ o: e, lit: t }) {
  let n = Math.max(2, Math.min(30, Math.round(e.h / 1.25))),
    r = e.h / n,
    i = e.shape === `round` || e.shape === `ring` ? `50%` : `${e.radius ?? 18}px`,
    a = e.shape === `hex` ? mf : void 0,
    o = e.tone === `navy`,
    s = Math.max(1, Math.round(n * 0.3)),
    c = o
      ? `linear-gradient(to top right, var(--color-navy-2), var(--color-navy) 70%)`
      : `linear-gradient(to top right, var(--color-card) 0%, var(--color-page-2) 45%, color-mix(in oklab, var(--color-line-2) 55%, var(--color-mist)) 100%)`,
    l = o ? `var(--color-navy)` : `var(--color-line-2)`,
    u = o
      ? `linear-gradient(to top right, var(--color-navy-2), var(--color-navy))`
      : `linear-gradient(to top right, var(--color-card), var(--color-page) 130%)`,
    d = (t) => {
      let n = !!e.glow && t === s,
        u = { position: `absolute`, inset: 0, borderRadius: i, clipPath: a, transform: `translateZ(${t * r}px)` };
      return e.shape === `ring`
        ? {
            ...u,
            border: `${e.ringWidth ?? 20}px solid ${n ? `var(--core-accent)` : l}`,
            boxShadow: n ? `0 0 14px 2px color-mix(in oklab, var(--core-accent) 55%, transparent)` : void 0,
          }
        : {
            ...u,
            background: n ? `var(--core-accent)` : t === 0 ? (o ? `var(--color-navy)` : `var(--color-line-2)`) : c,
            boxShadow: n && !a ? `0 0 16px 3px color-mix(in oklab, var(--core-accent) 55%, transparent)` : void 0,
          };
    },
    f =
      e.shape === `ring`
        ? {
            position: `absolute`,
            inset: 0,
            borderRadius: i,
            transform: `translateZ(${e.h}px)`,
            border: `${e.ringWidth ?? 20}px solid var(--color-card)`,
            boxShadow: t
              ? `inset 0 0 0 1.5px var(--color-accent-line), 0 0 0 1.5px var(--color-accent-line)`
              : `inset 0 0 0 1px var(--color-line), 0 0 0 1px var(--color-line)`,
          }
        : {
            position: `absolute`,
            inset: 0,
            borderRadius: i,
            clipPath: a,
            transform: `translateZ(${e.h}px)`,
            background: u,
            overflow: `hidden`,
            boxShadow: o
              ? `inset 0 0 0 1px var(--color-navy-line)`
              : t
                ? `inset 0 0 0 1.5px var(--color-accent-line), inset 0 0 0 6px var(--color-card), inset 0 0 0 7px var(--color-accent-line)`
                : `inset 0 0 0 1px var(--color-line), inset 0 0 0 6px var(--color-card), inset 0 0 0 7px var(--color-line)`,
            transition: `box-shadow .5s`,
          };
  return jsxs(Fragment, {
    children: [
      Array.from({ length: n }, (e, t) => jsx(`div`, { style: d(t) }, t)),
      jsx(`div`, { style: f, children: e.top }),
    ],
  });
}
function gf({ part: e, num: t }) {
  let n = e.icon;
  return jsxs(`div`, {
    className: `flex gap-2.5 rounded-[14px] bg-card p-3 text-left shadow-float`,
    children: [
      jsx(`span`, {
        className: `grid size-7 shrink-0 place-items-center rounded-lg text-white`,
        style: { background: `var(--core-accent)` },
        children: n
          ? jsx(n, { className: `size-[15px]`, strokeWidth: 2.2 })
          : jsx(`span`, { className: `text-[12px] font-bold`, children: t }),
      }),
      jsxs(`div`, {
        className: `min-w-0`,
        children: [
          jsx(`p`, {
            className: `text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3`,
            children: String(t).padStart(2, `0`),
          }),
          jsx(`p`, { className: `text-[13px] font-semibold leading-tight text-ink`, children: e.label }),
          e.detail &&
            jsx(`p`, { className: `mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-ink-3`, children: e.detail }),
        ],
      }),
    ],
  });
}
function _f({ className: e = `` }) {
  return jsxs(`svg`, {
    viewBox: `4 9 52 28`,
    className: e,
    "aria-hidden": `true`,
    children: [
      jsx(`path`, {
        fill: `var(--color-navy)`,
        d: `M16.7808 10.6203L5.33263 21.9496C4.77196 22.5045 4.77042 23.4098 5.32919 23.9665L16.2133 34.8114C16.7599 35.356 17.6412 35.365 18.1987 34.8317L22.716 30.5107C23.2928 29.959 23.3022 29.0404 22.7367 28.477L18.2273 23.9838C17.6619 23.4204 17.6712 22.5019 18.2481 21.9501L22.7856 17.6098C23.335 17.0842 24.2008 17.0842 24.7503 17.6098L29.3508 22.0103C29.9029 22.5385 30.7738 22.5355 31.3224 22.0037L35.7857 17.6766C36.3562 17.1236 36.3624 16.2103 35.7996 15.6495L30.7557 10.6237C30.4893 10.3583 30.1286 10.2093 29.7526 10.2093H17.7805C17.4061 10.2093 17.0469 10.357 16.7808 10.6203Z`,
      }),
      jsx(`path`, {
        fill: `var(--core-accent, var(--color-accent))`,
        d: `M43.7235 35.3797L55.1717 24.0504C55.7323 23.4956 55.7339 22.5903 55.1751 22.0335L44.291 11.1886C43.7444 10.644 42.8631 10.635 42.3055 11.1684L37.7883 15.4893C37.2115 16.0411 37.2021 16.9596 37.7676 17.523L42.277 22.0162C42.8424 22.5796 42.8331 23.4982 42.2562 24.0499L37.7187 28.3902C37.1693 28.9158 36.3034 28.9158 35.754 28.3902L31.1535 23.9897C30.6014 23.4616 29.7305 23.4645 29.1819 23.9963L24.7186 28.3234C24.1481 28.8765 24.1418 29.7898 24.7047 30.3506L29.7486 35.3763C30.015 35.6417 30.3757 35.7908 30.7517 35.7908H42.7238C43.0982 35.7908 43.4574 35.6431 43.7235 35.3797Z`,
      }),
    ],
  });
}
function vf({ w: e, cx: t, cy: n, animate: r, uid: i, h: a }) {
  let o = a ?? Z,
    s = [],
    c = Math.tan(Math.PI / 6);
  for (let t = -o * 2; t < e + o * 2; t += 34)
    s.push(jsx(`line`, { x1: t, y1: 0, x2: t + o / c, y2: o }, `a${t}`)),
      s.push(jsx(`line`, { x1: t, y1: 0, x2: t - o / c, y2: o }, `b${t}`));
  let l = i.replace(/:/g, ``),
    u = [
      { rx: Math.min(330, e / 2 - 8), ry: 132, dur: 44 },
      { rx: Math.min(250, e / 2 - 50), ry: 100, dur: 32 },
    ];
  return jsxs(`svg`, {
    className: `absolute inset-0 h-full w-full`,
    viewBox: `0 0 ${e} ${o}`,
    fill: `none`,
    children: [
      jsxs(`defs`, {
        children: [
          jsxs(`radialGradient`, {
            id: `${l}f`,
            cx: `50%`,
            cy: `52%`,
            r: `55%`,
            children: [
              jsx(`stop`, { offset: `0`, stopColor: `var(--color-white)`, stopOpacity: `1` }),
              jsx(`stop`, { offset: `1`, stopColor: `var(--color-white)`, stopOpacity: `0` }),
            ],
          }),
          jsx(`mask`, { id: `${l}m`, children: jsx(`rect`, { width: e, height: o, fill: `url(#${l}f)` }) }),
        ],
      }),
      jsx(`g`, { mask: `url(#${l}m)`, stroke: `var(--color-line)`, strokeWidth: `1`, opacity: `0.8`, children: s }),
      u.map((e, i) => {
        let a = `M ${t - e.rx} ${n} a ${e.rx} ${e.ry} 0 1 0 ${e.rx * 2} 0 a ${e.rx} ${e.ry} 0 1 0 ${-e.rx * 2} 0`;
        return jsxs(
          `g`,
          {
            children: [
              jsx(`path`, { d: a, stroke: `var(--color-line-2)`, strokeOpacity: `0.65` }),
              [0, 0.4, 0.73].map((i, o) =>
                jsx(
                  `circle`,
                  {
                    r: o === 1 ? 3 : 2.3,
                    cx: r ? 0 : t + e.rx * Math.cos(i * 2 * Math.PI),
                    cy: r ? 0 : n + e.ry * Math.sin(i * 2 * Math.PI),
                    fill: `var(--core-accent)`,
                    opacity: o === 1 ? 0.85 : 0.5,
                    children: r
                      ? jsx(`animateMotion`, {
                          dur: `${e.dur}s`,
                          repeatCount: `indefinite`,
                          path: a,
                          begin: `${-i * e.dur}s`,
                        })
                      : null,
                  },
                  o,
                ),
              ),
            ],
          },
          i,
        );
      }),
    ],
  });
}
var yf = [0.23, 1, 0.32, 1],
  bf = 106,
  xf = 18,
  Sf = 26,
  Cf = 30,
  wf = 1060,
  Tf = 640,
  Ef = 206;
function Df({
  keys: e,
  foundation: t,
  expanded: n,
  defaultExpanded: r = !1,
  onExpandedChange: i,
  mark: a,
  className: o = ``,
  listClassName: lc = ``,
}) {
  // The motion setting is read only after hydration, so the first client render matches the server HTML.
  let hydrated = useSyncExternalStore(noop, () => !0, () => !1),
    prefersReduced = useReducedMotion(),
    s = hydrated && !!prefersReduced,
    c = useId().replace(/:/g, ``),
    l = useRef(null),
    [u, d] = useState(0),
    [f, p] = useState(r),
    m = n ?? f,
    h = () => {
      i?.(!m), n === void 0 && p(!m);
    };
  useLayoutEffect(() => {
    let e = l.current;
    if (!e) return;
    let t = new ResizeObserver(([e]) => d(e.contentRect.width));
    return t.observe(e), d(e.getBoundingClientRect().width), () => t.disconnect();
  }, []);
  let g = e.slice(0, 6),
    v = Math.ceil(g.length / 2),
    y = v * bf + (v - 1) * xf + 52,
    b = u > 0 && u < 640,
    x = b ? 600 : wf,
    S = x / 2,
    ee = u ? Math.min(1, u / x) : 1,
    C = s ? 0 : 0.9,
    w = (e) => {
      let t = e < v ? -1 : 1;
      return { x: ((e % v) - (v - 1) / 2) * 124, y: t * 86 };
    },
    te = (e, t) => {
      let n = w(e),
        r = t ? 1.22 : 1;
      return { x: n.x * r, y: n.y * (t ? 1.42 : 1), z: t ? 122 + ((e * 7) % 3) * 16 : 24 };
    },
    T = [
      {
        key: `tray`,
        shape: `rect`,
        w: y,
        d: 330,
        h: Sf,
        radius: 40,
        x: 0,
        y: 0,
        z: 0,
        top: jsx(jf, { n: g.length, cols: v, seat: w, uid: c, open: m, trayW: y, trayD: 330 }),
      },
      {
        key: `rail`,
        shape: `rect`,
        w: y - 40,
        d: 30,
        h: 10,
        radius: 15,
        x: 0,
        y: 0,
        z: m ? 60 : Sf,
        glow: !0,
        top: jsx(kf, { label: t.label, icon: t.icon ?? Sparkles, mark: a }),
      },
      ...g.map((e, t) => {
        let n = te(t, m);
        return {
          key: `k${t}`,
          shape: `rect`,
          w: bf,
          d: bf,
          h: Cf,
          radius: 24,
          ...n,
          part: t,
          glow: m,
          top: jsx(Of, { part: e }),
        };
      }),
    ],
    ne = (e) => {
      let t = 1 / 0,
        n = -1 / 0,
        r = [{ x: 0, y: 0, z: 0, w: y, d: 330, h: Sf }, ...g.map((t, n) => ({ ...te(n, e), w: bf, d: bf, h: Cf }))];
      for (let e of r)
        (t = Math.min(t, pf({ x: e.x - e.w / 2, y: e.y - e.d / 2, z: e.z + e.h })[1])),
          (n = Math.max(n, pf({ x: e.x + e.w / 2, y: e.y + e.d / 2, z: e.z })[1]));
      return -(t + n) / 2;
    },
    re = ne(m),
    ie = ne(!0),
    ae = g.map((e, t) => {
      let n = te(t, !0),
        r = w(t),
        i = Math.sign(r.x) || 0,
        [a, o] = pf({ x: n.x + (i >= 0 ? bf / 2 - 10 : -43), y: n.y + (i >= 0 ? -43 : bf / 2 - 10), z: n.z + Cf });
      return { i: t, x: S + a, y: 350 + ie + o };
    }),
    oe = { left: [], right: [] },
    se = [];
  ae.forEach((e) => (Math.abs(e.x - S) < 24 ? se : e.x > S ? oe.right : oe.left).push(e)),
    se.forEach((e) => (oe.right.length <= oe.left.length ? oe.right : oe.left).push(e));
  let ce = [`left`, `right`].flatMap((e) => {
      let t = [...oe[e]].sort((e, t) => e.y - t.y),
        n = [];
      t.forEach((e, t) => n.push(Math.max(e.y, t ? n[t - 1] + 86 : 56)));
      let r = (n[n.length - 1] ?? 0) - 490;
      return t.map((t, i) => ({ ...t, side: e, cy: r > 0 ? n[i] - r : n[i] }));
    }),
    [, E] = pf({ x: y / 2, y: 165, z: 0 }),
    le = Math.min(528, 350 + ie + E + 18),
    ue = { width: x, height: Tf, transform: `scale(${ee})`, transformOrigin: `top left` };
  return jsxs(`div`, {
    className: o,
    style: { "--core-accent": `var(--color-accent)` },
    children: [
      jsx(`style`, {
        children: `
        @keyframes kd-flow { to { stroke-dashoffset: -28; } }
        @keyframes kd-rise { from { background-position: 0 0; } to { background-position: 0 -120px; } }
        @media (prefers-reduced-motion: reduce) { .kd-anim { animation: none !important; } }
      `,
      }),
      jsxs(`div`, {
        ref: l,
        className: `relative w-full`,
        children: [
          jsx(`button`, {
            type: `button`,
            "aria-expanded": m,
            "aria-controls": `${c}-parts`,
            "aria-label": m ? `Close the BeRocker modules` : `Open BeRocker to see its modules`,
            onClick: h,
            className: `relative block w-full cursor-pointer rounded-[var(--radius-panel)] text-left`,
            style: { height: Tf * ee, overflowX: `clip` },
            children: jsxs(`div`, {
              "aria-hidden": `true`,
              className: `absolute left-1/2 top-0 select-none`,
              style: { ...ue, marginLeft: -(x * ee) / 2 },
              children: [
                jsx(vf, { w: x, cx: S, cy: 350, animate: !s, uid: `kd${c}`, h: Tf }),
                jsx(motion.div, {
                  className: `absolute inset-0`,
                  initial: !1,
                  animate: { y: re },
                  transition: { duration: C, ease: yf },
                  children: jsxs(`div`, {
                    className: `absolute`,
                    style: {
                      left: S,
                      top: 350,
                      width: 0,
                      height: 0,
                      transform: `rotateX(60deg) rotateZ(45deg)`,
                      transformStyle: `preserve-3d`,
                    },
                    children: [
                      jsx(`div`, {
                        className: `absolute rounded-full`,
                        style: {
                          left: -y * 0.75,
                          top: -247.5,
                          width: y * 1.5,
                          height: 495,
                          transform: `translateZ(-2px)`,
                          background: `radial-gradient(closest-side, color-mix(in oklab, var(--color-navy) 20%, transparent), transparent)`,
                          filter: `blur(14px)`,
                        },
                      }),
                      g.map((e, t) => {
                        let n = w(t),
                          r = te(t, !0).z - Sf;
                        return jsx(
                          motion.div,
                          {
                            className: `absolute`,
                            style: {
                              left: -1.5,
                              top: 0,
                              width: 3,
                              height: r,
                              transformOrigin: `50% 0`,
                              transformStyle: `preserve-3d`,
                            },
                            initial: !1,
                            animate: { x: n.x * 1.22, y: n.y * 1.42, z: 27, rotateX: 90, scaleY: +!!m, opacity: +!!m },
                            transition: { duration: C, ease: yf, delay: m && !s ? 0.25 : 0 },
                            children: jsx(`div`, {
                              className: `kd-anim h-full w-full rounded-full`,
                              style: {
                                backgroundImage: `linear-gradient(to top, transparent, color-mix(in oklab, var(--core-accent) 90%, transparent) 30%, var(--core-accent) 50%, color-mix(in oklab, var(--core-accent) 90%, transparent) 70%, transparent)`,
                                backgroundSize: `100% 120px`,
                                boxShadow: `0 0 10px 2px color-mix(in oklab, var(--core-accent) 50%, transparent)`,
                                animation: `kd-rise 1.6s linear infinite`,
                              },
                            }),
                          },
                          `beam${t}`,
                        );
                      }),
                      T.map((e, t) =>
                        jsx(
                          motion.div,
                          {
                            className: `absolute`,
                            style: {
                              left: -e.w / 2,
                              top: -e.d / 2,
                              width: e.w,
                              height: e.d,
                              transformStyle: `preserve-3d`,
                            },
                            initial: !1,
                            animate: { x: e.x, y: e.y, z: e.z },
                            transition: { duration: C, ease: yf, delay: s ? 0 : (m ? t : T.length - t) * 0.04 },
                            children: jsx(hf, { o: e, lit: !1 }),
                          },
                          e.key,
                        ),
                      ),
                    ],
                  }),
                }),
                jsx(AnimatePresence, {
                  children:
                    m &&
                    jsxs(
                      motion.div,
                      {
                        className: `absolute inset-0`,
                        initial: { opacity: 0 },
                        animate: { opacity: 1, transition: { delay: s ? 0 : 0.55, duration: 0.35 } },
                        exit: { opacity: 0, transition: { duration: 0.15 } },
                        children: [
                          !b &&
                            jsx(`svg`, {
                              className: `absolute inset-0`,
                              width: x,
                              height: Tf,
                              fill: `none`,
                              children: ce.map((e) => {
                                let t = e.side === `right` ? x - Ef - 10 : 216,
                                  n = (e.x + t) / 2;
                                return jsx(
                                  `path`,
                                  {
                                    d: `M${e.x} ${e.y} L${n} ${e.y} L${n} ${e.cy} L${t} ${e.cy}`,
                                    stroke: `var(--color-accent-line)`,
                                    strokeWidth: `1.2`,
                                  },
                                  e.i,
                                );
                              }),
                            }),
                          ae.map((e) =>
                            jsx(
                              `span`,
                              {
                                className: `absolute grid size-[22px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[11px] font-bold text-white ring-4 ring-card`,
                                style: {
                                  left: e.x,
                                  top: e.y,
                                  background: `var(--core-accent)`,
                                  boxShadow: `0 2px 8px color-mix(in oklab, var(--color-navy) 25%, transparent)`,
                                },
                                children: e.i + 1,
                              },
                              e.i,
                            ),
                          ),
                          !b &&
                            ce.map((e) =>
                              jsx(
                                motion.div,
                                {
                                  className: `absolute -translate-y-1/2`,
                                  style: { top: e.cy, width: Ef, [e.side === `right` ? `right` : `left`]: 10 },
                                  initial: !s && { opacity: 0, x: e.side === `right` ? -12 : 12 },
                                  animate: { opacity: 1, x: 0 },
                                  transition: { duration: 0.5, delay: s ? 0 : 0.6 + e.i * 0.06 },
                                  children: jsx(gf, { part: g[e.i], num: e.i + 1 }),
                                },
                                e.i,
                              ),
                            ),
                          !b &&
                            jsx(motion.div, {
                              className: `absolute left-1/2 w-[330px] -translate-x-1/2`,
                              style: { top: le },
                              initial: !s && { opacity: 0, y: 8 },
                              animate: { opacity: 1, y: 0 },
                              transition: { duration: 0.5, delay: s ? 0 : 0.95 },
                              children: jsx(Mf, { f: t }),
                            }),
                        ],
                      },
                      `labels`,
                    ),
                }),
              ],
            }),
          }),
          jsx(`div`, {
            className: `mt-1 flex justify-center`,
            children: jsxs(`span`, {
              className: `inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-[12px] font-semibold text-ink-2 shadow-quiet`,
              children: [
                m ? `Tap to close` : `Tap to open`,
                jsx(ChevronDown, {
                  "aria-hidden": `true`,
                  className: `size-3.5 transition-transform duration-300 ${m ? `rotate-180` : ``}`,
                }),
              ],
            }),
          }),
          jsxs(`div`, {
            id: `${c}-parts`,
            className: b && m ? `mt-3 flex flex-col gap-2 ${lc}` : `sr-only`,
            children: [
              jsx(Mf, { f: t }),
              jsx(`ol`, {
                className: `flex flex-col gap-2`,
                children: g.map((e, t) => jsx(`li`, { children: jsx(gf, { part: e, num: t + 1 }) }, e.label)),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Of({ part: e }) {
  let t = e.icon;
  return jsxs(Fragment, {
    children: [
      jsx(`div`, {
        className: `absolute inset-[9px] rounded-[16px]`,
        style: {
          background: `linear-gradient(to top right, var(--color-page), var(--color-card))`,
          boxShadow: `inset 0 1px 0 var(--color-card), inset 0 -2px 6px color-mix(in oklab, var(--color-navy) 8%, transparent)`,
        },
      }),
      jsx(`div`, {
        className: `absolute inset-0 grid place-items-center`,
        style: { transform: `rotate(-90deg)` },
        children: jsxs(`div`, {
          className: `flex w-[92px] flex-col items-center gap-1 text-center`,
          children: [
            t && jsx(t, { className: `size-[22px]`, style: { color: `var(--core-accent)` }, strokeWidth: 2.1 }),
            jsx(`span`, {
              className: `text-[14px] font-bold leading-[1.05] tracking-[-0.01em] text-ink`,
              children: e.label,
            }),
          ],
        }),
      }),
    ],
  });
}
function kf({ label: e, icon: t, mark: n }) {
  return jsxs(`div`, {
    className: `absolute inset-0 flex items-center justify-center gap-2`,
    style: { background: `linear-gradient(90deg, var(--color-navy), var(--color-navy-2), var(--color-navy))` },
    children: [
      n ?? jsx(Af, {}),
      jsx(t, { className: `size-[13px] text-white`, strokeWidth: 2.4 }),
      jsx(`span`, { className: `text-[11px] font-bold uppercase tracking-[0.22em] text-white`, children: e }),
      jsx(`span`, {
        className: `kd-anim size-1.5 animate-pulse-dot rounded-full`,
        style: { background: `var(--core-accent)` },
      }),
    ],
  });
}
function Af() {
  return jsx(`span`, {
    className: `grid h-[16px] w-[28px] place-items-center rounded bg-white/95 px-0.5`,
    children: jsx(_f, { className: `w-[22px]` }),
  });
}
function jf({ n: e, cols: t, seat: n, uid: r, open: i, trayW: a, trayD: o }) {
  let s = a / 2,
    c = o / 2;
  return jsxs(`svg`, {
    className: `absolute inset-0`,
    width: a,
    height: o,
    viewBox: `0 0 ${a} ${o}`,
    fill: `none`,
    children: [
      jsx(`defs`, {
        children: jsxs(`linearGradient`, {
          id: `${r}tr`,
          x1: `0`,
          x2: `1`,
          children: [
            jsx(`stop`, { offset: `0`, stopColor: `var(--color-accent-line)` }),
            jsx(`stop`, { offset: `1`, stopColor: `var(--core-accent)` }),
          ],
        }),
      }),
      jsx(`rect`, {
        x: `12`,
        y: `12`,
        width: a - 24,
        height: o - 24,
        rx: `30`,
        fill: `var(--color-page-2)`,
        stroke: `var(--color-line-2)`,
      }),
      Array.from({ length: e }, (e, a) => {
        let o = n(a),
          l = s + o.x,
          u = c + o.y,
          d = u < c ? c - 15 : c + 15,
          f = u < c ? u + bf / 2 : u - bf / 2,
          p = `M${l} ${u} L${l} ${f} L${l + (a % t === 0 ? 14 : a % t === t - 1 ? -14 : 0)} ${(f + d) / 2} L${l + (a % t === 0 ? 14 : a % t === t - 1 ? -14 : 0)} ${d}`;
        return jsxs(
          `g`,
          {
            children: [
              jsx(`rect`, {
                x: l - bf / 2 - 3,
                y: u - bf / 2 - 3,
                width: 112,
                height: 112,
                rx: `26`,
                fill: `var(--color-line)`,
                opacity: i ? 1 : 0.6,
              }),
              jsx(`rect`, {
                x: l - 22,
                y: u - 22,
                width: `44`,
                height: `44`,
                rx: `12`,
                fill: `none`,
                stroke: `var(--color-accent-line)`,
                strokeDasharray: `3 4`,
                opacity: +!!i,
              }),
              jsx(`circle`, { cx: l, cy: u, r: `6`, fill: `var(--core-accent)`, opacity: +!!i }),
              jsx(`path`, {
                d: p,
                stroke: `url(#${r}tr)`,
                strokeWidth: `2.4`,
                strokeLinecap: `round`,
                strokeLinejoin: `round`,
              }),
              jsx(`path`, {
                className: `kd-anim`,
                d: p,
                stroke: `var(--color-card)`,
                strokeWidth: `2.4`,
                strokeLinecap: `round`,
                strokeDasharray: `4 24`,
                style: { animation: `kd-flow 1.4s linear ${a * 0.18}s infinite` },
              }),
            ],
          },
          a,
        );
      }),
    ],
  });
}
function Mf({ f: e }) {
  let t = e.icon ?? Sparkles;
  return jsxs(`div`, {
    className: `flex gap-2.5 rounded-[14px] p-3 text-left shadow-float`,
    style: { background: `var(--color-navy)` },
    children: [
      jsx(`span`, {
        className: `grid size-7 shrink-0 place-items-center rounded-lg text-white`,
        style: { background: `var(--core-accent)` },
        children: jsx(t, { className: `size-[15px]`, strokeWidth: 2.2 }),
      }),
      jsxs(`div`, {
        className: `min-w-0`,
        children: [
          jsx(`p`, {
            className: `text-[10px] font-semibold uppercase tracking-[0.08em] text-mist`,
            children: `Foundation`,
          }),
          jsx(`p`, { className: `text-[13px] font-semibold leading-tight text-white`, children: e.label }),
          e.detail && jsx(`p`, { className: `mt-0.5 text-[11.5px] leading-snug text-mist`, children: e.detail }),
        ],
      }),
    ],
  });
}

export default Df;
