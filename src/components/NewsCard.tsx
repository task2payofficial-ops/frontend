'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, User, Flame, Sparkles, Play } from 'lucide-react';
import { Article } from '@/lib/types';

interface NewsCardProps {
  article: Article;
  variant?: 'standard' | 'compact' | 'hero' | 'minimal' | 'horizontal';
  showSummary?: boolean;
}

export default function NewsCard({
  article,
  variant = 'standard',
  showSummary = true,
}: NewsCardProps) {
  const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80';

  // Format relative or date time
  const formatTime = (dateStr?: string | null) => {
    if (!dateStr) return 'कुछ समय पूर्व';
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'अभी-अभी';
    if (diffHours === 1) return '1 घंटा पहले';
    if (diffHours < 24) return `${diffHours} घंटे पहले`;
    return date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' });
  };

  const imageSrc = article.featured_image || fallbackImage;
  const categoryName = article.category?.name_hi || 'राजस्थान';
  const locationName = article.district || article.location?.name_hi;

  // 1. HERO VARIANT
  if (variant === 'hero') {
    return (
      <div className="relative group overflow-hidden rounded-2xl bg-slate-900 shadow-xl aspect-16/10 md:aspect-16/9">
        <img
          src={imageSrc}
          alt={article.image_alt || article.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackImage;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-5 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow-xs">
              {categoryName}
            </span>
            {locationName && (
              <span className="bg-slate-800/80 backdrop-blur-xs text-amber-300 font-medium text-xs px-2.5 py-1 rounded-md flex items-center gap-1 border border-slate-700">
                <MapPin className="w-3 h-3" /> {locationName}
              </span>
            )}
            {article.is_video_story && (
              <span className="bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                <Play className="w-3 h-3 fill-white" /> वीडियो
              </span>
            )}
            {article.is_breaking && (
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                <Flame className="w-3 h-3 fill-slate-950" /> बड़ी खबर
              </span>
            )}
          </div>

          <Link href={`/news/${article.slug}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight hover:text-red-300 transition-colors line-clamp-3">
              {article.title}
            </h2>
          </Link>

          {showSummary && article.summary && (
            <p className="hidden sm:block text-slate-200 text-sm mt-2 line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-300 mt-4 pt-3 border-t border-white/10">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {formatTime(article.published_at)}
            </span>
            {article.author && (
              <span className="hidden sm:flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> {article.author.name}
              </span>
            )}
            {article.is_ai_generated && (
              <span className="flex items-center gap-1 text-[11px] text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded-full border border-blue-700/50">
                <Sparkles className="w-3 h-3" /> AI सहाय्यित
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. COMPACT / HORIZONTAL VARIANT (Ideal for Sidebars and Lists)
  if (variant === 'compact' || variant === 'horizontal') {
    return (
      <div className="group flex gap-3 p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
        <div className="relative w-24 sm:w-28 h-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <img
            src={imageSrc}
            alt={article.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackImage;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] mb-1">
              <span className="text-red-700 font-bold">{categoryName}</span>
              {article.is_video_story && (
                <span className="text-red-600 font-bold flex items-center gap-0.5">
                  <Play className="w-2.5 h-2.5 fill-red-600" /> वीडियो
                </span>
              )}
              {locationName && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 text-slate-400" /> {locationName}
                  </span>
                </>
              )}
            </div>

            <Link href={`/news/${article.slug}`}>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                {article.title}
              </h4>
            </Link>
          </div>

          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {formatTime(article.published_at)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. MINIMAL VARIANT
  if (variant === 'minimal') {
    return (
      <div className="py-2.5 border-b border-slate-100 group">
        <Link href={`/news/${article.slug}`}>
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
            {article.title}
          </h4>
        </Link>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
          <span className="text-red-600 font-semibold">{categoryName}</span>
          {article.is_video_story && (
            <span className="text-red-600 font-bold flex items-center gap-0.5">
              <Play className="w-2.5 h-2.5 fill-red-600" /> वीडियो
            </span>
          )}
          <span>•</span>
          <span>{formatTime(article.published_at)}</span>
        </div>
      </div>
    );
  }

  // 4. STANDARD VERTICAL CARD VARIANT
  return (
    <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Cover Image */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
          <img
            src={imageSrc}
            alt={article.image_alt || article.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackImage;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="bg-red-600 text-white font-bold text-[11px] px-2 py-0.5 rounded shadow-xs">
              {categoryName}
            </span>
            {article.is_video_story && (
              <span className="bg-red-700/90 text-white font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                <Play className="w-2.5 h-2.5 fill-white" /> वीडियो
              </span>
            )}
            {locationName && (
              <span className="bg-slate-900/80 backdrop-blur-xs text-white font-medium text-[11px] px-2 py-0.5 rounded flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5 text-amber-400" /> {locationName}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <Link href={`/news/${article.slug}`}>
            <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
              {article.title}
            </h3>
          </Link>

          {showSummary && article.summary && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
              {article.summary}
            </p>
          )}
        </div>
      </div>

      {/* Meta info footer */}
      <div className="px-4 pb-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" /> {formatTime(article.published_at)}
        </span>
        <span className="text-slate-500 font-medium">
          {article.read_time_minutes || 2} मिनट पाठ
        </span>
      </div>
    </article>
  );
}

