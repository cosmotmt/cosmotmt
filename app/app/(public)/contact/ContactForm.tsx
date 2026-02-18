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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
        <div className="space-y-10">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">音楽</h3>
            <div className="h-1 w-10 bg-red-500 rounded-full mt-3"></div>
          </div>
          <div className="space-y-3">
            {MUSIC_FAQ.map((item, index) => (
              <div key={index} className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10">
                <button
                  onClick={() => setOpenMusicIndex(openMusicIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-sm font-bold text-gray-200">{item.question}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${openMusicIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`px-6 transition-all duration-300 ease-in-out ${openMusicIndex === index ? 'max-h-[32rem] pb-6 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">ゲーム</h3>
            <div className="h-1 w-10 bg-red-500 rounded-full mt-3"></div>
          </div>
          <div className="space-y-3">
            {GAME_FAQ.map((item, index) => (
              <div key={index} className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10">
                <button
                  onClick={() => setOpenGameIndex(openGameIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-sm font-bold text-gray-200">{item.question}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${openGameIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`px-6 transition-all duration-300 ease-in-out ${openGameIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-fade-in-up">
        {state?.success ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-4">メッセージを送信しました</h2>
            <p className="text-gray-400">お問い合わせありがとうございます。内容を確認次第、ご連絡させていただきます。</p>
            <button
              onClick={() => window.location.reload()} 
              className="mt-10 text-sm font-black text-gray-500 hover:text-red-500 transition-colors tracking-widest uppercase cursor-pointer"
            >
              新しいメッセージを送る
            </button>
          </div>
        ) : (
          <form action={formAction} className="space-y-8">
            {state?.error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center">{state.error}</div>}

            <div className="hidden" aria-hidden="true">
              <input type="text" name="tel" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">お名前</label>
                <input type="text" id="name" name="name" required className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500 ${state?.errors?.name ? 'border-red-500/50' : 'border-white/10'}`} placeholder="cosmotmt" />
                {state?.errors?.name && <p className="text-red-500 text-[10px] font-bold ml-1">{state.errors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">メールアドレス</label>
                <input type="email" id="email" name="email" required className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500 ${state?.errors?.email ? 'border-red-500/50' : 'border-white/10'}`} placeholder="example@cosmotmt.jp" />
                {state?.errors?.email && <p className="text-red-500 text-[10px] font-bold ml-1">{state.errors.email[0]}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">お問い合わせ内容</label>
              <textarea id="message" name="message" required rows={8} className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500 resize-none ${state?.errors?.message ? 'border-red-500/50' : 'border-white/10'}`} placeholder="ご自由にご記入ください"></textarea>
              {state?.errors?.message && <p className="text-red-500 text-[10px] font-bold ml-1">{state.errors.message[0]}</p>}
            </div>

            <div className="pt-4 flex justify-center">
              <button type="submit" disabled={isPending} className="w-full md:w-auto md:px-24 py-5 bg-white text-slate-950 rounded-full text-sm font-black tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl shadow-white/10 hover:shadow-red-500/40 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer">
                {isPending ? <><div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>送信中...</> : "メッセージを送信する"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
