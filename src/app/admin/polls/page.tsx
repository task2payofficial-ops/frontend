'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Vote, 
  PlusCircle, 
  Clock, 
  Users, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Copy, 
  Check, 
  Activity, 
  X,
  Search,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Poll } from '@/lib/types';

export default function AdminPollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedType, setCopiedType] = useState<'vote' | 'results' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Tracing Modal State
  const [tracingPollId, setTracingPollId] = useState<number | null>(null);
  const [tracingData, setTracingData] = useState<any | null>(null);
  const [tracingLoading, setTracingLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    try {
      const u = localStorage.getItem('admin_user');
      if (u) setCurrentUser(JSON.parse(u));
    } catch {}
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/api/v1/admin/polls?search=${encodeURIComponent(search)}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('सर्वेक्षण लोड करने में असमर्थ');
      }

      const data = await res.json();
      setPolls(data.data || []);
    } catch (e: any) {
      setError(e.message || 'त्रुटि आई');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [search]);

  // Copy voting link
  const copyPollLink = async (poll: Poll) => {
    const url = `${window.location.origin}/polls/${poll.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(poll.id);
      setCopiedType('vote');
      setTimeout(() => { setCopiedId(null); setCopiedType(null); }, 2000);
    } catch {}
  };

  // Copy shareable results link
  const copyResultsLink = async (poll: Poll) => {
    const url = `${window.location.origin}/polls/${poll.slug}/results`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(poll.id);
      setCopiedType('results');
      setTimeout(() => { setCopiedId(null); setCopiedType(null); }, 2000);
    } catch {}
  };

  // Close or extend poll
  const togglePollStatus = async (poll: Poll, newStatus: 'active' | 'closed') => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/api/v1/admin/polls/${poll.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchPolls();
      }
    } catch {}
  };

  // Extend timer by 24 hours
  const extendPollTimer = async (poll: Poll) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/api/v1/admin/polls/${poll.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ extend_hours: 24 }),
      });

      if (res.ok) {
        fetchPolls();
      }
    } catch {}
  };

  // Delete poll
  const deletePoll = async (id: number) => {
    if (!confirm('क्या आप निश्चित रूप से इस सर्वेक्षण और इसके सभी वोटों को हटाना चाहते हैं?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/api/v1/admin/polls/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPolls(polls.filter((p) => p.id !== id));
      }
    } catch {}
  };

  // Open voter tracing modal
  const openTracingModal = async (pollId: number) => {
    setTracingPollId(pollId);
    setTracingLoading(true);
    setTracingData(null);

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/api/v1/admin/polls/${pollId}/tracing`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTracingData(data);
      }
    } catch {} finally {
      setTracingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              {currentUser?.role === 'user' ? 'यूजर पोल सेंटर' : 'थार मीडिया जनमत प्रणाली'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Vote className="w-6 h-6 text-red-600" />
            {currentUser?.role === 'user' ? 'मेरे जनमत पोल (My Created Polls)' : 'जनमत सर्वेक्षण प्रबंधन (Live Polls & Tracing)'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser?.role === 'user'
              ? 'आपके द्वारा बनाए गए सभी सर्वेक्षण। यहाँ से वोटिंग लिंक या सीधे परिणाम (Graph) लिंक कॉपी करके किसी को भी शेयर करें।'
              : 'सर्वेक्षण बनाएं, टाइमर सेट करें, सार्वजनिक लिंक शेयर करें और फर्जी वोटिंग रोकने के लिए IP व टोकन ट्रेसिंग देखें।'}
          </p>
        </div>

        <Link
          href="/admin/polls/create"
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ नया जनमत पोल बनाएं</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="सर्वेक्षण प्रश्न या श्रेणी खोजें..."
            className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <button
          onClick={fetchPolls}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          title="रिफ्रेश करें"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">रिफ्रेश</span>
        </button>
      </div>

      {/* Polls Listing Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
            सर्वेक्षण डेटा लोड हो रहा है...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-xs font-semibold">
            {error}
          </div>
        ) : polls.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            कोई सर्वेक्षण नहीं मिला। नया पोल बनाने के लिए ऊपर दिए गए बटन पर क्लिक करें।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">सर्वेक्षण प्रश्न</th>
                  <th className="py-3 px-4">श्रेणी</th>
                  <th className="py-3 px-4">स्थिति / टाइमर</th>
                  <th className="py-3 px-4">कुल वोट</th>
                  <th className="py-3 px-4">वोट विभाजन (Live Breakdown)</th>
                  <th className="py-3 px-4 text-right">कार्य (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {polls.map((poll) => {
                  const isClosed = poll.status === 'closed' || poll.is_expired;
                  return (
                    <tr key={poll.id} className="hover:bg-slate-50/80 transition">
                      {/* Title & Slug */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 max-w-sm">
                        <div className="line-clamp-2 mb-1">{poll.title}</div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-normal">
                          <span>Slug: {poll.slug}</span>
                          {poll.is_featured && (
                            <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded text-[10px]">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {poll.category || 'जनमत'}
                        </span>
                      </td>

                      {/* Status & Timer */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] w-fit ${
                            !isClosed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${!isClosed ? 'bg-emerald-600 animate-ping' : 'bg-slate-500'}`}></span>
                            {!isClosed ? 'सक्रिय (Live)' : 'समाप्त (Closed)'}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {poll.time_left_human || 'कोई समय सीमा नहीं'}
                          </span>
                        </div>
                      </td>

                      {/* Total Votes */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-black text-slate-900 text-sm">
                        {poll.total_votes.toLocaleString('hi-IN')}
                      </td>

                      {/* Options & Percentage preview */}
                      <td className="py-3.5 px-4 min-w-[220px]">
                        <div className="space-y-1.5">
                          {poll.options.map((opt) => (
                            <div key={opt.id} className="text-[11px]">
                              <div className="flex items-center justify-between text-slate-600 mb-0.5 gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {opt.image && (
                                    <img 
                                      src={opt.image} 
                                      alt="" 
                                      className="w-4 h-4 object-contain rounded-xs bg-white border shrink-0" 
                                    />
                                  )}
                                  <span className="truncate max-w-[130px] font-medium">{opt.option_text}</span>
                                </div>
                                <span className="font-bold text-slate-900 shrink-0">{opt.percentage}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-red-600 rounded-full"
                                  style={{ width: `${opt.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Share Results Link Button */}
                          <button
                            onClick={() => copyResultsLink(poll)}
                            className={`px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                              copiedId === poll.id && copiedType === 'results'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                            title="परिणाम (Graph) लिंक कॉपी करें"
                          >
                            {copiedId === poll.id && copiedType === 'results' ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>रिजल्ट कॉपी!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                                <span>परिणाम लिंक</span>
                              </>
                            )}
                          </button>

                          {/* View Results Graph */}
                          <Link
                            href={`/polls/${poll.slug}/results`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                            title="ग्राफ परिणाम देखें"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Copy Voting Link */}
                          <button
                            onClick={() => copyPollLink(poll)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              copiedId === poll.id && copiedType === 'vote'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                            title="वोटिंग लिंक कॉपी करें"
                          >
                            {copiedId === poll.id && copiedType === 'vote' ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* Open Public Voting Page */}
                          <Link
                            href={`/polls/${poll.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="वोटिंग पेज खोलें"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Voter Tracing Audit (only for staff or admins) */}
                          {currentUser?.role !== 'user' && (
                            <button
                              onClick={() => openTracingModal(poll.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer border border-amber-200"
                              title="वोट ट्रेसिंग व सुरक्षा ऑडिट"
                            >
                              <Activity className="w-3.5 h-3.5 text-amber-600" />
                              <span>ट्रेसिंग</span>
                            </button>
                          )}

                          {/* Close / Reopen Toggle */}
                          {!isClosed ? (
                            <button
                              onClick={() => togglePollStatus(poll, 'closed')}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
                              title="वोटिंग बंद करें"
                            >
                              बंद करें
                            </button>
                          ) : (
                            <button
                              onClick={() => extendPollTimer(poll)}
                              className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold cursor-pointer"
                              title="24 घंटे और बढ़ाएं"
                            >
                              +24h बढ़ाएं
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => deletePoll(poll.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                            title="हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tracing & Voter Audit Modal */}
      {tracingPollId && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  वोटर ट्रेसिंग एवं फ्रॉड डिटेक्शन ऑडिट (Voter Tracing Log)
                </h3>
              </div>
              <button
                onClick={() => setTracingPollId(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
              {tracingLoading ? (
                <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                  ट्रेसिंग लॉग लोड हो रहा है...
                </div>
              ) : tracingData ? (
                <>
                  {/* Top Analytics Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[11px] text-slate-500 font-medium">कुल वोट (Total)</div>
                      <div className="text-lg font-black text-slate-900 mt-0.5">
                        {tracingData.poll.total_votes}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[11px] text-slate-500 font-medium">यूनिक IP पते</div>
                      <div className="text-lg font-black text-emerald-600 mt-0.5">
                        {tracingData.poll.unique_ips}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[11px] text-slate-500 font-medium">यूनिक डिवाइस टोकन</div>
                      <div className="text-lg font-black text-blue-600 mt-0.5">
                        {tracingData.poll.unique_tokens}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[11px] text-slate-500 font-medium">संदिग्ध रिपीट IP</div>
                      <div className="text-lg font-black text-amber-600 mt-0.5">
                        {tracingData.poll.suspicious_repeated_ips?.length || 0}
                      </div>
                    </div>
                  </div>

                  {/* Suspicious IP alert if any */}
                  {tracingData.poll.suspicious_repeated_ips?.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                      <strong>⚠️ ध्यान दें:</strong> निम्नलिखित IP पतों से 2 से अधिक वोट दर्ज किए गए हैं (WiFi/Office Network या संभावित स्पैम):
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {tracingData.poll.suspicious_repeated_ips.map((ip: any) => (
                          <span key={ip.ip_address} className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-[11px]">
                            {ip.ip_address} ({ip.count} वोट)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Voter Audit Log Table */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">हालिया वोटर ऑडिट ट्रेल (Recent Votes Audit Log):</h4>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3">समय (Timestamp)</th>
                            <th className="py-2 px-3">चुना गया विकल्प</th>
                            <th className="py-2 px-3">IP पता</th>
                            <th className="py-2 px-3">डिवाइस / ब्राउज़र (User-Agent)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {tracingData.votes?.data?.map((vote: any) => (
                            <tr key={vote.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-mono text-slate-500 whitespace-nowrap">
                                {new Date(vote.created_at).toLocaleString('hi-IN')}
                              </td>
                              <td className="py-2 px-3 font-bold text-slate-800">
                                {vote.option?.option_text || 'विकल्प'}
                              </td>
                              <td className="py-2 px-3 font-mono text-slate-600 whitespace-nowrap">
                                {vote.ip_address}
                              </td>
                              <td className="py-2 px-3 text-slate-500 truncate max-w-xs font-mono text-[10px]">
                                {vote.user_agent || 'Unknown'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-400">कोई डेटा उपलब्ध नहीं है।</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setTracingPollId(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

