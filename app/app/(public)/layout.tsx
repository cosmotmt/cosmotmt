"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioProvider } from "./context/AudioContext";
import GlobalPlayer from "./components/GlobalPlayer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollScrollTop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { href: "/gworks", label: "ゲーム" },
    { href: "/mworks", label: "音楽" },
    { href: "/contact", label: "お問い合わせ" },
  ];

  return (
    <AudioProvider>
      <div className="relative min-h-screen antialiased">
        {/* Global Cosmic Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-red-900/10 blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[100px]"></div>
          <div className="absolute inset-0 animate-twinkle-1">
            <div className="w-1 h-1 bg-emerald-100 rounded-full shadow-[10vw_20vh_2px_#b3ffec,30vw_50vh_2px_#d1fae5,70vw_10vh_2px_#b3ffec,90vw_80vh_2px_#d1fae5,50vw_40vh_2px_#b3ffec,15vw_85vh_2px_#b3ffec,45vw_15vh_2px_#d1fae5,75vw_45vh_2px_#b3ffec,5vw_5vh_2px_#d1fae5,85vw_95vh_2px_#b3ffec]"></div>
          </div>
          <div className="absolute inset-0 animate-twinkle-2">
            <div className="w-0.5 h-0.5 bg-emerald-200 rounded-full shadow-[20vw_70vh_1px_#b3ffec,60vw_30vh_1px_#d1fae5,80vw_90vh_1px_#b3ffec,15vw_10vh_1px_#d1fae5,40vw_60vh_1px_#d1fae5,55vw_85vh_1px_#b3ffec,95vw_15vh_1px_#b3ffec,5vw_35vh_1px_#b3ffec,35vw_5vh_1px_#d1fae5,65vw_95vh_1px_#b3ffec]"></div>
          </div>
        </div>

        <div className="flex flex-col min-h-screen text-white font-mono">
          {/* Header Navigation */}
          <header className="sticky top-0 z-50 w-full h-16 flex items-center bg-slate-950/40 backdrop-blur-md border-b border-white/5">
            <div className="max-w-4xl mx-auto px-6 w-full flex items-center justify-between">
              <Link href="/" className="group relative z-50 flex items-baseline antialiased leading-none p-4 -m-4">
                <span className="text-lg font-black tracking-tighter text-white group-hover:text-red-500 transition-colors duration-200">
                  CosmoTmt
                </span>
                <span className="ml-2 text-xs font-bold tracking-[0.1em] text-gray-500 group-hover:text-red-500 transition-colors duration-200 uppercase">
                  Planet
                </span>
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} className="group p-4 -m-4">
                    <span className="text-xs font-bold text-white group-hover:text-red-500 transition-colors tracking-widest uppercase">{link.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-12 h-12 -mr-4 flex flex-col items-center justify-center gap-1 relative z-50 cursor-pointer"
                aria-label="Menu"
              >
                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </button>
            </div>
          </header>

          {/* Mobile Overlay Menu */}
          <div className={`fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-3xl transition-all duration-500 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <nav className="h-full flex flex-col items-center justify-center gap-12">
              {navLinks.map((link, index) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`group flex flex-col items-center transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span className="text-3xl font-black tracking-widest text-white group-hover:text-red-500 transition-colors uppercase">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <main className="flex-1">
            {children}
          </main>

          <GlobalPlayer />

          {/* Scroll To Top Button */}
          <button
            onClick={scrollToTop}
            className={`fixed bottom-28 md:bottom-32 right-6 md:right-10 z-40 w-10 h-10 flex items-center justify-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all duration-500 cursor-pointer group/scroll hover:bg-red-500 hover:border-red-500 ${
              showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white group-hover/scroll:-translate-y-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Footer */}
          <footer className="py-16 border-t border-white/5 bg-slate-950/40 backdrop-blur-md">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                  <a href="https://x.com/cosmotmt" target="_blank" rel="noopener noreferrer" className="group p-2 -m-2">
                    <span className="text-xs font-bold text-white group-hover:text-red-500 transition-colors tracking-widest uppercase">X</span>
                  </a>
                  <a href="https://www.youtube.com/@cosmotmt" target="_blank" rel="noopener noreferrer" className="group p-2 -m-2">
                    <span className="text-xs font-bold text-white group-hover:text-red-500 transition-colors tracking-widest uppercase">YouTube</span>
                  </a>
                  <a href="https://github.com/cosmotmt" target="_blank" rel="noopener noreferrer" className="group p-2 -m-2">
                    <span className="text-xs font-bold text-white group-hover:text-red-500 transition-colors tracking-widest uppercase">GitHub</span>
                  </a>
                </div>
                <p className="text-gray-600 text-[10px] font-medium tracking-[0.2em] uppercase">
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
