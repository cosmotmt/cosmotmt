"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface GameWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: {
    id: number;
    title: string;
    description: string;
    thumbnail_url?: string;
    features?: string;
    external_url?: string;
    techs: string[];
    roles: string[];
    platforms: string[];
    development_type?: string;
  } | null;
}

export default function GameWorkModal({ isOpen, onClose, work }: GameWorkModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  const tagClass = "px-3 py-1 bg-white/5 text-white text-[11px] font-bold rounded-lg border border-white/10 tracking-wider";

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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-red-500 text-white rounded-full transition-all z-20 backdrop-blur-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Left: Image & Links */}
          <div className="lg:w-1/2">
            <div className="aspect-video lg:aspect-square bg-slate-800 overflow-hidden">
              {work.thumbnail_url ? (
                <img src={work.thumbnail_url} alt={work.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 font-black tracking-widest uppercase text-xs">No Image</div>
              )}
            </div>
            
            {work.external_url && (
              <div className="p-8 lg:p-10">
                <Link
                  href={work.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-4 bg-white text-slate-950 rounded-full text-sm font-black tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-white/5 hover:shadow-red-500/20"
                >
                  ストアページを見る
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="lg:w-1/2 p-8 lg:p-12 lg:border-l border-white/5">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5">
                  {work.development_type === 'solo' ? '個人開発' : work.development_type === 'team' ? 'チーム開発' : '業務実績'}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-6">{work.title}</h2>
              <p className="text-gray-400 leading-relaxed text-base">{work.description}</p>
            </div>

            <div className="space-y-10">
              {/* Features */}
              {work.features && (
                <div>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">主な実装機能</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{work.features}</p>
                </div>
              )}

              {/* Platforms */}
              {work.platforms.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">プラットフォーム</h3>
                  <div className="flex flex-wrap gap-2">
                    {work.platforms.map(p => (
                      <span key={p} className={tagClass}>{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              {work.techs.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">技術スタック</h3>
                  <div className="flex flex-wrap gap-2">
                    {work.techs.map(tech => (
                      <span key={tech} className={tagClass}>{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Roles */}
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
