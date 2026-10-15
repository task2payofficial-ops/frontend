import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Vote, ArrowLeft, ShieldCheck, Share2 } from 'lucide-react';
import { getPollBySlug, getPolls } from '@/lib/api';
import PollWidget from '@/components/PollWidget';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPollBySlug(slug);

  if (!data?.poll) {
    return {
      title: 'जनमत सर्वेक्षण | थार मीडिया (Thar Media)',
    };
  }

  const poll = data.poll;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const pageUrl = `${siteUrl}/polls/${poll.slug}`;

  return {
    title: `${poll.title} | थार मीडिया जनमत`,
    description: poll.description || `थार मीडिया (Thar Media) जनमत सर्वेक्षण: "${poll.title}" पर अपना कीमती वोट दर्ज करें।`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `📊 जनमत सर्वेक्षण: ${poll.title}`,
      description: poll.description || 'थार मीडिया पर निष्पक्ष वोट दें और जनता का मूड जानें।',
      url: pageUrl,
      siteName: 'Thar Media (थार मीडिया)',
      type: 'website',
      images: [
        {
          url: poll.featured_image || `${siteUrl}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: poll.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: poll.title,
      description: 'थार मीडिया लाइव जनमत पोल - अपनी राय दें',
      creator: '@TharMedia',
    },
  };
}

export default async function SinglePollPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPollBySlug(slug);

  if (!data?.poll) {
    notFound();
  }

  const poll = data.poll;
  const otherPollsData = await getPolls(1);
  const otherPolls = (otherPollsData?.data || []).filter((p) => p.id !== poll.id).slice(0, 2);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/polls" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>सभी जनमत सर्वेक्षण देखें</span>
        </Link>
      </div>

      {/* Main Single Poll Container */}
      <div className="mb-12">
        <PollWidget initialPoll={poll} variant="standalone" showShare={true} />
      </div>

      {/* Trust & Transparency Note */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>100% निष्पक्ष मतदान:</strong> थार मीडिया किसी भी राजनीतिक दल या दबाव से मुक्त, स्वतंत्र डिजिटल सर्वेक्षण आयोजित करता है।
          </span>
        </div>
        <Link 
          href="/editorial-policy" 
          className="text-red-600 font-semibold hover:underline shrink-0"
        >
          संपादकीय नीति पढ़ें →
        </Link>
      </div>

      {/* Other Active Polls */}
      {otherPolls.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Vote className="w-5 h-5 text-red-600" />
            <span>अन्य प्रमुख सर्वेक्षण (Other Live Polls)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherPolls.map((op) => (
              <PollWidget key={op.id} initialPoll={op} variant="card" showShare={false} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

