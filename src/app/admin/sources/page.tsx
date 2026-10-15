'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Plus,
  RefreshCw,
  Link as LinkIcon,
  CheckCircle,
  AlertTriangle,
  History,
  Play,
  Clock,
  Sparkles
} from 'lucide-react';

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<number | null>(null);

  // Manual URL Ingestion state
  const [manualUrl, setManualUrl] = useState('');
  const [manualIngesting, setManualIngesting] = useState(false);
  const [manualResult, setManualResult] = useState<any>(null);

  // New Source Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceType, setNewSourceType] = useState('rss');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSyncInterval, setNewSyncInterval] = useState('60');

  const fetchSourcesAndLogs = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      };

      const [srcRes, logsRes] = await Promise.all([
        fetch('/api/v1/admin/sources', { headers }),
        fetch('/api/v1/admin/sources/logs', { headers }),
      ]);

      if (srcRes.ok) setSources(await srcRes.json());
      if (logsRes.ok) {
        const lData = await logsRes.json();
        setLogs(lData.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSourcesAndLogs();
  }, []);

  const handleSyncNow = async (id: number) => {
    setSyncingId(id);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/v1/admin/sources/${id}/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      alert(`सिंक पूर्ण! आयातित: ${data.result?.imported || 0}, डुप्लिकेट छोड़े गए: ${data.result?.skipped || 0}`);
      fetchSourcesAndLogs();
    } catch (e: any) {
      alert('सिंक विफल: ' + e.message);
    } finally {
      setSyncingId(null);
    }
  };

  const handleManualIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl) return;
    setManualIngesting(true);
    setManualResult(null);

    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/v1/admin/sources/ingest-url', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: manualUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'यूआरएल अधिग्रहण विफल रहा');
      }

      setManualResult({
        type: 'success',
        article: data.article,
        articles: data.articles || [data.article],
        message: data.message
      });
      setManualUrl('');
      fetchSourcesAndLogs();
    } catch (err: any) {
      setManualResult({ type: 'error', message: err.message });
    } finally {
      setManualIngesting(false);
    }
  };

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/v1/admin/sources', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSourceName,
          source_type: newSourceType,
          url: newSourceUrl,
          sync_interval_minutes: parseInt(newSyncInterval, 10),
          auto_publish: false,
          require_ai_processing: true,
          require_editorial_review: true,
          is_active: true,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewSourceName('');
        setNewSourceUrl('');
        fetchSourcesAndLogs();
      }
    } catch (e) {
      alert('स्रोत जोड़ने में समस्या हुई');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            स्वचालित समाचार संग्रह एवं स्रोत (Sources & Automation)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            RSS/Atom फीड्स, सरकारी एपीआई, ऑन-डिमांड यूआरएल अधिग्रहण और एआई पाइपलाइन प्रबंधन
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>नया स्रोत जोड़ें</span>
        </button>
      </div>

      {/* Manual URL Ingestion Tool Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4 border border-indigo-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black">फेसबुक व ऑन-डिमांड यूआरएल ऑटो-न्यूज अधिग्रहण (Auto-News Ingestion)</h2>
          </div>
          <span className="text-[10px] font-bold bg-blue-600/40 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
            ✨ FB पेज • वीडियो • सरकारी प्रेस रिलीज
          </span>
        </div>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          किसी भी <strong>फेसबुक पेज (Facebook Page)</strong>, फेसबुक वीडियो, रील्स, सरकारी पोर्टल (DIPR) या प्रेस रिलीज का लिंक यहाँ पेस्ट करें। हमारी एआई पाइपलाइन स्वतः आज के पोस्ट और वीडियो निकालकर पूरी हिंदी खबर तैयार कर देगी।
        </p>

        <form onSubmit={handleManualIngest} className="flex flex-col sm:flex-row gap-3 max-w-4xl">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            required
            placeholder="उदा. https://www.facebook.com/NDTV या https://facebook.com/watch/?v=... या प्रेस रिलीज लिंक"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={manualIngesting}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            {manualIngesting ? 'AI खबर तैयार हो रही है...' : 'अधिग्रहण एवं AI ऑटो-न्यूज बनाएं'}
          </button>
        </form>

        {manualResult && (
          <div className={`p-4 rounded-xl text-xs font-semibold ${manualResult.type === 'success' ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800' : 'bg-red-950/80 text-red-200 border border-red-800'}`}>
            {manualResult.type === 'success' ? (
              <div className="space-y-3">
                <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{manualResult.message || 'समाचार सफलतापूर्वक तैयार हुआ!'}</span>
                </div>
                {manualResult.articles && manualResult.articles.length > 0 && (
                  <div className="space-y-2 max-h-56 overflow-y-auto pt-1">
                    {manualResult.articles.map((art: any, i: number) => (
                      <div key={art.id || i} className="p-2.5 rounded-lg bg-emerald-900/60 flex items-center justify-between gap-3 border border-emerald-700/50">
                        <div className="flex items-center gap-2 min-w-0">
                          {art.is_video_story && (
                            <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-black shrink-0 flex items-center gap-1">
                              ▶ वीडियो स्टोरी
                            </span>
                          )}
                          <span className="truncate text-white font-medium text-xs">{art.title}</span>
                        </div>
                        <a
                          href={`/news/${art.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-300 hover:text-amber-200 underline shrink-0 text-xs font-bold"
                        >
                          खबर देखें ↗
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span>✗ {manualResult.message}</span>
            )}
          </div>
        )}
      </div>

      {/* Configured Sources List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900">सक्रिय समाचार स्रोत (Active Feeds)</h2>
          <span className="text-xs text-slate-400 font-bold">{sources.length} स्रोत उपलब्ध</span>
        </div>

        <div className="divide-y divide-slate-100">
          {sources.map((src) => (
            <div key={src.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{src.name}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold uppercase px-2 py-0.5 rounded">
                    {src.source_type}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    src.last_status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                    src.last_status === 'running' ? 'bg-blue-100 text-blue-800' :
                    src.last_status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {src.last_status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono truncate max-w-xl">
                  {src.url || 'एपीआई / मैन्युअल इनपुट'}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                  <span>सिंक आवृत्ति: हर {src.sync_interval_minutes} मिनट</span>
                  <span>•</span>
                  <span>कुल संकलित: {src.articles_count || 0} लेख</span>
                  <span>•</span>
                  <span>अंतिम सिंक: {src.last_synced_at ? new Date(src.last_synced_at).toLocaleTimeString('hi-IN') : 'कभी नहीं'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleSyncNow(src.id)}
                  disabled={syncingId === src.id}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingId === src.id ? 'animate-spin' : ''}`} />
                  <span>{syncingId === src.id ? 'सिंक हो रहा है...' : 'अभी सिंक करें (Sync Now)'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingestion Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-600" />
            <h2 className="text-base font-black text-slate-900">हालिया सिंक एवं अधिग्रहण लॉग (Ingestion Audit Logs)</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black text-[10px]">
              <tr>
                <th className="p-4">स्रोत</th>
                <th className="p-4">स्थिति</th>
                <th className="p-4">फेच किए गए</th>
                <th className="p-4">आयातित</th>
                <th className="p-4">डुप्लिकेट छोड़े</th>
                <th className="p-4">समय</th>
                <th className="p-4">त्रुटि / विवरण</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{log.source?.name || 'मैन्युअल'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                      log.status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4 font-semibold">{log.items_fetched}</td>
                  <td className="p-4 font-bold text-emerald-600">{log.items_imported}</td>
                  <td className="p-4 font-semibold text-slate-400">{log.items_skipped_duplicate}</td>
                  <td className="p-4 text-[11px] text-slate-400">
                    {new Date(log.created_at).toLocaleTimeString('hi-IN')}
                  </td>
                  <td className="p-4 text-[11px] text-slate-500 max-w-xs truncate">
                    {log.error_message || 'सफलतापूर्वक संसाधित'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">नया समाचार स्रोत जोड़ें (Add Source)</h3>

            <form onSubmit={handleCreateSource} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">स्रोत का नाम *</label>
                <input
                  type="text"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  required
                  placeholder="जैसे: DIPR राजस्थान, PTI"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">स्रोत प्रकार (Source Type) *</label>
                <select
                  value={newSourceType}
                  onChange={(e) => setNewSourceType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="facebook">फेसबुक पेज एवं वीडियो (Facebook Page & Videos)</option>
                  <option value="rss">RSS Feed (XML)</option>
                  <option value="atom">Atom Feed</option>
                  <option value="api">Official JSON API</option>
                  <option value="manual_url">Manual Single URL</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {newSourceType === 'facebook' ? 'फेसबुक पेज यूआरएल *' : 'फीड / एपीआई यूआरएल *'}
                </label>
                <input
                  type="url"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  required
                  placeholder={
                    newSourceType === 'facebook'
                      ? 'https://www.facebook.com/NDTV या https://www.facebook.com/YourPage'
                      : 'https://example.com/rss.xml'
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
                {newSourceType === 'facebook' && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    ✓ सार्वजनिक फेसबुक पेजों से आज के वीडियो और पोस्ट स्वतः स्क्रैप होकर AI से समाचार बन जाएंगे।
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">सिंक अंतराल (मिनटों में)</label>
                <input
                  type="number"
                  value={newSyncInterval}
                  onChange={(e) => setNewSyncInterval(e.target.value)}
                  min="5"
                  max="1440"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 text-white font-bold"
                >
                  स्रोत जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

