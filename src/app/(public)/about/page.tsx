"use client";

import { useLanguage } from "@/lib/LanguageContext";

const skills = ["HTML5", "CSS3", "JavaScript", "React", "PHP", "Bootstrap", "OJS"];

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <section className="panel page-stack">
      <p className="page-eyebrow">{t.about.eyebrow}</p>
      <div className="about-split">
        <div className="about-split__text">
          <h1 className="page-title">{t.about.title}</h1>
          <p className="page-copy">{t.about.p1}</p>
          <p className="page-copy">{t.about.p2}</p>
          <p className="page-copy">{t.about.p3}</p>
        </div>
        <div className="about-split__photo">
          <img src="/img/jasan-profile.jpeg" alt="Jasan Badell" className="about-portrait" />
        </div>
      </div>
      <div className="skills-grid">
        <div className="skills-card">
          <p className="section-title">{t.about.focus}</p>
          <div className="chip-list">
            {t.about.highlights.map((item) => <span key={item} className="chip chip--primary">{item}</span>)}
          </div>
        </div>
        <div className="skills-card">
          <p className="section-title">{t.about.stack}</p>
          <div className="chip-list">
            {skills.map((item) => <span key={item} className="chip chip--accent">{item}</span>)}
          </div>
        </div>
      </div>
      <div>
        <a href="/img/Jasan Badell CV.pdf" className="btn btn--primary" target="_blank" rel="noreferrer">
          {t.about.cvBtn}
        </a>
      </div>
    </section>
  );
}
