import React from 'react';

const AD_CONFIGS = {
  leaderboard: { minHeight: '90px', maxHeight: '100px', label: 'SPONSORED INTEL' },
  infeed: { minHeight: '100px', maxHeight: '120px', label: 'SPONSORED INTEL' },
  sidebar: { minHeight: '250px', maxHeight: '280px', label: 'SPONSORED INTEL' },
  footer: { minHeight: '90px', maxHeight: '100px', label: 'SPONSORED INTEL' },
};

export default function AdSlot({ type = 'infeed', className = '' }) {
  const config = AD_CONFIGS[type] || AD_CONFIGS.infeed;

  return (
    <div
      data-testid={`ad-slot-${type}`}
      className={`ad-container w-full rounded-lg bg-black/30 flex items-center justify-center ${className}`}
      style={{ minHeight: config.minHeight, maxHeight: config.maxHeight }}
    >
      {/* Google AdSense responsive ad unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-1115056295957658"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
