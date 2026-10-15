'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Eye, 
  RotateCcw, 
  CheckCircle, 
  Sparkles, 
  MapPin, 
  Clock 
} from 'lucide-react';

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === 'user') {
          router.replace('/admin/polls');
          return;
        }
      }
    } catch {}
  }, [router]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/v1/admin/articles?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setArticles(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('क्या आप वाकई इस समाचार को ट्रैश में भेजना चाहते हैं?')) return;
    const token = localStorage.getItem('admin_token');
    await fetch(`/api/v1/admin/articles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchArticles();
  };

  const handleRestore = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    await fetch(`/api/v1/admin/articles/${id}/restore`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchArticles();
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return;
    const token = localStorage.getItem('admin_token');
    await fetch('/api/v1/admin/articles/bulk-action', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: selectedIds, action }),
    });
    setSelectedIds([]);
    fetchArticles();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            समाचार प्रबंधन (Article Management)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            सभी प्रकाशित, ड्राफ्ट, लंबित और स्वतः संकलित समाचारों का संपादन
          </p>
        </div>

        <Link
          href="/admin/articles/create"
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>नया समाचार जोड़ें</span>
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { label: 'सभी (All)', value: '' },
            { label: 'प्रकाशित (Published)', value: 'published' },
            { label: 'समीक्षा अपेक्षित (Review)', value: 'pending_review' },
            { label: 'ड्राफ्ट (Draft)', value: 'draft' },
            { label: 'कचरा पात्र (Trash)', value: 'trash' },
          ].map((st) => (
            <button
              key={st.value}
              onClick={() => setStatusFilter(st.value)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === st.value
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="शीर्षक या रिपोर्टर खोजें..."
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            खोजें
          </button>
        </form>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs">
          <span className="font-bold text-red-900">
            {selectedIds.length} समाचार चयनित
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('publish')}
              className="px-3 py-1 rounded bg-emerald-600 text-white font-bold"
            >
              प्रकाशित करें
            </button>
            <button
              onClick={() => handleBulkAction('draft')}
              className="px-3 py-1 rounded bg-slate-700 text-white font-bold"
            >
              ड्राफ्ट करें
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 rounded bg-red-600 text-white font-bold"
            >
              हटाएं (Trash)
            </button>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black text-[10px] tracking-wider">
              <tr>
                <th className="p-4 w-8">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(articles.map((a) => a.id));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th className="p-4">शीर्षक व विवरण</th>
                <th className="p-4">श्रेणी व जिला</th>
                <th className="p-4">स्थिति / AI</th>
                <th className="p-4">व्यूज</th>
                <th className="p-4">तारीख</th>
                <th className="p-4 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(art.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds([...selectedIds, art.id]);
                        else setSelectedIds(selectedIds.filter((id) => id !== art.id));
                      }}
                    />
                  </td>
                  <td className="p-4 min-w-[280px]">
                    <div className="font-bold text-slate-900 line-clamp-2 text-sm leading-snug">
                      {art.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>आईडी: #{art.id}</span>
                      <span>•</span>
                      <span>रिपोर्टर: {art.author?.name || art.reporter_name || 'विशेष संवाददाता'}</span>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">{art.category?.name_hi || 'सामान्य'}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                      <MapPin className="w-2.5 h-2.5" /> {art.district || 'राजस्थान'}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      art.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                      art.status === 'pending_review' ? 'bg-amber-100 text-amber-800' :
                      art.status === 'draft' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-800'
                    }`}>
                      {art.status}
                    </span>
                    {art.is_ai_generated && (
                      <span className="block mt-1 text-[10px] text-blue-600 font-semibold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> AI {art.ai_model_used}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-slate-800">
                    {art.view_count || 0}
                  </td>
                  <td className="p-4 whitespace-nowrap text-[11px] text-slate-500">
                    {art.published_at ? new Date(art.published_at).toLocaleDateString('hi-IN') : 'अप्रकाशित'}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap space-x-1">
                    {art.deleted_at ? (
                      <button
                        onClick={() => handleRestore(art.id)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        title="पुनर्स्थापित करें (Restore)"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <Link
                          href={`/news/${art.slug}`}
                          target="_blank"
                          className="inline-block p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                          title="वेबसाइट पर देखें"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/articles/${art.id}/edit`}
                          className="inline-block p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                          title="संपादित करें"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                          title="हटाएं (Trash)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

