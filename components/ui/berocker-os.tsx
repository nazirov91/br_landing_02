"use client";

/*
  BeRocker OS: the hero visual. BeRocker shown as the operating system for auto transport:
  a menu bar with live status, a dock of modules as apps with AI agents at the core, and app
  windows that play one sample shipment through the system on their own (lead in, AI quote,
  loadboard offers, dispatch, money, ask ChatGPT, integrations). Any dock app can be opened
  by hand; autoplay pauses on hover, off screen and for reduced motion.

  Sample data only. Every colour is a token.
*/

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  Calculator,
  Car,
  Check,
  CircleDot,
  Inbox,
  Plug,
  Sparkles,
  Truck,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const EASE = [0.22, 1, 0.36, 1] as const;
const INTERVAL = 3800;

type AppId = "leads" | "ai" | "loadboards" | "dispatch" | "accounting" | "chatgpt" | "integrations";
type App = { id: AppId; name: string; icon: LucideIcon; status: string; core?: boolean };

const APPS: Record<AppId, App> = {
  leads: { id: "leads", name: "Lead Management", icon: Inbox, status: "3 new" },
  ai: { id: "ai", name: "AI agents", icon: Sparkles, status: "Always on", core: true },
  loadboards: { id: "loadboards", name: "Loadboards", icon: Waypoints, status: "Posted" },
  dispatch: { id: "dispatch", name: "Dispatch", icon: Truck, status: "On schedule" },
  accounting: { id: "accounting", name: "Accounting", icon: Calculator, status: "Up to date" },
  chatgpt: { id: "chatgpt", name: "ChatGPT", icon: Bot, status: "Through MCP" },
  integrations: { id: "integrations", name: "Integrations", icon: Plug, status: "All connected" },
};

// The dock, left to right, with AI agents in the middle as the core.
const DOCK: AppId[] = ["leads", "loadboards", "dispatch", "ai", "accounting", "integrations", "chatgpt"];
// The order one shipment moves through the system.
const STORY: AppId[] = ["leads", "ai", "loadboards", "dispatch", "accounting", "chatgpt", "integrations"];
const nextApp = (id: AppId) => STORY[(STORY.indexOf(id) + 1) % STORY.length];

/* ───────────── Small parts ───────────── */

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="4 9 52 28" aria-hidden="true" className={className}>
      <path
        className="fill-ink"
        d="M16.7808 10.6203L5.33263 21.9496C4.77196 22.5045 4.77042 23.4098 5.32919 23.9665L16.2133 34.8114C16.7599 35.356 17.6412 35.365 18.1987 34.8317L22.716 30.5107C23.2928 29.959 23.3022 29.0404 22.7367 28.477L18.2273 23.9838C17.6619 23.4204 17.6712 22.5019 18.2481 21.9501L22.7856 17.6098C23.335 17.0842 24.2008 17.0842 24.7503 17.6098L29.3508 22.0103C29.9029 22.5385 30.7738 22.5355 31.3224 22.0037L35.7857 17.6766C36.3562 17.1236 36.3624 16.2103 35.7996 15.6495L30.7557 10.6237C30.4893 10.3583 30.1286 10.2093 29.7526 10.2093H17.7805C17.4061 10.2093 17.0469 10.357 16.7808 10.6203Z"
      />
      <path
        className="fill-accent"
        d="M43.7235 35.3797L55.1717 24.0504C55.7323 23.4956 55.7339 22.5903 55.1751 22.0335L44.291 11.1886C43.7444 10.644 42.8631 10.635 42.3055 11.1684L37.7883 15.4893C37.2115 16.0411 37.2021 16.9596 37.7676 17.523L42.277 22.0162C42.8424 22.5796 42.8331 23.4982 42.2562 24.0499L37.7187 28.3902C37.1693 28.9158 36.3034 28.9158 35.754 28.3902L31.1535 23.9897C30.6014 23.4616 29.7305 23.4645 29.1819 23.9963L24.7186 28.3234C24.1481 28.8765 24.1418 29.7898 24.7047 30.3506L29.7486 35.3763C30.015 35.6417 30.3757 35.7908 30.7517 35.7908H42.7238C43.0982 35.7908 43.4574 35.6431 43.7235 35.3797Z"
      />
    </svg>
  );
}

