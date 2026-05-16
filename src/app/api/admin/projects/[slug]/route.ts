import { NextRequest, NextResponse } from "next/server";
import { readProjectsSync, writeProjectsSync } from "@/lib/projects-store";
import type { Project } from "@/data/projects";

type Params = { params: Promise<{ slug: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const updated = (await req.json()) as Project;
  const projects = readProjectsSync();
  const index = projects.findIndex((p) => p.slug === slug);

  if (index === -1) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }

  projects[index] = updated;
  writeProjectsSync(projects);
  return NextResponse.json({ ok: true, project: updated });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { slug } = await params;
  const projects = readProjectsSync();
  const filtered = projects.filter((p) => p.slug !== slug);

  if (filtered.length === projects.length) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }

  writeProjectsSync(filtered);
  return NextResponse.json({ ok: true });
}
