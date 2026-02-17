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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {initialWorks.map((work) => (
          <div
            key={work.id}
            className="group cursor-pointer"
            onClick={() => handleWorkClick(work)}
          >
            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 mb-6 shadow-2xl group-hover:shadow-red-500/20 transition-all duration-500 border border-white/5">
              {work.thumbnail_url ? (
                <img
                  src={work.thumbnail_url}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold tracking-widest text-xs uppercase">
                  No Image
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                {/* 開発形態 */}
                <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5">
                  {work.development_type === 'solo' ? '個人開発' : work.development_type === 'team' ? 'チーム開発' : '業務実績'}
                </span>
                {/* 開発期間 - 色と背景を開発形態と完全に統一 */}
                {work.duration && (
                  <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5">
                    {work.duration}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors ml-1">
                {work.title}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {initialWorks.length === 0 && (
        <div className="py-32 text-center text-gray-500">
          作品はまだ登録されていません。
        </div>
      )}

      {/* Modal */}
      <GameWorkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        work={selectedWork}
      />
    </>
  );
}
