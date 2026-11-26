import { ArrowUpRight } from "lucide-react";
import { ANNOUNCEMENT } from "@/lib/content";
import { FeeNote } from "@/components/ui";

/* The thin bar above the header: the one-line pitch and the Super Dispatch fee waiver. */
export default function AnnouncementBar() {
  return (
    <div id="announcement" className="border-b border-accent-line bg-accent-soft">
      <a
        href={ANNOUNCEMENT.href}
        className="group mx-auto flex min-h-9 max-w-[1280px] flex-wrap items-center justify-center gap-x-5 gap-y-0.5 px-5 py-1.5 text-center text-[13px] text-ink-2 sm:px-10"
      >
        <span className="hidden sm:inline">{ANNOUNCEMENT.text}</span>
        <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5">
          <span>{ANNOUNCEMENT.fee}</span>
          <s className="text-ink-3">$250</s>
          <span className="font-semibold text-accent-ink">$0</span>
          <FeeNote />
          <ArrowUpRight aria-hidden="true" className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </a>
    </div>
  );
}
