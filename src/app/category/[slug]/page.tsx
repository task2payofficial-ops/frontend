import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getAdForPosition } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import AdBanner from '@/components/AdBanner';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryBySlug(slug);

  if (!data?.category) {
    return { title: 'श्रेणी नहीं मिली' };
  }

  const cat = data.category;
  return {
    title: cat.meta_title || `${cat.name_hi} समाचार | राजस्थान समाचार`,
    description: cat.meta_description || `${cat.name_hi} से जुड़ी ताज़ा और प्रामाणिक खबरें।`,
    alternates: {
      canonical: `/category/${cat.slug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const currentPage = parseInt(pageStr || '1', 10);

  const data = await getCategoryBySlug(slug, currentPage);

  if (!data?.category) {
    notFound();
  }

  const { category, articles } = data;
  const leaderboardAd = await getAdForPosition('header_leaderboard');
  const sidebarAd = await getAdForPosition('sidebar_top');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-red-600">होम</Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">{category.name_hi}</span>
      </nav>

      {/* Category Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span>{category.name_hi}</span>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              {category.name_en}
            </span>
          </h1>
          {category.description && (
            <p className="text-xs text-slate-600 mt-1.5">{category.description}</p>
          )}
        </div>

        {/* Subcategories if any */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${sub.slug}`}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-700 font-medium transition"
              >
                {sub.name_hi}
              </Link>
            ))}
          </div>
        )}
      </div>

      <AdBanner ad={leaderboardAd} position="header_leaderboard" />

      {/* Main Grid & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Article Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {articles.data && articles.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {articles.data.map((art) => (
                <NewsCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">इस श्रेणी में अभी कोई समाचार उपलब्ध नहीं है।</p>
            </div>
          )}

          {/* Pagination */}
          {articles.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {currentPage > 1 && (
                <Link
                  href={`/category/${category.slug}?page=${currentPage - 1}`}
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
                  href={`/category/${category.slug}?page=${currentPage + 1}`}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  अगला →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <AdBanner ad={sidebarAd} position="sidebar_top" />

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 tracking-tight pb-3 mb-3 border-b border-slate-100">
              संबंधित अन्य श्रेणियां
            </h3>
            <div className="flex flex-col space-y-2 text-xs">
              <Link href="/category/rajasthan" className="hover:text-red-600 py-1 border-b border-slate-50 flex justify-between">
                <span>राजस्थान समाचार</span> <span>→</span>
              </Link>
              <Link href="/category/politics" className="hover:text-red-600 py-1 border-b border-slate-50 flex justify-between">
                <span>राजनीति व सियासत</span> <span>→</span>
              </Link>
              <Link href="/category/agriculture" className="hover:text-red-600 py-1 border-b border-slate-50 flex justify-between">
                <span>कृषि व मौसम</span> <span>→</span>
              </Link>
              <Link href="/category/jobs-education" className="hover:text-red-600 py-1 border-b border-slate-50 flex justify-between">
                <span>शिक्षा एवं REET</span> <span>→</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

