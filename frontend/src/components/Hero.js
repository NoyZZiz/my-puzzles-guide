import React, { useEffect, useState } from 'react';

const TYPING_TEXT = "INITIALIZING STRATEGY PROTOCOLS...";

export default function Hero() {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < TYPING_TEXT.length) {
        setTyped(TYPING_TEXT.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      data-testid="hero-section"
      className="relative corner-accent glass-panel rounded-lg p-8 md:p-12 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#fbbf24]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#00dcd7]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      {/* Scan Line Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#fbbf24]/20 to-transparent"
          style={{ animation: 'scanLine 4s linear infinite' }}
        />
      </div>

      <div className="relative z-10 text-center">
        {/* Status Badge */}
        <span
          className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-bold tracking-[0.2em] text-[#fbbf24] border border-[#fbbf24]/30 bg-[#fbbf24]/5 rounded-full animate-fade-in-up"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
          data-testid="hero-status-badge"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          SYSTEM ONLINE
        </span>

        <h2
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 leading-none animate-fade-in-up-1"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
          data-testid="hero-title"
        >
          CONQUEST{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]">
            MASTERED
          </span>
        </h2>

        {/* Typing Effect */}
        <div className="h-7 mb-8 flex justify-center animate-fade-in-up-2">
          <p
            className="text-gray-400 text-xs sm:text-sm border-r-2 border-[#fbbf24] pr-1"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
            data-testid="hero-typing"
          >
            {typed}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up-3">
          <a
            href="#guides"
            data-testid="cta-guides"
            className="relative px-8 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold tracking-wide text-sm transition-all overflow-hidden group"
            style={{ fontFamily: 'Rajdhani, sans-serif', clipPath: 'polygon(0 0, 100% 0, 100% 80%, 88% 100%, 0 100%)' }}
          >
            <span className="relative z-10">INITIATE GUIDES</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <a
            href="#tools"
            data-testid="cta-tools"
            className="px-8 py-3 border border-[#1e293b] hover:border-[#fbbf24] text-gray-300 hover:text-[#fbbf24] font-bold tracking-wide text-sm transition-all"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            ACCESS TOOLS
          </a>
        </div>
      </div>
    </section>
  );
}
