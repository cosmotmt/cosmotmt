"use client";

import { useState } from "react";
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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-8 group/player font-mono">
      <div className="max-w-4xl mx-auto relative">
        
        {/* Close Button (Outside Top Right) - Hover controlled on PC */}
        <button
          onClick={stopTrack}
          className="absolute -top-3 -right-3 z-[60] w-8 h-8 flex items-center justify-center bg-slate-900 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all shadow-2xl cursor-pointer group opacity-100 md:opacity-0 md:group-hover/player:opacity-100 scale-100 md:scale-90 md:group-hover/player:scale-100"
          aria-label="Close Player"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Player Window */}
        <div className="relative bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-20 opacity-50"></div>

          <div className="p-4 md:p-6 flex items-center gap-4 md:gap-8 relative z-10">
            
            {/* Left: Thumbnail HUD */}
            <div 
              className="relative w-12 h-12 md:w-16 md:h-16 bg-slate-900 border border-white/10 overflow-hidden shrink-0 cursor-pointer group/thumb"
              onClick={togglePlay}
            >
              {currentTrack.thumbnail_url ? (
                <img src={currentTrack.thumbnail_url} alt={currentTrack.title} className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover/thumb:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-700 text-[8px] font-black uppercase">No Art</div>
              )}
              
              {/* Play/Pause Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover/player:opacity-100">
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover/thumb:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white ml-1 group-hover/thumb:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Center: Info & Gauge */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <h4 className="text-white font-bold truncate text-sm md:text-base tracking-tight uppercase">
                  {currentTrack.title}
                </h4>
                <div className="text-[9px] md:text-[10px] text-gray-500 tracking-tighter whitespace-nowrap">
                  {formatTime(displayTime)} / {formatTime(duration)}
                </div>
              </div>
              
              {/* System Gauge (Seek Bar) */}
              <div className="relative h-1.5 bg-white/5 border border-white/5 overflow-hidden group cursor-pointer">
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
                >
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)' }}></div>
                </div>
              </div>
            </div>

            {/* Right: Volume (Desktop Only) */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center group/volume relative">
                <div className="w-10 h-10 flex items-center justify-center text-gray-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </div>
                <div className="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-300 ease-out flex items-center">
                  <div className="w-24 px-2">
                    <div className="relative w-full h-1 bg-white/10 overflow-hidden">
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
                        className="absolute top-0 left-0 h-full bg-gray-400"
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
    </div>
  );
}
