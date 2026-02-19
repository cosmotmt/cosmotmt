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
  const { currentTrack, isPlaying, playTrack } = useAudio();
  const [selectedWork, setSelectedWork] = useState<MWork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayClick = (e: React.MouseEvent, work: MWork) => {
    e.stopPropagation();
    if (work.audio_url) {
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
      <div className="flex flex-col border-t border-white/5">
        {initialWorks.map((work) => {
          const isCurrent = currentTrack?.id === work.id;
          const hasAudio = !!work.audio_url;

          return (
            <div
              key={work.id}
              onClick={() => handleWorkClick(work)}
              className={`group flex items-center gap-4 md:gap-6 py-3 px-4 border-b border-white/5 transition-all cursor-pointer hover:bg-white/[0.03] ${
                isCurrent ? "bg-white/[0.05]" : ""
              }`}
            >
              {/* Thumbnail with Hover Play Icon */}
              <div className="relative w-12 h-12 md:w-14 md:h-14 bg-slate-900 border border-white/10 overflow-hidden shrink-0">
                {work.thumbnail_url ? (
                  <img 
                    src={work.thumbnail_url} 
                    alt={work.title} 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      isCurrent && isPlaying ? 'opacity-40 scale-105' : 'opacity-40 md:opacity-100 md:group-hover:opacity-40 group-hover:scale-105'
                    }`} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-600 font-black uppercase">No Art</div>
                )}

                {/* Play Icon Overlay (Pause Icon when Playing) */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                  hasAudio ? 'cursor-pointer' : 'opacity-20 cursor-default'
                } ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'}`}>
                  <button
                    onClick={(e) => handlePlayClick(e, work)}
                    className="w-full h-full flex items-center justify-center text-white hover:text-red-500 transition-colors"
                  >
                    {isCurrent && isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : hasAudio ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : null}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 font-mono">
                <h3 className={`text-sm md:text-base font-bold truncate transition-colors ${isCurrent ? "text-red-500" : "text-white group-hover:text-red-500"}`}>
                  {work.title}
                </h3>
              </div>

              {/* Genres (Desktop Only) */}
              <div className="hidden md:flex items-center gap-2 overflow-hidden">
                {work.genres.map(g => (
                  <span key={g} className="text-[9px] font-black px-1.5 py-0.5 border border-white/10 text-gray-500 uppercase whitespace-nowrap">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {initialWorks.length === 0 && (
        <div className="py-32 text-center text-gray-500 font-mono text-sm">
          作品はまだ登録されていません。
        </div>
      )}

      <MusicWorkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        work={selectedWork}
      />
    </>
  );
}
