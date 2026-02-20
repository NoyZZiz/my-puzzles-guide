import React from 'react';

const TOOLS = [
  {
    id: 'calculator',
    title: 'TROOP CALCULATOR',
    desc: 'Real-time battle simulation and resource analysis.',
    icon: 'fa-calculator',
    href: '/troop-resource-calculator/',
    label: 'LAUNCH APP',
    color: 'from-[#0f172a] to-[#020617]',
    borderColor: 'border-[#1e293b] hover:border-[#fbbf24]',
    iconColor: 'text-[#fbbf24]/10 group-hover:text-[#fbbf24]/20',
    btnClass: 'bg-[#1e293b] hover:bg-[#fbbf24] hover:text-black',
  },
  {
    id: 'hawkins',
    title: 'CODE NAME: HAWKINS',
    desc: 'Find your unique Stranger Things Season 5 alliance character.',
    icon: 'fa-dice-d20',
    href: '/stranger_things_game/',
    label: 'ASSIGN CODE',
    color: 'from-red-900/40 to-[#020617]',
    borderColor: 'border-red-500/50 hover:border-red-500',
    iconColor: 'text-red-500/20 group-hover:text-red-500/40',
    btnClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
  {
    id: 'pocket',
    title: 'POCKET CONQUEST',
    desc: 'Collect heroes, summon 5-stars, and battle in this RPG sim!',
    icon: 'fa-khanda',
    href: '/pocket-conquest/',
    label: 'START ADVENTURE',
    color: 'from-purple-900/40 to-[#020617]',
    borderColor: 'border-purple-500/50 hover:border-purple-500',
    iconColor: 'text-purple-500/20 group-hover:text-purple-500/40',
    btnClass: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  {
    id: 'hogwarts',
    title: 'HOGWARTS REGISTRY',
    desc: 'Inscribe your signature in the official book of fates. An authentic ROL experience.',
    icon: 'fa-wand-sparkles',
    href: '/harry-potter.html',
    label: 'UNROLL PARCHMENT',
    color: 'from-cyan-900/40 to-[#020617]',
    borderColor: 'border-cyan-500/50 hover:border-[#fbbf24]',
    iconColor: 'text-cyan-500/20 group-hover:text-[#fbbf24]/20',
    btnClass: 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white',
  },
  {
    id: 'pokemon',
    title: 'POKEMON REGISTRY',
    desc: 'Draft your squad. Become a Gym Boss. Enter the Hall of Leaders.',
    icon: 'fa-dragon',
    href: '/pokemon-registry/',
    label: 'ENTER REGISTRY',
    color: 'from-red-900/40 to-[#020617]',
    borderColor: 'border-red-400/50 hover:border-yellow-400',
    iconColor: 'text-red-400/20 group-hover:text-yellow-400/30',
    btnClass: 'bg-gradient-to-r from-red-600 to-yellow-500 text-black',
  },
];

export default function ToolsSection() {
  return (
    <section id="tools" data-testid="tools-section">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8 border-b border-gray-800/50 pb-3">
        <div>
          <span
            className="text-[10px] font-bold tracking-[0.25em] text-[#fbbf24]/60 mb-1 block"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            OPERATIONAL TOOLS
          </span>
          <h2
            className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <i className="fa-solid fa-microchip text-[#fbbf24] text-base" />
            UTILITIES
          </h2>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {TOOLS.map((tool, i) => (
          <div
            key={tool.id}
            data-testid={`tool-card-${tool.id}`}
            className={`group p-6 bg-gradient-to-br ${tool.color} border ${tool.borderColor} rounded-lg transition-all relative overflow-hidden animate-fade-in-up-${Math.min(i + 1, 5)}`}
          >
            {/* Background Icon */}
            <div className={`absolute right-4 top-4 ${tool.iconColor} transition-colors`}>
              <i className={`fa-solid ${tool.icon} text-5xl`} />
            </div>

            <h3
              className="text-xl font-bold text-white mb-2"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {tool.title}
            </h3>
            <p
              className="text-xs text-gray-400 mb-6 leading-relaxed"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {tool.desc}
            </p>
            <a
              href={tool.href}
              data-testid={`tool-link-${tool.id}`}
              className={`inline-block px-4 py-2 ${tool.btnClass} text-xs font-bold tracking-wide transition-all rounded-sm`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {tool.label}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
