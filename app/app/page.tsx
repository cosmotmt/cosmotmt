export const runtime = "edge";

import Link from "next/link";
import GWorksList from "./gworks/GWorksList";
import MWorksList from "./mworks/MWorksList";

export default async function Home() {
  const db = process.env.DB;
  if (!db) return <div>Database connection failed</div>;

  const { results: gResults } = await db.prepare(`
    SELECT 
      w.*,
      (SELECT GROUP_CONCAT(t.name) FROM gwork_techs wt JOIN techs t ON wt.tech_id = t.id WHERE wt.gwork_id = w.id) as techs,
      (SELECT GROUP_CONCAT(r.name) FROM gwork_roles wr JOIN roles r ON wr.role_id = r.id WHERE wr.gwork_id = w.id) as roles,
      (SELECT GROUP_CONCAT(p.name) FROM gwork_platforms wp JOIN platforms p ON wp.platform_id = p.id WHERE wp.gwork_id = w.id) as platforms
    FROM gworks w
    ORDER BY w.created_at DESC LIMIT 3
  `).all();

  const latestGWorks = gResults.map((work: any) => {
    let duration = "";
    if (work.start_date && work.end_date) duration = `${work.start_date} 〜 ${work.end_date}`;
    else if (work.start_date) duration = `${work.start_date} 〜`;
    return {
      ...work,
      duration,
      techs: work.techs ? work.techs.split(',') : [],
      roles: work.roles ? work.roles.split(',') : [],
      platforms: work.platforms ? work.platforms.split(',') : [],
    };
  });

  const { results: mResults } = await db.prepare(`
    SELECT 
      m.*,
      (SELECT GROUP_CONCAT(g.name) FROM mwork_genres mg JOIN genres g ON mg.genre_id = g.id WHERE mg.mwork_id = m.id) as genres,
      (SELECT GROUP_CONCAT(r.name) FROM mwork_roles mr JOIN roles r ON mr.role_id = r.id WHERE mr.mwork_id = m.id) as roles
    FROM mworks m
    ORDER BY m.created_at DESC LIMIT 3
  `).all();

  const latestMWorks = mResults.map((work: any) => {
    let duration = "";
    if (work.start_date && work.end_date) duration = `${work.start_date} 〜 ${work.end_date}`;
    else if (work.start_date) duration = `${work.start_date} 〜`;
    return {
      ...work,
      duration,
      genres: work.genres ? work.genres.split(',') : [],
      roles: work.roles ? work.roles.split(',') : [],
    };
  });

  return (
    <div className="relative">
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

      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h3 className="text-3xl font-black tracking-tight text-white">ゲーム作品</h3>
              <div className="h-1 w-12 bg-red-500 rounded-full mt-3"></div>
            </div>
            <Link href="/gworks" className="text-xs font-black tracking-widest text-gray-500 hover:text-red-500 transition-colors">すべて見る</Link>
          </div>
          <GWorksList initialWorks={latestGWorks} />
        </div>
      </section>

      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h3 className="text-3xl font-black tracking-tight text-white">音楽作品</h3>
              <div className="h-1 w-12 bg-red-500 rounded-full mt-3"></div>
            </div>
            <Link href="/mworks" className="text-xs font-black tracking-widest text-gray-500 hover:text-red-500 transition-colors">すべて見る</Link>
          </div>
          <MWorksList initialWorks={latestMWorks} />
        </div>
      </section>

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
