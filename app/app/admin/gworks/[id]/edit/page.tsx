import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import WorkForm from "../../WorkForm";
import { updateGWork } from "../../actions";

export const runtime = "edge";

export default async function EditGWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workId = parseInt(id);

  if (isNaN(workId)) notFound();

  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) redirect("/admin/login");

  const db = process.env.DB;
  if (!db) return <div>データベースに接続できません。</div>;

  // 実績本体
  const work = await db
    .prepare("SELECT * FROM gworks WHERE id = ?")
    .bind(workId)
    .first<any>();

  if (!work) notFound();

  // この実績に紐付いているタグ
  const currentTechs = await db
    .prepare("SELECT t.name FROM techs t JOIN gwork_techs gt ON t.id = gt.tech_id WHERE gt.gwork_id = ?")
    .bind(workId)
    .all<{ name: string }>();

  const currentRoles = await db
    .prepare("SELECT r.name FROM roles r JOIN gwork_roles gr ON r.id = gr.role_id WHERE gr.gwork_id = ?")
    .bind(workId)
    .all<{ name: string }>();

  // 全ての既存タグ（選択用）
  const allTechs = await db.prepare("SELECT name FROM techs ORDER BY name ASC").all<{ name: string }>();
  const allRoles = await db.prepare("SELECT name FROM roles ORDER BY name ASC").all<{ name: string }>();

  const techString = currentTechs.results.map((t) => t.name).join(", ");
  const roleString = currentRoles.results.map((r) => r.name).join(", ");
  
  const existingTechs = allTechs.results.map(t => t.name);
  const existingRoles = allRoles.results.map(r => r.name);

  const updateGWorkWithId = updateGWork.bind(null, workId);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <WorkForm 
        action={updateGWorkWithId} 
        initialData={work}
        techString={techString}
        roleString={roleString}
        existingTechs={existingTechs}
        existingRoles={existingRoles}
        title="ゲーム実績の編集"
      />
    </div>
  );
}
