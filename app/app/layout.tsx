import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CosmoTmt Planet | Game & Music",
  description: "The creative planet of CosmoTmt. Game Developer & Music Creator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        {/* Cosmic Background Decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-red-50/50 blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-gray-100/60 blur-[100px]"></div>
        </div>

        <div className="flex flex-col min-h-screen">
          {/* Header Navigation */}
          <header className="sticky top-0 z-40 w-full h-24 flex items-center bg-gradient-to-b from-slate-900/10 via-slate-900/5 to-transparent backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="text-2xl font-black tracking-[0.05em] group flex items-center drop-shadow-md h-full">
                <span className="group-hover:text-red-500 transition-colors duration-300 text-white">C</span>
                <span className="text-red-500">o</span>
                <span className="group-hover:text-red-500 transition-colors duration-300 text-white">sm</span>
                <span className="text-red-500">o</span>
                <span className="group-hover:text-red-500 transition-colors duration-300 text-white">Tmt</span>
                <span className="ml-4 group-hover:text-red-500 transition-colors duration-300 text-white tracking-[0.1em]">Planet</span>
              </Link>
              
              {/* Navigation */}
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

              {/* Mobile Menu Icon */}
              <button className="md:hidden w-10 h-10 flex items-center justify-center">
                <div className="w-6 h-0.5 bg-white relative before:content-[''] before:absolute before:w-6 before:h-0.5 before:bg-white before:-top-2 after:content-[''] after:absolute after:w-6 after:h-0.5 after:bg-white after:top-2"></div>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Global Audio Player Placeholder */}
          <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Player will be here */}
          </div>

          {/* Footer */}
          <footer className="py-24 bg-gradient-to-t from-slate-900/10 via-slate-900/5 to-transparent backdrop-blur-md border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-xl font-black tracking-[0.05em] flex items-center drop-shadow-md text-white group">
                <span>C</span>
                <span className="text-red-500">o</span>
                <span>sm</span>
                <span className="text-red-500">o</span>
                <span>Tmt</span>
                <span className="ml-4 tracking-[0.1em]">Planet</span>
              </div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] drop-shadow-sm">
                &copy; {new Date().getFullYear()} CosmoTmt. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
