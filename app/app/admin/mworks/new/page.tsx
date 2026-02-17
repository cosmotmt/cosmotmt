import MusicWorkForm from "../MusicWorkForm";
import { createMWork } from "../actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function NewMWorkPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) redirect("/admin/login");

  const db = process.env.DB;
  if (!db) return <div>Database connection failed</div>;

  const roles = await db.prepare("SELECT name FROM roles ORDER BY name ASC").all<{ name: string }>();
  const genres = await db.prepare("SELECT name FROM genres ORDER BY name ASC").all<{ name: string }>();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <MusicWorkForm 
        action={createMWork} 
        title="音楽実績の新規追加" 
        existingRoles={roles.results.map(r => r.name)}
        existingGenres={genres.results.map(g => g.name)}
      />
    </div>
  );
}
