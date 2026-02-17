"use client";

import { useActionState } from "react";
import { sendContact, ContactState } from "./actions";

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(sendContact, {} as ContactState);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-white">お問い合わせ</h1>
          <div className="h-1 w-20 bg-red-500 rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-8 leading-relaxed">
            お仕事のご依頼やお見積もりなど、お気軽にお問い合わせください。
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-fade-in-up">
          {state?.success ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white mb-4">メッセージを送信しました</h2>
              <p className="text-gray-400">
                お問い合わせありがとうございます。内容を確認次第、ご連絡させていただきます。
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-10 text-sm font-black text-red-500 hover:text-red-400 transition-colors tracking-widest uppercase cursor-pointer"
              >
                新しいメッセージを送る
              </button>
            </div>
          ) : (
            <form action={formAction} className="space-y-6">
              {state?.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">お名前</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500 ${
                    state?.errors?.name ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="cosmotmt"
                />
                {state?.errors?.name && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">{state.errors.name[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">メールアドレス</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500 ${
                    state?.errors?.email ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="example@cosmotmt.jp"
                />
                {state?.errors?.email && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">{state.errors.email[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">お問い合わせ内容</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500 resize-none ${
                    state?.errors?.message ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="ご自由にご記入ください"
                ></textarea>
                {state?.errors?.message && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">{state.errors.message[0]}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-5 bg-white text-slate-950 rounded-full text-sm font-black tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl shadow-white/10 hover:shadow-red-500/40 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      送信中...
                    </>
                  ) : (
                    "メッセージを送信する"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
