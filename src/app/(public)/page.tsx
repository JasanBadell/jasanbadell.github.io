"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const socialLinks = [
  { href: "https://github.com/JasanBadell", label: "GitHub", icon: "https://s2.svgbox.net/social.svg?ic=github&color=ab9c9c" },
  { href: "https://www.linkedin.com/in/jasanbadelldev/", label: "LinkedIn", icon: "https://s2.svgbox.net/social.svg?ic=linkedin&color=ab9c9c" },
  { href: "mailto:jasanbadelldev@gmail.com", label: "Email", icon: "https://s2.svgbox.net/social.svg?ic=telegram&color=ab9c9c" },
];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="hero">
      <article className="hero__panel panel">
        <p className="hero__eyebrow">{t.hero.eyebrow}</p>
        <div>
          <h1 className="hero__name">Jasan<br />Badell</h1>
          <p className="hero__role">{t.hero.role}</p>
        </div>
        <p className="hero__desc">{t.hero.desc}</p>
        <div className="hero__badge">
          <span className="hero__badge-dot" aria-hidden="true" />
          {t.hero.badge}
        </div>
        <nav className="hero__actions" aria-label="Acciones principales">
          <Link href="/projects" className="btn btn--primary">{t.hero.btnProjects}</Link>
          <Link href="/about" className="btn btn--ghost">{t.hero.btnAbout}</Link>
          <a href="/img/Jasan Badell CV.pdf" className="btn btn--ghost" target="_blank" rel="noreferrer">{t.hero.btnCV}</a>
        </nav>
      </article>
      <aside className="hero__side" aria-label="Redes sociales">
        <div className="hero__side-panel panel">
          <div className="hero__portrait-wrap">
            <img src="/img/jasan-portrait-2.jpeg" alt="Jasan Badell" className="hero__portrait" />
          </div>
          <p className="hero__side-label">{t.hero.connect}</p>
          <div className="hero__socials">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} className="hero__social" target="_blank" rel="noreferrer" aria-label={item.label}>
                <img src={item.icon} alt={item.label} width={24} height={24} />
              </a>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
