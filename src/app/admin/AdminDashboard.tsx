"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

type LinkRow = { href: string; label: string; external: boolean };

type FormState = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  tags: string;
  links: LinkRow[];
  status: "active" | "draft";
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  tags: "",
  links: [],
  status: "active",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toForm(p: Project): FormState {
  return {
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    description: p.description.join("\n\n"),
    tags: p.tags.join(", "),
    links: p.links.map((l) => ({ href: l.href, label: l.label, external: l.external ?? false })),
    status: p.status,
  };
}

function fromForm(f: FormState): Project {
  return {
    title: f.title.trim(),
    slug: f.slug.trim(),
    summary: f.summary.trim(),
    description: f.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
    tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
    links: f.links.filter((l) => l.href.trim()),
    status: f.status,
  };
}

type View = "list" | "add" | "edit";

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin1234";
    if (pw === correct) {
      sessionStorage.setItem("admin_authed", "1");
      onAuth();
    } else {
      setError(true);
      setPw("");
    }
  }

  return (
    <div className="admin-gate">
      <div className="panel admin-gate__panel">
        <h1 className="admin-gate__title">Panel de admin</h1>
        <form onSubmit={handleSubmit} className="admin-gate__form">
          <label className="form-field">
            <span className="form-label">Contraseña</span>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(false); }}
              placeholder="••••••••"
              autoFocus
              required
            />
          </label>
          {error && <p className="form-status form-status--error">Contraseña incorrecta</p>}
          <button type="submit" className="btn btn--primary">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export function AdminDashboard({ initialProjects }: { initialProjects: Project[] }) {
  const [authed, setAuthed] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "1") setAuthed(true);
  }, []);

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;
  const [view, setView] = useState<View>("list");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const cvInputRef = useRef<HTMLInputElement>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvMsg, setCvMsg] = useState<{ text: string; ok: boolean } | null>(null);

  async function refresh() {
    const res = await fetch("/api/admin/projects");
    if (res.ok) {
      const data = (await res.json()) as { projects: Project[] };
      setProjects(data.projects);
    }
  }

  function openAdd() {
    setForm(emptyForm);
    setEditingSlug(null);
    setError(null);
    setView("add");
  }

  function openEdit(project: Project) {
    setForm(toForm(project));
    setEditingSlug(project.slug);
    setError(null);
    setView("edit");
  }

  async function handleDelete(slug: string) {
    const res = await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteConfirm(null);
      await refresh();
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const payload = fromForm(form);
    const url = view === "edit" ? `/api/admin/projects/${editingSlug}` : "/api/admin/projects";
    const method = view === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await refresh();
      setView("list");
    } else {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Error al guardar.");
    }
    setSaving(false);
  }

  function setLink(i: number, field: keyof LinkRow, value: string | boolean) {
    setForm((p) => {
      const links = [...p.links];
      links[i] = { ...links[i], [field]: value };
      return { ...p, links };
    });
  }

  async function handleCvUpload() {
    if (!cvFile) return;
    setCvUploading(true);
    setCvMsg(null);
    const fd = new FormData();
    fd.append("file", cvFile);
    const res = await fetch("/api/admin/cv", { method: "POST", body: fd });
    const data = (await res.json()) as { message?: string; error?: string };
    setCvMsg({ text: data.message ?? data.error ?? "Error", ok: res.ok });
    setCvUploading(false);
    setCvFile(null);
    if (cvInputRef.current) cvInputRef.current.value = "";
  }

  if (view !== "list") {
    return (
      <div className="panel page-stack">
        <div className="admin-form-header">
          <div>
            <p className="page-eyebrow">{view === "add" ? "Nuevo proyecto" : "Editar proyecto"}</p>
            <h1 className="page-title" style={{ fontSize: "1.4rem", marginTop: "0.4rem" }}>
              {view === "add" ? "Añadir proyecto" : form.title || "Editar"}
            </h1>
          </div>
          <button className="btn btn--ghost" onClick={() => setView("list")}>← Cancelar</button>
        </div>

        <div className="admin-form-grid">
          <label className="form-field">
            <span className="form-label">Título</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  title: e.target.value,
                  slug: view === "add" ? slugify(e.target.value) : p.slug,
                }))
              }
              placeholder="Mi proyecto"
            />
          </label>

          <label className="form-field">
            <span className="form-label">Slug (URL)</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
              placeholder="mi-proyecto"
            />
          </label>
        </div>

        <label className="form-field">
          <span className="form-label">Estado</span>
          <select
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "active" | "draft" }))}
            className="admin-select"
          >
            <option value="active">Activo</option>
            <option value="draft">En revisión</option>
          </select>
        </label>

        <label className="form-field">
          <span className="form-label">Resumen</span>
          <textarea
            value={form.summary}
            onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
            placeholder="Descripción corta visible en la lista de proyectos..."
            rows={2}
          />
        </label>

        <label className="form-field">
          <span className="form-label">Descripción completa (separa párrafos con una línea en blanco)</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder={"Párrafo 1...\n\nPárrafo 2...\n\nPárrafo 3..."}
            rows={7}
          />
        </label>

        <label className="form-field">
          <span className="form-label">Tags (separados por coma)</span>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
            placeholder="React, TypeScript, Node.js"
          />
        </label>

        <div className="form-field">
          <span className="form-label">Links</span>
          <div className="admin-links-list">
            {form.links.map((link, i) => (
              <div key={i} className="admin-link-row">
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => setLink(i, "href", e.target.value)}
                  placeholder="https://..."
                  className="admin-link-href"
                />
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => setLink(i, "label", e.target.value)}
                  placeholder="Live Demo"
                  className="admin-link-label"
                />
                <label className="admin-link-ext">
                  <input
                    type="checkbox"
                    checked={link.external}
                    onChange={(e) => setLink(i, "external", e.target.checked)}
                  />
                  <span>externo</span>
                </label>
                <button
                  type="button"
                  className="admin-link-remove"
                  onClick={() => setForm((p) => ({ ...p, links: p.links.filter((_, j) => j !== i) }))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn--ghost"
            style={{ marginTop: "0.5rem", fontSize: "0.78rem" }}
            onClick={() => setForm((p) => ({ ...p, links: [...p.links, { href: "", label: "", external: true }] }))}
          >
            + Agregar link
          </button>
        </div>

        {error && <p className="form-status form-status--error">{error}</p>}

        <div className="link-row" style={{ justifyContent: "flex-end", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
          <button className="btn btn--ghost" onClick={() => setView("list")}>Cancelar</button>
          <button className="btn btn--primary" onClick={handleSave} disabled={saving || !form.title || !form.slug}>
            {saving ? "Guardando..." : "Guardar proyecto →"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      {/* Projects */}
      <div className="panel page-stack">
        <div className="admin-section-header">
          <div>
            <p className="page-eyebrow">Gestión de contenido</p>
            <h1 className="page-title" style={{ fontSize: "1.5rem", marginTop: "0.4rem" }}>Proyectos</h1>
          </div>
          <button className="btn btn--primary" onClick={openAdd}>+ Nuevo proyecto</button>
        </div>

        <div className="admin-project-list">
          {projects.map((project, i) => (
            <div key={project.slug} className="admin-project-row">
              <span className="admin-project-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="admin-project-title">{project.title}</span>
              <span className={`status-pill status-pill--${project.status}`}>
                {project.status === "active" ? "Activo" : "En revisión"}
              </span>
              <div className="admin-project-actions">
                <button className="btn btn--ghost" onClick={() => openEdit(project)}>Editar</button>
                {deleteConfirm === project.slug ? (
                  <>
                    <button className="btn btn--accent" onClick={() => handleDelete(project.slug)}>Confirmar</button>
                    <button className="btn btn--ghost" onClick={() => setDeleteConfirm(null)}>No</button>
                  </>
                ) : (
                  <button className="btn btn--ghost" style={{ color: "var(--accent)", borderColor: "var(--accent-border)" }} onClick={() => setDeleteConfirm(project.slug)}>
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="page-copy" style={{ opacity: 0.45, textAlign: "center", padding: "2rem 0" }}>
              No hay proyectos. Añade el primero.
            </p>
          )}
        </div>
      </div>

      {/* CV */}
      <div className="panel page-stack">
        <div>
          <p className="page-eyebrow">Curriculum Vitae</p>
          <h2 className="page-title" style={{ fontSize: "1.5rem", marginTop: "0.4rem" }}>Actualizar CV</h2>
        </div>
        <p className="page-copy">
          El CV se publica en{" "}
          <code style={{ color: "var(--primary)", fontSize: "0.85em" }}>/img/Jasan Badell CV.pdf</code>.
          Sube un nuevo PDF para reemplazarlo.
        </p>
        <div className="admin-cv-row">
          <input
            ref={cvInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
          />
          <button type="button" className="btn btn--ghost" onClick={() => cvInputRef.current?.click()}>
            {cvFile ? `📄 ${cvFile.name}` : "Seleccionar PDF"}
          </button>
          <button
            className="btn btn--primary"
            onClick={handleCvUpload}
            disabled={!cvFile || cvUploading}
          >
            {cvUploading ? "Subiendo..." : "Actualizar CV"}
          </button>
        </div>
        {cvMsg && (
          <p className={`form-status form-status--${cvMsg.ok ? "success" : "error"}`}>{cvMsg.text}</p>
        )}
      </div>
    </div>
  );
}
