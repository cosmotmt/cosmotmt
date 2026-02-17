"use client";

import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface ChipSelectProps {
  name: string;
  label: string;
  initialValue: string;
  options: Option[];
}

export default function ChipSelect({ name, label, initialValue, options }: ChipSelectProps) {
  const [selected, setSelected] = useState(initialValue || options[0]?.value);

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
            className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all border h-[34px] flex items-center justify-center ${
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
