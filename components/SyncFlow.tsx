"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, Ban, CircleDollarSign, Send, Truck } from "lucide-react";
import { SUPER_DISPATCH } from "@/lib/content";

/*
  The BeRocker <-> Super Dispatch map. Its code is fetched only when the section is
  close to the screen and the screen is wide enough to show it; until then the space
  is reserved so nothing on the page moves. Phones get the plain list instead.
*/
const IntegrationFlow = dynamic(() => import("@/components/IntegrationFlow"), { ssr: false });

const ICONS = { send: Send, offers: CircleDollarSign, dispatch: Truck, status: ArrowLeftRight, cancel: Ban } as const;

type Palette = { accent: string; navy: string };

export default function SyncFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [palette, setPalette] = useState<Palette | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 900px)");
    const css = getComputedStyle(document.documentElement);
    setPalette({ accent: css.getPropertyValue("--color-accent").trim(), navy: css.getPropertyValue("--color-navy").trim() });

    let near = false;
    const update = () => setShow((s) => s || (near && wide.matches));
    const io = new IntersectionObserver(
      (entries) => {
        near = entries[0]?.isIntersecting ?? false;
        update();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    wide.addEventListener("change", update);
    return () => {
      io.disconnect();
      wide.removeEventListener("change", update);
    };
  }, []);

  return (
    <div ref={ref} className="min-h-[470px]">
      {show && palette && (
        <IntegrationFlow
          theme="light"
          source={{
            title: "BeRocker",
            subtitle: "Leads, quotes and loads",
            logo: <MarkLogo />,
            status: "Connected",
          }}
          target={{
            title: "Super Dispatch",
            subtitle: "Carriers and dispatch",
            logo: <Truck aria-hidden="true" className="size-7 text-navy" />,
            status: "Connected",
          }}
          items={SUPER_DISPATCH.flow.map((f) => {
            const Icon = ICONS[f.icon as keyof typeof ICONS];
            return {
              id: f.title,
              title: f.title,
              subtitle: f.subtitle,
              outbound: f.outbound,
              inbound: f.inbound,
              icon: <Icon aria-hidden="true" className="size-[18px]" />,
            };
          })}
          outboundColor={palette.accent}
          inboundColor={palette.navy}
          outboundLabel="BeRocker sends"
          inboundLabel="Super Dispatch sends back"
          pulseInterval={6}
        />
      )}
    </div>
  );
}

function MarkLogo() {
  return (
    <svg viewBox="4 9 52 28" aria-hidden="true" className="h-auto w-full">
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
