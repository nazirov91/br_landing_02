"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import DemoForm from "@/components/DemoForm";
import { ease } from "@/components/ui";

type Request = { source: string; plan?: "pro" | "enterprise" };
type Ctx = { openDemo: (r: Request) => void };

const DemoContext = createContext<Ctx>({ openDemo: () => {} });
export const useDemo = () => useContext(DemoContext);

export default function DemoProvider({ children }: { children: ReactNode }) {
  const [req, setReq] = useState<Request | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const openDemo = useCallback((r: Request) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setReq(r);
  }, []);
  const close = useCallback(() => {
    setReq(null);
    requestAnimationFrame(() => returnFocus.current?.focus());
  }, []);

  return (
    <DemoContext.Provider value={{ openDemo }}>
      {children}
      <AnimatePresence>{req && <DemoDialog key="demo" req={req} onClose={close} />}</AnimatePresence>
    </DemoContext.Provider>
  );
}

function DemoDialog({ req, onClose }: { req: Request; onClose: () => void }) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("input, button");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, iframe, [tabindex]:not([tabindex="-1"])')];
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const enterprise = req.plan === "enterprise";

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
    >
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-dialog-title"
        className="relative max-h-[92dvh] w-full max-w-[620px] overflow-y-auto rounded-t-[var(--radius-panel)] bg-card p-6 shadow-float sm:rounded-[var(--radius-panel)] sm:p-8"
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-ink-3 transition-colors hover:bg-fill hover:text-ink"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
        <p className="text-[13px] font-semibold uppercase tracking-wide text-accent">{enterprise ? "Enterprise" : "Book a demo"}</p>
        <h2 id="demo-dialog-title" className="mt-2 pr-10 text-[24px] font-medium tracking-[-0.02em] text-ink">
          {enterprise ? "Tell us about your brokerage" : "See BeRocker on your own lanes"}
        </h2>
        <p className="mt-2 text-[15px] text-ink-3">
          {enterprise
            ? "We'll shape a plan around your team, your domain and your requirements."
            : "A 30-minute walkthrough of intake, pricing, conversations and dispatch, built around how you work."}
        </p>
        <div className="mt-6">
          <DemoForm source={req.source} plan={req.plan} compact onDone={onClose} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** A button that opens the demo dialog. */
export function DemoButton({
  source,
  plan,
  className,
  children,
}: {
  source: string;
  plan?: "pro" | "enterprise";
  className: string;
  children: ReactNode;
}) {
  const { openDemo } = useDemo();
  return (
    <button type="button" className={className} onClick={() => openDemo({ source, plan })}>
      {children}
    </button>
  );
}
