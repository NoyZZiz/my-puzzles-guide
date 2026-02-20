import React, { useState, useRef, useEffect } from 'react';

const KNOWLEDGE_BASE = {
  military: {
    keywords: ['military', 'expedition', 'me', 'kingdom', 'kvk'],
    response: `**Military Expedition Intel:**
- Focus on **Occupation Points** over Kill Points - they're worth more!
- Keep your infirmary below max capacity to avoid troop losses
- Use **Fast Comeback** mechanism wisely - it's your secret weapon
- Coordinate with alliance for chapter objectives
- Altar defense + Occupation = maximum scoring
Check the full guide: [Military Expedition Guide](/military-expedition-guide/)`
  },
  troop: {
    keywords: ['troop', 'calculator', 'train', 'resource', 'army', 'might'],
    response: `**Troop Strategy:**
- T9+ troops recommended for competitive play
- Balance training speed with resource management
- Use **Training Speed Buff** to maximize output
- Calculate with our tool: [Troop Calculator](/troop-resource-calculator/)
- Higher tier = more might per unit but costs more resources`
  },
  talent: {
    keywords: ['talent', 'memory', 'skill', 'build', 'vip'],
    response: `**Talent Memory Sets (VIP 10+):**
- **Balance Set**: Everyday use, general purpose
- **Attack Set**: Rallies, PvP combat, open field
- **Production Set**: Resource gathering, economy focus
- Free resets at VIP 10 - switch between sets strategically!
Full breakdown: [Talent Memory Guide](/talent-memory-guide/)`
  },
  bos: {
    keywords: ['bos', 'battle', 'saurnesia', 'wonder'],
    response: `**Battle of Saurnesia (BOS):**
- It's a 1-hour alliance competition based on League Grade
- Secure wonders early for point advantage
- Dragon Cub Escort gives bonus points
- Demands coordination AND endurance
- Check scoring details: [BOS Guide](/battle-of/)`
  },
  heroes: {
    keywords: ['hero', 'best', 'lineup', 'tier', 'element'],
    response: `**Hero Strategy:**
- 5 elements: Fire, Water, Gale, Light, Dark
- Dark beats Light, Water beats Fire (2x damage)
- **God Tier**: Pioneer Crusader, Skender
- **Elite**: Orochi, Lux, Gorgon (Medusa), Zeus, Horus
- Match hero elements to enemy weaknesses in battles!`
  },
  trap: {
    keywords: ['trap', 'defense', 'workshop', 'castle', 'defend', 'shield'],
    response: `**Trap Workshop Note:**
Traps are no longer effective in the current meta. The Trap Workshop exists but traps don't really do anything meaningful anymore. Focus your resources on troop training, hero upgrades, and rally formations instead.`
  },
  rally: {
    keywords: ['rally', 'attack', 'formation', 'pvp', 'war'],
    response: `**Rally Strategies:**
- Scout with Watchtower before attacking
- vs Mixed Rally (442/992): Use INF formations
- vs Blast Rallies: Ranged wedge formation
- Use T3 frontline to prevent burns
- Coordinate timing with your alliance!`
  },
  alliance: {
    keywords: ['alliance', 'rol', 'join', 'discord', 'team'],
    response: `**Alliance ROL - Rebirth of Legends:**
- Drama-free zone with coordinated strikes
- Monthly alliance events (Stranger Things, Pokemon, etc.)
- Active community with strategy sharing
- Join Discord: [discord.gg/BX95Q38C](https://discord.gg/BX95Q38C)`
  },
  events: {
    keywords: ['event', 'calendar', 'weekly', 'ace', 'showdown', 'cycle'],
    response: `**Event Calendar:**
- Tracks Weekly, Ace, and Showdown cycles
- Real-time countdown timers for next events
- Plan your resources around upcoming events
- Check live tracker: [Event Calendar](/event-calendar/)`
  },
  beginner: {
    keywords: ['beginner', 'start', 'new', 'tip', 'advice', 'help', 'guide', 'how'],
    response: `**Beginner Commander Tips:**
1. Follow the main storyline for unlocks
2. Join an alliance ASAP (more rewards + protection)
3. Complete daily quests religiously
4. Don't neglect gem matching combos (prioritize enemy-weak elements)
5. Balance: Castle upgrades > Research > Troop training
Browse all guides from the homepage!`
  },
  tools: {
    keywords: ['tool', 'game', 'play', 'fun', 'mini', 'pocket', 'pokemon', 'hogwarts', 'stranger'],
    response: `**Alliance Mini-Games & Tools:**
- **Pocket Conquest**: RPG hero collector sim
- **Code Name: Hawkins**: Stranger Things S5 character assignment
- **Hogwarts Registry**: Official book of fates
- **Pokemon Registry**: Build your squad, become Gym Boss
- **Troop Calculator**: Battle simulation tool
Explore all from the homepage!`
  }
};

