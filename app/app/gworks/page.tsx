export const runtime = "edge";

import Link from "next/link";

export default async function GWorksPage() {
  const db = process.env.DB;
  if (!db) return <div>Database connection failed</div>;

  // すべてのゲーム実績を取得
  const works = await db
    .prepare("SELECT id, title, thumbnail_url, description, features, external_url FROM gworks ORDER BY created_at DESC")
    .all<any>();

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">ゲーム作品</h1>
          <div className="h-1 w-20 bg-red-500 rounded-full"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {works.results.map((work: any) => (
            <div key={work.id} className="group cursor-pointer">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 mb-6 shadow-2xl group-hover:shadow-red-500/20 transition-all duration-500 border border-white/5">
                {work.thumbnail_url ? (
                  <img src={work.thumbnail_url} alt={work.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold tracking-widest text-xs uppercase">No Image</div>
                )}
              </div>
              <h2 className="text-xl font-bold group-hover:text-red-500 transition-colors mb-2">{work.title}</h2>
              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{work.description}</p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {works.results.length === 0 && (
          <div className="py-32 text-center text-gray-500">
            作品はまだ登録されていません。
          </div>
        )}
      </div>
    </div>
  );
}
