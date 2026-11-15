"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SMS_CONSENT } from "@/lib/content";
import { buttonClass } from "@/components/ui";

/*
  Same contract as the current site's BookDemo.vue:
  POST {NEXT_PUBLIC_API_BASE_URL}/book-demo with the form fields, digits-only phone,
  turnstile_token, and plan / request_source so the team can tell enquiries apart.
  A 422 returns { errors: { field: message | message[] } }.
*/

type Fields = {
  full_name: string;
  company_name: string;
  email: string;
  company_mc: string;
  phone: string;
  website: string;
};

const EMPTY: Fields = { full_name: "", company_name: "", email: "", company_mc: "", phone: "", website: "" };

const API = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileLoading: Promise<void> | null = null;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (!turnstileLoading) {
    turnstileLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("turnstile failed to load"));
      document.head.appendChild(s);
    });
  }
  return turnstileLoading;
}

/** US-style display mask: +1 (234) 567 89-01, as on the current form. */
function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  let out = "+1";
  if (d.length) out += ` (${d.slice(0, 3)}`;
  if (d.length >= 3) out += ")";
  if (d.length > 3) out += ` ${d.slice(3, 6)}`;
  if (d.length > 6) out += ` ${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}

export default function DemoForm({
  source,
  plan,
  compact = false,
  onDone,
}: {
  source: string;
  plan?: "pro" | "enterprise";
  compact?: boolean;
  onDone?: () => void;
}) {
  const uid = useId();
  const [form, setForm] = useState<Fields>(EMPTY);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | "form", string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [token, setToken] = useState("");
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!TURNSTILE_KEY || !tsRef.current) return;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !tsRef.current || !window.turnstile) return;
        tsId.current = window.turnstile.render(tsRef.current, {
          sitekey: TURNSTILE_KEY,
          theme: "light",
          callback: (t: string) => setToken(t),
          "expired-callback": () => setToken(""),
        });
      })
      .catch(() => setErrors((e) => ({ ...e, form: "The spam check didn't load. Refresh the page and try again." })));
    return () => {
      cancelled = true;
      if (tsId.current) window.turnstile?.remove(tsId.current);
    };
  }, []);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = k === "phone" ? maskPhone(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er: typeof errors = {};
    if (!form.full_name.trim()) er.full_name = "Enter your full name.";
    if (!form.company_name.trim()) er.company_name = "Enter your company name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 11) er.phone = "Enter a 10-digit US phone number.";
    if (!form.website.trim()) er.website = "Enter your website.";
    return er;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er = validate();
    if (Object.keys(er).length) {
      setErrors(er);
      return;
    }
    if (!API) {
      setErrors({ form: "The demo form isn't connected yet (NEXT_PUBLIC_API_BASE_URL is not set)." });
      return;
    }
    if (TURNSTILE_KEY && !token) {
      setErrors({ form: "Please complete the spam check." });
      return;
    }
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch(`${API}/book-demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          turnstile_token: token,
          ...form,
          phone: form.phone.replace(/\D/g, ""),
          ...(plan ? { plan } : {}),
          request_source: source,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm(EMPTY);
        setAgree(false);
        return;
      }
      const data = await res.json().catch(() => null);
      const fieldErrors: typeof errors = {};
      if (data?.errors && typeof data.errors === "object") {
        for (const [k, v] of Object.entries(data.errors)) {
          fieldErrors[k as keyof Fields] = Array.isArray(v) ? String(v[0]) : String(v);
        }
      }
      if (!Object.keys(fieldErrors).length) fieldErrors.form = data?.message || "Something went wrong. Please try again.";
      setErrors(fieldErrors);
      setStatus("idle");
    } catch {
      setErrors({ form: "We couldn't reach the server. Check your connection and try again." });
      setStatus("idle");
    } finally {
      if (tsId.current) window.turnstile?.reset(tsId.current);
      setToken("");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-start gap-3 py-6">
        <CheckCircle2 aria-hidden="true" className="size-9 text-success" />
        <p className="text-xl font-semibold text-ink">Thanks, your request is in.</p>
        <p className="text-ink-2">Our team will reach out shortly to set up your walkthrough.</p>
        {onDone && (
          <button type="button" onClick={onDone} className={buttonClass("light", "md", "mt-2")}>
            Close
          </button>
        )}
      </div>
    );
  }

  const field = (k: keyof Fields, label: string, opts: { type?: string; placeholder: string; required?: boolean; autoComplete?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"] }) => {
    const id = `${uid}-${k}`;
    const err = errors[k];
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-[13px] font-semibold text-ink">
          {label}
          {opts.required && <span className="text-brand"> *</span>}
        </label>
        <input
          id={id}
          name={k}
          type={opts.type ?? "text"}
          value={form[k]}
          onChange={set(k)}
          placeholder={opts.placeholder}
          autoComplete={opts.autoComplete}
          inputMode={opts.inputMode}
          aria-invalid={!!err}
          aria-describedby={err ? `${id}-err` : undefined}
          className={`h-11 rounded-[10px] bg-white px-3.5 text-[15px] text-ink outline-none ring-1 transition-shadow placeholder:text-ink-3/70 focus:ring-2 focus:ring-brand ${err ? "ring-red-400" : "ring-line-2"}`}
        />
        {err && (
          <p id={`${id}-err`} className="text-[13px] text-red-600">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-4">
      <div className={`grid gap-4 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}>
        {field("full_name", "Full name", { placeholder: "Ade Tiger", required: true, autoComplete: "name" })}
        {field("company_name", "Company", { placeholder: "Company name", required: true, autoComplete: "organization" })}
        {field("email", "Email address", { type: "email", placeholder: "yourname@email.com", required: true, autoComplete: "email" })}
        {field("company_mc", "MC / USDOT", { placeholder: "1234567", inputMode: "numeric" })}
        {field("phone", "Phone number", { type: "tel", placeholder: "+1 (234) 567 89-01", required: true, autoComplete: "tel", inputMode: "tel" })}
        {field("website", "Website", { placeholder: "example.com", required: true, autoComplete: "url" })}
      </div>

      <label className="flex items-start gap-3 text-[12px] leading-5 text-ink-3">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-brand)]"
        />
        <span>
          {SMS_CONSENT} You can also find our{" "}
          <a href="https://berocker.com/privacy" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
            privacy policy
          </a>{" "}
          and{" "}
          <a href="https://berocker.com/terms" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
            terms of service
          </a>{" "}
          on our website.
        </span>
      </label>

      {TURNSTILE_KEY && <div ref={tsRef} className="min-h-[65px]" />}

      {errors.form && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        disabled={!agree || status === "sending"}
        className={buttonClass("primary", "lg", "w-full disabled:pointer-events-none disabled:opacity-50")}
      >
        {status === "sending" && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        Get your free demo
      </button>
    </form>
  );
}
