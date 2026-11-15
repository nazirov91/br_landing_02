import { CLIENTS, QUOTES, STATS } from "@/lib/content";
import { Container, Placeholder, Reveal } from "@/components/ui";

export default function Proof() {
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <section id="customers" aria-labelledby="customers-title" className="pt-20 md:pt-28">
      <Container>
        <h2 id="customers-title" className="text-center text-[15px] font-medium text-ink-3">
          Trusted by auto transport brokers who run on BeRocker
        </h2>
      </Container>

      {/* Logo row; static wrap under reduced motion */}
      <div className="group relative mx-auto mt-8 max-w-[1280px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] motion-reduce:[mask-image:none]">
        <ul className="flex w-max animate-marquee items-center gap-14 px-7 group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-6">
          {row.map((c, i) => {
            const dup = i >= CLIENTS.length;
            return (
              <li key={`${c.alt}-${i}`} aria-hidden={dup ? true : undefined} className={dup ? "motion-reduce:hidden" : ""}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.src}
                  alt={dup ? "" : c.alt}
                  width={c.w}
                  height={c.h}
                  loading="lazy"
                  decoding="async"
                  className={`h-auto max-h-9 w-auto object-contain opacity-70 mix-blend-multiply grayscale transition duration-300 hover:opacity-100 ${c.invert ? "invert" : ""} ${"darken" in c && c.darken ? "brightness-[0.45]" : ""}`}
                  style={{ maxWidth: c.w }}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <Container className="mt-14">
        <Reveal className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Placeholder note="Placeholder quote" className="h-full">
            <figure className="flex h-full flex-col justify-between gap-8 rounded-[var(--radius-panel)] bg-card p-7 shadow-card sm:p-9">
              <blockquote className="text-pretty text-[20px] font-medium leading-[1.45] tracking-[-0.01em] text-ink sm:text-[22px]">
                &ldquo;{QUOTES.proof.text}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-[13px] font-bold text-accent-ink">CN</span>
                <span>
                  <span className="block text-[15px] font-semibold text-ink">{QUOTES.proof.name}</span>
                  <span className="block text-[13px] text-ink-3">{QUOTES.proof.role}</span>
                </span>
              </figcaption>
            </figure>
          </Placeholder>

          <dl className="grid grid-cols-3 overflow-hidden rounded-[var(--radius-panel)] bg-card shadow-card lg:grid-cols-1">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col justify-center px-4 py-6 sm:px-8 ${i ? "border-l border-line lg:border-l-0 lg:border-t" : ""}`}
              >
                <dt className="order-2 mt-1.5 text-[13px] text-ink-3 sm:text-[15px]">{s.label}</dt>
                <dd className="order-1 whitespace-nowrap text-[1.6rem] font-medium leading-none tracking-[-0.03em] text-ink sm:text-[2.6rem]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
