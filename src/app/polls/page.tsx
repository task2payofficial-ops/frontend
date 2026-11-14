import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Vote, Sparkles, Clock, CheckCircle2, Share2, Flame } from 'lucide-react';
import { getPolls } from '@/lib/api';
import PollWidget from '@/components/PollWidget';

export const metadata: Metadata = {
  title: 'जनमत सर्वेक्षण (Live Public Polls) | अपना बीकानेर (Apna Bikaner)',
  description: 'राजस्थान और राष्ट्रीय समसामयिक मुद्दों पर अपना बीकानेर का निष्पक्ष जनमत सर्वेक्षण। अपनी राय दें और जनता का मूड जानें।',
  keywords: ['अपना बीकानेर जनमत', 'Apna Bikaner Polls', 'Rajasthan Opinion Poll', 'जनमत सर्वेक्षण', 'लाइव पोलिंग'],
};

export default async function PollsPage() {
  const pollsData = await getPolls(1);
  const polls = pollsData?.data || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase mb-3 shadow-xs">
            <Vote className="w-3.5 h-3.5" />
            <span>बीकानेर जनमत सर्वेक्षण • जनता की आवाज़</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
            मरुधरा का मूड: समसामयिक जनमुद्दों पर निष्पक्ष जनमत
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            अपना बीकानेर (Apna Bikaner) के इस डिजिटल मंच पर हर नागरिक का मत अमूल्य है। राजनीति, कृषि, विकास, शिक्षा और सामाजिक नीतियों पर निष्पक्ष वोट दें और वास्तविक आंकड़े देखें।
          </p>
        </div>
      </div>

      {/* Polls Grid */}
      {polls.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {polls.map((poll) => (
            <PollWidget 
              key={poll.id} 
              initialPoll={poll} 
              variant="standalone" 
              showShare={true} 
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Vote className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            फिलहाल कोई नया सर्वेक्षण सक्रिय नहीं है
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            शीघ्र ही समसामयिक मुद्दों पर नए सर्वेक्षण प्रकाशित किए जाएंगे। ताज़ा समाचार पढ़ने के लिए होमपेज पर जाएं।
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
          >
            ताज़ा खबरें पढ़ें →
          </Link>
        </div>
      )}
    </main>
  );
}

