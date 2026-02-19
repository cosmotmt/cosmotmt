"use client";

import { useEffect, useRef, useState } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currentTrack, isPlaying, playTrack } = useAudio();
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const isCurrent = currentTrack?.id === work?.id;

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (work?.audio_url) {
      playTrack({
        id: work.id,
        title: work.title,
        audio_url: work.audio_url,
        thumbnail_url: work.thumbnail_url,
        description: work.description
      });
    }
  };

  // Check if content is scrollable
  const checkScrollable = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isScrollable = scrollHeight > clientHeight;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
      setShowScrollHint(isScrollable && !isAtBottom);
    }
  };

  // Check scrollability when modal opens or content changes
  useEffect(() => {
    if (isOpen && work && !isClosing) {
      // Small delay to ensure DOM is rendered
      const timer = setTimeout(checkScrollable, 100);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setShowScrollHint(false);
    }
  }, [isOpen, work, isClosing]);

  // Re-check on window resize
  useEffect(() => {
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
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
  }, [isOpen]);

  if (!isOpen || !work) return null;

  const stripeStyle = {
    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)'
  };

  const TerminalLine = ({ label, content, isLong = false }: { label: string, content: React.ReactNode, isLong?: boolean }) => (
    <div className="flex items-start gap-3 md:gap-4 min-h-[1.5rem]">
      <div className="shrink-0 w-4 flex items-center justify-center h-5 md:h-6">
        <span className="font-black text-sm text-gray-600">{'>'}</span>
      </div>
      <div className={`flex flex-row items-start gap-2 md:gap-0 flex-1 min-w-0`}>
        <div className="flex items-center shrink-0 h-5 md:h-6">
          <div className="w-14 md:w-20 flex items-center">
            <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">
              {label}
            </span>
          </div>
        </div>
        <div className={`text-xs md:text-base text-gray-300 flex-1 py-0.5 md:py-0 leading-relaxed`}>
          {content}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm antialiased transition-all duration-300 ${isClosing ? 'opacity-0 bg-transparent' : 'opacity-100 bg-white/[0.02]'}`}
      onClick={handleClose}
    >
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className={`relative w-full max-w-4xl transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-[60] w-8 h-8 flex items-center justify-center bg-slate-900 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all shadow-2xl cursor-pointer group"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Shell */}
        <div
          ref={modalRef}
          className="relative w-full max-h-[85vh] overflow-hidden bg-slate-950/70 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl font-mono flex flex-col animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white/5 border-b border-white/10 px-4 py-2 h-10 flex items-center justify-between relative z-30">
            <div className="flex items-center gap-4 md:gap-6 text-[9px] md:text-[10px] font-bold text-gray-500 tracking-widest uppercase truncate">
              <span>{work.development_type === 'solo' ? '個人制作' : work.development_type === 'team' ? 'チーム制作' : '業務実績'}</span>
              <span>{work.duration || "---"}</span>
            </div>
          </div>

          {/* Terminal Content */}
          <div 
            ref={scrollRef}
            onScroll={checkScrollable}
            className="flex-1 overflow-y-auto relative z-10 p-5 md:p-10 space-y-6 md:space-y-8 no-scrollbar"
          >
            {/* Player Section */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              {/* Cover Art */}
              <div className="relative w-full md:w-64 aspect-square bg-slate-950 border border-white/10 overflow-hidden group/cover shrink-0 shadow-2xl">
                {work.thumbnail_url ? (
                  <img src={work.thumbnail_url} alt={work.title} className="w-full h-full object-cover opacity-90" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700 font-black tracking-widest uppercase text-xs">No Cover</div>
                )}
                
                {/* Play Overlay */}
                {work.audio_url && (
                  <div 
                    onClick={handlePlayClick}
                    className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity cursor-pointer ${
                      isCurrent && isPlaying ? "opacity-100" : "opacity-0 group-hover/cover:opacity-100"
                    }`}
                  >
                    <div className="w-16 h-16 flex items-center justify-center bg-white text-slate-950 rounded-full shadow-2xl transform transition-all hover:scale-110 group-hover/cover:bg-red-500 group-hover/cover:text-white">
                      {isCurrent && isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Track Info & Controls */}
              <div className="flex-1 space-y-4 md:space-y-6 w-full text-left">
                <h2 className="text-xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                  {work.title}
                </h2>

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  {work.genres.map(g => (
                    <span key={g} className="px-2 py-0.5 border border-white/10 text-gray-400 bg-white/5 text-[9px] md:text-[10px] font-bold tracking-wider uppercase">
                      {g}
                    </span>
                  ))}
                  {work.external_url && (
                    <div className="relative inline-block group">
                      <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 translate-x-0 translate-y-0 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-200"></div>
                      <Link
                        href={work.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-flex items-center justify-center px-3 md:px-4 py-1 bg-white text-slate-950 transition-all duration-200 hover:bg-red-500 hover:text-white overflow-hidden border border-transparent hover:-translate-x-0.5 hover:-translate-y-0.5"
                      >
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={stripeStyle}></div>
                        <span className="relative z-10 text-[9px] font-black tracking-widest uppercase whitespace-nowrap">外部リンク</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full" />
            
            {/* Detailed Logs */}
            <div className="space-y-4 md:space-y-5">
              <TerminalLine label="概要" content={work.description || "説明はありません。"} isLong={true} />
              {work.roles.length > 0 && (
                <TerminalLine label="担当" content={work.roles.join(", ")} />
              )}
              {work.features && (
                <TerminalLine label="機能" content={work.features} isLong={true} />
              )}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className={`absolute bottom-4 right-6 z-30 pointer-events-none transition-opacity duration-500 ${showScrollHint ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 tracking-[0.2em] uppercase animate-pulse">
              <span className="text-white">Scroll</span>
              <span className="text-gray-500">▼</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
