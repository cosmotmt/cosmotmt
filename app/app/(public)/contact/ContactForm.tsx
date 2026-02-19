"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { sendContact, ContactState } from "./actions";

const FAQ_DATA = [
  {
    id: "price",
    category: "音楽",
    question: "制作料金について教えてください",
    answer: "1曲 15,000円〜 承っております。"
  },
  {
    id: "flow",
    category: "音楽",
    question: "制作の流れを教えてください",
    answer: "ヒアリング → デモ作成 → 本制作 → 納品 というステップで進めていきます。"
  },
  {
    id: "revision",
    category: "音楽",
    question: "修正は何回まで可能ですか？",
    answer: "回数制限は設けておりません。ご納得いただけるまで修正します。"
  },
  {
    id: "rights",
    category: "音楽",
    question: "著作権や禁止事項について教えてください",
    answer: "・著作権：原則として譲渡・放棄いたしません（応相談）\n・禁止事項：自作発言 / AI学習 / 反社・宗教・政治利用"
  },
  {
    id: "credits",
    category: "音楽",
    question: "制作した楽曲の実績紹介について",
    answer: "制作した楽曲は、ご相談の上で実績として紹介させていただくことがございます。"
  },
  {
    id: "game_req",
    category: "ゲーム",
    question: "ゲーム開発の依頼は受け付けていますか？",
    answer: "はい、受け付けております。まずはお気軽にご相談くださいませ。"
  },
  {
    id: "other_dev",
    category: "ゲーム",
    question: "ゲーム以外の開発依頼は受け付けていますか？",
    answer: "受付できる可能性がございます。まずはお気軽にご相談くださいませ。"
  }
];

