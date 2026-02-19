export const runtime = "edge";

import Link from "next/link";
import TerminalWindow from "./components/TerminalWindow";

export default async function Home() {
  const db = process.env.DB;
  if (!db) return <div>Database connection failed</div>;

  // ゲーム実績の取得
  const { results: gResults } = await db.prepare(`
    SELECT title, start_date FROM gworks WHERE start_date IS NOT NULL
  `).all();

  // 音楽実績の取得
  const { results: mResults } = await db.prepare(`
    SELECT title, start_date FROM mworks WHERE start_date IS NOT NULL
  `).all();

  // タイムライン用データの作成
  const timelineLogs = [
    ...gResults.map((w: any) => ({ date: w.start_date.substring(0, 7).replace('-', '.'), title: w.title, type: 'ゲーム', href: '/gworks' })),
    ...mResults.map((m: any) => ({ date: m.start_date.substring(0, 7).replace('-', '.'), title: m.title, type: '音楽', href: '/mworks' }))
  ];

  // 固定ログの追加
  const logs = [
    ...timelineLogs,
    { date: "2025.04", title: "上場ソーシャルゲーム企業 クライアントエンジニア 入社", type: "システム", href: null },
    { date: "2025.03", title: "プログラミング専門学校 卒業", type: "システム", href: null },
    { date: "2021.04", title: "プログラミング専門学校 入学", type: "システム", href: null },
    { date: "2021.01", title: "地球侵略計画 開始", type: "システム", href: null },
    { date: "2001.12", title: "誕生", type: "システム", href: null }
  ].sort((a, b) => b.date.localeCompare(a.date));

  const stripeStyle = {
    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)'
  };

  const SystemButton = ({ href, label }: { href: string, label: string }) => (
    <div className="relative inline-block group">
      {/* Offset Layer */}
      <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 translate-x-0 translate-y-0 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-200"></div>
      
      <Link href={href} className="relative inline-flex items-center justify-center px-8 py-3 bg-white text-slate-950 font-mono transition-all duration-200 hover:bg-red-500 hover:text-white overflow-hidden border border-transparent hover:-translate-x-0.5 hover:-translate-y-0.5">
        {/* Stripe Texture - Strictly hidden by default */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={stripeStyle}></div>
        
        <span className="relative z-10 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase">
          {label}
        </span>
      </Link>
    </div>
  );

  return (
    <div className="relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-9xl font-black tracking-tighter mb-8 md:mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-500 to-white bg-[length:200%_auto] animate-gradient">CosmoTmt</span>
          </h1>
          
          <div className="space-y-6 md:space-y-8 mb-12 md:mb-16 relative">
            <p className="text-gray-300 text-base md:text-2xl font-medium leading-relaxed tracking-wide max-w-3xl mx-auto">
              宇宙より飛来した、トマトによく似た<br className="md:hidden" />スライム状の謎の生命体。<br />
              いつか、地球をトマトで埋めつくす野望を持つ。
            </p>
            
            <div className="pt-8 md:pt-10 border-t border-white/10 max-w-2xl mx-auto flex flex-col items-center">
              <div className="flex flex-col items-center gap-2 font-mono">
                <span className="text-lg md:text-2xl font-black tracking-widest text-white text-center">
                  ゲームエンジニア / 音楽クリエーター
                </span>
                <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase">
                  Game Developer / Music Creator
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-center gap-6 md:gap-10">
            <SystemButton href="/gworks" label="ゲーム作品" />
            <SystemButton href="/mworks" label="音楽作品" />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 md:mb-16 font-mono">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase whitespace-nowrap">タイムライン</h3>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          </div>
          <TerminalWindow logs={logs} />
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-20 md:py-32 px-6 pb-48 md:pb-60">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 md:mb-16 font-mono">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase whitespace-nowrap">お問い合わせ</h3>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          </div>

          <div className="px-4 md:px-10 space-y-8 font-mono">
            <div className="flex items-start gap-4">
              <span className="text-gray-600 font-black shrink-0">#</span>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                お仕事のご依頼やお見積もりなど、お気軽にお問い合わせください。
              </p>
            </div>

            <div className="flex items-center">
              <SystemButton href="/contact" label="お問い合わせ" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
