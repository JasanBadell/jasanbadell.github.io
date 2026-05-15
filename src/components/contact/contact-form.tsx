"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

type FormState = { name: string; email: string; message: string };
const empty: FormState = { name: "", email: "", message: "" };

const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
  : "/api/contact";

export function ContactForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>(empty);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const isDisabled = useMemo(
    () => isSubmitting || !form.name || !form.email || !form.message,
    [form, isSubmitting]
  );

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setIsSuccess(false);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await res.json()) as { ok?: boolean; message?: string; error?: string; errors?: { message?: string }[] | string[] };

      if (!res.ok) {
        const errMsg =
          result.error ??
          (Array.isArray(result.errors)
            ? (result.errors as { message?: string }[]).map((e) => e.message ?? String(e)).join(" ")
            : undefined) ??
          t.contact.errorFallback;
        setStatusMessage(errMsg);
        setIsSuccess(false);
        return;
      }
      setStatusMessage(result.message ?? t.contact.sendBtn);
      setIsSuccess(true);
      setForm(empty);
    } catch {
      setStatusMessage(t.contact.errorNet);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span className="form-label">{t.contact.nameLabel}</span>
        <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder={t.contact.namePlaceholder} minLength={2} required />
      </label>
      <label className="form-field">
        <span className="form-label">{t.contact.emailLabel}</span>
        <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder={t.contact.emailPlaceholder} required />
      </label>
      <label className="form-field">
        <span className="form-label">{t.contact.msgLabel}</span>
        <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder={t.contact.msgPlaceholder} minLength={10} maxLength={1500} rows={5} required />
      </label>
      <button type="submit" className="btn btn--primary" disabled={isDisabled}>
        {isSubmitting ? t.contact.sending : t.contact.sendBtn}
      </button>
      {statusMessage && (
        <p className={`form-status form-status--${isSuccess ? "success" : "error"}`}>{statusMessage}</p>
      )}
    </form>
  );
}
