"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import type { Project } from "@/data/projects";

export function ProjectDetailContent({ project }: { project: Project }) {
  const { t } = useLanguage();

  return (
    <section className="panel page-stack">
      <p className="page-eyebrow">{t.projects.projectLabel}</p>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <h1 className="page-title">{project.title}</h1>
        <span className={`status-pill status-pill--${project.status}`}>
          {project.status === "active" ? t.projects.active : t.projects.draft}
        </span>
      </div>
      {project.image && (
        <div className="project-detail__image-wrap">
          <img src={project.image} alt={project.title} className="project-detail__image" />
        </div>
      )}
      <p style={{ color: "#ccc", lineHeight: "1.76", fontSize: "0.95rem" }}>{project.summary}</p>
      <div className="chip-list">
        {project.tags.map((tag) => <span key={tag} className="chip chip--primary">{tag}</span>)}
      </div>
      <div className="page-stack" style={{ gap: "0.8rem" }}>
        {project.description.map((paragraph) => <p key={paragraph} className="page-copy">{paragraph}</p>)}
      </div>
      <div className="link-row">
        {project.links.filter((l) => l.external).map((link) => (
          <a key={link.href} href={link.href} className="btn btn--primary" target="_blank" rel="noreferrer">
            {link.label} ↗
          </a>
        ))}
        <Link href="/projects" className="btn btn--ghost">{t.projects.backBtn}</Link>
      </div>
    </section>
  );
}
