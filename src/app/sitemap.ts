import type { MetadataRoute } from "next";
import { getProjects } from "@/data/projects";

export const dynamic = "force-static";

const BASE_URL = "https://jasanbadell.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/projects", "/contact"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projectPages = getProjects().map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages];
}
