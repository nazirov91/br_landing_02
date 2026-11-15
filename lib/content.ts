/*
  All homepage copy lives here.

  Anything marked `placeholder: true` (or wrapped in <Placeholder> in a component) is
  NOT confirmed and must be replaced before launch: customer quotes, the exact
  Super Dispatch sync list, accounting integrations, some FAQ facts and the MCP claim.
  Everything else comes from the current berocker.com page, its repo or llms.txt.
*/

export const SITE = {
  name: "BeRocker",
  url: "https://berocker.com",
  appUrl: "https://app.berocker.com",
  signUpUrl: "https://berocker.com/sign-up",
  phone: "+1 302 313 0966",
  phoneHref: "tel:+13023130966",
  email: "info@berocker.com",
  address: "15 Worthington Access Dr, Ste 12, Maryland Heights, MO 63043",
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61573435508647",
    linkedin: "https://www.linkedin.com/company/berocker/",
    x: "https://x.com/BeRockerAI",
  },
};

/** Set to false to hide the amber "Placeholder" markers once the content is real. */
export const SHOW_PLACEHOLDER_MARKERS = true;

export const NAV = [
  { label: "Product", href: "#product" },
  { label: "Integrations", href: "#integrations" },
  { label: "Pricing", href: "#pricing" },
  { label: "Customers", href: "#customers" },
];

export const HERO = {
  eyebrow: "Now with MCP for Claude and ChatGPT",
  title: ["Your brokerage.", "Fully connected."],
  lede:
    "Manage leads, quotes, conversations, payments and dispatch in one auto transport CRM, with the deepest Super Dispatch integration and support that shows up.",
  notes: ["$250 Super Dispatch API fee waived", "Connect your AI assistant through MCP"],
};

export const CLIENTS = [
  { src: "/img/clients/mercury.svg", alt: "Mercury Auto Transport", w: 160, h: 24 },
  { src: "/img/clients/snowbridge.png", alt: "Snow Bridge", w: 120, h: 34 },
  { src: "/img/clients/transportation.png", alt: "Nova Car Transportation", w: 110, h: 39 },
  { src: "/img/clients/vehicle-transport.png", alt: "Vehicle Transport", w: 72, h: 36, invert: true },
  { src: "/img/clients/hiyaaks.webp", alt: "Hiyaaks Inc", w: 120, h: 24, invert: true },
  { src: "/img/clients/aaatransporters2.png", alt: "AAA Transporters", w: 84, h: 38 },
  { src: "/img/clients/autoline.webp", alt: "Auto Line Express", w: 150, h: 24 },
  { src: "/img/clients/car-shipping-hawaii.webp", alt: "Car Shipping Hawaii", w: 44, h: 44 },
  { src: "/img/clients/dasauto.png", alt: "Das Auto", w: 170, h: 17 },
  { src: "/img/clients/direct-express.webp", alt: "Direct Express", w: 120, h: 28 },
  { src: "/img/clients/lisca.webp", alt: "Lisca", w: 96, h: 35 },
  { src: "/img/clients/novaautotransport.png", alt: "Nova Auto Transport", w: 108, h: 36 },
  { src: "/img/clients/pigeon.webp", alt: "Pigeon", w: 104, h: 32 },
  { src: "/img/clients/transplicity.png", alt: "Transplicity", w: 124, h: 32 },
];

export const STATS = [
  { value: "1M+", label: "leads processed" },
  { value: "100K+", label: "bookings secured" },
  { value: "< 1 min", label: "response time" },
];

export const QUOTES = {
  proof: {
    placeholder: true,
    text: "Placeholder: one short quote from a customer about what changed after switching to BeRocker.",
    name: "Customer name",
    role: "Role, Company",
  },
  support: {
    placeholder: true,
    text: "Placeholder: one short quote from a customer about migration, onboarding or day-to-day support.",
    name: "Customer name",
    role: "Role, Company",
  },
};

