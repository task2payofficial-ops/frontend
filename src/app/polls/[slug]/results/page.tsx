import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  ArrowLeft, 
  ShieldCheck, 
  Share2, 
  Vote, 
  Clock, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Copy,
  ExternalLink
} from 'lucide-react';
import { getPollBySlug, getPolls } from '@/lib/api';
import PollResultsGraph from '@/components/PollResultsGraph';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPollBySlug(slug);

  if (!data?.poll) {
    return {
      title: 'जनमत परिणाम | अपना बीकानेर (Apna Bikaner)',
    };
  }

  const poll = data.poll;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const pageUrl = `${siteUrl}/polls/${poll.slug}/results`;

  return {
    title: `📊 परिणाम ग्राफ: ${poll.title} | अपना बीकानेर जनमत`,
    description: `अपना बीकानेर (Apna Bikaner) लाइव जनमत सर्वेक्षण परिणाम: "${poll.title}" पर जनता का मूड और प्रतिशत जानें।`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `📊 लाइव जनमत परिणाम: ${poll.title}`,
      description: `कुल मत: ${poll.total_votes} | अपना बीकानेर डिजिटल जनमत के ताज़ा आंकड़े और परिणाम ग्राफ देखें।`,
      url: pageUrl,
      siteName: 'अपना बीकानेर (Apna Bikaner)',
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
      title: `📊 परिणाम ग्राफ: ${poll.title}`,
      description: 'अपना बीकानेर लाइव जनमत परिणाम ग्राफ - जनता का मूड',
      creator: '@ApnaBikaner',
    },
  };
}

export default async function PollResultsPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPollBySlug(slug);

  if (!data?.poll) {
    notFound();
  }

  const poll = data.poll;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/polls" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>सभी जनमत सर्वेक्षण देखें</span>
        </Link>

        {!poll.is_expired && (
          <Link
            href={`/polls/${poll.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Vote className="w-3.5 h-3.5" />
            <span>वोटिंग पेज पर जाएं →</span>
          </Link>
        )}
      </div>

      {/* Main Results Graph Component */}
      <PollResultsGraph poll={poll} />

      {/* Trust, Anonymity & Methodology Note */}
      <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% गोपनीय व निष्पक्ष परिणाम (Completely Anonymous Voting)</span>
        </div>
        <p className="leading-relaxed">
          यह जनमत परिणाम ग्राफ केवल सामूहिक प्रतिशत रुझानों को प्रदर्शित करता है। अपना बीकानेर किसी भी मतदाता का नाम, व्यक्तिगत संपर्क या संवेदनशील विवरण सार्वजनिक नहीं करता है।
        </p>
      </div>
    </main>
  );
}

