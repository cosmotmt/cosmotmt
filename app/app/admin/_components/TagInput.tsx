"use client";

import { useState, useRef, useEffect } from "react";

interface TagInputProps {
  name: string;
  label: string;
  initialValue: string;
  suggestions: string[];
}

export default function TagInput({ name, label, initialValue, suggestions }: TagInputProps) {
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
