"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { ContactForm } from "@/components/contact/contact-form";

const contactLinks = [
  { href: "mailto:jasanbadelldev@gmail.com", label: "Email" },
  { href: "https://www.linkedin.com/in/jasanbadelldev", label: "LinkedIn" },
  { href: "https://github.com/JasanBadell", label: "GitHub" },
];

export default function ContactPage() {
  const { t } = useLanguage();
  return (
    <section className="panel page-stack">
      <p className="page-eyebrow">{t.contact.eyebrow}</p>
      <h1 className="page-title">{t.contact.title}</h1>
      <p className="page-copy">{t.contact.p1}</p>
      <article className="contact-highlight">
        <p>{t.contact.directEmail} <strong>jasanbadelldev@gmail.com</strong></p>
        <p className="muted">{t.contact.emailNote}</p>
      </article>
      <ContactForm />
      <div className="link-row">
        {contactLinks.map((link) => (
          <a key={link.href} href={link.href} className="btn btn--ghost" target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
