import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { readProjectsSync, writeProjectsSync } from "@/lib/projects-store";

export async function POST(req: Request) {
  const fd = await req.formData();
  const file = fd.get("file") as File | null;
  const slug = fd.get("slug") as string | null;

  if (!file || !slug) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  const ext = extname(file.name) || ".jpg";
  const filename = `${slug}${ext}`;
  const dir = join(process.cwd(), "public", "img", "projects");
  await mkdir(dir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(join(dir, filename), Buffer.from(bytes));

  const imagePath = `/img/projects/${filename}`;

  const projects = readProjectsSync();
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx !== -1) {
    projects[idx] = { ...projects[idx], image: imagePath };
    writeProjectsSync(projects);
  }

  return NextResponse.json({ ok: true, path: imagePath });
}
