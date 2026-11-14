import React from 'react';
import Link from 'next/link';
import { getHomepageData } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import AdBanner from '@/components/AdBanner';
import RajasthanHub from '@/components/RajasthanHub';
import SafeImage from '@/components/SafeImage';
import PollWidget from '@/components/PollWidget';
import { Flame, Sparkles, TrendingUp, ChevronRight, PlayCircle, Image as ImageIcon } from 'lucide-react';

export default async function HomePage() {
  const data = await getHomepageData();

  const heroMain = data?.hero?.main;
  const heroSub = data?.hero?.sub || [];
  const trending = data?.trending || [];
  const sections = data?.sections || [];
  const rajasthanLocal = data?.rajasthan_local || {};
  const featuredPoll = data?.featured_poll;
  const ads = data?.ads || {};

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* 1. TOP HEADER LEADERBOARD AD */}
      <AdBanner ad={ads['header_leaderboard']} position="header_leaderboard" />

      {/* 2. HERO NEWS GRID (Top Story + 4 Sub-Stories) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Lead Story (7 cols) */}
        <div className="lg:col-span-7 xl:col-span-8">
          {heroMain ? (
            <NewsCard article={heroMain} variant="hero" />
          ) : (
            <div className="h-96 rounded-2xl bg-slate-200 animate-pulse flex items-center justify-center text-slate-400">
              समाचार लोड हो रहा है...
            </div>
          )}
        </div>

        {/* 4 Sub-featured Stories Grid (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {heroSub.slice(0, 3).map((art) => (
            <NewsCard key={art.id} article={art} variant="horizontal" />
          ))}
        </div>
      </section>

      {/* 3. RAJASTHAN DISTRICT LOCAL NEWS HUB (Jaipur, Bikaner, Jodhpur, etc.) */}
      <RajasthanHub initialStoriesByDistrict={rajasthanLocal} />

      {/* 4. MID-PAGE DYNAMIC SECTIONS & TRENDING SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column: Dynamic Admin Configured Sections (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {sections.map((section, idx) => (
            <div key={section.id} className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center justify-between border-b-2 border-red-600 pb-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  <span>{section.title_hi}</span>
                </h3>
                {section.category && (
                  <Link
                    href={`/category/${section.category.slug}`}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group"
                  >
                    <span>और देखें</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>

              {/* Section Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {section.stories.map((story) => (
                  <NewsCard key={story.id} article={story} variant="standard" />
                ))}
              </div>

              {/* In-feed ad between sections */}
              {idx === 1 && (
                <AdBanner ad={ads['between_sections']} position="between_sections" />
              )}
            </div>
          ))}

          {/* Multimedia & Video News Spotlight */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-black tracking-tight">वीडियो एवं विजुअल बुलेटिन</h3>
              </div>
              <Link href="/gallery" className="text-xs text-amber-400 hover:underline">
                पूरी गैलरी देखें →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {heroSub.slice(0, 3).map((art) => (
                <div key={art.id} className="group relative rounded-xl overflow-hidden bg-slate-800">
                  <div className="aspect-16/10 relative">
                    <SafeImage
                      src={art.featured_image || ''}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                        <PlayCircle className="w-6 h-6 fill-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <Link href={`/news/${art.slug}`}>
                      <h4 className="text-xs font-bold text-white line-clamp-2 hover:text-red-400 transition">
                        {art.title}
                      </h4>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Trending, Weather, & Sidebar Ads (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Sidebar Top Ad */}
          <AdBanner ad={ads['sidebar_top']} position="sidebar_top" />

          {/* Featured Live Poll Widget */}
          {featuredPoll && (
            <PollWidget initialPoll={featuredPoll} variant="card" showShare={true} />
          )}

          {/* Trending & Most Read Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <Flame className="w-5 h-5 text-red-600 fill-red-600" />
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                सबसे ज्यादा पढ़ी गई खबरें (Trending)
              </h3>
            </div>

            <div className="space-y-3.5">
              {trending.map((art, index) => (
                <div key={art.id} className="flex items-start gap-3 group">
                  <span className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-red-600 group-hover:text-white transition text-xs font-black text-slate-500 flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/news/${art.slug}`}>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug group-hover:text-red-600 transition line-clamp-2">
                        {art.title}
                      </h4>
                    </Link>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>{art.category?.name_hi || 'समाचार'}</span>
                      <span>•</span>
                      <span>{art.view_count || 100}+ बार पढ़ा गया</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Trust Badge */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-red-500/5 to-transparent border border-amber-200/60">
            <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>प्रमाणित एवं निष्पक्ष पत्रकारिता</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              अपना बीकानेर (Apna Bikaner) की हर रिपोर्ट वरिष्ठ संपादकीय टीम द्वारा फैक्ट-चेक की जाती है। यदि आपको किसी समाचार में सुधार की आवश्यकता लगे, तो कृपया हमारी <Link href="/corrections-policy" className="text-red-600 underline font-semibold">सुधार नीति</Link> के अंतर्गत संपर्क करें।
            </p>
          </div>

          {/* Sidebar Bottom Ad */}
          <AdBanner ad={ads['sidebar_bottom']} position="sidebar_bottom" />
        </aside>
      </div>

      {/* 5. FOOTER BANNER AD */}
      <AdBanner ad={ads['footer_banner']} position="footer_banner" />
    </main>
  );
}
