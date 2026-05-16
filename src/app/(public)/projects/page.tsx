import { getProjects } from "@/data/projects";
import { ProjectsContent } from "@/components/ProjectsContent";

export default function ProjectsPage() {
  return <ProjectsContent projects={getProjects()} />;
}