interface FaqLog {
  id: string;
  category: string;
  question: string;
  answer: string;
  timestamp: number;
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContact, {} as ContactState);
  const [faqLogs, setFaqLogs] = useState<FaqLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const stripeStyle = {
    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)'
  };

  const handleFaqClick = (item: typeof FAQ_DATA[0]) => {
    setFaqLogs(prev => {
      const newLogs = [...prev, { ...item, timestamp: Date.now() }];
      return newLogs.slice(-3);
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [faqLogs]);

  const getTagClass = (category: string, isHover: boolean = false) => {
    const base = "inline-flex items-center text-[8px] md:text-[9px] font-black px-1 h-3.5 md:h-4 border uppercase transition-all mr-2 vertical-mid ";
    if (category === 'ゲーム') {
      return base + (isHover ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5 group-hover:border-red-500/50 group-hover:text-red-500" : "border-emerald-500/30 text-emerald-500 bg-emerald-500/5");
    }
    return base + (isHover ? "border-sky-500/30 text-sky-500 bg-sky-500/5 group-hover:border-red-500/50 group-hover:text-red-500" : "border-sky-500/30 text-sky-500 bg-sky-500/5");
  };

  return (
    <div className="max-w-4xl mx-auto font-mono">
      <style jsx global>{`
        .vertical-mid { vertical-align: middle; margin-top: -2px; }
      `}</style>

      {/* FAQ Terminal Window */}
      <div className="relative bg-slate-950/70 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col mb-12 md:mb-16">
        {/* Header */}
        <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-end relative z-30">
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">FAQ</span>
        </div>

        <div className="p-4 md:p-10 space-y-6 relative min-h-[400px] flex flex-col">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-10"></div>

          {/* Question List */}
          <div className="relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              {FAQ_DATA.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleFaqClick(item)}
                  className="flex items-start text-left cursor-pointer transition-all group py-1"
                >
                  <div className="shrink-0 w-4 flex items-center justify-center h-5 md:h-6 mr-3 md:mr-4">
                    <span className="font-black text-sm text-gray-700 group-hover:text-red-500 transition-colors">{'>'}</span>
                  </div>
                  <div className="text-xs md:text-base font-bold text-gray-500 group-hover:text-red-500 transition-colors leading-5 md:leading-6">
                    <span className={getTagClass(item.category, true)}>{item.category}</span>
                    {item.question}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Output Buffer */}
          <div className="relative z-20 flex-1 flex flex-col pt-4 overflow-hidden">
            <div className="h-px bg-white/5 w-full mb-6"></div>
            
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar scroll-smooth"
            >
              {faqLogs.length > 0 ? (
                faqLogs.map((log, index) => {
                  const isLatest = index === faqLogs.length - 1;
                  return (
                    <div key={`${log.id}-${log.timestamp}`} className={`space-y-1 transition-opacity duration-500 ${isLatest ? 'opacity-100' : 'opacity-30 hidden md:block'}`}>
                      {/* Question Log */}
                      <div className="flex items-start">
                        <div className="shrink-0 w-4 flex items-center justify-center h-5 md:h-6 mr-3 md:mr-4">
                          <span className="text-gray-600 font-black text-sm">{'>'}</span>
                        </div>
                        <div className="text-xs md:text-base font-bold text-gray-400 leading-relaxed md:leading-6">
                          <span className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2 inline-block align-middle" style={{ marginTop: '-2px' }}>Q:</span>
                          <span className={getTagClass(log.category)}>{log.category}</span>
                          {log.question}
                        </div>
                      </div>
                      
                      {/* Answer Log */}
                      <div className="flex items-start">
                        <div className="shrink-0 w-4 flex items-center justify-center h-5 md:h-6 mr-3 md:mr-4">
                          <span className="text-gray-600 font-black text-sm">#</span>
                        </div>
                        <p className={`text-xs md:text-base leading-relaxed md:leading-6 whitespace-pre-wrap max-w-2xl ${isLatest ? 'text-gray-300' : 'text-gray-500'}`}>
                          {log.answer}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center">
                  <div className="shrink-0 w-4 flex items-center justify-center h-5 md:h-6 mr-3 md:mr-4">
                    <span className="text-gray-700 font-black text-sm animate-pulse">{'>'}</span>
                  </div>
                  <div className="w-2 h-4 bg-gray-700 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="relative bg-slate-950/70 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-end relative z-30">
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">CONTACT</span>
        </div>

        <div className="p-4 md:p-10 relative">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-10"></div>

          {state?.success ? (
            <div className="relative z-20 text-center py-12">
              <div className="text-emerald-500 font-black text-2xl mb-6">[ SUCCESS ]</div>
              <h2 className="text-lg font-bold text-white mb-4">メッセージを送信しました</h2>
              <p className="text-gray-500 text-xs">内容を確認次第、ご連絡させていただきます。</p>
              <button
                onClick={() => window.location.reload()} 
                className="mt-12 text-[10px] font-black text-gray-500 hover:text-red-500 transition-colors tracking-[0.3em] uppercase cursor-pointer"
              >
                {'>'} 新しいメッセージを送信
              </button>
            </div>
          ) : (
            <form action={formAction} className="relative z-20 space-y-6 md:space-y-8">
              {state?.error && (
                <div className="flex items-start gap-4 p-4 bg-red-500/5 border border-red-500/20 text-red-500">
                  <div className="shrink-0 w-4 flex items-center justify-center h-5 md:h-6 mr-0">
                    <span className="font-black text-sm">!</span>
                  </div>
                  <p className="text-xs md:text-sm font-bold uppercase tracking-tight">
                    ERROR: {state.error}
                  </p>
                </div>
              )}

              <div className="hidden" aria-hidden="true">
                <input type="text" name="tel" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
                  <div className="flex items-center shrink-0 w-full md:w-36">
                    <div className="w-4 flex items-center justify-center mr-3 md:mr-4">
                      <span className="text-gray-600 font-black text-sm">{'>'}</span>
                    </div>
                    <label htmlFor="name" className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-widest">お名前</label>
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" id="name" name="name" required 
                      className={`w-full bg-[#020617] border px-4 py-2 text-xs md:text-base text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 rounded-none ${state?.errors?.name ? 'border-red-500/50' : 'border-white/10'}`} 
                      placeholder="cosmotmt" 
                    />
                    {state?.errors?.name && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-red-500 font-black text-[10px]">!</span>
                        <p className="text-red-500 text-[9px] font-bold uppercase tracking-tighter">{state.errors.name[0]}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
                  <div className="flex items-center shrink-0 w-full md:w-36">
                    <div className="w-4 flex items-center justify-center mr-3 md:mr-4">
                      <span className="text-gray-600 font-black text-sm">{'>'}</span>
                    </div>
                    <label htmlFor="email" className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-widest">メールアドレス</label>
                  </div>
                  <div className="flex-1">
                    <input 
                      type="email" id="email" name="email" required 
                      className={`w-full bg-[#020617] border px-4 py-2 text-xs md:text-base text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 rounded-none ${state?.errors?.email ? 'border-red-500/50' : 'border-white/10'}`} 
                      placeholder="example@cosmotmt.jp" 
                    />
                    {state?.errors?.email && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-red-500 font-black text-[10px]">!</span>
                        <p className="text-red-500 text-[9px] font-bold uppercase tracking-tighter">{state.errors.email[0]}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-0">
                  <div className="flex items-center shrink-0 w-full md:w-36 pt-1">
                    <div className="w-4 flex items-center justify-center mr-3 md:mr-4">
                      <span className="text-gray-600 font-black text-sm">{'>'}</span>
                    </div>
                    <label htmlFor="message" className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-widest">内容</label>
                  </div>
                  <div className="flex-1">
                    <textarea 
                      id="message" name="message" required rows={6} 
                      className={`w-full bg-[#020617] border px-4 py-3 text-xs md:text-base text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 resize-none rounded-none ${state?.errors?.message ? 'border-red-500/50' : 'border-white/10'}`}
                      placeholder="ご自由にご記入ください"
                    ></textarea>
                    {state?.errors?.message && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-red-500 font-black text-[10px]">!</span>
                        <p className="text-red-500 text-[9px] font-bold uppercase tracking-tighter">{state.errors.message[0]}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-center">
                <div className="relative inline-block group w-full md:w-auto">
                  <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 translate-x-0 translate-y-0 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-200"></div>
                  <button 
                    type="submit" 
                    disabled={isPending} 
                    className="relative flex items-center justify-center w-full md:px-24 py-4 bg-white text-slate-950 text-xs font-black tracking-[0.2em] uppercase transition-all duration-200 hover:bg-red-500 hover:text-white overflow-hidden border border-transparent hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={stripeStyle}></div>
                    <span className="relative z-10">{isPending ? "送信中..." : "送信"}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
