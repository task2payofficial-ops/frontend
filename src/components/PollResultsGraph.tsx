'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Clock, 
  Trophy, 
  Vote, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Poll } from '@/lib/types';

interface PollResultsGraphProps {
  poll: Poll;
}

export default function PollResultsGraph({ poll }: PollResultsGraphProps) {
  const [copied, setCopied] = useState(false);

  const publicResultUrl = typeof window !== 'undefined'
    ? window.location.href
    : `http://localhost:3000/polls/${poll.slug}/results`;

  const publicVoteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/polls/${poll.slug}`
    : `http://localhost:3000/polls/${poll.slug}`;

  const shareText = `📊 अपना बीकानेर जनमत परिणाम (Apna Bikaner Poll Results):\n"${poll.title}"\nकुल मत: ${poll.total_votes}\nलाइव परिणाम ग्राफ और आंकड़े देखें 👉 ${publicResultUrl}`;

  const copyResultsLink = async () => {
    try {
      await navigator.clipboard.writeText(publicResultUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  // Find leading option
  const maxVotes = Math.max(...poll.options.map((o) => o.votes_count), 0);
  const leadingOption = maxVotes > 0 ? poll.options.find((o) => o.votes_count === maxVotes) : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
      {/* Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-blue-600 text-white shadow-xs">
            <BarChart3 className="w-3.5 h-3.5" />
            जनमत परिणाम ग्राफ
          </span>
          {poll.category && (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {poll.category}
            </span>
          )}
        </div>

        {/* Status & Timer */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
            !poll.is_expired ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${!poll.is_expired ? 'bg-emerald-600 animate-ping' : 'bg-slate-400'}`}></span>
            {!poll.is_expired ? 'लाइव वोटिंग जारी' : 'मतदान समाप्त'}
          </span>
          <span className="text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {poll.time_left_human || 'सक्रिय'}
          </span>
        </div>
      </div>

      {/* Poll Question */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight mb-2">
          {poll.title}
        </h1>
        {poll.description && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {poll.description}
          </p>
        )}
      </div>

      {/* Leading Option Banner (if any votes) */}
      {leadingOption && poll.total_votes > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                वर्तमान में सबसे आगे (Leading Option)
              </span>
              <span className="text-sm font-black text-slate-900">
                {leadingOption.option_text}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl sm:text-2xl font-black text-amber-600 block">
              {leadingOption.percentage}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              ({leadingOption.votes_count} मत)
            </span>
          </div>
        </div>
      )}

      {/* 📊 Visual Graphical Bar Chart */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
          <span>विकल्प व पार्टी (Option & Party)</span>
          <span>मत प्रतिशत (Percentage)</span>
        </div>

        {poll.options.map((opt, idx) => {
          const isLeader = leadingOption?.id === opt.id && poll.total_votes > 0;

          return (
            <div 
              key={opt.id}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                isLeader 
                  ? 'border-amber-300 bg-amber-50/30 shadow-xs' 
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              {/* Animated Progress Bar Fill */}
              <div 
                className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out opacity-20 ${
                  isLeader
                    ? 'bg-gradient-to-r from-amber-500 to-red-500'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                }`}
                style={{ width: `${Math.max(2, opt.percentage)}%` }}
              />

              <div className="relative z-10 flex items-center justify-between gap-3">
                {/* Option Name & Symbol */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  {/* Party Symbol / Logo Image */}
                  {opt.image && (
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                      <img 
                        src={opt.image} 
                        alt={opt.option_text} 
                        onError={(e) => {
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) parent.style.display = 'none';
                        }}
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  )}

                  <div>
                    <span className="text-sm sm:text-base font-bold text-slate-900 block truncate">
                      {opt.option_text}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {opt.votes_count.toLocaleString('hi-IN')} मत
                    </span>
                  </div>
                </div>

                {/* Percentage Display */}
                <div className="text-right shrink-0">
                  <span className={`text-lg sm:text-2xl font-black ${
                    isLeader ? 'text-amber-600' : 'text-slate-900'
                  }`}>
                    {opt.percentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Votes Summary Dock */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-500" />
          <span>
            कुल दर्ज मत (Total Votes): <strong className="text-slate-900 text-sm">{poll.total_votes.toLocaleString('hi-IN')}</strong>
          </span>
        </div>

        {!poll.is_expired && (
          <Link
            href={publicVoteUrl}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <Vote className="w-3.5 h-3.5" />
            <span>अपना मत भी दर्ज करें →</span>
          </Link>
        )}
      </div>

      {/* Share Results Action Dock */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold flex items-center gap-1.5 text-slate-200">
            <Share2 className="w-4 h-4 text-red-500" />
            यह परिणाम ग्राफ शेयर करें (Share Results):
          </span>
          <span className="text-[11px] text-slate-400">1-क्लिक शेयरिंग</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp Share */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[120px] py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
          >
            <span>व्हाट्सएप पर शेयर</span>
          </a>

          {/* Twitter / X Share */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>X (Twitter)</span>
          </a>

          {/* Copy Results Link */}
          <button
            onClick={copyResultsLink}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'लिंक कॉपी हुआ!' : 'परिणाम लिंक कॉपी करें'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

