export const runtime = "edge";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  // セッションチェック
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  // ログインしていなければログイン画面へ戻す
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">管理者ダッシュボード</h1>
      <p className="mb-8">ログイン成功です！おめでとうございます！</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded shadow">
          <h2 className="font-bold mb-2">ゲーム実績管理</h2>
          <p className="text-sm text-gray-600 mb-4">ゲームエンジニアとしての実績を追加・編集します。</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            管理する（準備中）
          </button>
        </div>
        
        <div className="border p-4 rounded shadow">
          <h2 className="font-bold mb-2">音楽実績管理</h2>
          <p className="text-sm text-gray-600 mb-4">音楽クリエイターとしての実績を追加・編集します。</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            管理する（準備中）
          </button>
        </div>
      </div>

      <div className="mt-12">
        <form action={async () => {
          "use server";
          const cookieStore = await cookies();
          cookieStore.delete("admin_session");
          redirect("/admin/login");
        }}>
          <button type="submit" className="text-red-500 underline">
            ログアウトする
          </button>
        </form>
      </div>
    </div>
  );
}
