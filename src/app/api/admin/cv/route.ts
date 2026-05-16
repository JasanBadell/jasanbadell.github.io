import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Se requiere un archivo PDF válido." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dest = path.join(process.cwd(), "public", "img", "Jasan Badell CV.pdf");
  await writeFile(dest, buffer);

  return NextResponse.json({ ok: true, message: "CV actualizado correctamente." });
}
