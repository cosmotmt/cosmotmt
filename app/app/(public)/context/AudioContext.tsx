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

  // クリーンアップ関数
  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener("ended", handleEnded);
      audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.removeEventListener("seeked", handleSeeked);
      audioRef.current.removeEventListener("loadedmetadata", updateDuration);
      audioRef.current.removeEventListener("durationchange", updateDuration);
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
      audioRef.current = null;
    }
  };

  const handleEnded = () => setIsPlaying(false);
  const handleTimeUpdate = () => {
    if (audioRef.current && !isSeekingRef.current) {
      // わずかな差分であれば更新をスキップして、ステート更新による再レンダリングを抑制する
      const newTime = audioRef.current.currentTime;
      if (Math.abs(currentTime - newTime) > 0.1) {
        setCurrentTime(newTime);
      }
    }
  };
  const handleSeeked = () => {
    isSeekingRef.current = false;
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  const updateDuration = () => {
    if (audioRef.current && audioRef.current.duration && audioRef.current.duration !== Infinity && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const playTrack = (track: Track) => {
    if (!track.audio_url) return;

    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    // 以前の再生を停止・削除
    cleanupAudio();

    // 新しいAudioインスタンス
    const audio = new Audio();
    audio.src = track.audio_url;
    audio.volume = volume;
    audio.preload = "metadata";
    
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("seeked", handleSeeked);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);

    audioRef.current = audio;
    setCurrentTrack(track);
    setDuration(0);
    setCurrentTime(0);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch(error => {
        if (error.name !== "AbortError") console.error("Playback failed:", error);
      });
    }
  };

  const pauseTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (!audioRef.current?.src) return;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const togglePlay = () => {
    if (isPlaying) pauseTrack();
    else resumeTrack();
  };

  const stopTrack = () => {
    cleanupAudio();
    setCurrentTrack(null);
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
  };

  const seek = (time: number) => {
    if (!audioRef.current?.src) return;
    try {
      isSeekingRef.current = true;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    } catch (e) {
      console.error("Seek failed:", e);
      isSeekingRef.current = false;
    }
  };

  const setIsSeeking = (seeking: boolean) => {
    isSeekingRef.current = seeking;
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  useEffect(() => {
    return () => cleanupAudio();
  }, []);

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
