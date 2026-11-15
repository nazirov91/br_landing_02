"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV, SITE } from "@/lib/content";
import { Logo, buttonClass, softEase } from "@/components/ui";
import { useDemo } from "@/components/DemoProvider";

/*
  Floats over the dark hero, then docks into a solid light bar once the page scrolls.
*/
export default function SiteHeader() {
  const [docked, setDocked] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { openDemo } = useDemo();

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const light = docked || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        light ? "bg-white/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className={`mx-auto flex h-16 w-full max-w-[calc(1200px+6rem)] items-center justify-between px-5 transition-[padding] duration-300 sm:px-12 ${light ? "" : "sm:pt-3"}`}>
        <a href="#top" className="flex items-center rounded-md" aria-label="BeRocker, back to top">
          <Logo dark={!light} className="h-8 w-auto" />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 min-[900px]:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors ${
                light ? "text-ink-2 hover:bg-surface hover:text-ink" : "text-white/75 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={SITE.appUrl}
            className={`hidden rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors min-[900px]:inline-flex ${
              light ? "text-ink-2 hover:text-ink" : "text-white/75 hover:text-white"
            }`}
          >
            Sign in
          </a>
          <button
            type="button"
            onClick={() => openDemo({ source: "header" })}
            className={buttonClass(light ? "primary" : "glass", "md", "h-10 px-4 text-[14px]")}
          >
            Book a demo
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className={`grid size-10 place-items-center rounded-lg min-[900px]:hidden ${light ? "text-ink hover:bg-surface" : "text-white hover:bg-white/10"}`}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Menu"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: softEase }}
            className="overflow-hidden border-t border-line bg-white min-[900px]:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-6 pt-3">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: softEase, delay: 0.04 * i }}
                  className="rounded-lg px-3 py-3 text-lg font-semibold text-ink hover:bg-surface"
                >
                  {n.label}
                </motion.a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={SITE.appUrl} className={buttonClass("light", "lg")}>
                  Sign in
                </a>
                <a href={SITE.signUpUrl} className={buttonClass("primary", "lg")}>
                  Start free trial
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
