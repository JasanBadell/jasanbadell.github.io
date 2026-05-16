import { readProjectsSync } from "@/lib/projects-store";

export type ProjectLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string[];
  tags: string[];
  links: ProjectLink[];
  status: "active" | "draft";
  image?: string;
};

export function getProjects(): Project[] {
  return readProjectsSync();
}

export function getProjectBySlug(slug: string): Project | undefined {
  return readProjectsSync().find((p) => p.slug === slug);
}