function Dot({ tone = "success", pulse = false }: { tone?: "success" | "accent"; pulse?: boolean }) {
  return (
    <span className="relative flex size-1.5 shrink-0" aria-hidden="true">
      {pulse && <span className={cx("absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden", tone === "success" ? "bg-success" : "bg-accent")} />}
      <span className={cx("relative inline-flex size-1.5 rounded-full", tone === "success" ? "bg-success" : "bg-accent")} />
    </span>
  );
}

/** Children appear one after another when a window opens. */
function Stagger({ children, i, className = "" }: { children: ReactNode; i: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: 0.12 + i * 0.09 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "success" }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-semibold",
        tone === "neutral" && "bg-fill text-ink-2",
        tone === "accent" && "bg-accent-soft text-accent-ink",
        tone === "success" && "bg-success-soft text-success",
      )}
    >
      {children}
    </span>
  );
}

/* ───────────── The app windows (sample data) ───────────── */

function LeadsWindow() {
  const rows = [
    { v: "2021 Toyota RAV4", r: "Dallas, TX → Denver, CO", src: "Website form", t: "Just now", isNew: true },
    { v: "2019 Honda Accord", r: "Chicago, IL → Tampa, FL", src: "Lead provider", t: "2 min" },
    { v: "2023 Jeep Wrangler", r: "Phoenix, AZ → Portland, OR", src: "Email", t: "6 min" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <Stagger key={row.v} i={i}>
          <div className={cx("flex items-center gap-3 rounded-[12px] px-3 py-2.5", row.isNew ? "bg-accent-soft ring-1 ring-accent-line" : "bg-fill")}>
            <span className={cx("grid size-8 shrink-0 place-items-center rounded-[10px]", row.isNew ? "bg-accent text-white" : "bg-card text-ink-3 ring-1 ring-line")}>
              <Car aria-hidden="true" className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                <span className="truncate">{row.v}</span>
                {row.isNew && <Chip tone="accent">New</Chip>}
              </span>
              <span className="block truncate text-[11.5px] text-ink-3">{row.r}</span>
            </span>
            <span className="hidden shrink-0 flex-col items-end gap-0.5 min-[420px]:flex">
              <Chip>{row.src}</Chip>
              <span className="text-[10.5px] text-ink-3">{row.t}</span>
            </span>
          </div>
        </Stagger>
      ))}
      <Stagger i={3}>
        <p className="flex items-center gap-1.5 pt-1 text-[11.5px] text-ink-3">
          <Check aria-hidden="true" className="size-3.5 text-success" strokeWidth={2.6} /> Every source in one inbox, assigned to the right rep
        </p>
      </Stagger>
    </div>
  );
}

function AiWindow() {
  return (
    <div className="flex flex-col gap-2.5">
      <Stagger i={0} className="max-w-[86%]">
        <p className="mb-1 text-[10.5px] font-semibold text-ink-3">Customer · SMS</p>
        <p className="rounded-[14px] rounded-tl-[4px] bg-fill px-3 py-2 text-[12.5px] leading-snug text-ink">Hi, how much to ship my RAV4 from Dallas to Denver?</p>
      </Stagger>
      <Stagger i={1} className="ml-auto max-w-[86%]">
        <p className="mb-1 flex items-center justify-end gap-1 text-[10.5px] font-semibold text-accent-ink">
          <Sparkles aria-hidden="true" className="size-3" /> AI agent · replied in 12s
        </p>
        <p className="rounded-[14px] rounded-tr-[4px] bg-accent px-3 py-2 text-[12.5px] leading-snug text-white">
          Open transport is $850 and we can pick up this week. Want me to send your booking link?
        </p>
      </Stagger>
      <Stagger i={2} className="flex flex-wrap gap-1.5 pt-0.5">
        <Chip tone="success">
          <Check aria-hidden="true" className="size-3" strokeWidth={3} /> Quote sent
        </Chip>
        <Chip tone="success">
          <Check aria-hidden="true" className="size-3" strokeWidth={3} /> Booking link sent
        </Chip>
        <Chip>Follow-up drafted</Chip>
      </Stagger>
    </div>
  );
}

