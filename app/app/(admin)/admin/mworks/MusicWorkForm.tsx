"use client";

import { useActionState, useState, useRef } from "react";
import Link from "next/link";
import TagInput from "../_components/TagInput";

interface MusicWorkFormProps {
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: {
    title?: string;
    description?: string;
    audio_url?: string;
    thumbnail_url?: string;
    external_url?: string;
    start_date?: string;
    end_date?: string;
  };
  roleString?: string;
  genreString?: string;
  existingRoles?: string[];
  existingGenres?: string[];
  title: string;
}

export default function MusicWorkForm({ 
  action, 
  initialData, 
  roleString = "", 
  genreString = "", 
  existingRoles = [], 
  existingGenres = [],
  title 
}: MusicWorkFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || "");
  const [audioUrl, setAudioUrl] = useState(initialData?.audio_url || "");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const inputClasses = "w-full rounded-lg border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 border p-2.5 bg-white transition-all shadow-sm";

  const handleFileUpload = async (file: File, type: "image" | "audio") => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { url?: string; fileName?: string; error?: string };
      
      if (data.url) {
        if (type === "image") setThumbnailUrl(data.url);
        else setAudioUrl(data.url);
        if (data.fileName) setUploadedFiles(prev => [...prev, data.fileName!]);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async (type: "image" | "audio") => {
    const url = type === "image" ? thumbnailUrl : audioUrl;
    const fileName = url.split("/").pop();

    if (fileName && uploadedFiles.includes(fileName)) {
      try {
        await fetch(`/api/storage/${fileName}`, { method: "DELETE" });
        setUploadedFiles(prev => prev.filter(f => f !== fileName));
      } catch (err) {
        console.error(err);
      }
    }
    
    if (type === "image") setThumbnailUrl("");
    else setAudioUrl("");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
          {title}
        </h1>
        <Link href="/admin/mworks" className="text-sm text-gray-500 hover:text-sky-600 transition">キャンセル</Link>
      </div>

      <form action={formAction} className="space-y-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {state?.error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 font-medium">{state.error}</div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">作品タイトル *</label>
            <input type="text" name="title" defaultValue={initialData?.title} required className={inputClasses} placeholder="曲名を入力" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">説明</label>
            <textarea name="description" defaultValue={initialData?.description} rows={2} className={inputClasses} placeholder="楽曲の解説" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TagInput name="genres" label="ジャンル" initialValue={genreString} suggestions={existingGenres} />
            <TagInput name="roles" label="担当役割" initialValue={roleString} suggestions={existingRoles} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">開始日</label>
              <input type="date" name="start_date" defaultValue={initialData?.start_date} className={inputClasses} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">終了日</label>
              <input type="date" name="end_date" defaultValue={initialData?.end_date} className={inputClasses} />
            </div>
          </div>

          {/* サムネイル (Game実績と完全一致) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">ジャケット画像</label>
            <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />
            <input type="file" ref={thumbInputRef} onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "image")} accept="image/*" className="hidden" />
            
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {thumbnailUrl ? (
                <div className="relative group w-full md:w-64 aspect-square rounded-xl border-2 border-dashed border-sky-100 bg-sky-50/30 overflow-hidden shadow-inner">
                  <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveFile("image")}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all transform scale-90 group-hover:scale-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => thumbInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full md:w-64 aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-sky-50 hover:border-sky-200 transition-all flex flex-col items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 group-hover:text-sky-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-sky-500 uppercase tracking-widest">Upload Cover</span>
                </button>
              )}

              {thumbnailUrl && (
                <button
                  type="button"
                  onClick={() => thumbInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-50 hover:border-sky-400 transition-all shadow-sm disabled:opacity-50"
                >
                  画像を差し替える
                </button>
              )}
            </div>
          </div>

          {/* 音源ファイル */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">音源ファイル</label>
            <input type="hidden" name="audio_url" value={audioUrl} />
            <input type="file" ref={audioInputRef} onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "audio")} accept="audio/*" className="hidden" />
            
            {audioUrl ? (
              <div className="flex items-center gap-4 p-2 bg-sky-50 rounded-lg border border-sky-100 shadow-inner">
                <audio src={audioUrl} controls className="h-8 flex-1" />
                <button type="button" onClick={() => handleRemoveFile("audio")} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                disabled={isUploading}
                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-sky-50 hover:border-sky-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span className="text-xs font-bold text-gray-400 group-hover:text-sky-500 uppercase tracking-widest">{isUploading ? "Uploading..." : "Upload Audio"}</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">外部リンク</label>
            <input type="text" name="external_url" defaultValue={initialData?.external_url} className={inputClasses} placeholder="https://..." />
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isPending} className="w-full py-3 px-4 rounded-lg text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 transition shadow-md disabled:opacity-50">
            {isPending ? "保存中..." : "実績を保存する"}
          </button>
        </div>
      </form>
    </div>
  );
}
