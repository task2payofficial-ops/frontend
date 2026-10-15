import React from 'react';
import { Metadata } from 'next';
import { getTrendingNews } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import { Flame } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ट्रेंडिंग समाचार | Trending News in Rajasthan',
  description: 'राजस्थान और देश की सबसे ज्यादा पढ़ी जाने वाली और वायरल खबरें।',
};

export default async function TrendingPage() {
  const articles = await getTrendingNews();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-red-100 text-red-600">
          <Flame className="w-8 h-8 fill-red-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ट्रेंडिंग खबरें (Trending & Most Read)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            इस समय पाठकों द्वारा सबसे ज्यादा पढ़ी और साझा की जा रही खबरें
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art, idx) => (
          <div key={art.id} className="relative">
            <div className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-md">
              #{idx + 1}
            </div>
            <NewsCard article={art} variant="standard" />
          </div>
        ))}
      </div>
    </main>
  );
}

