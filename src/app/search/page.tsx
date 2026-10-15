import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { searchNews } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import { Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'समाचार खोज | Search News',
  robots: {
    index: false, // Prevent thin/internal search pages from being indexed per SEO best practices
    follow: true,
  },
};

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page: pageStr = '1' } = await searchParams;
  const currentPage = parseInt(pageStr, 10);

  const results = q ? await searchNews(q, currentPage) : null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Search Header & Input */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
          <Search className="w-6 h-6 text-red-600" />
          <span>समाचार खोज परिणाम</span>
        </h1>

        <form action="/search" method="GET" className="flex gap-2 max-w-xl">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="कीवर्ड, नेता, जिला या विषय दर्ज करें..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition"
          >
            खोजें
          </button>
        </form>

        {q && (
          <p className="text-xs text-slate-500 mt-3">
            &ldquo;<strong>{q}</strong>&rdquo; के लिए <strong>{results?.total || 0}</strong> परिणाम मिले
          </p>
        )}
      </div>

      {/* Results Grid */}
      {results?.data && results.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.data.map((art) => (
            <NewsCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-600 font-semibold">कोई समाचार नहीं मिला।</p>
          <p className="text-xs text-slate-400 mt-1">कृपया अन्य शब्द या जिले के नाम से प्रयास करें।</p>
        </div>
      )}
    </main>
  );
}

