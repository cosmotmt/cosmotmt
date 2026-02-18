"use client";

import { useState } from "react";
import GameWorkModal from "./GameWorkModal";

interface GWorksListProps {
  initialWorks: any[];
}

export default function GWorksList({ initialWorks }: GWorksListProps) {
  const [selectedWork, setSelectedWork] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWorkClick = (work: any) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {initialWorks.map((work) => (
          <div
            key={work.id}
            className="group cursor-pointer relative aspect-video bg-slate-950 border border-white/10 overflow-hidden transition-all duration-300 hover:border-red-500/50"
            onClick={() => handleWorkClick(work)}
          >
            {/* Thumbnail Image */}
            {work.thumbnail_url ? (
              <img
                src={work.thumbnail_url}
                alt={work.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-700 font-mono text-[10px] font-black tracking-widest uppercase">
                No Image
              </div>
            )}

            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-10"></div>

            {/* HUD Info Overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between z-20 font-mono">
              {/* Top: Development Type Tag */}
              <div className="flex justify-start">
                <span className="text-[10px] md:text-xs font-black px-2 py-0.5 border border-white/10 text-gray-400 bg-slate-950/50 backdrop-blur-sm group-hover:border-red-500/50 group-hover:text-red-500 transition-colors -ml-2">
                  {work.development_type === 'solo' ? '個人' : work.development_type === 'team' ? 'チーム' : '業務'}
                </span>
              </div>

              {/* Bottom: Title */}
              <div className="flex items-center">
                <h2 className="text-sm md:text-base font-bold text-white group-hover:text-red-500 transition-colors truncate">
                  {work.title}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {initialWorks.length === 0 && (
        <div className="py-32 text-center text-gray-500 font-mono text-sm">
          作品はまだ登録されていません。
        </div>
      )}

      <GameWorkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        work={selectedWork}
      />
    </>
  );
}