export const SUPER_DISPATCH = {
  eyebrow: "Super Dispatch integration",
  title: "Super Dispatch. Fully in sync.",
  lede:
    "Quote, post, collect offers and dispatch without leaving BeRocker. Loads go out in one click, carrier offers come back in, and every status lands on the shipment it belongs to.",
  cards: [
    {
      title: "Price against the market",
      body: "Compare BeRocker AI pricing with Super Dispatch and Central Dispatch side by side, and quote with confidence in seconds.",
    },
    {
      title: "Post everywhere in one click",
      body: "Shipment-ready loads go straight to Super Dispatch, Central Dispatch or both. No copy-pasting, no second login.",
    },
    {
      title: "Offers, dispatch and tracking",
      body: "Carrier offers roll in, you compare bids and dispatch the winner with one click. Tracking stays on the same shipment.",
    },
  ],
  // Exact sync list is not confirmed yet.
  syncPlaceholder: true,
  toSD: ["Vehicles and route", "Pickup and delivery dates", "Your posted price"],
  fromSD: ["Carrier offers", "Dispatch status", "Pickup and delivery updates"],
};

export type WorkflowStep = {
  key: string;
  label: string;
  short: string;
  title: string;
  body: string;
  points: string[];
  poster: string;
  video?: { webm: string; mp4: string };
  alt: string;
};

export const WORKFLOW: WorkflowStep[] = [
  {
    key: "intake",
    label: "Lead intake",
    short: "Every source, one pipeline",
    title: "Every lead captured, instantly.",
    body: "Lead providers, your website, parsed emails and on-site widgets all flow into one place. Every lead arrives structured, assigned and ready to work.",
    points: ["Lead providers, emails and web forms", "Your own booking website and widgets", "Assigned to the right rep automatically"],
    poster: "/img/flow/intake.png",
    video: { webm: "/videos/flow/intake.webm", mp4: "/videos/flow/intake.mp4" },
    alt: "Leads from providers, website, email and widgets flowing into BeRocker",
  },
  {
    key: "pricing",
    label: "Pricing",
    short: "Quote in seconds",
    title: "Price every lead your way.",
    body: "Compare BeRocker AI pricing with Super Dispatch and Central Dispatch side by side. Quote confidently in seconds, never locked into one source.",
    points: ["AI price suggestion on every lead", "Market prices from both load boards", "Your markup, your rules"],
    poster: "/img/flow/pricing.png",
    video: { webm: "/videos/flow/pricing.webm", mp4: "/videos/flow/pricing.mp4" },
    alt: "BeRocker comparing AI pricing with Super Dispatch and Central Dispatch",
  },
  {
    key: "conversations",
    label: "Conversations",
    short: "SMS, calls, email, WhatsApp",
    title: "Every channel. One timeline.",
    body: "SMS, WhatsApp, email and calls with recordings and transcripts live in one conversation. Keep your existing numbers and inboxes, call with one click, and let AI answer while you're busy, all the way to the e-signed contract.",
    points: ["Your existing phone numbers and WhatsApp", "One-click calling, recordings, transcripts", "E-sign the contract in the same thread"],
    poster: "/img/flow/comms.png",
    video: { webm: "/videos/flow/comms.webm", mp4: "/videos/flow/comms.mp4" },
    alt: "A BeRocker conversation mixing SMS and AI replies with a customer",
  },
  {
    key: "loadboards",
    label: "Load boards",
    short: "Post in one click",
    title: "Post everywhere in one click.",
    body: "Shipment-ready loads go straight to Super Dispatch, Central Dispatch or both. No copy-pasting, no leaving the CRM.",
    points: ["Super Dispatch and Central Dispatch", "Post, update and remove from one place", "Status mirrored on the lead"],
    poster: "/img/flow/loadboards.png",
    video: { webm: "/videos/flow/loadboards.webm", mp4: "/videos/flow/loadboards.mp4" },
    alt: "A shipment posted to Super Dispatch and Central Dispatch from BeRocker",
  },
  {
    key: "dispatch",
    label: "Dispatch",
    short: "Offers to dispatched",
    title: "From offers to dispatch in seconds.",
    body: "Carrier offers roll in, you compare bids and dispatch the winner with one click. Offers, dispatch and tracking in one workflow.",
    points: ["Compare carrier offers side by side", "Dispatch the winner in one click", "Track pickup and delivery"],
    poster: "/img/flow/dispatch.png",
    video: { webm: "/videos/flow/dispatch.webm", mp4: "/videos/flow/dispatch.mp4" },
    alt: "Carrier offers, dispatch and tracking for one shipment in BeRocker",
  },
  {
    key: "reporting",
    label: "Reporting",
    short: "KPIs from day one",
    title: "Numbers that make sense from day one.",
    body: "Gross income, commissions, net income, lead volume and every rep's activity on one dashboard, so you can see what's driving bookings.",
    points: ["Income, commissions and net", "Leads in progress and completed", "Calls, chats and payments in one feed"],
    poster: "/img/dashboard.webp",
    alt: "The BeRocker broker dashboard with income, leads and recent activity",
  },
];

