import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";

const manrope = localFont({
  src: [
    { path: "./fonts/Manrope-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Manrope-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Manrope-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Manrope-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://berocker.com";
const TITLE = "BeRocker | AI-Powered CRM for Auto Transport Brokers";
const DESCRIPTION =
  "Manage leads, quotes, conversations, payments and dispatch in one auto transport CRM, with the deepest Super Dispatch integration, MCP support for Claude and ChatGPT, and a team that handles your migration.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }] },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "BeRocker",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/img/og-image.png" }],
  },
  twitter: { card: "summary_large_image", site: "@BeRockerAI", title: TITLE, description: DESCRIPTION, images: ["/img/og-image.png"] },
};

export const viewport: Viewport = {
  themeColor: "#070b12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <a
          href="#main"
          className="absolute left-3 top-[-60px] z-[100] rounded-lg bg-ink px-4 py-2.5 font-semibold text-white focus:top-3"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
