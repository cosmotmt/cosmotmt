"use client";

import { useActionState, useState } from "react";
import { sendContact, ContactState } from "./actions";

const MUSIC_FAQ = [
  {
    question: "制作料金について教えてください",
    answer: "1曲 15,000円〜 承っております。"
  },
  {
    question: "制作の流れを教えてください",
    answer: "ヒアリング → デモ作成 → 本制作 → 納品\nというステップで進めていきます。"
  },
  {
    question: "修正は何回まで可能ですか？",
    answer: "回数制限は設けておりません。ご納得いただけるまで修正します。"
  },
  {
    question: "著作権や禁止事項について教えてください",
    answer: "・著作権：原則として譲渡・放棄いたしません（応相談）\n・禁止事項：自作発言 / AI学習 / 反社・宗教・政治利用"
  },
  {
    question: "制作した楽曲の実績紹介について",
    answer: "制作した楽曲は、ご相談の上で実績として紹介させていただくことがございます。"
  }
];

const GAME_FAQ = [
  {
    question: "ゲーム開発の依頼は受け付けていますか？",
    answer: "はい、受け付けております。まずはお気軽にご相談くださいませ。"
  }
];

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContact, {} as ContactState);
  const [openMusicIndex, setOpenMusicIndex] = useState<number | null>(null);
  const [openGameIndex, setOpenGameIndex] = useState<number | null>(null);

  const stripeStyle = {
    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)'
  };

  return (
    <div className="max-w-4xl mx-auto font-mono">
      {/* FAQ Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Music FAQ */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-black text-white uppercase tracking-widest">FAQ_MUSIC</h3>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          <div className="space-y-2">
            {MUSIC_FAQ.map((item, index) => (
              <div key={index} className="border border-white/5 bg-slate-950/30 transition-all hover:border-white/10">
                <button
                  onClick={() => setOpenMusicIndex(openMusicIndex === index ? null : index)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer group"
                >
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors flex items-center gap-3">
                    <span className="text-red-500">{openMusicIndex === index ? '▼' : '>'}</span>
                    {item.question}
                  </span>
                </button>
                <div className={`px-11 transition-all duration-300 ease-in-out ${openMusicIndex === index ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap border-l border-white/10 pl-4">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game FAQ */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-black text-white uppercase tracking-widest">FAQ_GAME</h3>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          <div className="space-y-2">
            {GAME_FAQ.map((item, index) => (
              <div key={index} className="border border-white/5 bg-slate-950/30 transition-all hover:border-white/10">
                <button
                  onClick={() => setOpenGameIndex(openGameIndex === index ? null : index)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer group"
                >
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors flex items-center gap-3">
                    <span className="text-red-500">{openGameIndex === index ? '▼' : '>'}</span>
                    {item.question}
                  </span>
                </button>
                <div className={`px-11 transition-all duration-300 ease-in-out ${openGameIndex === index ? 'max-h-48 pb-4 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap border-l border-white/10 pl-4">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section: Terminal Window Style */}
      <div className="relative bg-slate-950/70 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Terminal Header */}
        <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-end relative z-30">
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">CONTACT</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 md:p-10 relative">
          {/* Scanline Effect */}
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
                {'>'} SEND_NEW_MESSAGE
              </button>
            </div>
          ) : (
            <form action={formAction} className="relative z-20 space-y-8">
              {state?.error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center uppercase">[ ERROR: {state.error} ]</div>}

              <div className="hidden" aria-hidden="true">
                <input type="text" name="tel" tabIndex={-1} autoComplete="off" />
              </div>

              {/* Input Rows */}
              <div className="space-y-8">
                {/* Name Input */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="flex items-center shrink-0 w-full md:w-32">
                    <span className="text-gray-600 font-black mr-3">{'>'}</span>
                    <label htmlFor="name" className="text-[10px] font-black text-gray-500 uppercase tracking-widest">お名前</label>
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" id="name" name="name" required 
                      className={`w-full bg-[#020617] border px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 rounded-none ${state?.errors?.name ? 'border-red-500/50' : 'border-white/10'}`} 
                      placeholder="cosmotmt" 
                    />
                    {state?.errors?.name && <p className="text-red-500 text-[9px] font-bold mt-1">! {state.errors.name[0]}</p>}
                  </div>
                </div>

                {/* Email Input */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="flex items-center shrink-0 w-full md:w-32">
                    <span className="text-gray-600 font-black mr-3">{'>'}</span>
                    <label htmlFor="email" className="text-[10px] font-black text-gray-500 uppercase tracking-widest">メールアドレス</label>
                  </div>
                  <div className="flex-1">
                    <input 
                      type="email" id="email" name="email" required 
                      className={`w-full bg-[#020617] border px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 rounded-none ${state?.errors?.email ? 'border-red-500/50' : 'border-white/10'}`} 
                      placeholder="example@cosmotmt.jp" 
                    />
                    {state?.errors?.email && <p className="text-red-500 text-[9px] font-bold mt-1">! {state.errors.email[0]}</p>}
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                  <div className="flex items-center shrink-0 w-full md:w-32 pt-1">
                    <span className="text-gray-600 font-black mr-3">{'>'}</span>
                    <label htmlFor="message" className="text-[10px] font-black text-gray-500 uppercase tracking-widest">内容</label>
                  </div>
                  <div className="flex-1">
                    <textarea 
                      id="message" name="message" required rows={6} 
                      className={`w-full bg-[#020617] border px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 resize-none rounded-none ${state?.errors?.message ? 'border-red-500/50' : 'border-white/10'}`}
                      placeholder="ご自由にご記入ください"
                    ></textarea>
                    {state?.errors?.message && <p className="text-red-500 text-[9px] font-bold mt-1">! {state.errors.message[0]}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
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
