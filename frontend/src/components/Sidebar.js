import React, { useState } from 'react';
import MonetizationBanner from './MonetizationBanner';

export default function Sidebar() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      }
    } catch (err) {
      console.error('Subscribe error:', err);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Sidebar Ad */}
      <MonetizationBanner type="sidebar" />

      {/* Commander Profile */}
      <div data-testid="commander-profile" className="glass-panel rounded-lg p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b45309] via-[#fbbf24] to-[#b45309]" />

        <h3
          className="text-base font-bold text-white mb-4 tracking-wider"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          COMMANDER PROFILE
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-lg bg-black border border-[#fbbf24]/30 p-1 overflow-hidden">
            <img
              src="/assets/images/noyzzing-logo.png"
              alt="NoYzzing Commander Profile"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <div>
            <p className="font-bold text-white text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              NOYZZING
            </p>
            <span
              className="text-[10px] text-[#fbbf24] uppercase tracking-wider bg-[#fbbf24]/10 px-2 py-0.5 rounded-full border border-[#fbbf24]/20"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Admin
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Delivering top-tier strategy and operational guides for the alliance community.
        </p>

        <div className="space-y-2">
          <a
            href="https://discord.gg/BX95Q38C"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="sidebar-discord-link"
            className="block w-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-center py-2 text-xs rounded transition-all"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            <i className="fa-brands fa-discord mr-2" />
            JOIN DISCORD
          </a>
        </div>
      </div>

      {/* Support / Buy Me a Coffee */}
      <div data-testid="support-section" className="glass-panel rounded-lg p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF813F] via-[#FFDD00] to-[#FF813F]" />
        <h3
          className="text-sm font-bold text-white mb-2 uppercase tracking-wide flex items-center gap-2"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          <i className="fa-solid fa-mug-hot text-[#FFDD00]" />
          Support the Commander
        </h3>
        <p
          className="text-[10px] text-gray-500 mb-4 leading-relaxed"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Free guides take hours to create. Fuel the mission with a coffee!
        </p>
        <a
          href="https://www.buymeacoffee.com/noyzzing"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="buy-me-coffee-link"
          className="block w-full bg-[#FFDD00] hover:bg-[#FFD000] text-black font-bold text-center py-3 text-xs uppercase tracking-wider rounded transition-all"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          <i className="fa-solid fa-mug-hot mr-2" />
          Buy Me a Coffee
        </a>
      </div>

      {/* Newsletter */}
      <div data-testid="newsletter-section" className="glass-panel rounded-lg p-6">
        <h3
          className="text-sm font-bold text-white mb-2 uppercase tracking-wide flex items-center gap-2"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          <i className="fa-regular fa-envelope text-[#fbbf24]" />
          Intel Briefing
        </h3>
        <p
          className="text-[10px] text-gray-500 mb-4"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Subscribe for weekly strategy updates.
        </p>

        <form onSubmit={handleSubscribe} className="space-y-2" data-testid="newsletter-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENCRYPTED EMAIL..."
            required
            data-testid="newsletter-email-input"
            className="w-full bg-black/50 border border-[#1e293b] text-gray-300 text-xs p-2.5 rounded focus:border-[#fbbf24] focus:ring-1 focus:ring-[#fbbf24]/30 outline-none transition-all"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          />
          <button
            type="submit"
            disabled={loading}
            data-testid="newsletter-subscribe-btn"
            className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold py-2.5 text-xs uppercase tracking-wider transition-colors disabled:opacity-50 rounded"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {loading ? 'PROCESSING...' : 'SUBSCRIBE'}
          </button>
        </form>

        {subscribed && (
          <div
            data-testid="newsletter-success"
            className="mt-2 text-[10px] text-[#22c55e] text-center animate-fade-in-up"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            CONFIRMED. INTEL INCOMING.
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="glass-panel rounded-lg p-6">
        <h3
          className="text-sm font-bold text-white mb-4 uppercase tracking-wide"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          <i className="fa-solid fa-bolt text-[#fbbf24] mr-2" />
          Quick Access
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Military Guide', href: '/military-expedition-guide/', icon: 'fa-crosshairs' },
            { label: 'Troop Calculator', href: '/troop-resource-calculator/', icon: 'fa-calculator' },
            { label: 'Battle of Saurnesia', href: '/battle-of/', icon: 'fa-shield-halved' },
            { label: 'Event Calendar', href: '/event-calendar/', icon: 'fa-calendar-days' },
            { label: 'Talent Memory', href: '/talent-memory-guide/', icon: 'fa-brain' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-3 text-xs text-gray-400 hover:text-[#fbbf24] py-1.5 transition-colors group"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <i className={`fa-solid ${link.icon} text-[10px] text-gray-600 group-hover:text-[#fbbf24] transition-colors w-4 text-center`} />
              {link.label}
              <span className="ml-auto text-gray-700 group-hover:text-[#fbbf24]/50 transition-colors">&rarr;</span>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Sidebar Ad */}
      <MonetizationBanner type="sidebar" />
    </>
  );
}
