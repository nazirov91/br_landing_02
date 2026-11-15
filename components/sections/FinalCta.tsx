import { CalendarCheck, Clock, Headset } from "lucide-react";
import Ribbons from "@/components/Ribbons";
import DemoForm from "@/components/DemoForm";
import { ButtonLink, Container, Reveal } from "@/components/ui";
import { FINAL_CTA, SITE } from "@/lib/content";

export default function FinalCta() {
  return (
    <section id="demo" aria-labelledby="demo-title" className="py-24 md:py-32">
      <Container>
        <div className="well-navy grid items-center gap-10 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:px-16">
          <Ribbons angle={-12} amplitude={0.45} ribbonWidth={0.2} wires={48} glow={0.4} intensity={0.7} speed={0.35} spin={0.25} clickPulse={false} quality={0.7} />
          <div className="relative">
            <Reveal>
              <h2 id="demo-title" className="text-balance text-[2.2rem] font-medium leading-[1.08] tracking-[-0.03em] text-white sm:text-[3rem]">
                {FINAL_CTA.title}
              </h2>
              <p className="mt-5 max-w-[46ch] text-pretty text-[17px] leading-[1.6] text-mist sm:text-[19px]">{FINAL_CTA.lede}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={SITE.signUpUrl} size="lg" arrow>
                  Start free trial
                </ButtonLink>
                <ButtonLink href="#demo-form" variant="quiet-dark" size="lg">
                  Book a demo
                </ButtonLink>
              </div>
              <ul className="mt-10 flex flex-col gap-3 text-[15px] text-mist">
                <li className="flex items-center gap-3">
                  <Clock aria-hidden="true" className="size-4 text-white" /> 30 minutes, on your own lanes and workflow
                </li>
                <li className="flex items-center gap-3">
                  <CalendarCheck aria-hidden="true" className="size-4 text-white" /> 14-day free trial, no charge today
                </li>
                <li className="flex items-center gap-3">
                  <Headset aria-hidden="true" className="size-4 text-white" /> Migration and onboarding included
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.06} className="relative">
            <div id="demo-form" className="scroll-mt-24 rounded-[var(--radius-card)] bg-card p-6 shadow-float sm:p-8">
              <h3 className="text-[20px] font-medium text-ink">Book a demo</h3>
              <p className="mt-1 text-[15px] text-ink-3">Tell us a little about your brokerage and we&apos;ll set up a time.</p>
              <div className="mt-6">
                <DemoForm source="final-cta" />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
