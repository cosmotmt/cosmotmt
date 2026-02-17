export const runtime = "edge";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function GWorksListPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) {
    redirect("/admin/login");
  }

  const db = process.env.DB;
  if (!db) return <div className="p-8 text-red-500">データベースに接続できません。</div>;

  const works = await db
    .prepare("SELECT id, title, created_at FROM gworks ORDER BY created_at DESC")
    .all<{ id: number; title: string; created_at: string }>();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
            ゲーム実績
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="text-sm text-gray-500 hover:text-sky-600 transition"
            >
              戻る
            </Link>
            <Link
              href="/admin/gworks/new"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition shadow-sm"
            >
              新規追加
            </Link>
          </div>
        </div>

        {/* リスト */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {works.results.map((work) => (
              <li key={work.id} className="flex items-center justify-between p-4 hover:bg-sky-50/30 transition-colors">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">{work.title}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(work.created_at).toLocaleDateString("ja-JP")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/gworks/${work.id}/edit`}
                    className="text-sm text-sky-600 hover:text-sky-800 font-medium"
                  >
                    編集
                  </Link>
                  <DeleteButton id={work.id} />
                </div>
              </li>
            ))}
            {works.results.length === 0 && (
              <li className="p-12 text-center text-gray-400 text-sm">
                実績がまだありません。
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
