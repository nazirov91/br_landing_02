"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import DemoProvider from "@/components/DemoProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <DemoProvider>{children}</DemoProvider>
    </MotionConfig>
  );
}
