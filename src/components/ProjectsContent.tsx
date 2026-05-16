"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import type { Project } from "@/data/projects";

export function ProjectsContent({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();

  return (
    <section className="page-stack">
      <p className="page-eyebrow">{t.projects.eyebrow} · {projects.length}</p>
      <h1 className="page-title">{t.projects.title}</h1>
      <div className="card-stack">
        {projects.map((project, index) => (
          <article key={project.slug} className="project-card">
            {project.image && (
              <div className="project-card__image-wrap">
                <img src={project.image} alt={project.title} className="project-card__image" />
              </div>
            )}
            <div className="project-card__meta">
              <span className="project-card__num">{String(index + 1).padStart(2, "0")}</span>
              <span className={`status-pill status-pill--${project.status}`}>
                {project.status === "active" ? t.projects.active : t.projects.draft}
              </span>
            </div>
            <h2 className="project-card__title">{project.title}</h2>
            <p className="project-card__summary">{project.summary}</p>
            <div className="chip-list">
              {project.tags.map((tag) => <span key={tag} className="chip chip--primary">{tag}</span>)}
            </div>
            <div className="link-row">
              <Link href={`/projects/${project.slug}`} className="btn btn--ghost">{t.projects.detail}</Link>
              {project.links.filter((l) => l.external).map((link) => (
                <a key={link.href} href={link.href} className="btn btn--primary" target="_blank" rel="noreferrer">
                  {link.label} ↗
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
