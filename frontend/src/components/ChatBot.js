import React, { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = "You are NoyzBot v3.0, an elite tactical AI for 'Puzzles and Conquest'. You speak in a concise, military style. Provide strategy on troops, heroes, and events. Keep responses short (under 100 words) and tactical.";

function fallbackResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('hello') || m.includes('hi') || m.includes('hey'))
    return "Greetings, Commander. NoyzBot v3.0 online. State your tactical query — troops, heroes, events, or strategy.";
  if (m.includes('military') || m.includes('expedition'))
    return "Military Expedition intel: Focus on occupation points > kill points. Keep infirmary under capacity. Use Fast Comeback wisely. Check our Military Expedition Guide for full breakdown.";
  if (m.includes('troop') || m.includes('calculator'))
    return "Troop optimization requires precise resource allocation. Use our Troop Calculator for real-time analysis. T9+ troops recommended for competitive play.";
  if (m.includes('talent') || m.includes('memory'))
    return "Talent Memory sets: Balance (VIP 10 default), Attack (rallies/PvP), Production (resource gathering). Our guide covers optimal configs for each scenario.";
  if (m.includes('bos') || m.includes('battle') || m.includes('saurnesia'))
    return "BOS strategy: Secure wonders early. Dragon Cub Escort for bonus points. Coordinate alliance attacks. Check our BOS Guide for scoring details.";
  if (m.includes('alliance') || m.includes('rol'))
    return "Alliance ROL — Rebirth of Legends. Drama-free, coordinated strikes, monthly events. Join via Discord: discord.gg/BX95Q38C";
  if (m.includes('guide'))
    return "Available guides: Military Expedition, Troop Strength, Talent Memory, Battle of Saurnesia. Access them from the Database section on the homepage.";
  return "Query acknowledged. For detailed strategy, explore our guides using the navigation above. State a specific topic — troops, heroes, events, or battle tactics.";
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Greetings Commander. NoyzBot v3.0 Online. Ready for strategy queries.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { type: 'user', text }]);
    setInput('');
    setLoading(true);

    // Use fallback responses (no API key needed - free!)
    setTimeout(() => {
      const reply = fallbackResponse(text);
      setMessages((prev) => [...prev, { type: 'bot', text: reply }]);
      setLoading(false);
    }, 600);
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
        <span className="hidden md:inline tracking-wide">NOYZBOT v3.0</span>
      </button>

      {/* Chat Window */}
      {open && (
        <div
          data-testid="chatbot-window"
          className="fixed bottom-20 right-6 w-80 md:w-96 h-[440px] glass-panel rounded-lg shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden animate-fade-in-up border-[#fbbf24]/30"
        >
          {/* Header */}
          <div className="bg-[#0f172a] p-3 border-b border-[#1e293b] flex justify-between items-center">
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
                className={`max-w-[88%] p-3 rounded text-xs animate-fade-in-up ${
                  msg.type === 'user'
                    ? 'bg-[#fbbf24] text-black ml-auto rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                    : 'bg-[#0f172a] text-gray-300 border border-[#1e293b] rounded-tr-lg rounded-br-lg rounded-bl-lg'
                }`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {msg.type === 'bot' && (
                  <span className="text-[#fbbf24] block text-[10px] mb-1 font-bold">SYSTEM:</span>
                )}
                {msg.text}
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
          <div className="p-3 bg-black/50 border-t border-[#1e293b]">
            <div className="flex gap-2">
              <input
                data-testid="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about troops, events..."
                className="flex-1 bg-[#020617] text-white border border-[#1e293b] p-2.5 text-xs rounded focus:border-[#fbbf24] focus:ring-1 focus:ring-[#fbbf24]/30 outline-none transition-all"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              />
              <button
                data-testid="chatbot-send"
                onClick={sendMessage}
                disabled={loading}
                className="bg-[#fbbf24] text-black px-3 rounded font-bold hover:bg-[#f59e0b] transition-colors disabled:opacity-50"
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
