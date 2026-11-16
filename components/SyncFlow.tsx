"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  Banknote,
  ClipboardList,
  MessageSquareText,
  Package,
  ShieldCheck,
  Tag,
  Truck,
  Users,
} from "lucide-react";
import { SUPER_DISPATCH } from "@/lib/content";

/*
  Everything BeRocker and Super Dispatch exchange, as a live wiring map.
  The map's code is fetched only when the section is close to the screen, and its space
  is reserved so nothing moves. Wide screens get it side by side; phones get the same
  map stacked, with the cables running down both edges.
*/
const IntegrationFlow = dynamic(() => import("@/components/IntegrationFlow"), { ssr: false });

const ICONS = {
  loads: Package,
  offers: MessageSquareText,
  dispatch: Truck,
  pricing: Tag,
  carriers: Users,
  orders: ClipboardList,
  money: Banknote,
  checks: ShieldCheck,
} as const;

const ROWS = SUPER_DISPATCH.flow;

type Palette = { out: string; back: string; navy: string };

export default function SyncFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  // Pulses run only while the map is actually on screen.
  const [visible, setVisible] = useState(false);
  const [palette, setPalette] = useState<Palette | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const css = getComputedStyle(document.documentElement);
    const v = (n: string) => css.getPropertyValue(n).trim();
    setPalette({ out: v("--color-accent"), back: v("--color-success"), navy: v("--color-navy") });

    let near = false;
    const update = () => setShow((s) => s || near);
    const io = new IntersectionObserver(
      (entries) => {
        near = entries[0]?.isIntersecting ?? false;
        update();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    const seen = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? false));
    seen.observe(el);
    return () => {
      io.disconnect();
      seen.disconnect();
    };
  }, []);

  return (
    <div className="surface rounded-[var(--radius-panel)]">
      {/* Header strip: what the map means */}
      <div className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-[17px] font-medium text-ink">The most synchronized CRM on Super Dispatch</p>
          <p className="mt-0.5 text-[14px] text-ink-3">
            Fully wired, both ways. Change it in one place and the other already knows.
            <span className="hidden min-[900px]:inline"> Hover a row to follow its connection.</span>
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 self-start whitespace-nowrap rounded-full bg-card px-3 py-1 text-[13px] font-semibold text-ink shadow-quiet sm:self-center">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Fully wired
        </span>
      </div>

      {/* The wiring map, loaded on demand. Side by side on wide screens, stacked on phones. */}
      <div ref={ref} className="flex min-h-[362px] items-center py-1 sm:min-h-[430px] sm:px-2 min-[960px]:min-h-[610px] min-[960px]:py-3">
        {show && palette && (
          <IntegrationFlow
            theme="light"
            source={{
              title: "BeRocker",
              subtitle: "Your loads, offers and carriers",
              logo: <BeRockerMark />,
              logoBackground: palette.navy,
            }}
            target={{
              title: "Super Dispatch",
              logo: (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/img/super-dispatch-mark.svg" alt="" width={40} height={40} className="block size-full" />
              ),
              status: "Connected",
            }}
            items={ROWS.map((r) => {
              const Icon = ICONS[r.icon as keyof typeof ICONS];
              return {
                id: r.title,
                title: r.title,
                subtitle: r.subtitle,
                outbound: r.outbound,
                inbound: r.inbound,
                icon: <Icon aria-hidden="true" className="size-[18px]" />,
              };
            })}
            outboundColor={palette.out}
            inboundColor={palette.back}
            outboundLabel="BeRocker sends"
            inboundLabel="Super Dispatch sends"
            pulseInterval={5}
            animated={visible}
            rowGap={8}
            compactBelow={860}
          />
        )}
      </div>

    </div>
  );
}

/** BeRocker mark for the dark logo tile. */
function BeRockerMark() {
  return (
    <svg viewBox="4 9 52 28" aria-hidden="true" className="h-auto w-full">
      <path
        className="fill-white"
        d="M16.7808 10.6203L5.33263 21.9496C4.77196 22.5045 4.77042 23.4098 5.32919 23.9665L16.2133 34.8114C16.7599 35.356 17.6412 35.365 18.1987 34.8317L22.716 30.5107C23.2928 29.959 23.3022 29.0404 22.7367 28.477L18.2273 23.9838C17.6619 23.4204 17.6712 22.5019 18.2481 21.9501L22.7856 17.6098C23.335 17.0842 24.2008 17.0842 24.7503 17.6098L29.3508 22.0103C29.9029 22.5385 30.7738 22.5355 31.3224 22.0037L35.7857 17.6766C36.3562 17.1236 36.3624 16.2103 35.7996 15.6495L30.7557 10.6237C30.4893 10.3583 30.1286 10.2093 29.7526 10.2093H17.7805C17.4061 10.2093 17.0469 10.357 16.7808 10.6203Z"
      />
      <path
        className="fill-accent"
        d="M43.7235 35.3797L55.1717 24.0504C55.7323 23.4956 55.7339 22.5903 55.1751 22.0335L44.291 11.1886C43.7444 10.644 42.8631 10.635 42.3055 11.1684L37.7883 15.4893C37.2115 16.0411 37.2021 16.9596 37.7676 17.523L42.277 22.0162C42.8424 22.5796 42.8331 23.4982 42.2562 24.0499L37.7187 28.3902C37.1693 28.9158 36.3034 28.9158 35.754 28.3902L31.1535 23.9897C30.6014 23.4616 29.7305 23.4645 29.1819 23.9963L24.7186 28.3234C24.1481 28.8765 24.1418 29.7898 24.7047 30.3506L29.7486 35.3763C30.015 35.6417 30.3757 35.7908 30.7517 35.7908H42.7238C43.0982 35.7908 43.4574 35.6431 43.7235 35.3797Z"
      />
    </svg>
  );
}