function LoadboardsWindow() {
  const offers = [
    { c: "FastHaul", p: "$650", best: true },
    { c: "Prime Auto", p: "$675" },
    { c: "RoadStar", p: "$700" },
  ];
  return (
    <div className="flex flex-col gap-2">
      <Stagger i={0} className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-[12px] bg-fill px-2.5 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/super-dispatch-mark.svg" alt="" width={18} height={18} className="size-[18px]" />
          <span className="min-w-0 text-[11.5px] font-semibold leading-tight text-ink">
            Super Dispatch
            <span className="flex items-center gap-1 font-medium text-success">
              <Check aria-hidden="true" className="size-3" strokeWidth={3} /> Posted
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-[12px] bg-fill px-2.5 py-2">
          <span className="grid size-[18px] place-items-center rounded-[5px] bg-ink text-[8px] font-bold text-white" aria-hidden="true">
            CD
          </span>
          <span className="min-w-0 text-[11.5px] font-semibold leading-tight text-ink">
            Central Dispatch
            <span className="flex items-center gap-1 font-medium text-success">
              <Check aria-hidden="true" className="size-3" strokeWidth={3} /> Posted
            </span>
          </span>
        </div>
      </Stagger>
      <Stagger i={1}>
        <p className="pt-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">Carrier offers</p>
      </Stagger>
      {offers.map((o, i) => (
        <Stagger key={o.c} i={i + 2}>
          <div className={cx("flex items-center justify-between rounded-[12px] px-3 py-2", o.best ? "bg-accent-soft ring-1 ring-accent-line" : "bg-fill")}>
            <span className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
              <Truck aria-hidden="true" className={cx("size-3.5", o.best ? "text-accent" : "text-ink-3")} /> {o.c}
              {o.best && <Chip tone="accent">Best</Chip>}
            </span>
            <span className="text-[13px] font-semibold tabular-nums text-ink">{o.p}</span>
          </div>
        </Stagger>
      ))}
    </div>
  );
}

