"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface Track {
  id: number;
  title: string;
  audio_url: string;
  thumbnail_url?: string;
  description?: string;
}

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  stopTrack: () => void;
  seek: (time: number) => void;
  setIsSeeking: (seeking: boolean) => void;
  setVolume: (volume: number) => void;
  formatTime: (time: number) => string;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSeekingRef = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.volume = volume;
    audioRef.current = audio;
    
    const handleEnded = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const updateDuration = () => {
      if (audio.duration && audio.duration !== Infinity && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("canplaythrough", updateDuration);

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("canplaythrough", updateDuration);
    };
  }, []);

  const playTrack = (track: Track) => {
    if (!audioRef.current || !track.audio_url) return;

    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      // 1. 確実に停止
      audioRef.current.pause();
      setIsPlaying(false);
      
      // 2. 状態リセット
      setDuration(0);
      setCurrentTime(0);
      
      // 3. ソースの切り替え
      audioRef.current.src = track.audio_url;
      audioRef.current.load(); // WAVなどのために明示的にロード
      
      // 4. 再生
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setCurrentTrack(track);
          setIsPlaying(true);
        }).catch(error => {
          if (error.name !== "AbortError") {
            console.error("Playback failed:", error);
          }
        });
      }
    }
  };

  const pauseTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (!audioRef.current || !audioRef.current.src) return;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const togglePlay = () => {
    if (isPlaying) pauseTrack();
    else resumeTrack();
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src"); // 空文字ではなく属性削除
      audioRef.current.load(); // 状態をクリア
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
  };

  const seek = (time: number) => {
    if (audioRef.current && audioRef.current.readyState >= 1) {
      try {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      } catch (e) {
        // Ignore
      }
    }
  };

  const setIsSeeking = (seeking: boolean) => {
    isSeekingRef.current = seeking;
  };

  const setVolume = (v: number) => {
    if (audioRef.current) {
      audioRef.current.volume = v;
      setVolumeState(v);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || time === Infinity) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <AudioContext.Provider value={{ 
      currentTrack, isPlaying, duration, currentTime, volume,
      playTrack, pauseTrack, resumeTrack, togglePlay, stopTrack, seek, setIsSeeking, setVolume, formatTime 
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) throw new Error("useAudio must be used within an AudioProvider");
  return context;
}
