export const runtime = "edge";

import { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "CosmoTmtへのゲーム開発・音楽制作のご依頼、お見積もり、その他お問い合わせはこちらから。",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter mb-4 text-white">お問い合わせ</h1>
          <div className="h-1 w-20 bg-red-500 rounded-full"></div>
          <p className="text-gray-400 mt-8 leading-relaxed max-w-2xl">
            お仕事のご依頼やお見積もりなど、お気軽にお問い合わせください。
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
