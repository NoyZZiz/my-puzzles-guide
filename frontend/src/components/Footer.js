import React from 'react';
import AdSlot from './AdSlot';

const FOOTER_LINKS = {
  guides: [
    { label: 'Military Expedition', href: '/military-expedition-guide/' },
    { label: 'Troop Strength', href: '/troop-strength-guide/' },
    { label: 'Talent Memory', href: '/talent-memory-guide/' },
    { label: 'Battle of Saurnesia', href: '/battle-of/' },
  ],
  tools: [
    { label: 'Troop Calculator', href: '/troop-resource-calculator/' },
    { label: 'Pokemon Registry', href: '/pokemon-registry/' },
    { label: 'Pocket Conquest', href: '/pocket-conquest/' },
    { label: 'Event Calendar', href: '/event-calendar/' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy/' },
    { label: 'Terms of Service', href: '/terms-of-service/' },
  ],
};

export default function Footer() {
  return (
    <footer data-testid="main-footer" className="border-t border-[#1e293b] mt-12 bg-[#020617]">
      {/* Footer Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <AdSlot type="footer" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/images/noyzzing-logo.png"
                alt="NoYzzing"
                className="w-8 h-8 object-contain"
                loading="lazy"
              />
              <span
                className="text-lg font-bold tracking-wider"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <span className="text-white">NOY</span>
                <span className="text-[#fbbf24]">ZZING</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              The ultimate strategy command center for Puzzles and Conquest players. Expert guides, powerful tools, and community resources.
            </p>
            <a
              href="https://discord.gg/BX95Q38C"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-discord-link"
              className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#fbbf24] transition-colors"
            >
              <i className="fa-brands fa-discord" /> Join Discord
            </a>
          </div>

          {/* Guides */}
          <div>
            <h4
              className="text-xs font-bold text-[#fbbf24] mb-4 tracking-widest uppercase"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Guides
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.guides.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4
              className="text-xs font-bold text-[#fbbf24] mb-4 tracking-widest uppercase"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Tools
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.tools.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-xs font-bold text-[#fbbf24] mb-4 tracking-widest uppercase"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Legal
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1e293b] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p
            className="text-gray-600 text-[10px] uppercase tracking-widest"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            &copy; {new Date().getFullYear()} Noyzzing | Operational Command
          </p>
          <p className="text-gray-700 text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Not affiliated with 37Games or Puzzles & Conquest
          </p>
        </div>
      </div>
    </footer>
  );
}