function DispatchWindow() {
  const steps = [
    { t: "Booked", d: "Today, 10:12", done: true },
    { t: "Dispatched to FastHaul", d: "Today, 10:40", done: true },
    { t: "Pickup in Dallas", d: "Tomorrow, 8 to 12", now: true },
    { t: "Delivery in Denver", d: "Friday" },
  ];
  return (
    <div className="flex flex-col">
      <Stagger i={0} className="mb-3 flex items-center justify-between gap-2 rounded-[12px] bg-fill px-3 py-2">
        <span className="text-[12.5px] font-semibold text-ink">2021 Toyota RAV4</span>
        <span className="text-[11.5px] text-ink-3">Dallas, TX → Denver, CO</span>
      </Stagger>
      <ol className="flex flex-col">
        {steps.map((s, i) => (
          <Stagger key={s.t} i={i + 1}>
            <li className="relative flex gap-3 pb-3 last:pb-0">
              {i < steps.length - 1 && <span aria-hidden="true" className={cx("absolute left-[9px] top-5 h-[calc(100%-12px)] w-px", s.done ? "bg-accent" : "bg-line-2")} />}
              <span
                className={cx(
                  "relative grid size-[19px] shrink-0 place-items-center rounded-full",
                  s.done && "bg-accent text-white",
                  s.now && "bg-card ring-2 ring-accent",
                  !s.done && !s.now && "bg-card ring-1 ring-line-2",
                )}
              >
                {s.done && <Check aria-hidden="true" className="size-3" strokeWidth={3} />}
                {s.now && <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" />}
              </span>
              <span className="-mt-0.5">
                <span className={cx("block text-[12.5px] font-semibold", s.done || s.now ? "text-ink" : "text-ink-3")}>{s.t}</span>
                <span className="block text-[11px] text-ink-3">{s.d}</span>
              </span>
            </li>
          </Stagger>
        ))}
      </ol>
    </div>
  );
}

function AccountingWindow() {
  const lines = [
    { k: "Customer price", v: "$850" },
    { k: "Deposit received", v: "$150", tag: "Paid" },
    { k: "Carrier pay, on delivery", v: "$650" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {lines.map((l, i) => (
        <Stagger key={l.k} i={i}>
          <div className="flex items-center justify-between rounded-[12px] bg-fill px-3 py-2.5">
            <span className="flex items-center gap-2 text-[12.5px] text-ink-2">
              {l.k}
              {l.tag && (
                <Chip tone="success">
                  <Check aria-hidden="true" className="size-3" strokeWidth={3} /> {l.tag}
                </Chip>
              )}
            </span>
            <span className="text-[13px] font-semibold tabular-nums text-ink">{l.v}</span>
          </div>
        </Stagger>
      ))}
      <Stagger i={3}>
        <div className="flex items-center justify-between rounded-[12px] bg-navy px-3 py-3">
          <span className="text-[12.5px] font-semibold text-white">Your margin</span>
          <span className="text-[18px] font-semibold tabular-nums tracking-[-0.02em] text-white">$200</span>
        </div>
      </Stagger>
      <Stagger i={4}>
        <p className="pt-0.5 text-[11.5px] text-ink-3">Payments, carrier payables and commissions on the same shipment.</p>
      </Stagger>
    </div>
  );
}

function ChatgptWindow() {
  const rows = [
    { v: "Toyota RAV4", r: "Dallas → Denver", s: "Quote sent" },
    { v: "Jeep Wrangler", r: "Phoenix → Portland", s: "Awaiting reply" },
    { v: "Honda Accord", r: "Chicago → Tampa", s: "Follow-up due" },
  ];
  return (
    <div className="flex flex-col gap-2">
      <Stagger i={0} className="ml-auto max-w-[86%]">
        <p className="rounded-[14px] rounded-tr-[4px] bg-ink px-3 py-2 text-[12.5px] text-white">Who needs a follow-up today?</p>
      </Stagger>
      <Stagger i={1}>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-success">
          <Check aria-hidden="true" className="size-3.5" strokeWidth={2.6} /> Read from BeRocker
        </p>
        <p className="mt-1 text-[12.5px] text-ink">You have 3 leads due for a follow-up.</p>
      </Stagger>
      {rows.map((row, i) => (
        <Stagger key={row.v} i={i + 2}>
          <div className="flex items-center justify-between gap-2 rounded-[12px] bg-fill px-3 py-2">
            <span className="min-w-0">
              <span className="block text-[12.5px] font-semibold text-ink">{row.v}</span>
              <span className="block text-[11px] text-ink-3">{row.r}</span>
            </span>
            <Chip tone={i === 2 ? "accent" : "neutral"}>{row.s}</Chip>
          </div>
        </Stagger>
      ))}
    </div>
  );
}

function IntegrationsWindow() {
  const groups = [
    { g: "Phones", items: ["RingCentral", "Twilio", "Telnyx"] },
    { g: "Messages", items: ["WhatsApp", "SendGrid", "Mailgun"] },
    { g: "Payments", items: ["Stripe", "Square", "Authorize.net"] },
    { g: "Dispatch", items: ["Super Dispatch", "Central Dispatch"] },
  ];
  return (
    <div className="flex flex-col gap-2">
      {groups.map((grp, i) => (
        <Stagger key={grp.g} i={i}>
          <div className="flex flex-wrap items-center gap-1.5 rounded-[12px] bg-fill px-3 py-2">
            <span className="w-full shrink-0 text-[11px] font-semibold text-ink-3 min-[420px]:w-[68px]">{grp.g}</span>
            {grp.items.map((name) => (
              <span key={name} className="inline-flex items-center gap-1.5 rounded-full bg-card px-2 py-0.5 text-[11px] font-medium text-ink ring-1 ring-line">
                <Dot /> {name}
              </span>
            ))}
          </div>
        </Stagger>
      ))}
      <Stagger i={4}>
        <p className="hidden pt-0.5 text-[11.5px] text-ink-3 sm:block">Keep your numbers, inboxes and processors. Webhooks and an API for the rest.</p>
      </Stagger>
    </div>
  );
}

const WINDOWS: Record<AppId, () => ReactNode> = {
  leads: LeadsWindow,
  ai: AiWindow,
  loadboards: LoadboardsWindow,
  dispatch: DispatchWindow,
  accounting: AccountingWindow,
  chatgpt: ChatgptWindow,
  integrations: IntegrationsWindow,
};

/* ───────────── Window chrome ───────────── */

function AppWindow({ app, progress, children }: { app: App; progress: boolean; children: ReactNode }) {
  const Icon = app.icon;
  return (
    <div className="overflow-hidden rounded-[16px] bg-card shadow-float ring-1 ring-line">
      <div className="relative flex h-11 items-center gap-2.5 border-b border-line px-3.5">
        <span className={cx("grid size-6 place-items-center rounded-[8px]", app.core ? "bg-navy text-white" : "bg-accent-soft text-accent")}>
          <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.2} />
        </span>
        <span className="text-[13px] font-semibold text-ink">{app.name}</span>
        <span className="ms-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-3">
          <Dot pulse /> {app.status}
        </span>
        {progress && (
          <motion.span
            aria-hidden="true"
            className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: INTERVAL / 1000, ease: "linear" }}
          />
        )}
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  );
}

