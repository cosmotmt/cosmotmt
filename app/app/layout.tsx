import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CosmoTmt Planet",
    template: "%s | CosmoTmt Planet"
  },
  description: "ゲームエンジニア兼音楽クリエイター「CosmoTmt」のポートフォリオサイト。",
  keywords: ["CosmoTmt", "ゲーム開発", "作曲", "BGM制作", "ポートフォリオ", "Unity", "ゲームエンジニア"],
  authors: [{ name: "CosmoTmt" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://cosmotmt.jp",
    siteName: "CosmoTmt Planet",
    title: "CosmoTmt Planet",
    description: "ゲームエンジニア兼音楽クリエイター「CosmoTmt」のポートフォリオサイト。",
    images: [
      {
        url: "/og-image.png", // OGP画像を用意して public フォルダに置くのだ
        width: 1200,
        height: 630,
        alt: "CosmoTmt Planet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CosmoTmt Planet",
    description: "ゲームエンジニア兼音楽クリエイター「CosmoTmt」のポートフォリオサイト。",
    creator: "@cosmotmt",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://cosmotmt.jp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
