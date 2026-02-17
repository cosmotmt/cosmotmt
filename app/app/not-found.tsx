import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center bg-slate-950 text-white">
      {/* Cosmic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-red-900/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[100px]"></div>
        <div className="absolute inset-0 animate-twinkle-1">
          <div className="w-1 h-1 bg-emerald-100 rounded-full shadow-[10vw_20vh_2px_#b3ffec,30vw_50vh_2px_#d1fae5,70vw_10vh_2px_#b3ffec,90vw_80vh_2px_#d1fae5,50vw_40vh_2px_#b3ffec,15vw_85vh_2px_#b3ffec,45vw_15vh_2px_#d1fae5,75vw_45vh_2px_#b3ffec,5vw_5vh_2px_#d1fae5,85vw_95vh_2px_#b3ffec]"></div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="mb-6">
          <span className="text-[10px] font-black tracking-[0.5em] text-gray-500 uppercase">404 Not Found</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter mb-12">
          ページが見つかりませんでした
        </h1>

        <Link 
          href="/" 
          className="inline-block px-12 py-4 bg-white text-slate-950 rounded-full text-sm font-black tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl shadow-white/10 hover:shadow-red-500/40 hover:-translate-y-1 active:scale-[0.98]"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
