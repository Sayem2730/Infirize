import { getProjects } from "../lib/content";
import LiveCount from "./LiveCount";

export default async function ProjectCount() {
  const projects = await getProjects();
  if (!projects) return null;
  return <LiveCount initial={projects.length} />;
}