function getResponse(msg) {
  const m = msg.toLowerCase().trim();
  
  if (m.match(/^(hi|hello|hey|yo|sup|greetings)/)) {
    return `Commander reporting in. NoyzBot v3.0 at your service.

I can help with:
- **Troop** strategy & calculator
- **Military Expedition** tactics
- **Heroes** & lineup advice
- **BOS** (Battle of Saurnesia)
- **Talent Memory** builds
- **Rally** & trap strategies
- **Events** calendar
- **Alliance** info

What's your query, Commander?`;
  }
  
  if (m.match(/^(thank|thanks|thx|ty)/)) {
    return `Roger that, Commander. NoyzBot standing by for your next query. Good luck on the battlefield!`;
  }
  
  // Search knowledge base
  let bestMatch = null;
  let bestScore = 0;
  
  for (const [key, data] of Object.entries(KNOWLEDGE_BASE)) {
    let score = 0;
    for (const kw of data.keywords) {
      if (m.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = data;
    }
  }
  
  if (bestMatch && bestScore > 0) {
    return bestMatch.response;
  }
  
  return `Query acknowledged, Commander. I don't have specific intel on that topic yet.

Try asking about:
- **Military Expedition** strategy
- **Troop** training & calculator
- **Hero** lineups & tier list
- **BOS** (Battle of Saurnesia)
- **Talent Memory** builds
- **Rally** tactics
- **Trap** defense
- **Events** calendar

Or browse our guides from the navigation menu above.`;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Commander reporting in. NoyzBot v3.0 Online.\n\nAsk me about troops, heroes, events, military expedition, BOS, talents, or rally tactics.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { type: 'user', text }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const reply = getResponse(text);
      setMessages((prev) => [...prev, { type: 'bot', text: reply }]);
      setLoading(false);
    }, 400 + Math.random() * 400);
  };

  const renderMessage = (text) => {
    // Simple markdown-like rendering
    return text.split('\n').map((line, i) => {
      let processed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#fbbf24;text-decoration:underline">$1</a>');
      return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        data-testid="chatbot-toggle"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold py-3 px-4 rounded-lg shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all hover:-translate-y-0.5 animate-pulse-gold"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-robot'}`} />
        <span className="hidden sm:inline tracking-wide text-sm">NOYZBOT v3.0</span>
      </button>

      {/* Chat Window */}
      {open && (
        <div
          data-testid="chatbot-window"
          className="fixed bottom-20 right-4 left-4 sm:left-auto sm:w-96 h-[440px] glass-panel rounded-lg shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden animate-fade-in-up border border-[#fbbf24]/30"
        >
          {/* Header */}
          <div className="bg-[#0f172a] p-3 border-b border-[#1e293b] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-terminal text-[#fbbf24] text-xs" />
              <span
                className="text-[#fbbf24] font-bold text-sm tracking-wider"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                NOYZBOT v3.0
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            </div>
            <button
              data-testid="chatbot-close"
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[88%] p-3 rounded text-xs leading-relaxed animate-fade-in-up ${
                  msg.type === 'user'
                    ? 'bg-[#fbbf24] text-black ml-auto rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                    : 'bg-[#0f172a] text-gray-300 border border-[#1e293b] rounded-tr-lg rounded-br-lg rounded-bl-lg'
                }`}
                style={{ fontFamily: msg.type === 'user' ? 'inherit' : 'JetBrains Mono, monospace' }}
              >
                {msg.type === 'bot' && (
                  <span className="text-[#fbbf24] block text-[10px] mb-1.5 font-bold tracking-wider">SYSTEM:</span>
                )}
                {msg.type === 'bot' ? renderMessage(msg.text) : msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-[#0f172a] text-gray-300 border border-[#1e293b] rounded-tr-lg rounded-br-lg rounded-bl-lg max-w-[88%] p-3 text-xs animate-fade-in-up">
                <span className="text-[#fbbf24] block text-[10px] mb-1 font-bold">SYSTEM:</span>
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="p-3 bg-black/50 border-t border-[#1e293b] shrink-0">
            <div className="flex gap-2">
              <input
                data-testid="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about troops, heroes, events..."
                className="flex-1 bg-[#020617] text-white border border-[#1e293b] p-2.5 text-xs rounded focus:border-[#fbbf24] focus:ring-1 focus:ring-[#fbbf24]/30 outline-none transition-all min-w-0"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              />
              <button
                data-testid="chatbot-send"
                onClick={sendMessage}
                disabled={loading}
                className="bg-[#fbbf24] text-black px-3 rounded font-bold hover:bg-[#f59e0b] transition-colors disabled:opacity-50 shrink-0"
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
