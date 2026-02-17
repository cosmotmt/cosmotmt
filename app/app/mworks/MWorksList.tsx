"use client";

import { useAudio } from "../context/AudioContext";

interface MWorksListProps {
  initialWorks: any[];
}

export default function MWorksList({ initialWorks }: MWorksListProps) {
  const { currentTrack, isPlaying, playTrack, duration, formatTime } = useAudio();

  // ゲームの技術スタックと同じスタイル (四角いバッジ)
  const roleTagClass = "px-3 py-1 bg-white/5 text-white text-[11px] font-bold rounded-lg border border-white/10 tracking-wider whitespace-nowrap";
  
  // ゲームの開発形態・期間と同じスタイル (カプセル型バッジ)
  const metaTagClass = "px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 whitespace-nowrap";

  return (
    <div className="space-y-3">
      {initialWorks.map((work) => {
        const isCurrent = currentTrack?.id === work.id;

        return (
          <div
            key={work.id}
            onClick={() => playTrack(work)}
            className={`group flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-2xl transition-all cursor-pointer border ${
              isCurrent 
                ? "bg-white/10 border-white/20 shadow-xl" 
                : "bg-slate-900/40 border-white/5 hover:bg-white/5 hover:border-white/10"
            }`}
          >
            {/* Jacket Image */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 shadow-lg">
              {work.thumbnail_url ? (
                <img src={work.thumbnail_url} alt={work.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 text-[8px] font-black uppercase">No Cover</div>
              )}
              
              {/* Play Overlay */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                isCurrent && isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}>
                {isCurrent && isPlaying ? (
                  <div className="flex gap-1 items-end h-4">
                    <div className="w-1 bg-red-500 animate-bounce" style={{ animationDuration: '0.5s' }}></div>
                    <div className="w-1 bg-red-500 animate-bounce" style={{ animationDuration: '0.8s' }}></div>
                    <div className="w-1 bg-red-500 animate-bounce" style={{ animationDuration: '0.6s' }}></div>
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h3 className={`text-lg font-bold truncate transition-colors ${isCurrent ? "text-red-500" : "text-white"}`}>
                  {work.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {/* ジャンル */}
                  {work.genres.map((g: string) => (
                    <span key={g} className={metaTagClass}>
                      {g}
                    </span>
                  ))}
                  {/* 制作期間 */}
                  {work.duration && (
                    <span className={metaTagClass}>
                      {work.duration}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                <p className="text-slate-400 text-sm line-clamp-1 flex-1">{work.description}</p>
                <div className="flex flex-wrap gap-2">
                  {work.roles.map((r: string) => (
                    <span key={r} className={roleTagClass}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="text-slate-500 text-xs font-mono w-12 text-right">
              {isCurrent ? formatTime(duration) : "--:--"}
            </div>
          </div>
        );
      })}

      {initialWorks.length === 0 && (
        <div className="py-32 text-center text-gray-500">
          作品はまだ登録されていません。
        </div>
      )}
    </div>
  );
}
