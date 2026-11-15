"use client";

import { useEffect, useState } from "react";
import InterferenceRibbons, { type InterferenceRibbonsProps } from "@/components/InterferenceRibbons";

/*
  Interference Ribbons coloured from the design tokens, so the palette stays defined in
  one place (app/globals.css). The ribbon blends accent into violet over the navy panel.
*/
type Palette = { accent: string; violet: string; navy: string };

function readPalette(): Palette | null {
  const css = getComputedStyle(document.documentElement);
  const v = (n: string) => css.getPropertyValue(n).trim();
  const p = { accent: v("--color-accent"), violet: v("--color-violet"), navy: v("--color-navy") };
  return p.accent && p.violet && p.navy ? p : null;
}

export default function Ribbons(props: Omit<InterferenceRibbonsProps, "colors" | "backgroundColor" | "mode">) {
  const [palette, setPalette] = useState<Palette | null>(null);
  useEffect(() => setPalette(readPalette()), []);
  if (!palette) return null;
  return (
    <InterferenceRibbons
      {...props}
      colors={[palette.accent, palette.violet]}
      backgroundColor={palette.navy}
      mode="glow"
      style={{ position: "absolute", inset: 0, minHeight: 0, ...props.style }}
    />
  );
}