export const AI = {
  eyebrow: "AI in BeRocker",
  title: "Your CRM. Meet your AI assistant.",
  claim: "The only auto transport CRM with MCP support.",
  claimPlaceholder: true,
  lede:
    "Connect Claude or ChatGPT to BeRocker through MCP and ask about your leads, follow-ups and pipeline in plain words. Anything that would change your data asks you first.",
  prompt: "Who do I need to follow up with today?",
  answerIntro: "You have 5 leads on today's follow-up list. Two opened your quote yesterday but haven't booked:",
  answerItems: [
    { lead: "#174203", vehicle: "2021 Toyota RAV4", route: "Dallas → Denver", note: "Quoted $850, opened twice" },
    { lead: "#174188", vehicle: "2023 Jeep Wrangler", route: "Phoenix → Portland", note: "Quoted $1,120, asked about dates" },
  ],
  answerOutro: "Want me to draft a text to both? I'll show it to you before anything is sent.",
  tools: ["get-follow-up-list", "get-lead-details"],
  builtIn: {
    title: "Built into BeRocker",
    items: [
      { title: "AI broker", body: "Answers customer texts around the clock and keeps every conversation moving toward a booking." },
      { title: "AI calls", body: "Picks up inbound calls when your team can't, so no call goes unanswered." },
      { title: "AI pricing", body: "Suggests a price for every lead next to live load board prices." },
    ],
  },
  connected: {
    title: "Your assistant, connected",
    items: [
      { title: "Claude and ChatGPT", body: "Connect the assistant you already use through MCP." },
      { title: "Ask in plain words", body: "Leads, conversations, follow-ups and numbers, without opening a report." },
      { title: "You stay in control", body: "Changes are previewed and need your yes before anything happens." },
    ],
  },
};

export const INTEGRATIONS = {
  eyebrow: "Integrations",
  title: "Your tools. Working together.",
  lede: "Keep the providers you already pay for. BeRocker connects them so every call, message, payment and load lands on the right shipment.",
  groups: [
    {
      key: "dispatch",
      title: "Dispatch",
      body: "Post loads, collect carrier offers and dispatch from the lead.",
      tools: ["Super Dispatch", "Central Dispatch"],
    },
    {
      key: "communications",
      title: "Communications",
      body: "Your numbers and inboxes, one timeline per customer.",
      tools: ["RingCentral", "Twilio", "Telnyx", "OpenPhone", "WhatsApp Business", "SendGrid", "Mailgun"],
    },
    {
      key: "payments",
      title: "Payments",
      body: "Take deposits and payments with the processor you already use.",
      tools: ["Stripe", "Square", "Authorize.net", "Zelle"],
    },
    {
      key: "accounting",
      title: "Accounting",
      body: "Placeholder: what connects for accounting and what flows into it.",
      tools: ["Placeholder"],
      placeholder: true,
    },
  ],
};

