'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden bg-[#fdfdf9] flex flex-col justify-between selection:bg-brand-yellow-light">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft Blurs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-yellow/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-blue/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Floating Sparks/Lightning */}
        <div className="absolute top-[20%] right-[45%] text-brand-yellow/40 animate-float opacity-70 hidden md:block">
          <svg className="w-10 h-10 animate-rotate-slow" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 8H9v4h6v-6h4l-7-8z" className="hidden" />
            <path d="M11.5 2L4.5 12h6v8l7-10h-6V2z" /> {/* Lightning Bolt */}
          </svg>
        </div>
        <div className="absolute bottom-[25%] left-[10%] text-brand-blue/30 animate-float opacity-70 hidden md:block" style={{ animationDelay: '1.5s' }}>
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" className="opacity-10" />
            <path d="M12 8v8m-4-4h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute top-[15%] left-[40%] text-brand-yellow/30 animate-float opacity-60 hidden md:block" style={{ animationDelay: '3s' }}>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" /> {/* Star */}
          </svg>
        </div>
        
        {/* Decorative Grid Dots */}
        <div className="absolute top-1/3 left-5% w-24 h-24 bg-[radial-gradient(#e2e8f0_2px,transparent_2px)] [background-size:12px_12px] opacity-60 hidden lg:block" />
        <div className="absolute bottom-1/4 right-5% w-32 h-32 bg-[radial-gradient(#e2e8f0_2px,transparent_2px)] [background-size:16px_16px] opacity-60 hidden lg:block" />
      </div>

      {/* Header / Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 md:py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center shadow-md shadow-brand-yellow/30 border-2 border-white">
            <svg className="w-5 h-5 text-brand-blue-dark" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
              <circle cx="12" cy="12" r="3" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
            포켓몬 <span className="text-brand-blue">탐험대</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="flex items-center gap-4 sm:gap-8">
            <li>
              <a
                id="nav-pokemon-intro"
                href="#"
                className="text-sm md:text-base font-semibold text-slate-600 hover:text-brand-blue transition-colors duration-200"
              >
                포켓몬 소개
              </a>
            </li>
            <li>
              <a
                id="nav-pokemon-encyclopedia"
                href="/dogam"
                className="text-sm md:text-base font-semibold text-slate-600 hover:text-brand-blue transition-colors duration-200"
              >
                포켓몬 도감
              </a>
            </li>
            <li>
              <a
                id="nav-adventure-start"
                href="#"
                className="text-sm md:text-base font-bold bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-all duration-300 border border-brand-blue/20"
              >
                모험 시작
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 py-6 lg:py-0">
        
        {/* Left Column: Headline, Description, Buttons */}
        <div className={`w-full lg:w-1/2 flex flex-col gap-6 text-center lg:text-left ${isMounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center justify-center lg:justify-start gap-2 bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow-dark px-4 py-1.5 rounded-full text-sm font-bold tracking-wide w-fit mx-auto lg:mx-0">
            ⚡ 신나는 포켓몬 세계로!
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 leading-[1.15] tracking-tight">
            오늘, 어떤 포켓몬을<br className="hidden sm:inline" />
            만나 볼래?
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            서로 다른 모습과 특별한 능력을 가진 포켓몬을 만나 보세요. 새로운 포켓몬과 함께 신나는 모험을 시작해요!
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-2">
            <button
              id="btn-pokemon-meet"
              className="w-full sm:w-auto px-8 py-4 bg-brand-yellow text-slate-800 font-extrabold text-lg rounded-full shadow-lg shadow-brand-yellow/30 border-2 border-white hover:bg-brand-yellow-dark hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              포켓몬 만나기
            </button>
            <button
              id="btn-pokemon-info"
              className="w-full sm:w-auto px-8 py-4 bg-white text-brand-blue font-extrabold text-lg rounded-full shadow-md shadow-slate-100 border-2 border-brand-blue-light/50 hover:bg-brand-blue-light/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              포켓몬 알아보기
            </button>
          </div>
        </div>

        {/* Right Column: Hero Image */}
        <div className={`w-full lg:w-1/2 flex items-center justify-center relative ${isMounted ? 'animate-float' : 'opacity-0'}`}>
          {/* Circular soft halo behind the Pokemon */}
          <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full bg-brand-yellow/20 blur-xl z-0 pointer-events-none" />
          
          {/* Image Container */}
          <div className="relative z-10 w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px] transition-transform duration-300">
            <Image
              src="/images/pokemon.png"
              alt="포켓몬 이미지"
              fill
              priority
              className="object-contain drop-shadow-[0_20px_35px_rgba(250,204,21,0.25)]"
              sizes="(max-width: 640px) 260px, (max-width: 1024px) 360px, 420px"
            />
          </div>
        </div>
      </main>

      {/* Footer (Subtle and clean, keeps height balanced) */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 text-xs font-semibold text-slate-400 gap-2">
        <span>© 2026 포켓몬 탐험대. All Rights Reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand-blue transition-colors">이용약관</a>
          <a href="#" className="hover:text-brand-blue transition-colors">개인정보처리방침</a>
        </div>
      </footer>
    </div>
  );
}
