import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocationBySlug, getWeather, getAdForPosition } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import AdBanner from '@/components/AdBanner';
import { MapPin, CloudSun } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getLocationBySlug(slug);

  if (!data?.location) {
    return { title: 'स्थान नहीं मिला' };
  }

  const loc = data.location;
  return {
    title: `${loc.name_hi} समाचार | ${loc.name_en} District News in Hindi`,
    description: `${loc.name_hi} जिले की ताज़ा, प्रामाणिक और विस्तृत खबरें। अपराध, विकास, राजनीति और स्थानीय हलचल।`,
    alternates: {
      canonical: `/location/${loc.slug}`,
    },
  };
}

export default async function LocationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const currentPage = parseInt(pageStr || '1', 10);

  const data = await getLocationBySlug(slug, currentPage);

  if (!data?.location) {
    notFound();
  }

  const { location, articles } = data;
  const weather = await getWeather(location.name_en);
  const sidebarAd = await getAdForPosition('sidebar_top');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-red-600">होम</Link>
        <span>/</span>
        <Link href="/rajasthan" className="hover:text-red-600">राजस्थान</Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">{location.name_hi}</span>
      </nav>

      {/* Location Banner Header */}
      <div className="bg-gradient-to-r from-red-800 to-amber-700 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" /> राजस्थान जिला बुलेटिन
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {location.name_hi} ({location.name_en})
          </h1>
          <p className="text-xs sm:text-sm text-red-100 mt-2 max-w-xl">
            {location.name_hi} और आसपास के ग्रामीण क्षेत्रों की सभी ताज़ा खबरें, प्रशासनिक आदेश और जमीनी रिपोर्ट।
          </p>
        </div>

        {weather && (
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 self-start md:self-auto flex items-center gap-3">
            <CloudSun className="w-8 h-8 text-amber-300" />
            <div>
              <div className="text-xl font-black">{weather.temp}°C</div>
              <div className="text-xs text-red-100">{weather.condition}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {articles.data && articles.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {articles.data.map((art) => (
                <NewsCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">इस जिले के लिए अभी कोई विशेष रिपोर्ट उपलब्ध नहीं है।</p>
            </div>
          )}

          {/* Pagination */}
          {articles.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {currentPage > 1 && (
                <Link
                  href={`/location/${location.slug}?page=${currentPage - 1}`}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  ← पिछला
                </Link>
              )}
              <span className="text-xs text-slate-500 font-semibold px-3">
                पृष्ठ {articles.current_page} / {articles.last_page}
              </span>
              {currentPage < articles.last_page && (
                <Link
                  href={`/location/${location.slug}?page=${currentPage + 1}`}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  अगला →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <AdBanner ad={sidebarAd} position="sidebar_top" />

          {/* Other Districts Quick Switcher */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 tracking-tight pb-3 mb-3 border-b border-slate-100">
              अन्य प्रमुख जिले
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Jaipur', 'Bikaner', 'Jodhpur', 'Kota', 'Udaipur', 'Ajmer', 'Jaisalmer', 'Barmer'].map((c) => (
                <Link
                  key={c}
                  href={`/location/${c.toLowerCase()}`}
                  className={`p-2 rounded font-medium text-center transition ${c.toLowerCase() === location.slug ? 'bg-red-600 text-white font-bold' : 'bg-slate-50 hover:bg-red-50 text-slate-700'}`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

