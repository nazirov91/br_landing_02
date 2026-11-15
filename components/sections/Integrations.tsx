import Image from "next/image";
import { CreditCard, MessagesSquare, Receipt, Truck } from "lucide-react";
import { Placeholder, Rail, Reveal, SectionHeading } from "@/components/ui";
import { INTEGRATIONS } from "@/lib/content";

const ICONS = { dispatch: Truck, communications: MessagesSquare, payments: CreditCard, accounting: Receipt } as const;
const ACCENTS = {
  dispatch: "bg-violet-50 text-violet",
  communications: "bg-brand-50 text-brand",
  payments: "bg-[#e9f8f1] text-success",
  accounting: "bg-amber-50 text-amber-700",
} as const;

export default function Integrations() {
  return (
    <Rail id="integrations" labelledBy="int-title" innerClassName="py-24 sm:py-28">
      <div className="grid items-center gap-12 px-0 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <div>
          <SectionHeading id="int-title" align="left" eyebrow={INTEGRATIONS.eyebrow} title={INTEGRATIONS.title} lede={INTEGRATIONS.lede} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {INTEGRATIONS.groups.map((g, i) => {
              const Icon = ICONS[g.key as keyof typeof ICONS];
              const card = (
                <div className="h-full rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgb(27_36_48/0.04)]">
                  <div className="flex items-center gap-3">
                    <span className={`grid size-9 place-items-center rounded-xl ${ACCENTS[g.key as keyof typeof ACCENTS]}`}>
                      <Icon aria-hidden="true" className="size-[18px]" />
                    </span>
                    <h3 className="text-[16px] font-semibold text-ink">{g.title}</h3>
                  </div>
                  <p className="mt-3 text-[14px] leading-6 text-ink-2">{g.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {g.tools.map((t) => (
                      <li key={t} className="rounded-md bg-surface px-2 py-1 text-[12px] font-medium text-ink-2">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              );
              return (
                <Reveal key={g.key} delay={0.05 * i} className="h-full">
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
        </div>

        <Reveal delay={0.1}>
          <div className="relative mx-auto max-w-[520px] overflow-hidden rounded-[28px] tint-sky p-4 sm:p-6">
            <Image
              src="/img/flow/integrations.webp"
              alt="BeRocker in the middle of its integrations: Super Dispatch and Central Dispatch, RingCentral, Twilio, Telnyx and Vonage, Gmail, SendGrid and Mailgun, Stripe, Square and Authorize.net, and Claude, ChatGPT and Gemini"
              width={1200}
              height={1200}
              sizes="(min-width: 1024px) 480px, 90vw"
              className="h-auto w-full rounded-2xl mix-blend-multiply"
            />
          </div>
        </Reveal>
      </div>
    </Rail>
  );
}
