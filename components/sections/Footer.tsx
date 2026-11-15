import { Container, Logo } from "@/components/ui";
import { SITE } from "@/lib/content";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#product" },
      { label: "Super Dispatch", href: "#super-dispatch" },
      { label: "AI assistant", href: "#ai" },
      { label: "Integrations", href: "#integrations" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Customers", href: "#customers" },
      { label: "About us", href: "https://berocker.com/about-us" },
      { label: "Blog", href: "https://berocker.com/articles" },
      { label: "Book a demo", href: "#demo-form" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "https://berocker.com/privacy" },
      { label: "Terms", href: "https://berocker.com/terms" },
      { label: "User data deletion", href: "mailto:info@berocker.com?subject=User%20data%20deletion%20request" },
    ],
  },
];

const SOCIAL = [
  { label: "BeRocker on Facebook", href: SITE.socials.facebook, path: "M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z" },
  {
    label: "BeRocker on LinkedIn",
    href: SITE.socials.linkedin,
    path: "M6.5 8.5h-3V20h3V8.5ZM5 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.5 13.4c0-3-1.7-5.1-4.4-5.1-1.5 0-2.6.8-3.1 1.6V8.5h-3V20h3v-6c0-1.6.8-2.7 2.2-2.7 1.4 0 2.3 1 2.3 2.7v6h3v-6.6Z",
  },
  { label: "BeRocker on X", href: SITE.socials.x, path: "M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-page-2 md:mt-32">
      <Container className="pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div>
            <Logo className="h-8 w-auto" />
            <p className="mt-4 max-w-[36ch] text-[15px] leading-6 text-ink-3">
              Leads, quotes, conversations, payments and dispatch for auto transport brokers, in one CRM.
            </p>
            <div className="mt-6 flex flex-col gap-1 text-[14px] text-ink-3">
              <a href={SITE.phoneHref} className="w-fit hover:text-ink">
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="w-fit hover:text-ink">
                {SITE.email}
              </a>
              <span>{SITE.address}</span>
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="text-[14px] font-semibold text-ink">{c.title}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-[15px] text-ink-3 transition-colors hover:text-ink">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line-2 pt-6 sm:flex-row sm:items-center">
          <p className="text-[13px] text-ink-3">© {new Date().getFullYear()} BeRocker. All rights reserved.</p>
          <ul className="flex items-center gap-2">
            {SOCIAL.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-[10px] bg-card text-ink-3 shadow-quiet transition-colors hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
