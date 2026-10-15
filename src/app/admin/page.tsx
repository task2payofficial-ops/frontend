'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  Clock,
  CheckCircle,
  FileText,
  Eye,
  Radio,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/v1/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Error fetching dashboard stats', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-medium text-sm">
        डैशबोर्ड डेटा लोड हो रहा है...
      </div>
    );
  }

  const artStats = stats?.article_stats || {};
  const sources = stats?.sources || [];
  const reviewQueue = stats?.review_queue || [];
  const topArticles = stats?.top_articles || [];
  const adStats = stats?.ad_stats || {};
  const recentLogs = stats?.recent_ingestion_logs || [];
  const recentActivities = stats?.recent_activities || [];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            संपादकीय डैशबोर्ड अवलोकन
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            समाचार स्थिति, स्वचालित स्रोत, समीक्षा कतार और दर्शक जुड़ाव विश्लेषण
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/articles/create"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition"
          >
            + नया लेख प्रकाशित करें
          </Link>
        </div>
      </div>

      {/* 1. KPI STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">कुल समाचार</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{artStats.total || 0}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">✓ {artStats.published || 0} प्रकाशित</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <Newspaper className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">समीक्षा कतार (Pending)</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{artStats.pending_review || 0}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">मानव सत्यापन अपेक्षित</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">कुल पाठक व्यूज</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{stats?.total_views || 0}</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">📈 उच्च डिजिटल सहभागिता</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">विज्ञापन इंप्रेशन व क्लिक</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{adStats.total_impressions || 0}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">{adStats.total_clicks || 0} क्लिक्स प्राप्त</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. OPERATIONAL QUEUES: Review Queue & Source Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Review Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                संपादकीय सत्यापन कतार (Review Queue)
              </h2>
            </div>
            <Link href="/admin/articles?verification_status=unverified" className="text-xs font-bold text-red-600 hover:underline">
              सभी देखें →
            </Link>
          </div>

          {reviewQueue.length > 0 ? (
            <div className="space-y-3">
              {reviewQueue.map((item: any) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {item.is_ai_generated && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> AI {item.ai_model_used}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">स्रोत: {item.source?.name || 'संवाददाता'}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/articles/${item.id}/edit`}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                    >
                      समीक्षा करें
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              ✓ बहुत बढ़िया! कोई भी समाचार समीक्षा हेतु लंबित नहीं है।
            </div>
          )}
        </div>

        {/* Right Column: Automated Sources Status (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                स्वचालित स्रोत स्थिति (News Sources)
              </h2>
            </div>
            <Link href="/admin/sources" className="text-xs font-bold text-red-600 hover:underline">
              प्रबंधन →
            </Link>
          </div>

          <div className="space-y-3">
            {sources.map((src: any) => (
              <div key={src.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{src.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    प्रारूप: {src.source_type.toUpperCase()} • {src.articles_count || 0} लेख संकलित
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  src.last_status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                  src.last_status === 'running' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                  src.last_status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {src.last_status === 'success' ? 'सक्रिय (Sync OK)' : src.last_status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MOST VIEWED ARTICLES & RECENT AUDIT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Most Viewed Articles (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Flame className="w-5 h-5 text-red-600 fill-red-600" />
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              शीर्ष पढ़े गए समाचार (Top Articles by Views)
            </h2>
          </div>

          <div className="space-y-3">
            {topArticles.map((top: any, idx: number) => (
              <div key={top.id} className="flex items-center justify-between gap-3 text-xs p-2 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-slate-600 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <Link href={`/news/${top.slug}`} target="_blank" className="font-bold text-slate-800 hover:text-red-600 truncate">
                    {top.title}
                  </Link>
                </div>
                <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded shrink-0">
                  {top.view_count} पाठ
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Admin Activities (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              हाल की गतिविधियां (Audit Log)
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {recentActivities.map((act: any) => (
              <div key={act.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-slate-700">{act.user?.name || 'System Admin'}</span>
                  <span>{new Date(act.created_at).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-600">{act.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

