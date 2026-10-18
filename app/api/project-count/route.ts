import { getProjects } from "../../lib/content";

export async function GET() {
  const projects = await getProjects();
  return Response.json(
    { count: projects ? projects.length : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
