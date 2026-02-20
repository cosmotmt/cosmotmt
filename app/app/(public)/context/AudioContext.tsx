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
  isSeeking: boolean;
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
  const [isSeekingState, setIsSeekingState] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSeekingRef = useRef(false);

  // 全てのイベントリスナーを一括管理するためのRef
  const listenersRef = useRef<Record<string, any>>({});

  const cleanupAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      // 全ての登録済みリスナーを削除
      Object.entries(listenersRef.current).forEach(([name, listener]) => {
        audio.removeEventListener(name, listener);
      });
      listenersRef.current = {};
      audio.src = "";
      audio.load();
      audioRef.current = null;
    }
  };

  const playTrack = (track: Track) => {
    if (!track.audio_url) return;

    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    // 1. 完全に初期化 (新しいAudioオブジェクトを作成)
    cleanupAudio();

    const audio = new Audio();
    // 同一ドメイン内なので crossOrigin は不要 (トラブル回避)
    audio.volume = volume;
    audio.preload = "auto";
    audioRef.current = audio;

    // 2. イベントハンドラ定義
    const handlers = {
      ended: () => setIsPlaying(false),
      timeupdate: () => {
        if (!isSeekingRef.current && audioRef.current === audio) {
          setCurrentTime(audio.currentTime);
        }
      },
      seeking: () => {
        console.log(`[Audio] Seeking to ${audio.currentTime}`);
      },
      seeked: () => {
        if (audioRef.current === audio) {
          isSeekingRef.current = false;
          setIsSeekingState(false);
          setCurrentTime(audio.currentTime);
        }
      },
      loadedmetadata: () => {
        if (audioRef.current === audio) setDuration(audio.duration);
      },
      durationchange: () => {
        if (audioRef.current === audio && audio.duration !== Infinity) {
          setDuration(audio.duration);
        }
      },
      error: () => {
        console.error("[Audio] Error occurred", audio.error);
      }
    };

    // 3. リスナー登録
    Object.entries(handlers).forEach(([name, handler]) => {
      audio.addEventListener(name, handler);
      listenersRef.current[name] = handler;
    });

    // 4. ソース設定と再生
    audio.src = track.audio_url;
    setCurrentTrack(track);
    setDuration(0);
    setCurrentTime(0);
    setIsSeekingState(false);
    isSeekingRef.current = false;

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      if (err.name !== "AbortError") console.error("[Audio] Playback failed", err);
    });
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
    cleanupAudio();
    setCurrentTrack(null);
    setIsPlaying(false);
    setIsSeekingState(false);
    isSeekingRef.current = false;
    setDuration(0);
    setCurrentTime(0);
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (!audio || isNaN(time)) return;
    
    isSeekingRef.current = true;
    setIsSeekingState(true);
    
    try {
      // readyState 1以上(HAVE_METADATA)ならシーク可能
      audio.currentTime = time;
      setCurrentTime(time);
    } catch (e) {
      console.error("[Audio] Seek error", e);
      isSeekingRef.current = false;
      setIsSeekingState(false);
    }
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

  useEffect(() => {
    return () => cleanupAudio();
  }, []);

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
