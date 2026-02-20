import React, { useEffect, useRef } from 'react';

export default function MonetizationBanner({ type = 'infeed' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Monetag Smart Banner - loads dynamically
    if (type === 'top' || type === 'infeed') {
      try {
        // Push AdSense ads if available
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        // AdSense not loaded, that's fine - we have fallbacks
      }
    }
  }, [type]);

  const heightMap = {
    top: 'min-h-[90px]',
    infeed: 'min-h-[100px]',
    sidebar: 'min-h-[250px]',
    footer: 'min-h-[90px]',
  };

  return (
    <div
      ref={containerRef}
      data-testid={`monetization-${type}`}
      className={`ad-container w-full rounded-lg bg-[#0a0f1a] flex items-center justify-center overflow-hidden ${
        type === 'top' ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4' : ''
      } ${heightMap[type] || heightMap.infeed}`}
    >
      {/* AdSense responsive unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-1115056295957658"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
