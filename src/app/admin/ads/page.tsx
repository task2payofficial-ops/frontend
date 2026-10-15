'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Eye, MousePointer, Trash2, CheckCircle, ExternalLink } from 'lucide-react';
import { Advertisement } from '@/lib/types';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New ad form state
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState('header_leaderboard');
  const [adType, setAdType] = useState('custom_banner');
  const [imageUrl, setImageUrl] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [adsenseClientId, setAdsenseClientId] = useState('');
  const [adsenseSlotId, setAdsenseSlotId] = useState('');

  const fetchAds = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/v1/admin/ads', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) setAds(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/v1/admin/ads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          position,
          ad_type: adType,
          image_url: imageUrl || null,
          destination_url: destinationUrl || null,
          adsense_client_id: adsenseClientId || null,
          adsense_slot_id: adsenseSlotId || null,
          is_active: true,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setTitle('');
        setImageUrl('');
        setDestinationUrl('');
        fetchAds();
      }
    } catch (e) {
      alert('विज्ञापन जोड़ने में त्रुटि हुई');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('क्या आप वाकई इस विज्ञापन को हटाना चाहते हैं?')) return;
    const token = localStorage.getItem('admin_token');
    await fetch(`/api/v1/admin/ads/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchAds();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            विज्ञापन एवं राजस्व प्रबंधन (Monetization & Ads)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            लीडरबोर्ड बैनर, साइडबार विज्ञापन, Google AdSense स्लॉट और क्लिक मेट्रिक्स
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>नया विज्ञापन जोड़ें</span>
        </button>
      </div>

      {/* Ads List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-900">{ad.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${ad.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                  {ad.is_active ? 'सक्रिय (Active)' : 'निष्क्रिय'}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div>स्थान: <strong className="text-slate-800">{ad.position}</strong></div>
                <div>प्रकार: <strong className="text-slate-800">{ad.ad_type}</strong></div>
              </div>

              {ad.image_url && (
                <div className="mt-3 aspect-16/9 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                  <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                </div>
              )}

              {ad.ad_type === 'google_adsense' && (
                <div className="mt-3 p-3 rounded-lg bg-amber-50 text-[11px] text-amber-900 font-mono border border-amber-200">
                  AdSense Slot: {ad.adsense_slot_id}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-blue-500" /> {ad.impression_count}
                </span>
                <span className="flex items-center gap-1">
                  <MousePointer className="w-3.5 h-3.5 text-emerald-500" /> {ad.click_count}
                </span>
              </div>

              <button
                onClick={() => handleDelete(ad.id)}
                className="text-red-500 hover:text-red-700 p-1 rounded cursor-pointer"
                title="हटाएं"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Ad Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">नया विज्ञापन स्थान जोड़ें</h3>

            <form onSubmit={handleCreateAd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">विज्ञापन शीर्षक *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="जैसे: राजस्थान टूरिज्म समर ऑफर"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">प्रदर्शित स्थान (Position) *</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="header_leaderboard">Header Leaderboard (शीर्ष बैनर)</option>
                  <option value="sidebar_top">Sidebar Top (साइडबार ऊपरी)</option>
                  <option value="sidebar_bottom">Sidebar Bottom (साइडबार निचला)</option>
                  <option value="in_article">In-Article (लेख के बीच में)</option>
                  <option value="between_sections">Between Sections (सेक्शनों के बीच)</option>
                  <option value="footer_banner">Footer Banner (फूटर)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विज्ञापन प्रकार (Ad Type) *</label>
                <select
                  value={adType}
                  onChange={(e) => setAdType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="custom_banner">कस्टम बैनर (Custom Banner)</option>
                  <option value="google_adsense">Google AdSense</option>
                  <option value="sponsored_card">Sponsored Story Card</option>
                </select>
              </div>

              {adType === 'custom_banner' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">इमेज यूआरएल</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">क्लिक गंतव्य लिंक (Destination URL)</label>
                    <input
                      type="url"
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      placeholder="https://yourbrand.com"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </>
              )}

              {adType === 'google_adsense' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">AdSense Client ID</label>
                    <input
                      type="text"
                      value={adsenseClientId}
                      onChange={(e) => setAdsenseClientId(e.target.value)}
                      placeholder="ca-pub-123456789"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">AdSense Slot ID</label>
                    <input
                      type="text"
                      value={adsenseSlotId}
                      onChange={(e) => setAdsenseSlotId(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
                >
                  विज्ञापन सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

