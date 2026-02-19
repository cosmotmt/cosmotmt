export const runtime = "edge";

import { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "CosmoTmtへのゲーム開発・音楽制作のご依頼、お見積もり、その他お問い合わせはこちらから。",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-48 md:pb-24 px-6 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-12">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase whitespace-nowrap">お問い合わせ</h1>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          
          {/* Description: Aligned with terminal internal content */}
          <div className="flex items-start px-4 md:px-10">
            <div className="shrink-0 w-4 flex items-center justify-center h-5 md:h-6 mr-3 md:mr-4">
              <span className="text-gray-600 font-black">#</span>
            </div>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
              お仕事のご依頼やお見積もりなど、お気軽にお問い合わせください。
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
