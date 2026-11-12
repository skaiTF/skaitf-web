import { getContributions } from "../../lib/github";

// Cache the response for an hour so GitHub is hit at most once per hour.
export const revalidate = 3600;

export async function GET() {
  const data = await getContributions();
  if (!data) {
    return Response.json({ error: "Contributions unavailable" }, { status: 503 });
  }
  return Response.json(data);
}
