import WorkForm from "../WorkForm";
import { createGWork } from "../actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function NewGWorkPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) redirect("/admin/login");

  const db = process.env.DB;
  if (!db) return <div>データベースに接続できません。</div>;

  // 既存のタグを取得（選択候補用）
  const techs = await db.prepare("SELECT name FROM techs ORDER BY name ASC").all<{ name: string }>();
  const roles = await db.prepare("SELECT name FROM roles ORDER BY name ASC").all<{ name: string }>();
  const platforms = await db.prepare("SELECT name FROM platforms ORDER BY name ASC").all<{ name: string }>();

  const existingTechs = techs.results.map(t => t.name);
  const existingRoles = roles.results.map(r => r.name);
  const existingPlatforms = platforms.results.map(p => p.name);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <WorkForm 
        action={createGWork} 
        title="ゲーム実績の新規追加" 
        existingTechs={existingTechs}
        existingRoles={existingRoles}
        existingPlatforms={existingPlatforms}
      />
    </div>
  );
}