export const SUPPORT = {
  eyebrow: "Switching to BeRocker",
  title: "A better CRM. A team behind it.",
  lede: "Moving CRMs is the part brokers dread, so we do the heavy lifting. A real team moves your data, connects your tools and stays with you after launch.",
  pillars: [
    {
      title: "Migration",
      body: "We bring your leads, customers and history over from your current CRM.",
      placeholderNote: "List exactly what transfers",
    },
    {
      title: "Onboarding",
      body: "We connect your phone numbers, email, WhatsApp, payments and Super Dispatch account for you.",
    },
    {
      title: "After launch",
      body: "Live support from people who know auto transport, included in every plan.",
    },
  ],
  steps: [
    "Tell us about your company",
    "Connect phone numbers, email and WhatsApp",
    "Connect payments and Super Dispatch",
    "Bring your data from your old CRM",
  ],
};

export const PRICING = {
  eyebrow: "Pricing",
  title: "Everything included. Clearly priced.",
  lede: "One plan with everything in it. No feature gates, no surprise add-ons. Add seats as your team grows; the more you add, the less each one costs.",
  monthly: 199,
  annualTotal: 1908,
  annualFullPrice: 2388,
  seat: 69,
  seatBulk: 59,
  trialDays: 14,
  proFeatures: [
    "Super Dispatch and Central Dispatch integrations",
    "BeRocker pricing tool",
    "Omnichannel: SMS, email, calls and WhatsApp",
    "Dialer, call recordings, transcriptions, e-sign",
    "Comprehensive follow-up system",
    "Booking page and ready-to-use widgets",
    "VoIP and payment integrations",
    "Claude and ChatGPT MCP connections",
    "Onboarding and migration from other CRMs",
    "Live support",
  ],
  enterpriseFeatures: [
    "Everything in Pro",
    "White label on your own domain",
    "Dedicated server",
    "Deeper customizations",
    "Prioritized support and onboarding",
  ],
  compliance: [
    { src: "/img/compliance/TCPA.png", alt: "TCPA compliant" },
    { src: "/img/compliance/TCR.png", alt: "TCR registered" },
    { src: "/img/compliance/A2P.png", alt: "A2P verified" },
    { src: "/img/compliance/10dlc.png", alt: "10DLC registered" },
    { src: "/img/compliance/SSL.png", alt: "SSL secured" },
  ],
};

export type FaqItem = { q: string; a: string; placeholder?: boolean };

export const FAQ: FaqItem[] = [
  {
    q: "How does migration from my current CRM work?",
    a: "Migration is included in every plan. Our team moves your data over from your current CRM and sets BeRocker up with you during onboarding, so you don't start from an empty pipeline.",
  },
  {
    q: "Can I keep my existing phone numbers?",
    a: "Yes. BeRocker connects your existing business numbers through RingCentral, Twilio, Telnyx or OpenPhone, plus your WhatsApp Business account and email provider. Customers keep reaching you on the numbers they already know.",
  },
  {
    q: "Do I need my own Super Dispatch account?",
    a: "Placeholder: what a broker needs on the Super Dispatch side, and how the waived $250 API fee is applied.",
    placeholder: true,
  },
  {
    q: "Is there a contract?",
    a: "Placeholder: contract terms. Known today: you can pay monthly or annually, and the 14-day free trial can be cancelled any time without a charge.",
    placeholder: true,
  },
  {
    q: "Are there any usage charges?",
    a: "Placeholder: whether SMS, calls, AI or anything else is billed on top of seats.",
    placeholder: true,
  },
  {
    q: "Can I use BeRocker on my phone?",
    a: "Yes. BeRocker works on desktop, tablet and phone with the same full workspace: quote a lead, answer a customer or dispatch a load from anywhere.",
  },
];

export const FINAL_CTA = {
  title: "See your next brokerage workflow.",
  lede: "Start a 14-day free trial, or book a 30-minute walkthrough and we'll show BeRocker on your own lanes.",
};

export const SMS_CONSENT =
  "By providing your phone number, you agree to receive SMS Marketing from BeRocker. Message frequency may vary. Standard Message and Data Rates may apply. Reply STOP to opt out. Reply HELP for help. We will not share mobile information with third parties for promotional or marketing purposes.";
