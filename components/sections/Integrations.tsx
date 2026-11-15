import Image from "next/image";
import { CreditCard, MessagesSquare, Receipt, Truck } from "lucide-react";
import { Heading, IconChip, Placeholder, Reveal, Section } from "@/components/ui";
import { INTEGRATIONS } from "@/lib/content";

const ICONS = { dispatch: Truck, communications: MessagesSquare, payments: CreditCard, accounting: Receipt } as const;

export default function Integrations() {
  return (
    <Section id="integrations" labelledBy="int-title">
      <Heading id="int-title" eyebrow={INTEGRATIONS.eyebrow} title={INTEGRATIONS.title} sub={INTEGRATIONS.lede} />

      <div className="mt-12 grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="grid gap-3 sm:grid-cols-2">
          {INTEGRATIONS.groups.map((g, i) => {
            const Icon = ICONS[g.key as keyof typeof ICONS];
            const card = (
              <div className="flex h-full flex-col rounded-[var(--radius-card)] bg-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <IconChip>
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </IconChip>
                  <h3 className="text-[17px] font-medium text-ink">{g.title}</h3>
                </div>
                <p className="mt-4 text-[15px] leading-6 text-ink-3">{g.body}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {g.tools.map((t) => (
                    <li key={t} className="rounded-md bg-fill px-2 py-1 text-[12px] font-medium text-ink-2">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            );
            return (
              <Reveal key={g.key} delay={0.04 * i} className="h-full">
                {g.placeholder ? (
                  <Placeholder note="Placeholder" className="h-full">
                    {card}
                  </Placeholder>
                ) : (
                  card
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.08} className="well grid place-items-center p-6 sm:p-10">
          <Image
            src="/img/flow/integrations.webp"
            alt="BeRocker in the middle of its integrations: Super Dispatch and Central Dispatch, RingCentral, Twilio, Telnyx and Vonage, Gmail, SendGrid and Mailgun, Stripe, Square and Authorize.net, and Claude, ChatGPT and Gemini"
            width={1200}
            height={1200}
            sizes="(min-width: 1024px) 460px, 90vw"
            className="h-auto w-full max-w-[460px] rounded-full mix-blend-multiply"
          />
        </Reveal>
      </div>
    </Section>
  );
}
