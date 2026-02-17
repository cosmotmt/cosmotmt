export const runtime = "edge";

import Link from "next/link";

export default async function Home() {
  const db = process.env.DB;
  if (!db) return <div>Database connection failed</div>;

  const latestGWorks = await db
    .prepare("SELECT id, title, thumbnail_url, description FROM gworks ORDER BY created_at DESC LIMIT 3")
    .all<any>();

  const latestMWorks = await db
    .prepare("SELECT id, title, thumbnail_url, description, audio_url FROM mworks ORDER BY created_at DESC LIMIT 3")
    .all<any>();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-500 to-white bg-[length:200%_auto] animate-gradient">CosmoTmt</span>
          </h1>
          
          <div className="space-y-8 mb-16">
            <p className="text-gray-300 text-lg md:text-2xl font-medium leading-relaxed tracking-wide">
              宇宙より飛来した、トマトによく似た<br className="md:hidden" />スライム状の謎の生命体。<br />
              いつか、地球をトマトで埋めつくす野望を持つ。
            </p>
            
            <div className="pt-10 border-t border-white/10 max-w-2xl mx-auto flex flex-col items-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xl md:text-2xl font-black tracking-widest text-white">
                  ゲームエンジニア / 音楽クリエーター
                </span>
                <span className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase">
                  Game Developer / Music Creator
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/gworks" className="px-12 py-4 bg-white text-slate-950 rounded-full text-sm font-black tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl shadow-white/10 hover:shadow-red-500/40 hover:-translate-y-1">
              ゲームを見る
            </Link>
            <Link href="/mworks" className="px-12 py-4 bg-white text-slate-950 rounded-full text-sm font-black tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl shadow-white/10 hover:shadow-red-500/40 hover:-translate-y-1">
              音楽を聴く
            </Link>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h3 className="text-3xl font-black tracking-tight">ゲーム作品</h3>
              <div className="h-1 w-12 bg-red-500 rounded-full mt-3"></div>
            </div>
            <Link href="/gworks" className="text-xs font-black tracking-widest text-gray-500 hover:text-red-500 transition-colors">すべて見る</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {latestGWorks.results.map((work: any) => (
              <div key={work.id} className="group">
                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 mb-6 shadow-2xl group-hover:shadow-red-500/20 transition-all duration-500 border border-white/5">
                  {work.thumbnail_url ? (
                    <img src={work.thumbnail_url} alt={work.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold tracking-widest text-xs uppercase">No Image</div>
                  )}
                </div>
                <h4 className="text-xl font-bold group-hover:text-red-500 transition-colors">{work.title}</h4>
                <p className="text-gray-500 text-sm line-clamp-2 mt-2 leading-relaxed">{work.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Music Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h3 className="text-3xl font-black tracking-tight">音楽作品</h3>
              <div className="h-1 w-12 bg-red-500 rounded-full mt-3"></div>
            </div>
            <Link href="/mworks" className="text-xs font-black tracking-widest text-gray-500 hover:text-red-500 transition-colors">すべて見る</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {latestMWorks.results.map((work: any) => (
              <div key={work.id} className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-red-500/30 transition-all duration-500 group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-800 mb-8 shadow-inner">
                  {work.thumbnail_url ? (
                    <img src={work.thumbnail_url} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold tracking-widest text-xs uppercase">No Cover</div>
                  )}
                </div>
                <h4 className="text-xl font-bold mb-2">{work.title}</h4>
                <p className="text-gray-500 text-xs mb-6 line-clamp-1">{work.description}</p>
                {work.audio_url && (
                  <div className="pt-6 border-t border-white/5">
                    <audio src={work.audio_url} controls className="w-full h-8 opacity-40 hover:opacity-100 transition-opacity invert" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-xl rounded-[4rem] p-16 md:p-24 shadow-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
          <p className="text-gray-300 text-lg md:text-xl mb-12 relative z-10 leading-relaxed">
            お仕事のご依頼やお見積もりなど、<br className="hidden md:block" />
            お気軽にお問い合わせください。
          </p>
          <Link href="/contact" className="inline-block px-16 py-5 bg-white text-slate-950 rounded-full text-sm font-black tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl shadow-white/10 hover:shadow-red-500/40 hover:-translate-y-1 relative z-10">
            お問い合わせ
          </Link>
        </div>
      </section>
    </div>
  );
}
