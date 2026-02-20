import React from 'react';

export default function AllianceBanner() {
  return (
    <section
      data-testid="alliance-banner"
      className="relative glass-panel border-l-4 border-[#fbbf24] p-6 flex flex-col md:flex-row items-center gap-6 rounded-lg overflow-hidden animate-fade-in-up"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#fbbf24]/5 to-transparent pointer-events-none" />

      <div className="relative w-20 h-20 bg-black rounded-lg border border-[#1e293b] flex items-center justify-center shadow-lg shrink-0">
        <img
          src="/assets/images/ROL_logo.png"
          alt="ROL Alliance - Rebirth of Legends"
          className="w-16 h-16 object-contain"
          loading="lazy"
        />
      </div>

      <div className="flex-1 text-center md:text-left z-10">
        <h3
          className="text-xl font-bold text-white mb-1"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          ALLIANCE: ROL
        </h3>
        <p className="text-sm text-gray-400 mb-3 leading-relaxed">
          Rebirth of Legends. Coordinated strikes. Drama-free zone.
          <br />
          <span className="text-[#fbbf24] text-xs">Monthly events like Stranger Things challenges!</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
          <a
            href="https://discord.gg/BX95Q38C"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="alliance-discord-link"
            className="text-xs font-bold text-[#fbbf24] hover:text-white uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <i className="fa-brands fa-discord" /> Connect to Secure Channel
          </a>
          <a
            href="/alliance/"
            data-testid="alliance-learn-more"
            className="text-xs font-bold text-gray-400 hover:text-[#fbbf24] uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-info-circle" /> Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
