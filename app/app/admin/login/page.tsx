"use client";

import { useActionState } from "react";
import { login } from "./actions";

export const runtime = "edge";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  const inputClasses = "w-full rounded-xl border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 border p-3 bg-white transition-all shadow-sm";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500 rounded-2xl shadow-lg shadow-sky-200 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">管理者ログイン</h1>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100 text-center">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">メールアドレス</label>
              <input
                type="email"
                name="email"
                required
                className={inputClasses}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">パスワード</label>
              <input
                type="password"
                name="password"
                required
                className={inputClasses}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 rounded-2xl text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 disabled:opacity-50 disabled:shadow-none"
              >
                {isPending ? "ログイン中..." : "ログイン"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
