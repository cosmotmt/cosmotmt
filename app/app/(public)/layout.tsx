import Link from "next/link";
import { AudioProvider } from "./context/AudioContext";
import GlobalPlayer from "./components/GlobalPlayer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AudioProvider>
      <div className="relative min-h-screen">
        {/* Cosmic Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-red-900/10 blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[100px]"></div>
          
          <div className="absolute inset-0 animate-twinkle-1">
            <div className="w-1 h-1 bg-emerald-100 rounded-full shadow-[10vw_20vh_2px_#b3ffec,30vw_50vh_2px_#d1fae5,70vw_10vh_2px_#b3ffec,90vw_80vh_2px_#d1fae5,50vw_40vh_2px_#b3ffec,15vw_85vh_2px_#b3ffec,45vw_15vh_2px_#d1fae5,75vw_45vh_2px_#b3ffec,5vw_5vh_2px_#d1fae5,85vw_95vh_2px_#b3ffec]"></div>
          </div>
          <div className="absolute inset-0 animate-twinkle-2">
            <div className="w-0.5 h-0.5 bg-emerald-200 rounded-full shadow-[20vw_70vh_1px_#b3ffec,60vw_30vh_1px_#d1fae5,80vw_90vh_1px_#b3ffec,15vw_10vh_1px_#d1fae5,40vw_60vh_1px_#b3ffec,55vw_85vh_1px_#b3ffec,95vw_15vh_1px_#d1fae5,5vw_35vh_1px_#b3ffec,35vw_5vh_1px_#d1fae5,65vw_95vh_1px_#b3ffec]"></div>
          </div>

          <div className="absolute inset-0 animate-float-bokeh opacity-20">
            <div className="absolute top-[20%] left-[15%] w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[30%] right-[20%] w-48 h-48 bg-red-500/10 rounded-full blur-[80px]"></div>
            <div className="absolute top-[60%] left-[60%] w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>

        <div className="flex flex-col min-h-screen text-white">
          {/* Header Navigation */}
          <header className="sticky top-0 z-40 w-full h-24 flex items-center bg-slate-950/30 backdrop-blur-md border-b border-white/5">
            <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
              <Link href="/" className="text-2xl font-black tracking-[0.05em] group flex items-center drop-shadow-md h-full">
                <span className="group-hover:text-red-500 transition-colors duration-300 text-white">C</span>
                <span className="text-red-500">o</span>
                <span className="group-hover:text-red-500 transition-colors duration-300 text-white">sm</span>
                <span className="text-red-500">o</span>
                <span className="group-hover:text-red-500 transition-colors duration-300 text-white">Tmt</span>
                <span className="ml-4 group-hover:text-red-500 transition-colors duration-300 text-white tracking-[0.1em]">Planet</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-12 pt-1">
                <Link href="/gworks" className="group flex flex-col items-center drop-shadow-sm">
                  <span className="text-sm font-bold tracking-[0.1em] text-white group-hover:text-red-500 transition-colors leading-none">ゲーム</span>
                  <span className="text-[9px] font-black tracking-[0.2em] text-white/70 group-hover:text-red-500 transition-colors uppercase mr-[-0.2em] mt-1.5">Games</span>
                </Link>
                <Link href="/mworks" className="group flex flex-col items-center drop-shadow-sm">
                  <span className="text-sm font-bold tracking-[0.1em] text-white group-hover:text-red-500 transition-colors leading-none">音楽</span>
                  <span className="text-[9px] font-black tracking-[0.2em] text-white/70 group-hover:text-red-500 transition-colors uppercase mr-[-0.2em] mt-1.5">Music</span>
                </Link>
                <Link href="/contact" className="group flex flex-col items-center drop-shadow-sm">
                  <span className="text-sm font-bold tracking-[0.1em] text-white group-hover:text-red-500 transition-colors leading-none">お問い合わせ</span>
                  <span className="text-[9px] font-black tracking-[0.2em] text-white/70 group-hover:text-red-500 transition-colors uppercase mr-[-0.2em] mt-1.5">Contact</span>
                </Link>
              </nav>

              <button className="md:hidden w-10 h-10 flex items-center justify-center">
                <div className="w-6 h-0.5 bg-white relative before:content-[''] before:absolute before:w-6 before:h-0.5 before:bg-white before:-top-2 after:content-[''] after:absolute after:w-6 after:h-0.5 after:bg-white after:top-2"></div>
              </button>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <GlobalPlayer />

          {/* Footer */}
          <footer className="py-24 border-t border-white/5 bg-slate-950/30 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <div className="flex flex-col items-center gap-10">
                <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
                  <a href="https://x.com/cosmotmt" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black tracking-[0.2em] text-gray-500 hover:text-red-500 transition-colors uppercase">X</a>
                  <a href="https://www.youtube.com/@cosmotmt" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black tracking-[0.2em] text-gray-500 hover:text-red-500 transition-colors uppercase">YouTube</a>
                </div>

                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.4em]">
                  &copy; {new Date().getFullYear()} CosmoTmt. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </AudioProvider>
  );
}
