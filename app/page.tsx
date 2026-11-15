import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/sections/Hero";
import Proof from "@/components/sections/Proof";
import SuperDispatch from "@/components/sections/SuperDispatch";
import Workflow from "@/components/sections/Workflow";
import AiAssistant from "@/components/sections/AiAssistant";
import Integrations from "@/components/sections/Integrations";
import Support from "@/components/sections/Support";
import Pricing from "@/components/sections/Pricing";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";
import { FAQ, PRICING, SITE } from "@/lib/content";

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "BeRocker",
      url: SITE.url,
      logo: `${SITE.url}/img/logo.svg`,
      telephone: SITE.phone,
      email: SITE.email,
      sameAs: Object.values(SITE.socials),
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "BeRocker",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: String(PRICING.monthly),
        priceCurrency: "USD",
        description: "Pro plan, base license with one seat, billed monthly",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      // Placeholder answers stay out of structured data until they are real.
      mainEntity: FAQ.filter((f) => !f.placeholder).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <main id="main">
        <Hero />
        <Proof />
        <SuperDispatch />
        <Workflow />
        <AiAssistant />
        <Integrations />
        <Support />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
