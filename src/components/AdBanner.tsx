'use client';

import React from 'react';
import { Advertisement } from '@/lib/types';
import { trackAdClick } from '@/lib/api';

interface AdBannerProps {
  ad?: Advertisement | null;
  position: 'header_leaderboard' | 'sidebar_top' | 'sidebar_bottom' | 'in_article' | 'between_sections' | 'footer_banner';
  fallbackText?: string;
}

export default function AdBanner({ ad, position, fallbackText }: AdBannerProps) {
  const handleClick = async () => {
    if (!ad) return;
    const dest = await trackAdClick(ad.id);
    if (dest || ad.destination_url) {
      window.open(dest || ad.destination_url || '#', '_blank', 'noopener,noreferrer');
    }
  };

  // Google AdSense Unit
  if (ad && ad.ad_type === 'google_adsense') {
    return (
      <div className="w-full my-4 flex flex-col items-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">विज्ञापन (Advertisement)</span>
        <div className="w-full max-w-3xl p-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center text-xs text-slate-500">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={ad.adsense_client_id || 'ca-pub-default'}
            data-ad-slot={ad.adsense_slot_id || '1234567890'}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <div className="py-2 text-[11px] text-slate-400">
            Google AdSense Unit ({position}) • Slot: {ad.adsense_slot_id || 'Active'}
          </div>
        </div>
      </div>
    );
  }

  // Custom Banner Ad
  if (ad && ad.ad_type === 'custom_banner' && ad.image_url) {
    const isLeaderboard = position === 'header_leaderboard' || position === 'footer_banner';

    return (
      <div className="w-full my-4 flex flex-col items-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">प्रायोजित (Sponsored)</span>
        <div
          onClick={handleClick}
          className={`cursor-pointer overflow-hidden rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition group ${isLeaderboard ? 'max-w-4xl w-full max-h-28' : 'w-full'}`}
        >
          <img
            src={ad.image_url}
            alt={ad.title}
            className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      </div>
    );
  }

  // Graceful Fallback Placeholder if no active ad
  return (
    <div className="w-full my-3 flex flex-col items-center">
      <div className="w-full py-3 px-4 rounded-lg bg-slate-50/70 border border-dashed border-slate-200 text-center text-xs text-slate-400 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-slate-400">विज्ञापन स्पेस उपलब्ध</span>
        <span>{fallbackText || 'अपने ब्रांड का प्रचार अपना बीकानेर (Apna Bikaner) पर करें'}</span>
        <a href="/advertise" className="text-red-600 font-semibold hover:underline">संपर्क करें →</a>
      </div>
    </div>
  );
}

