import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getRajasthanNews, getLocations, getAdForPosition } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import AdBanner from '@/components/AdBanner';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'राजस्थान समाचार | Rajasthan Local News, Districts & Breaking Updates',
  description: 'बीकानेर, जयपुर, जोधपुर, कोटा, उदयपुर, जैसलमेर, बाड़मेर सहित पूरे राजस्थान की ताज़ा और प्रामाणिक खबरें।',
};

interface Props {
  searchParams: Promise<{ district?: string; page?: string }>;
}

export default async function RajasthanPage({ searchParams }: Props) {
  const { district = 'all', page: pageStr = '1' } = await searchParams;
  const currentPage = parseInt(pageStr, 10);

  const [newsData, locations, leaderboardAd, sidebarAd] = await Promise.all([
    getRajasthanNews(district, currentPage),
    getLocations(),
    getAdForPosition('header_leaderboard'),
    getAdForPosition('sidebar_top'),
  ]);

  const districtsList = [
    { slug: 'all', name_hi: 'सभी जिले (All Rajasthan)' },
    { slug: 'jaipur', name_hi: 'जयपुर' },
    { slug: 'bikaner', name_hi: 'बीकानेर' },
    { slug: 'jodhpur', name_hi: 'जोधपुर' },
    { slug: 'udaipur', name_hi: 'उदयपुर' },
    { slug: 'kota', name_hi: 'कोटा' },
    { slug: 'ajmer', name_hi: 'अजमेर' },
    { slug: 'jaisalmer', name_hi: 'जैसलमेर' },
    { slug: 'barmer', name_hi: 'बाड़मेर' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
          <MapPin className="w-4 h-4" /> राजस्थान महा-बुलेटिन
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          राजस्थान की धड़कन (Rajasthan News Hub)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
          रेगिस्तान की रेत से लेकर अरावली की वादियों तक, 50 जिलों की राजनीति, अपराध, प्रशासन, विकास, कला और संस्कृति का विश्वसनीय संगम।
        </p>

        {/* District Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 border-t border-slate-100 mt-5 scrollbar-none">
          {districtsList.map((d) => {
            const isActive = district.toLowerCase() === d.slug;
            return (
              <Link
                key={d.slug}
                href={`/rajasthan?district=${d.slug}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {d.name_hi}
              </Link>
            );
          })}
        </div>
      </div>

      <AdBanner ad={leaderboardAd} position="header_leaderboard" />

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {newsData?.data && newsData.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {newsData.data.map((art) => (
                <NewsCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">चयनित जिले के लिए समाचार संकलित किए जा रहे हैं।</p>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <AdBanner ad={sidebarAd} position="sidebar_top" />
        </aside>
      </div>
    </main>
  );
}

