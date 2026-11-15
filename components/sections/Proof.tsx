import { CLIENTS, QUOTES, STATS } from "@/lib/content";
import { Placeholder, Rail, Reveal } from "@/components/ui";

export default function Proof() {
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <Rail id="customers" labelledBy="customers-title" divider={false} innerClassName="pt-16 pb-20 sm:pt-20">
      <h2 id="customers-title" className="text-center text-[15px] font-medium text-ink-3">
        Trusted by auto transport brokers who run on BeRocker
      </h2>

      {/* Logo marquee; static wrap under reduced motion */}
      <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] motion-reduce:[mask-image:none]">
        <ul className="flex w-max animate-marquee items-center gap-14 px-7 group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-6">
          {row.map((c, i) => (
            <li key={`${c.alt}-${i}`} aria-hidden={i >= CLIENTS.length ? true : undefined} className={i >= CLIENTS.length ? "motion-reduce:hidden" : ""}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.src}
                alt={i >= CLIENTS.length ? "" : c.alt}
                width={c.w}
                height={c.h}
                loading="lazy"
                decoding="async"
                className={`h-auto max-h-10 w-auto object-contain opacity-80 grayscale contrast-125 transition duration-300 hover:opacity-100 hover:grayscale-0 hover:contrast-100 ${c.invert ? "invert" : ""}`}
                style={{ maxWidth: c.w }}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1040px] items-stretch gap-6 px-0 sm:px-10 lg:grid-cols-[1.15fr_1fr]">
        <Reveal className="h-full">
          <Placeholder note="Placeholder quote" className="h-full">
            <figure className="flex h-full flex-col justify-between rounded-2xl bg-surface p-7 sm:p-8">
              <blockquote className="text-pretty text-[1.3rem] font-medium leading-snug tracking-[-0.01em] text-ink">
                &ldquo;{QUOTES.proof.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-brand-100 text-[13px] font-bold text-brand-700">CN</span>
                <span>
                  <span className="block text-[15px] font-semibold text-ink">{QUOTES.proof.name}</span>
                  <span className="block text-[13px] text-ink-3">{QUOTES.proof.role}</span>
                </span>
              </figcaption>
            </figure>
          </Placeholder>
        </Reveal>
        <Reveal delay={0.08}>
          <dl className="grid h-full grid-cols-3 gap-3 lg:grid-cols-1">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col justify-center rounded-2xl border border-line bg-white p-4 sm:p-6">
                <dt className="order-2 mt-1 text-[13px] text-ink-3 sm:text-[14px]">{s.label}</dt>
                <dd className="order-1 whitespace-nowrap text-[1.45rem] font-semibold leading-none tracking-[-0.03em] text-ink sm:text-[2.2rem]">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Rail>
  );
}
