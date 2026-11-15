import { CalendarCheck, Clock, Headset } from "lucide-react";
import InterferenceRibbons from "@/components/InterferenceRibbons";
import DemoForm from "@/components/DemoForm";
import { ButtonLink, Reveal } from "@/components/ui";
import { FINAL_CTA, SITE } from "@/lib/content";

export default function FinalCta() {
  return (
    <section id="demo" aria-labelledby="demo-title" className="relative isolate mx-2 mt-6 overflow-hidden rounded-[22px] bg-night sm:mx-3 sm:rounded-[28px]">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(60%_60%_at_20%_40%,rgba(36,104,242,0.3),transparent_70%)]" />
      <InterferenceRibbons
        className="-z-10"
        style={{ position: "absolute", inset: 0, minHeight: 0 }}
        colors={["#2468f2", "#7c4fe8"]}
        backgroundColor="#070b12"
        mode="glow"
        angle={-10}
        amplitude={0.45}
        ribbonWidth={0.2}
        wires={48}
        glow={0.4}
        intensity={0.75}
        speed={0.4}
        spin={0.25}
        clickPulse={false}
        quality={0.75}
      />
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <Reveal>
            <h2 id="demo-title" className="text-balance text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-[3rem]">
              {FINAL_CTA.title}
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="mt-5">
            <p className="max-w-[480px] text-pretty text-lg leading-7 text-white/70">{FINAL_CTA.lede}</p>
          </Reveal>
          <Reveal delay={0.12} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={SITE.signUpUrl} size="lg" arrow>
              Start free trial
            </ButtonLink>
            <ButtonLink href="#demo-form" variant="ghost-dark" size="lg">
              Book a demo
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.18}>
            <ul className="mt-10 flex flex-col gap-3 text-[15px] text-white/70">
              <li className="flex items-center gap-3">
                <Clock aria-hidden="true" className="size-4 text-[#8fb4ff]" /> 30 minutes, on your own lanes and workflow
              </li>
              <li className="flex items-center gap-3">
                <CalendarCheck aria-hidden="true" className="size-4 text-[#8fb4ff]" /> 14-day free trial, no charge today
              </li>
              <li className="flex items-center gap-3">
                <Headset aria-hidden="true" className="size-4 text-[#8fb4ff]" /> Migration and onboarding included
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div id="demo-form" className="scroll-mt-24 rounded-3xl bg-white p-6 shadow-float sm:p-8">
            <h3 className="text-xl font-semibold text-ink">Book a demo</h3>
            <p className="mt-1 text-[15px] text-ink-2">Tell us a little about your brokerage and we&apos;ll set up a time.</p>
            <div className="mt-6">
              <DemoForm source="final-cta" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
