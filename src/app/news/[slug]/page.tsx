import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAdForPosition, getFeaturedPoll } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import AdBanner from '@/components/AdBanner';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import SafeImage from '@/components/SafeImage';
import PollWidget from '@/components/PollWidget';
import { 
  Clock, 
  MapPin, 
  User, 
  Share2, 
  Bookmark, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Play
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArticleBySlug(slug);

  if (!data?.article) {
    return {
      title: 'समाचार नहीं मिला',
    };
  }

  const art = data.article;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = art.canonical_url || `${siteUrl}/news/${art.slug}`;

  return {
    title: art.meta_title || art.title,
    description: art.meta_description || art.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: art.og_title || art.title,
      description: art.og_description || art.summary,
      url: `${siteUrl}/news/${art.slug}`,
      siteName: 'Apna Bikaner',
      type: 'article',
      publishedTime: art.published_at || art.created_at,
      modifiedTime: art.updated_at,
      authors: [art.author?.name || art.reporter_name || 'अपना बीकानेर विशेष संवाददाता'],
      images: [
        {
          url: art.og_image || art.featured_image || `${siteUrl}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: art.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: art.title,
      description: art.summary,
      images: [art.featured_image || `${siteUrl}/og-default.jpg`],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getArticleBySlug(slug);

  if (!data?.article) {
    notFound();
  }

  const { article, related, suggested_videos, schema_json_ld } = data;
  const [inArticleAd, sidebarAd, pollRes] = await Promise.all([
    getAdForPosition('in_article'),
    getAdForPosition('sidebar_top'),
    getFeaturedPoll(),
  ]);
  const featuredPoll = pollRes?.poll || null;

  const pubDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'हाल ही में';

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/news/${article.slug}`;

  return (
    <>
      {/* Schema.org NewsArticle JSON-LD */}
      {schema_json_ld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema_json_ld) }}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600">होम</Link>
          <span>/</span>
          {article.category && (
            <>
              <Link href={`/category/${article.category.slug}`} className="hover:text-red-600">
                {article.category.name_hi}
              </Link>
              <span>/</span>
            </>
          )}
          {article.district && (
            <>
              <Link href={`/location/${article.district.toLowerCase()}`} className="hover:text-red-600">
                {article.district}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-700 truncate max-w-xs">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Column (8 cols) */}
          <article className="lg:col-span-8 bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            {/* Badges & Category */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded">
                {article.category?.name_hi || 'राजस्थान समाचार'}
              </span>
              {article.district && (
                <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-2.5 py-1 rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-600" /> {article.district}
                </span>
              )}
              {article.is_breaking && (
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-2.5 py-1 rounded animate-pulse">
                  ⚡ बड़ी खबर
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-4">
              {article.title}
            </h1>

            {/* Short Headline / Subtitle */}
            {article.short_headline && (
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-6 border-l-4 border-red-500 pl-4 py-1 bg-red-50/40 rounded-r">
                {article.short_headline}
              </p>
            )}

            {/* Author, Date & Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 mb-6 border-y border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <SafeImage
                    src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80'}
                    alt={article.author?.name || 'Reporter'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    {article.author?.name || article.reporter_name || 'विशेष संवाददाता'}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {pubDate}
                    </span>
                    <span>•</span>
                    <span>{article.read_time_minutes || 2} मिनट पाठ</span>
                  </div>
                </div>
              </div>

              {/* Social Sharing Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-xs flex items-center gap-1 transition"
                >
                  व्हाट्सएप पर शेयर
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold text-xs transition"
                >
                  X पर शेयर
                </a>
              </div>
            </div>

            {/* Custom Portal Video Player with Suggestions */}
            {article.video_url && (
              <CustomVideoPlayer
                videoUrl={article.video_url}
                title={article.title}
                posterImage={article.featured_image}
                suggestedVideos={suggested_videos || []}
              />
            )}

            {/* Featured Image & Caption (if not video or if image exists without video) */}
            {!article.video_url && article.featured_image && (
              <figure className="mb-8">
                <div className="rounded-xl overflow-hidden bg-slate-100 aspect-16/10">
                  <SafeImage
                    src={article.featured_image}
                    alt={article.image_alt || article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {article.image_caption && (
                  <figcaption className="text-xs text-slate-500 mt-2 italic px-1">
                    📷 {article.image_caption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* AI Generation & Verification Badges */}
            {article.is_ai_generated && (
              <div className="mb-6 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>एआई-असिस्टेड संपादन:</strong> यह रिपोर्ट आधिकारिक डेटा स्रोतों से संकलित एवं फैक्ट-चेक की गई है।
                  </span>
                </div>
                {article.editorial_verification_status === 'verified' && (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold bg-white px-2 py-0.5 rounded shadow-2xs">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> सत्यापित
                  </span>
                )}
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-base sm:text-lg mb-8"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* In-Article Monetization Unit */}
            <AdBanner ad={inArticleAd} position="in_article" />

            {/* Editorial Correction Note */}
            {article.correction_notes && (
              <div className="my-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <h4 className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> संपादकीय सुधार नोट (Correction Note):
                </h4>
                <p>{article.correction_notes}</p>
              </div>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500">संबंधित विषय (Tags):</span>
                {article.tags.map((t) => (
                  <Link
                    key={t.id}
                    href={`/search?q=${encodeURIComponent(t.name_hi)}`}
                    className="text-xs bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 px-3 py-1 rounded-full transition font-medium"
                  >
                    #{t.name_hi}
                  </Link>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar Column: Related Stories & Ads (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Sidebar Top Ad */}
            <AdBanner ad={sidebarAd} position="sidebar_top" />

            {/* Related Stories */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h3 className="text-base font-black text-slate-900 tracking-tight pb-3 mb-4 border-b border-slate-100">
                इस विषय पर और खबरें (Related News)
              </h3>

              <div className="space-y-4">
                {related && related.length > 0 ? (
                  related.map((rel) => (
                    <NewsCard key={rel.id} article={rel} variant="compact" />
                  ))
                ) : (
                  <p className="text-xs text-slate-400">कोई अन्य संबंधित समाचार उपलब्ध नहीं है।</p>
                )}
              </div>
            </div>

            {/* Featured Poll Widget */}
            {featuredPoll && (
              <PollWidget initialPoll={featuredPoll} />
            )}

            {/* Local District Bulletin */}
            {article.district && (
              <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200">
                <h4 className="text-sm font-bold text-red-900 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>{article.district} जिला बुलेटिन</span>
                </h4>
                <p className="text-xs text-red-800 leading-relaxed mb-3">
                  {article.district} जिले की ताज़ा हलचल और सरकारी घोषणाओं की जानकारी पाएं।
                </p>
                <Link
                  href={`/location/${article.district.toLowerCase()}`}
                  className="inline-block px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition"
                >
                  {article.district} की अन्य खबरें पढ़ें →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}

