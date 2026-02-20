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
  isSeeking: boolean; // 追加
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
  const [isSeekingState, setIsSeekingState] = useState(false); // 追加
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSeekingRef = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous"; // CORSを有効化
    audio.volume = volume;
    audio.preload = "metadata"; // メタデータを事前に読み込む
    audioRef.current = audio;
    
    const handleEnded = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      // シーク中（Ref）は currentTime ステートを更新しない
      if (!isSeekingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleSeeked = () => {
      // ブラウザ側のシークが完了したらフラグを下ろす
      isSeekingRef.current = false;
      setIsSeekingState(false);
      setCurrentTime(audio.currentTime);
    };
    const updateDuration = () => {
      if (audio.duration && audio.duration !== Infinity && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("seeked", handleSeeked);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("seeked", handleSeeked);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
    };
  }, []);

  const playTrack = (track: Track) => {
    const audio = audioRef.current;
    if (!audio || !track.audio_url) return;

    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    audio.pause();
    // 確実にリセット
    isSeekingRef.current = false;
    setIsSeekingState(false);
    
    audio.src = track.audio_url;
    audio.load();
    
    setCurrentTrack(track);
    setDuration(0);
    setCurrentTime(0);

    audio.play().then(() => setIsPlaying(true)).catch(console.error);
  };

  const pauseTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(console.error);
  };

  const togglePlay = () => {
    if (isPlaying) pauseTrack();
    else resumeTrack();
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setIsSeekingState(false);
    isSeekingRef.current = false;
    setDuration(0);
    setCurrentTime(0);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    // シーク開始
    isSeekingRef.current = true;
    setIsSeekingState(true);
    
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setIsSeeking = (seeking: boolean) => {
    isSeekingRef.current = seeking;
    setIsSeekingState(seeking);
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || time === Infinity) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <AudioContext.Provider value={{ 
      currentTrack, isPlaying, isSeeking: isSeekingState, duration, currentTime, volume,
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
