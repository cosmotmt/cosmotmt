export const runtime = "edge";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) {
    redirect("/admin/login");
  }

  const db = process.env.DB;
  if (!db) return <div className="p-8 text-red-500">Database connection failed</div>;

  const gCount = await db.prepare("SELECT COUNT(*) as count FROM gworks").first<{ count: number }>();
  const mCount = await db.prepare("SELECT COUNT(*) as count FROM mworks").first<{ count: number }>();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-2 h-8 bg-sky-500 rounded-full"></span>
            ダッシュボード
          </h1>
          <form action="/api/logout" method="POST">
            <button type="submit" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm">
              ログアウト
            </button>
          </form>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Game Works</div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-gray-900">{gCount?.count || 0}</span>
              <span className="text-sm text-gray-400 mb-1">作品</span>
            </div>
            <div className="h-1 w-12 bg-sky-500 rounded-full mt-4"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Music Works</div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-gray-900">{mCount?.count || 0}</span>
              <span className="text-sm text-gray-400 mb-1">楽曲</span>
            </div>
            <div className="h-1 w-12 bg-emerald-500 rounded-full mt-4"></div>
          </div>
        </div>

        {/* メインメニュー */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/admin/gworks" className="group">
            <div className="bg-white p-8 rounded-3xl border-2 border-transparent hover:border-sky-400 transition-all shadow-sm hover:shadow-xl flex flex-col h-full">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 011-1V4z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">ゲーム実績</h2>
              <div className="mt-6 flex items-center text-sky-600 font-bold text-sm">
                一覧を見る
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/admin/mworks" className="group">
            <div className="bg-white p-8 rounded-3xl border-2 border-transparent hover:border-emerald-400 transition-all shadow-sm hover:shadow-xl flex flex-col h-full">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">音楽実績</h2>
              <div className="mt-6 flex items-center text-emerald-600 font-bold text-sm">
                一覧を見る
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
