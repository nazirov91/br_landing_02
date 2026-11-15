import type { CSSProperties, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";

export type InterferenceRibbonsProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  colors?: [string, string];
  backgroundColor?: string;
  mode?: "auto" | "glow" | "ink";
  wires?: number;
  lineWidth?: number;
  ribbonWidth?: number;
  amplitude?: number;
  waveLength?: number;
  angle?: number;
  twist?: number;
  curl?: number;
  depth?: number;
  stripes?: number;
  colorFlow?: number;
  glow?: number;
  intensity?: number;
  speed?: number;
  spin?: number;
  interactive?: boolean;
  hoverPulses?: boolean;
  clickPulse?: boolean;
  pulseSpeed?: number;
  pulseStrength?: number;
  hoverBoost?: number;
  paused?: boolean;
  quality?: number;
};

export type InterferenceRibbonsHandle = { pulse: (x?: number) => void };

declare const InterferenceRibbons: ForwardRefExoticComponent<InterferenceRibbonsProps & RefAttributes<InterferenceRibbonsHandle>>;
export default InterferenceRibbons;
