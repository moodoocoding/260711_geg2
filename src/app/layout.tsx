import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "포켓몬 탐험대 - 오늘, 어떤 포켓몬을 만나 볼래?",
  description: "서로 다른 모습과 특별한 능력을 가진 포켓몬을 만나 보세요. 새로운 포켓몬과 함께 신나는 모험을 시작해요! 포켓몬 탐험대에서 다양한 포켓몬을 알아볼 수 있습니다.",
  keywords: ["포켓몬", "포켓몬 탐험대", "피카츄", "포켓몬스터", "도감", "모험"],
  authors: [{ name: "포켓몬 탐험대" }],
  openGraph: {
    title: "포켓몬 탐험대 - 오늘, 어떤 포켓몬을 만나 볼래?",
    description: "서로 다른 모습과 특별한 능력을 가진 포켓몬을 만나 보세요. 새로운 포켓몬과 함께 신나는 모험을 시작해요!",
    url: "https://pokemon-expedition.vercel.app",
    siteName: "포켓몬 탐험대",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
