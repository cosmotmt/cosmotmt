"use client";

import { useState, useEffect } from "react";
import { useAudio } from "../context/AudioContext";

export default function GlobalPlayer() {
  const { 
    currentTrack, isPlaying, duration, currentTime, volume,
    togglePlay, stopTrack, seek, setIsSeeking, setVolume, formatTime 
  } = useAudio();

  const [dragTime, setDragTime] = useState<number | null>(null);

  if (!currentTrack) return null;

  const handleMouseDown = () => {
    setIsSeeking(true);
    setDragTime(currentTime);
  };

  const handleMouseUp = () => {
    if (dragTime !== null) {
      seek(dragTime);
    }
    setIsSeeking(false);
    setDragTime(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDragTime(Number(e.target.value));
  };

  const displayTime = dragTime !== null ? dragTime : currentTime;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 group/player">
      <div className="max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-4 md:px-8 md:py-5 animate-fade-in-up relative">
        
        {/* Close Button - Always visible on mobile */}
        <button
          onClick={stopTrack}
          className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-500 text-white rounded-full transition-all z-30 shadow-lg border border-white/10 opacity-100 md:opacity-0 md:group-hover/player:opacity-100 scale-100 md:scale-90 md:group-hover/player:scale-100 cursor-pointer"
          aria-label="Close Player"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-4 md:gap-10">
          
          {/* Left: Thumbnail (Play/Pause Switch) - Always visible icon on mobile */}
          <div 
            className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 shadow-xl border border-white/5 cursor-pointer group/thumb"
            onClick={togglePlay}
          >
            {currentTrack.thumbnail_url ? (
              <img src={currentTrack.thumbnail_url} alt={currentTrack.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px] font-black uppercase">No Cover</div>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover/player:opacity-100">
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </div>

          {/* Center: Title & Seek Bar */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 md:gap-2">
            <h4 className="text-white font-black truncate text-sm md:text-lg tracking-tight leading-tight">
              {currentTrack.title}
            </h4>
            
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex-1 relative h-1.5 bg-white/10 rounded-full overflow-hidden group cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={displayTime}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchEnd={handleMouseUp}
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div 
                  className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-100"
                  style={{ width: `${duration > 0 ? (displayTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="text-[9px] md:text-[10px] font-mono text-slate-500 tracking-tighter whitespace-nowrap">
                {formatTime(displayTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* Right: Volume - Hidden on mobile */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center group/volume relative">
              <div className="w-10 h-10 flex items-center justify-center text-slate-500 group-hover/volume:text-white transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              <div className="w-0 group-hover/volume:w-32 overflow-hidden transition-all duration-300 ease-out flex items-center">
                <div className="w-32 px-3">
                  <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div 
                      className="absolute top-0 left-0 h-full bg-slate-400"
                      style={{ width: `${volume * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
