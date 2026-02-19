"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Log {
  date: string;
  title: string;
  type: string;
  href: string | null;
}

export default function TerminalWindow({ logs }: { logs: Log[] }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [displayTarget, setDisplayTarget] = useState(3);

  // 1行ずつ表示させるエフェクト
  useEffect(() => {
    if (visibleCount < displayTarget && visibleCount < logs.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, displayTarget, logs.length]);

  const hasMore = visibleCount < logs.length;

  const handleMore = () => {
    if (hasMore) {
      setDisplayTarget(prev => Math.min(prev + 3, logs.length));
    }
  };

  const stripeStyle = {
    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
  };

  return (
    <div className="relative bg-slate-950/70 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-20"></div>
      
      {/* Terminal Header */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-end">
        <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">TIMELINE</span>
      </div>

      {/* Terminal Content */}
      <div className="p-4 md:p-10 space-y-4 relative z-10">
        {logs.slice(0, visibleCount).map((log, index) => {
          const isInteractive = !!log.href;

          return (
            <div key={index} className="animate-fade-in-up">
              {log.href ? (
                <Link href={log.href} className="group flex items-center gap-3 md:gap-4 min-h-[1.5rem] md:min-h-[2rem] transition-all">
                  {/* Prompt */}
                  <div className="shrink-0 w-4 flex items-center justify-center">
                    <span className="font-black text-sm text-gray-500 group-hover:text-red-500 transition-colors duration-300">
                      {'>'}
                    </span>
                  </div>

                  {/* Log Line */}
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0 flex-1 min-w-0 h-full">
                    <div className="flex items-center shrink-0">
                      <span className="text-[10px] md:text-[11px] font-bold transition-colors duration-300 tracking-tighter w-16 md:w-20 text-gray-500 group-hover:text-red-500">
                        [{log.date}]
                      </span>
                      <div className="w-16 md:w-20 flex items-center">
                        <span className={`text-[8px] md:text-[9px] font-black px-1 md:px-1.5 py-0.5 transition-colors leading-none border ${
                          log.type === 'ゲーム' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5 group-hover:border-red-500/50 group-hover:text-red-500' :
                          log.type === '音楽' ? 'border-sky-500/30 text-sky-500 bg-sky-500/5 group-hover:border-red-500/50 group-hover:text-red-500' :
                          'border-white/10 text-gray-300 bg-white/10'
                        }`}>
                          {log.type}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xs md:text-base font-bold transition-colors flex-1 leading-none text-white group-hover:text-red-500">
                      {log.title}
                    </h3>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3 md:gap-4 min-h-[1.5rem] md:min-h-[2rem]">
                  <div className="shrink-0 w-4 flex items-center justify-center">
                    <span className="font-black text-sm text-gray-500">#</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0 flex-1 min-w-0 h-full">
                    <div className="flex items-center shrink-0">
                      <span className="text-[10px] md:text-[11px] font-bold tracking-tighter w-16 md:w-20 text-gray-500">
                        [{log.date}]
                      </span>
                      <div className="w-16 md:w-20 flex items-center">
                        <span className="text-[8px] md:text-[9px] font-black px-1 md:px-1.5 py-0.5 border border-white/10 text-gray-300 bg-white/10 leading-none">
                          {log.type}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xs md:text-base font-bold flex-1 leading-none text-gray-400">
                      {log.title}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom Prompt & Hint */}
        <div className="flex items-center gap-3 md:gap-4 min-h-[1.5rem] md:min-h-[2rem] pt-2">
          {hasMore ? (
            <div 
              onClick={handleMore}
              className="flex items-center gap-3 md:gap-4 cursor-pointer group/more w-full"
            >
              <div className="shrink-0 w-4 flex justify-center">
                <span className="text-gray-500 font-black group-hover/more:text-red-500 transition-colors duration-200">{'>'}</span>
              </div>
              <div className="flex items-stretch h-5">
                <span 
                  style={stripeStyle}
                  className="text-[9px] md:text-[10px] text-slate-950 font-black bg-white px-1 flex items-center group-hover/more:bg-red-500 group-hover/more:text-white group-hover/more:animate-none transition-all duration-200 -ml-1 animate-pulse"
                >
                  [MORE]
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 md:gap-4 w-full">
              <div className="shrink-0 w-4 flex justify-center">
                <span className="text-gray-500 font-black">{'>'}</span>
              </div>
              <div className="flex items-stretch h-5">
                <span 
                  style={stripeStyle}
                  className="text-[9px] md:text-[10px] text-slate-950 font-black bg-emerald-500 px-1 flex items-center -ml-1 animate-pulse"
                >
                  [END]
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
