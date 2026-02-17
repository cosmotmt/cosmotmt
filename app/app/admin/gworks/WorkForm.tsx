"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import Link from "next/link";

interface WorkFormProps {
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: any;
  techString?: string;
  roleString?: string;
  platformString?: string;
  existingTechs?: string[];
  existingRoles?: string[];
  existingPlatforms?: string[];
  title: string;
}

/**
 * GitHub風のタグ入力コンポーネント
 */
function TagInput({ 
  name, 
  label, 
  initialValue, 
  suggestions 
}: { 
  name: string; 
  label: string; 
  initialValue: string; 
  suggestions: string[] 
}) {
  const [tags, setTags] = useState<string[]>(
    initialValue.split(",").map(t => t.trim()).filter(Boolean)
  );
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = suggestions.filter(
    s => !tags.includes(s) && s.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">
        {label}
      </label>
      
      <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-sky-400 transition-all shadow-sm">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-md border border-sky-100">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-sky-900 focus:outline-none ml-1">&times;</button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(inputValue);
            } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
              removeTag(tags[tags.length - 1]);
            }
          }}
          className="flex-1 min-w-[120px] text-sm text-gray-900 outline-none bg-transparent"
          placeholder={tags.length === 0 ? "追加..." : ""}
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto py-1">
          {filteredSuggestions.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <input type="hidden" name={name} value={tags.join(",")} />
    </div>
  );
}

/**
 * 開発形態用のチップ選択コンポーネント
 */
function ChipSelect({ 
  name, 
  label, 
  initialValue 
}: { 
  name: string; 
  label: string; 
  initialValue: string 
}) {
  const options = [
    { value: "solo", label: "個人" },
    { value: "team", label: "チーム" },
    { value: "business", label: "業務" },
  ];
  const [selected, setSelected] = useState(initialValue || "solo");

  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-1.5 min-h-[42px]">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSelected(opt.value)}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold transition-all border h-[34px] flex items-center justify-center ${
              selected === opt.value 
                ? "bg-sky-500 text-white border-sky-500 shadow-sm" 
                : "bg-white text-gray-600 border-gray-300 hover:border-sky-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={selected} />
    </div>
  );
}

export default function WorkForm({ 
  action, 
  initialData, 
  techString = "", 
  roleString = "", 
  platformString = "",
  existingTechs = [], 
  existingRoles = [], 
  existingPlatforms = [],
  title 
}: WorkFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  const inputClasses = "w-full rounded-lg border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 border p-2.5 bg-white transition-all shadow-sm";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
          {title}
        </h1>
        <Link href="/admin/gworks" className="text-sm text-gray-500 hover:text-sky-600 transition">
          キャンセル
        </Link>
      </div>

      <form action={formAction} className="space-y-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {state?.error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 font-medium">
            {state.error}
          </div>
        )}

        <div className="space-y-5">
          {/* 作品タイトル */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">作品タイトル *</label>
            <input type="text" name="title" defaultValue={initialData?.title} required className={inputClasses} placeholder="作品名を入力" />
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">説明</label>
            <textarea name="description" defaultValue={initialData?.description} rows={2} className={inputClasses} placeholder="作品の概要" />
          </div>

          {/* タグ系入力 (2列グリッド) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TagInput name="techs" label="技術スタック" initialValue={techString} suggestions={existingTechs} />
            <TagInput name="roles" label="担当役割" initialValue={roleString} suggestions={existingRoles} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TagInput name="platform" label="プラットフォーム" initialValue={platformString} suggestions={existingPlatforms} />
            <ChipSelect name="development_type" label="開発形態" initialValue={initialData?.development_type} />
          </div>

          {/* 実装機能 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">主な実装機能</label>
            <input type="text" name="features" defaultValue={initialData?.features} className={inputClasses} placeholder="オンライン対戦, 物理演算など" />
          </div>

          {/* 期間 & URL (2列グリッド) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">開始日</label>
                <input type="date" name="start_date" defaultValue={initialData?.start_date} className={inputClasses} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">終了日</label>
                <input type="date" name="end_date" defaultValue={initialData?.end_date} className={inputClasses} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">サムネイル URL</label>
              <input type="text" name="thumbnail_url" defaultValue={initialData?.thumbnail_url} className={inputClasses} placeholder="https://..." />
            </div>
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
