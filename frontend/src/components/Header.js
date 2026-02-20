import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'MILITARY', href: '/military-expedition-guide/' },
  { label: 'CALCULATOR', href: '/troop-resource-calculator/' },
  { label: 'EVENTS', href: '/event-calendar/' },
  { label: 'BOS', href: '/battle-of/' },
  { label: 'REGISTRY', href: '/pokemon-registry/' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <header
      data-testid="main-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-panel shadow-lg shadow-black/40'
          : 'bg-[#020617]/90 backdrop-blur-sm border-b border-[#1e293b]/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" data-testid="logo-link" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-9 h-9 rounded overflow-hidden border border-[#1e293b] group-hover:border-[#fbbf24] transition-colors">
              <img
                src="/assets/images/noyzzing-logo.png"
                alt="NoYzzing Logo"
                className="w-full h-full object-contain p-0.5"
                loading="eager"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                <span className="text-white">NOY</span>
                <span className="text-[#fbbf24]">ZZING</span>
                <span className="text-[#334155] ml-1 text-sm font-normal">// OPS</span>
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:block" data-testid="desktop-nav">
            <ul className="flex items-center gap-1 bg-[#0f172a]/60 px-4 py-1.5 rounded-full border border-[#1e293b]/50">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    data-testid={`nav-${link.label.toLowerCase()}`}
                    className="px-3 py-1.5 text-xs font-semibold tracking-widest text-gray-400 hover:text-[#fbbf24] transition-colors"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search Toggle */}
            <button
              data-testid="search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 flex items-center justify-center rounded border border-[#1e293b] hover:border-[#fbbf24] text-gray-400 hover:text-[#fbbf24] transition-all"
            >
              <Search size={16} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded border border-[#1e293b] hover:border-[#fbbf24] text-gray-400 hover:text-[#fbbf24] transition-all"
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-sm`} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-3 animate-fade-in-up" data-testid="search-panel">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                ref={searchRef}
                data-testid="search-input"
                type="text"
                placeholder="Search guides, tools, strategies..."
                className="w-full bg-[#020617] border border-[#1e293b] text-gray-200 text-xs rounded px-9 py-2.5 focus:outline-none focus:border-[#fbbf24] focus:ring-1 focus:ring-[#fbbf24]/30 transition-all placeholder-gray-600"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>
          </div>
        )}

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden pb-4 animate-fade-in-up" data-testid="mobile-nav">
            <ul className="flex flex-col gap-1 bg-[#0f172a]/80 rounded-lg border border-[#1e293b]/50 p-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="block px-4 py-2 text-xs font-semibold tracking-widest text-gray-400 hover:text-[#fbbf24] hover:bg-[#fbbf24]/5 rounded transition-colors"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
