'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Vote, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Sparkles, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Poll } from '@/lib/types';
import { castPollVote } from '@/lib/api';

interface PollWidgetProps {
  initialPoll: Poll;
  variant?: 'card' | 'standalone' | 'compact';
  showShare?: boolean;
}

export default function PollWidget({
  initialPoll,
  variant = 'card',
  showShare = true,
}: PollWidgetProps) {
  const [poll, setPoll] = useState<Poll>(initialPoll);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewResultsOnly, setViewResultsOnly] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(() => {
    if (initialPoll.is_expired) return 0;
    if (initialPoll.seconds_remaining === null || initialPoll.seconds_remaining === undefined) return null;
    return Math.max(0, Number(initialPoll.seconds_remaining));
  });
  const [voterToken, setVoterToken] = useState<string>('');

  // 1. Initialize or get persistent voter token
  useEffect(() => {
    let token = localStorage.getItem('thar_voter_token');
    if (!token) {
      token = 'vt_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
      localStorage.setItem('thar_voter_token', token);
    }
    setVoterToken(token);

    // Check if user already voted in localStorage for this poll
    const votedPolls = JSON.parse(localStorage.getItem('thar_voted_polls') || '{}');
    if (votedPolls[initialPoll.id]) {
      setPoll((prev) => ({
        ...prev,
        has_voted: true,
        user_voted_option_id: votedPolls[initialPoll.id],
      }));
    }
  }, [initialPoll.id]);

  // 2. Real-time timer countdown ticker
  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0 || poll.is_expired || !poll.expires_at) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setPoll((p) => ({ ...p, is_expired: true, time_left_human: 'मतदान समाप्त' }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, poll.is_expired, poll.expires_at]);

  // Format countdown
  const formatCountdown = (totalSecs: number | null) => {
    if (poll.is_expired) return 'मतदान समाप्त (Poll Closed)';
    if (totalSecs === null) return poll.time_left_human || 'सक्रिय (Active)';
    if (totalSecs <= 0) {
      if (poll.expires_at) return 'मतदान समाप्त (Poll Closed)';
      return 'सक्रिय (Active)';
    }

    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    if (days > 0) {
      return `${days} दिन ${hours} घंटे बाकी`;
    }
    if (hours > 0) {
      return `${hours} घंटे ${minutes} मिनट ${seconds} सेकंड बाकी`;
    }
    return `${minutes} मिनट ${seconds} सेकंड बाकी`;
  };

  // 3. Handle Vote Submission
  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOptionId) {
      setMessage({ text: 'कृपया अपना मत दर्ज करने के लिए पहले ऊपर दिए गए विकल्पों में से किसी एक को चुनें।', type: 'error' });
      return;
    }

    if (poll.is_expired) {
      setMessage({ text: 'यह सर्वेक्षण समाप्त हो चुका है।', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const res = await castPollVote(poll.id, selectedOptionId, voterToken);

    setIsSubmitting(false);

    if (res.success && res.poll) {
      setPoll(res.poll);
      setViewResultsOnly(true);
      setMessage({ text: res.message || 'आपका मत सफलतापूर्वक दर्ज हुआ!', type: 'success' });

      // Save locally
      try {
        const votedPolls = JSON.parse(localStorage.getItem('thar_voted_polls') || '{}');
        votedPolls[poll.id] = selectedOptionId;
        localStorage.setItem('thar_voted_polls', JSON.stringify(votedPolls));
      } catch {}
    } else {
      setMessage({ text: res.message || 'वोट दर्ज करने में त्रुटि आई।', type: 'error' });
      if (res.poll) {
        setPoll(res.poll);
      }
    }
  };

  // 4. Social Sharing
  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/polls/${poll.slug}` 
    : `http://localhost:3000/polls/${poll.slug}`;

  const shareText = `अपना बीकानेर जनमत सर्वेक्षण (Apna Bikaner Poll):\n"${poll.title}"\nअपना कीमती वोट दें और परिणाम देखें 👉 ${publicUrl}`;

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const isExpired = Boolean(poll.is_expired || (secondsLeft !== null && secondsLeft <= 0 && Boolean(poll.expires_at)));
  const showResults = Boolean(poll.has_voted || isExpired || viewResultsOnly);

  return (
    <div className={`rounded-3xl overflow-hidden border transition-all ${
      variant === 'standalone' 
        ? 'bg-white p-6 sm:p-8 border-slate-200 shadow-xl' 
        : 'bg-gradient-to-b from-slate-900 to-slate-950 text-white p-5 sm:p-6 border-slate-800 shadow-lg'
    }`}>
      {/* Header Badge & Category */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-red-600 text-white shadow-xs">
            <Vote className="w-3.5 h-3.5" />
            बीकानेर जनमत पोल
          </span>
          {poll.category && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
              variant === 'standalone' ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
            }`}>
              {poll.category}
            </span>
          )}
        </div>

        {/* Live Timer Status */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Clock className={`w-3.5 h-3.5 ${isExpired ? 'text-slate-400' : 'text-amber-400 animate-pulse'}`} />
          <span className={isExpired ? 'text-slate-400' : 'text-amber-300'}>
            {formatCountdown(secondsLeft)}
          </span>
        </div>
      </div>

      {/* Poll Question */}
      <h3 className={`text-lg sm:text-xl font-black leading-snug tracking-tight mb-3 ${
        variant === 'standalone' ? 'text-slate-900' : 'text-white'
      }`}>
        {poll.title}
      </h3>

      {/* Poll Description (if available) */}
      {poll.description && (
        <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${
          variant === 'standalone' ? 'text-slate-600' : 'text-slate-400'
        }`}>
          {poll.description}
        </p>
      )}

      {/* Feedback Messages */}
      {message && (
        <div className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-200' 
            : 'bg-red-950/80 border border-red-700 text-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Interactive Body: Voting Form vs Results */}
      {!showResults ? (
        // A. VOTING FORM (Before Vote)
        <form onSubmit={handleVoteSubmit} className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className={variant === 'standalone' ? 'text-slate-600' : 'text-slate-300'}>
              👇 अपना मत देने के लिए किसी एक विकल्प को चुनें:
            </span>
            <button
              type="button"
              onClick={() => setViewResultsOnly(true)}
              className="text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              📊 रुझान देखें
            </button>
          </div>

          <div className="space-y-2.5">
            {poll.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <label
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`w-full p-4 rounded-2xl border flex items-center gap-3.5 cursor-pointer transition-all select-none ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500 text-red-600 shadow-sm ring-2 ring-red-500/30'
                      : variant === 'standalone'
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={`poll-${poll.id}`}
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => setSelectedOptionId(opt.id)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                    isSelected 
                      ? 'border-red-600 bg-red-600 text-white' 
                      : 'border-slate-400 bg-white'
                  }`}>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </div>

                  {opt.image && (
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
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

                  <span className="text-sm sm:text-base font-bold leading-snug">
                    {opt.option_text}
                  </span>
                </label>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm sm:text-base tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              selectedOptionId
                ? 'bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white shadow-red-600/30 scale-[1.01]'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                वोट दर्ज हो रहा है...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Vote className="w-5 h-5" />
                {selectedOptionId ? 'अपना मत दर्ज करें (Submit Vote) ✓' : 'वोट दें (Vote Now)'}
              </span>
            )}
          </button>
        </form>
      ) : (
        // B. RESULTS DISPLAY (After Vote or Expired)
        <div className="space-y-3.5">
          {poll.options.map((opt) => {
            const isUserChoice = poll.user_voted_option_id === opt.id;
            return (
              <div 
                key={opt.id} 
                className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
                  isUserChoice
                    ? 'border-emerald-500 bg-emerald-950/20 shadow-sm'
                    : variant === 'standalone'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {/* Progress Bar Fill Background */}
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out opacity-25 ${
                    isUserChoice 
                      ? 'bg-emerald-500' 
                      : 'bg-gradient-to-r from-red-600 to-amber-500'
                  }`}
                  style={{ width: `${Math.max(2, opt.percentage)}%` }}
                />

                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {isUserChoice && (
                      <span className="text-emerald-500 shrink-0 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">आपका मत</span>
                      </span>
                    )}
                    {opt.image && (
                      <div className="w-6 h-6 rounded-md bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                        <img src={opt.image} alt="" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <span className={`text-sm font-semibold truncate ${
                      variant === 'standalone' ? 'text-slate-900' : 'text-slate-200'
                    }`}>
                      {opt.option_text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                      ({opt.votes_count.toLocaleString('hi-IN')} वोट)
                    </span>
                    <span className={`text-sm font-black ${
                      isUserChoice ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {opt.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {poll.has_voted && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
              <Check className="w-3.5 h-3.5" />
              <span>आपका मत दर्ज हो चुका है। राय साझा करने के लिए धन्यवाद!</span>
            </div>
          )}

          {!poll.has_voted && !isExpired && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setViewResultsOnly(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-700 transition cursor-pointer shadow-md"
              >
                <Vote className="w-3.5 h-3.5" />
                <span>← वापस मतदान पर जाएं (Vote Now)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer Meta & Social Sharing Dock */}
      <div className={`mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
        variant === 'standalone' ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold">
            <Users className="w-4 h-4 text-slate-400" />
            <span>कुल मत: {poll.total_votes.toLocaleString('hi-IN')}</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-500">100% निष्पक्ष व पारदर्शी</span>
        </div>

        {/* Social Share Link Buttons */}
        {showShare && (
          <div className="flex items-center gap-2">
            <Link
              href={`/polls/${poll.slug}/results`}
              className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
              title="ग्राफ परिणाम देखें व शेयर करें"
            >
              <span>📊 परिणाम ग्राफ</span>
            </Link>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
              title="व्हाट्सएप पर शेयर करें"
            >
              <span>व्हाट्सएप</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1 transition"
              title="X पर शेयर करें"
            >
              <span>X</span>
            </a>

            <button
              onClick={copyShareLink}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1 transition cursor-pointer"
              title="लिंक कॉपी करें"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'कॉपी हुआ!' : 'लिंक'}</span>
            </button>

            <Link
              href={`/polls/${poll.slug}`}
              className="text-amber-400 hover:text-amber-300 ml-1"
              title="सर्वेक्षण का अलग पेज देखें"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

