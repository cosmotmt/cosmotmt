import { notFound } from "next/navigation";
import MusicWorkForm from "../MusicWorkForm";
import { updateMWork } from "../actions";

export const runtime = "edge";

export default async function EditMWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workId = parseInt(id);
  if (isNaN(workId)) notFound();

  const db = process.env.DB;
  if (!db) return <div>Database connection failed</div>;

  const work = await db.prepare("SELECT * FROM mworks WHERE id = ?").bind(workId).first<any>();
  if (!work) notFound();

  const currentRoles = await db.prepare("SELECT r.name FROM roles r JOIN mwork_roles mr ON r.id = mr.role_id WHERE mr.mwork_id = ?").bind(workId).all<{ name: string }>();
  const currentGenres = await db.prepare("SELECT g.name FROM genres g JOIN mwork_genres mg ON g.id = mg.genre_id WHERE mg.mwork_id = ?").bind(workId).all<{ name: string }>();

  const allRoles = await db.prepare("SELECT name FROM roles ORDER BY name ASC").all<{ name: string }>();
  const allGenres = await db.prepare("SELECT name FROM genres ORDER BY name ASC").all<{ name: string }>();

  const updateMWorkWithId = updateMWork.bind(null, workId);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <MusicWorkForm 
        action={updateMWorkWithId} 
        initialData={work}
        roleString={currentRoles.results.map(r => r.name).join(", ")}
        genreString={currentGenres.results.map(g => g.name).join(", ")}
        existingRoles={allRoles.results.map(r => r.name)}
        existingGenres={allGenres.results.map(g => g.name)}
        title="音楽実績の編集"
      />
    </div>
  );
}
