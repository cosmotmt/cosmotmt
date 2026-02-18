"use client";

import React, { useState } from "react";
import { useAudio } from "../context/AudioContext";
import MusicWorkModal from "./MusicWorkModal";

interface MWork {
  id: number;
  title: string;
  description: string;
  audio_url?: string;
  thumbnail_url?: string;
  external_url?: string;
  duration?: string;
  genres: string[];
  roles: string[];
  development_type?: string;
}

interface MWorksListProps {
  initialWorks: MWork[];
}

export default function MWorksList({ initialWorks }: MWorksListProps) {
  const { currentTrack, isPlaying, playTrack, duration, formatTime } = useAudio();
  const [selectedWork, setSelectedWork] = useState<MWork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const metaTagClass = "px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 whitespace-nowrap";

  const handlePlayClick = (e: React.MouseEvent, work: MWork) => {
    e.stopPropagation();
    if (work.audio_url) {
      // AudioContext の Track 型に合わせるためにキャスト
      playTrack({
        id: work.id,
        title: work.title,
        audio_url: work.audio_url,
        thumbnail_url: work.thumbnail_url,
        description: work.description
      });
    }
  };

  const handleWorkClick = (work: MWork) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-3">
        {initialWorks.map((work) => {
          const isCurrent = currentTrack?.id === work.id;
          const hasAudio = !!work.audio_url;

          return (
            <div
              key={work.id}
              onClick={() => handleWorkClick(work)}
              className={`group flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-2xl transition-all cursor-pointer border ${
                isCurrent 
                  ? "bg-white/10 border-white/20 shadow-xl" 
                  : "bg-slate-900/40 border-white/5 hover:bg-white/5 hover:border-white/10"
              }`}
            >
              {/* Thumbnail / Play Button Area */}
              <div 
                onClick={(e) => handlePlayClick(e, work)}
                className="relative w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0 shadow-lg group/thumb"
              >
                {work.thumbnail_url ? (
                  <img src={work.thumbnail_url} alt={work.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-[8px] font-black uppercase">No Cover</div>
                )}
                
                {/* Overlay Icons */}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                  !hasAudio || isCurrent ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover/thumb:opacity-100"
                }`}>
                  {hasAudio ? (
                    isCurrent && isPlaying ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="flex gap-1 items-end h-4 opacity-0 md:opacity-100 md:group-hover/thumb:opacity-0 transition-opacity">
                          <div className="w-1 bg-red-500 animate-bounce" style={{ animationDuration: '0.5s' }}></div>
                          <div className="w-1 bg-red-500 animate-bounce" style={{ animationDuration: '0.8s' }}></div>
                          <div className="w-1 bg-red-500 animate-bounce" style={{ animationDuration: '0.6s' }}></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-8 w-8 text-white opacity-100 md:opacity-0 md:group-hover/thumb:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      </div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )
                  ) : (
                    /* No Audio Icon (斜線付き) - 常時表示 */
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-0.5 bg-white/40 rotate-45"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-2">
                  <h3 className={`text-base md:text-lg font-bold truncate transition-colors ${isCurrent ? "text-red-500" : "text-white"}`}>
                    {work.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <span className={metaTagClass}>
                      {work.development_type === 'solo' ? '個人制作' : work.development_type === 'team' ? 'チーム制作' : '業務実績'}
                    </span>
                    {work.genres.map((g: string) => (
                      <span key={g} className={metaTagClass}>{g}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time (Audio Duration) */}
              <div className="hidden md:block text-slate-500 text-xs font-mono w-12 text-right">
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

      <MusicWorkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        work={selectedWork}
      />
    </>
  );
}
