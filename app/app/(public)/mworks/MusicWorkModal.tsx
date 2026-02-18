"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAudio } from "../context/AudioContext";

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

interface MusicWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: MWork | null;
}

export default function MusicWorkModal({ isOpen, onClose, work }: MusicWorkModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { currentTrack, isPlaying, playTrack } = useAudio();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !work) return null;

  const isCurrent = currentTrack?.id === work.id;
  const tagClass = "px-3 py-1 bg-white/5 text-white text-[11px] font-bold rounded-lg border border-white/10 tracking-wider";

  const handlePlayClick = () => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/10 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-red-500 text-white rounded-full transition-all z-20 backdrop-blur-md cursor-pointer"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left: Thumbnail & Player Area */}
          <div className="md:w-2/5 p-8 md:p-12 flex flex-col items-center justify-center bg-slate-950/30 border-b md:border-b-0 md:border-r border-white/5">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl mb-8 group">
              {work.thumbnail_url ? (
                <img src={work.thumbnail_url} alt={work.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600 text-xs font-black uppercase">No Cover</div>
              )}
              
              {work.audio_url && (
                <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                  isCurrent && isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                  <button
                    onClick={handlePlayClick}
                    className="w-20 h-20 flex items-center justify-center bg-white text-slate-950 rounded-full hover:scale-110 transition-transform cursor-pointer shadow-2xl"
                  >
                    {isCurrent && isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>
            
            {work.external_url && (
              <Link
                href={work.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-4 bg-white text-slate-950 rounded-full text-sm font-black tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-white/5 hover:shadow-red-500/20"
              >
                外部リンク
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            )}
          </div>

          {/* Right: Details Area */}
          <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="mb-10">
              <div className="flex items-center gap-1.5 mb-6">
                <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5">
                  {work.development_type === 'solo' ? '個人制作' : work.development_type === 'team' ? 'チーム制作' : '業務実績'}
                </span>
                {work.duration && (
                  <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5">
                    {work.duration}
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-6">{work.title}</h2>
              <p className="text-gray-400 leading-relaxed text-base">{work.description || "説明はありません。"}</p>
            </div>

            <div className="space-y-10">
              {work.genres.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">ジャンル</h3>
                  <div className="flex flex-wrap gap-2">
                    {work.genres.map(g => (
                      <span key={g} className={tagClass}>{g}</span>
                    ))}
                  </div>
                </div>
              )}

              {work.roles.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">担当役割</h3>
                  <div className="flex flex-wrap gap-2">
                    {work.roles.map(role => (
                      <span key={role} className={tagClass}>{role}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
