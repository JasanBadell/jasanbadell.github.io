import { getProjects } from "@/data/projects";
import { AdminDashboard } from "./AdminDashboard";

export default function AdminPage() {
  const projects = getProjects();
  return <AdminDashboard initialProjects={projects} />;
}
