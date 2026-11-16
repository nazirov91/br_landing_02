"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV, SITE } from "@/lib/content";
import { Container, Logo, buttonClass, ease } from "@/components/ui";
import { useDemo } from "@/components/DemoProvider";

/* Hourline's header: sticky on the page colour, a hairline appears once the page scrolls. */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { openDemo } = useDemo();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 901px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 bg-page/90 backdrop-blur-xl transition-shadow duration-200 ${
        scrolled || open ? "shadow-[0_1px_0_var(--color-line)]" : ""
      }`}
    >
      <Container className="flex h-[72px] items-center gap-4 sm:gap-8">
        <a href="#top" className="flex shrink-0 items-center rounded-md" aria-label="BeRocker, back to top">
          <Logo className="h-[26px] w-auto sm:h-[30px]" />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 min-[901px]:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="inline-flex h-10 items-center rounded-lg px-3 text-[15px] font-medium text-ink-2 transition-colors hover:bg-page-2 hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <a
            href={SITE.appUrl}
            className="hidden h-10 items-center rounded-lg px-3 text-[15px] font-medium text-ink-2 transition-colors hover:bg-page-2 hover:text-ink min-[901px]:inline-flex"
          >
            Sign in
          </a>
          <button type="button" onClick={() => openDemo({ source: "header" })} className={buttonClass("primary", "md", "h-10 px-3.5 text-[14px] sm:px-4 sm:text-[15px]")}>
            Book a demo
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="grid size-11 place-items-center rounded-lg text-ink hover:bg-page-2 min-[901px]:hidden"
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Menu"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
            className="absolute inset-x-0 top-full border-b border-line bg-page shadow-card min-[901px]:hidden"
          >
            <Container className="flex flex-col gap-1 pb-6 pt-2">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-[20px] font-medium tracking-[-0.01em] text-ink hover:bg-page-2"
                >
                  {n.label}
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={SITE.appUrl} className={buttonClass("quiet", "lg")}>
                  Sign in
                </a>
                <a href={SITE.signUpUrl} className={buttonClass("primary", "lg")}>
                  Start free trial
                </a>
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
