import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import AllianceBanner from './components/AllianceBanner';
import AdSlot from './components/AdSlot';
import GuidesSection from './components/GuidesSection';
import ToolsSection from './components/ToolsSection';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="noise-overlay flex flex-col min-h-screen">
      <Helmet>
        <title>NoYzzing OPS - Puzzles & Conquest Strategy Command Center</title>
        <meta name="description" content="Master Puzzles and Conquest with expert guides, troop calculators, and AI-powered strategies. Get military expedition tips, talent builds, and battle tactics." />
      </Helmet>

      <Header />

      <AdSlot type="leaderboard" className="mt-6" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4 space-y-10">
            <Hero />
            <AllianceBanner />
            <AdSlot type="infeed" />
            <GuidesSection />
            <AdSlot type="infeed" />
            <ToolsSection />
          </div>
          <aside className="w-full lg:w-1/4 space-y-8">
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}

export default App;
