'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Film, Sparkles, ChevronRight, Volume2, ShieldCheck, Video } from 'lucide-react';
import { Article } from '@/lib/types';

interface CustomVideoPlayerProps {
  videoUrl: string;
  title: string;
  posterImage?: string | null;
  suggestedVideos?: Article[];
}

export default function CustomVideoPlayer({
  videoUrl,
  title,
  posterImage,
  suggestedVideos = [],
}: CustomVideoPlayerProps) {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80';

  const formatRelativeTime = (dateStr?: string | null) => {
    if (!dateStr) return 'हाल ही में';
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'अभी-अभी';
    if (diffHours === 1) return '1 घंटा पहले';
    if (diffHours < 24) return `${diffHours} घंटे पहले`;
    return date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' });
  };

  const isFacebook = videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch');
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

  const getEmbedUrl = () => {
    if (isFacebook) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false&autoplay=false`;
    }
    if (isYouTube) {
      return videoUrl.replace('watch?v=', 'embed/');
    }
    return videoUrl;
  };

  return (
    <div className="mb-10 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
      {/* Player Header Bar - Portal Branded */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="text-white font-black text-xs tracking-wide flex items-center gap-1.5 uppercase">
            <Video className="w-3.5 h-3.5 text-red-500" />
            थार मीडिया प्लेयर
          </span>
          <span className="hidden sm:inline-block text-[11px] bg-red-950/80 text-red-300 font-bold px-2 py-0.5 rounded border border-red-800/60">
            THAR MEDIA • HD
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3 h-3" /> सत्यापित वीडियो
          </span>
          {suggestedVideos.length > 0 && (
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition font-medium cursor-pointer"
            >
              {showSuggestions ? 'सुझाव छुपाएं' : 'अन्य वीडियो देखें'}
            </button>
          )}
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {isFacebook || isYouTube ? (
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        ) : (
          <video
            controls
            src={videoUrl}
            poster={posterImage || fallbackImage}
            className="w-full h-full object-contain"
            playsInline
          />
        )}
      </div>

      {/* Player Bottom Info Strip */}
      <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2 truncate pr-2">
          <Film className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="truncate font-medium text-slate-200">{title}</span>
        </div>
        <span className="text-[11px] text-slate-400 shrink-0 font-medium">
          पोर्टल एक्सक्लूसिव
        </span>
      </div>

      {/* Portal's Own Video Suggestions Tray ("खिलाड़ी के अपने वीडियो सुझाव") */}
      {showSuggestions && suggestedVideos && suggestedVideos.length > 0 && (
        <div className="p-4 bg-slate-950 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-100">
                संबंधित वीडियो समाचार (Up Next)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              {suggestedVideos.length} वीडियो उपलब्ध
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {suggestedVideos.map((vid) => (
              <Link
                key={vid.id}
                href={`/news/${vid.slug}`}
                className="group flex gap-3 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="relative w-24 h-16 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  <img
                    src={vid.featured_image || fallbackImage}
                    alt={vid.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = fallbackImage;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition">
                    <div className="w-6 h-6 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-md">
                      <Play className="w-3 h-3 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-red-400 leading-snug line-clamp-2 transition-colors">
                    {vid.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                    <span className="text-red-400 font-bold">
                      {vid.category?.name_hi || 'वीडियो'}
                    </span>
                    <span>•</span>
                    <span>{formatRelativeTime(vid.published_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