/** A window further back on the desktop: title bar and a few quiet lines. */
function GhostWindow({ app, className }: { app: App; className: string }) {
  const Icon = app.icon;
  return (
    <div aria-hidden="true" className={cx("absolute overflow-hidden rounded-[14px] bg-card/80 shadow-card ring-1 ring-line", className)}>
      <div className="flex h-9 items-center gap-2 border-b border-line px-3">
        <span className="grid size-5 place-items-center rounded-[6px] bg-fill text-ink-3">
          <Icon className="size-3" />
        </span>
        <span className="text-[11.5px] font-semibold text-ink-3">{app.name}</span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <span className="h-2 w-3/4 rounded-full bg-fill" />
        <span className="h-2 w-1/2 rounded-full bg-fill" />
        <span className="h-2 w-2/3 rounded-full bg-fill" />
      </div>
    </div>
  );
}

/* ───────────── The OS ───────────── */

export default function BeRockerOS({ className = "" }: { className?: string }) {
  const [active, setActive] = useState<AppId>("leads");
  const [autoplay, setAutoplay] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<number | undefined>(undefined);
  const reducedRef = useRef(false);

  // Start playing once mounted, unless the visitor asked for less motion.
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAutoplay(!reducedRef.current);
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e?.isIntersecting ?? false));
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(resumeRef.current);
    };
  }, []);

  const playing = autoplay && !hovered && inView;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setActive((a) => nextApp(a)), INTERVAL);
    return () => window.clearTimeout(t);
  }, [playing, active]);

  // Opening an app by hand pauses the tour for a while, then it carries on from there.
  const open = (id: AppId) => {
    setActive(id);
    setAutoplay(false);
    window.clearTimeout(resumeRef.current);
    if (!reducedRef.current) resumeRef.current = window.setTimeout(() => setAutoplay(true), 10000);
  };

  const app = APPS[active];
  const Window = WINDOWS[active];
  const ghostA = APPS[nextApp(active)];
  const ghostB = APPS[nextApp(nextApp(active))];

  return (
    <div className={className}>
      <div
        ref={frameRef}
        role="group"
        aria-label="BeRocker OS preview with a sample shipment"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        className="overflow-hidden rounded-[22px] bg-card shadow-float ring-1 ring-line"
      >
        {/* Menu bar */}
        <div className="flex h-10 items-center gap-2.5 border-b border-line bg-card px-3.5 sm:px-4">
          <Mark className="h-[13px] w-auto" />
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-ink">BeRocker OS</span>
          <span className="hidden text-[12px] text-ink-3 min-[440px]:inline">· {app.name}</span>
          <span className="ms-auto flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-fill px-2 py-0.5 text-[10.5px] font-semibold text-ink-2">
              <Dot pulse /> <span className="hidden min-[400px]:inline">Super Dispatch</span> synced
            </span>
            <span className="hidden items-center gap-1.5 rounded-full bg-accent-soft px-2 py-0.5 text-[10.5px] font-semibold text-accent-ink sm:inline-flex">
              <Sparkles aria-hidden="true" className="size-3" /> AI agents on
            </span>
          </span>
        </div>

        {/* Desktop */}
        <div
          className="relative h-[460px] overflow-hidden"
          style={{
            backgroundColor: "var(--color-page)",
            backgroundImage:
              "radial-gradient(60% 50% at 50% 35%, color-mix(in oklab, var(--color-accent) 10%, transparent), transparent 70%), radial-gradient(color-mix(in oklab, var(--color-mist) 55%, transparent) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 22px 22px",
          }}
        >
          <GhostWindow app={ghostA} className="left-[4%] top-[9%] hidden w-[46%] -rotate-[1.5deg] opacity-80 sm:block" />
          <GhostWindow app={ghostB} className="right-[4%] top-[5%] hidden w-[44%] rotate-[1.5deg] opacity-70 sm:block" />

          <div className="absolute inset-x-3 top-4 mx-auto max-w-[430px] sm:inset-x-6 sm:top-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <AppWindow app={app} progress={playing}>
                  <Window />
                </AppWindow>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dock */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center px-2">
            <div role="toolbar" aria-label="Apps" className="flex items-end gap-1 rounded-[18px] bg-card/85 p-1.5 shadow-float ring-1 ring-line backdrop-blur-xl sm:gap-1.5">
              {DOCK.map((id) => {
                const a = APPS[id];
                const Icon = a.icon;
                const on = id === active;
                return (
                  <div key={id} className={cx("flex items-end", a.core && "mx-1 border-x border-line px-1.5 sm:mx-1.5 sm:px-2")}>
                    <button
                      type="button"
                      aria-label={`Open ${a.name}`}
                      aria-pressed={on}
                      onClick={() => open(id)}
                      className={cx(
                        "group relative grid size-9 place-items-center rounded-[11px] transition-[transform,box-shadow,background-color] duration-200 ease-[var(--ease-out)] hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:size-11 sm:rounded-[13px]",
                        a.core && "bg-navy text-white shadow-button",
                        !a.core && (on ? "bg-accent-soft text-accent ring-2 ring-accent" : "bg-card text-accent ring-1 ring-line"),
                        on && a.core && "ring-2 ring-accent ring-offset-2 ring-offset-card",
                      )}
                    >
                      <Icon aria-hidden="true" className="size-4 sm:size-[19px]" strokeWidth={2} />
                      <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
                        {a.name}
                      </span>
                      <span aria-hidden="true" className={cx("absolute -bottom-[5px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent transition-opacity", on ? "opacity-100" : "opacity-0")} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-ink-3">
        <CircleDot aria-hidden="true" className="size-3.5 text-accent" /> One sample shipment, through every app. Tap any app in the dock.
      </p>
    </div>
  );
}
