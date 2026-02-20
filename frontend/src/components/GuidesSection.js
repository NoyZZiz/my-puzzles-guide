import React from 'react';

const GUIDES = [
  {
    id: 'military',
    title: 'MILITARY EXPEDITION',
    description: 'Advanced warfare tactics for kingdom conquest events. Master points, occupation, troop management, and Fast Comeback mechanics.',
    image: '/assets/images/Military.png',
    tag: 'TACTICS',
    href: '/military-expedition-guide/',
    tagColor: 'text-[#fbbf24] border-[#fbbf24]/30 bg-[#fbbf24]/10',
  },
  {
    id: 'hero-tier',
    title: 'HERO TIER LIST 2026',
    description: 'Complete hero rankings by element and game mode. Find the strongest lineup for campaign, arena, rallies, and PvP.',
    image: '/assets/images/noyzzing-logo-premium.jpg',
    tag: 'NEW',
    href: '/hero-tier-list/',
    tagColor: 'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10',
  },
  {
    id: 'troop-strength',
    title: 'TROOP STRENGTH',
    description: 'Optimization protocols for maximum army output. Calculate power, speed, and resource efficiency.',
    image: '/assets/images/troop strength.png',
    tag: 'UNITS',
    href: '/troop-strength-guide/',
    tagColor: 'text-[#00dcd7] border-[#00dcd7]/30 bg-[#00dcd7]/10',
  },
  {
    id: 'talent',
    title: 'TALENT MEMORY',
    description: 'Unlock hero potential with optimal skill trees. Covers Balance, Attack, and Production sets for VIP 10+.',
    image: '/assets/images/talent.png',
    tag: 'HERO',
    href: '/talent-memory-guide/',
    tagColor: 'text-[#a78bfa] border-[#a78bfa]/30 bg-[#a78bfa]/10',
  },
];

export default function GuidesSection() {
  return (
    <section id="guides" data-testid="guides-section">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8 border-b border-gray-800/50 pb-3">
        <div>
          <span
            className="text-[10px] font-bold tracking-[0.25em] text-[#fbbf24]/60 mb-1 block"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            STRATEGIC FILES
          </span>
          <h2
            className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <i className="fa-solid fa-layer-group text-[#fbbf24] text-base" />
            DATABASE
          </h2>
        </div>
        <a
          href="/battle-of/"
          className="text-xs text-gray-500 hover:text-[#fbbf24] transition-colors"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          VIEW ALL &rarr;
        </a>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {GUIDES.map((guide, i) => (
          <article
            key={guide.id}
            data-testid={`guide-card-${guide.id}`}
            className={`group glass-panel corner-accent rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#fbbf24]/50 hover:shadow-[0_8px_30px_-10px_rgba(251,191,36,0.15)] animate-fade-in-up-${i + 1}`}
          >
            {/* Image */}
            <div className="h-44 overflow-hidden relative">
              <img
                src={guide.image}
                alt={`${guide.title} Guide - Puzzles and Conquest`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
              <span
                className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${guide.tagColor}`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {guide.tag}
              </span>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3
                className="text-lg font-bold text-white mb-2 group-hover:text-[#fbbf24] transition-colors"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {guide.title}
              </h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed line-clamp-2">
                {guide.description}
              </p>
              <a
                href={guide.href}
                data-testid={`guide-link-${guide.id}`}
                className="block w-full text-center text-xs font-bold bg-[#1e293b]/50 hover:bg-[#fbbf24] hover:text-black py-2.5 rounded transition-all tracking-wider"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                ACCESS FILE &gt;
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* JSON-LD for Guide Articles */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Puzzles and Conquest Strategy Guides",
            "numberOfItems": GUIDES.length,
            "itemListElement": GUIDES.map((guide, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "url": `https://noyziz.github.io/my-puzzles-guide${guide.href}`,
              "name": guide.title,
              "description": guide.description,
            })),
          }),
        }}
      />
    </section>
  );
}
