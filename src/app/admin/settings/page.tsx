'use client';

import React, { useState, useEffect } from 'react';
import {
  Code2,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileCode2,
  Sliders,
  Layers,
  HelpCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [headerCode, setHeaderCode] = useState('');
  const [footerCode, setFooterCode] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [adsenseClientId, setAdsenseClientId] = useState('');
  const [customCss, setCustomCss] = useState('');
  const [siteName, setSiteName] = useState('');
  const [siteTagline, setSiteTagline] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'scripts' | 'quick_ids' | 'branding'>('scripts');

  // Load existing settings
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch('/api/v1/admin/settings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setHeaderCode(data.header_code || '');
          setFooterCode(data.footer_code || '');
          setGoogleAnalyticsId(data.google_analytics_id || '');
          setAdsenseClientId(data.adsense_client_id || '');
          setCustomCss(data.custom_css || '');
          setSiteName(data.site_name || 'राजस्थान समाचार');
          setSiteTagline(data.site_tagline || 'सत्य, निष्पक्षता और मरुधरा की सच्ची आवाज');
        }
      } catch (e) {
        console.warn('Failed loading settings:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save Settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const token = localStorage.getItem('admin_token');
    const payload = {
      header_code: headerCode,
      footer_code: footerCode,
      google_analytics_id: googleAnalyticsId,
      adsense_client_id: adsenseClientId,
      custom_css: customCss,
      site_name: siteName,
      site_tagline: siteTagline,
    };

    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'हेडर, फूटर कोड व सेटिंग्स सफलतापूर्वक सेव हो गई हैं!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'सेटिंग्स सेव करने में त्रुटि आई।' });
      }
    } catch {
      setMessage({ type: 'error', text: 'सर्वर से कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।' });
    } finally {
      setSaving(false);
    }
  };

  // Quick Template Helpers
  const insertGaTemplate = () => {
    const template = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX');
</script>`;
    setHeaderCode((prev) => (prev ? prev + '\n\n' + template : template));
  };

  const insertGtmTemplate = () => {
    const template = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->`;
    setHeaderCode((prev) => (prev ? prev + '\n\n' + template : template));
  };

  const insertMetaPixelTemplate = () => {
    const template = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->`;
    setHeaderCode((prev) => (prev ? prev + '\n\n' + template : template));
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        सेटिंग्स लोड हो रही हैं, कृपया प्रतीक्षा करें...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-red-600" />
            <span>हेडर एवं फूटर कोड प्रबंधन (Header & Footer Code)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Google Analytics, Google Tag Manager, AdSense, Meta Pixel और कस्टम ट्रैकिंग स्क्रिप्ट्स जोड़ें।
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'सेव हो रहा है...' : 'सेटिंग्स सेव करें'}</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tab Selectors */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('scripts')}
          className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'scripts'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-200 bg-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>कस्टम हेडर व फूटर कोड (Custom Scripts)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quick_ids')}
          className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'quick_ids'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-200 bg-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>क्विक आईडी सेटिंग्स (Google Analytics & Ads)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'branding'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-200 bg-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>पोर्टल ब्रांडिंग व संपर्क (Branding)</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: SCRIPTS */}
        {activeTab === 'scripts' && (
          <div className="space-y-6">
            {/* Header Code Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-indigo-600" />
                    <span>हेडर कोड (&lt;head&gt; Code Injection)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    यह कोड वेबसाइट के प्रत्येक पेज के &lt;head&gt; टैग के अंदर लोड होगा।
                  </p>
                </div>

                {/* Quick Snippets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-400">टेम्पलेट्स जोड़ें:</span>
                  <button
                    type="button"
                    onClick={insertGaTemplate}
                    className="text-[11px] font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                  >
                    + Google Analytics (GA4)
                  </button>
                  <button
                    type="button"
                    onClick={insertGtmTemplate}
                    className="text-[11px] font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                  >
                    + Google Tag Manager
                  </button>
                  <button
                    type="button"
                    onClick={insertMetaPixelTemplate}
                    className="text-[11px] font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                  >
                    + Meta Pixel
                  </button>
                </div>
              </div>

              <textarea
                value={headerCode}
                onChange={(e) => setHeaderCode(e.target.value)}
                rows={10}
                placeholder="<!-- Paste your <head> tracking codes, meta tags, verification codes or analytics here -->"
                className="w-full text-xs font-mono px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950 text-emerald-400 leading-relaxed"
                spellCheck={false}
              />

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>उपयोगी उदाहरण:</strong> Google Analytics (gtag.js), Google AdSense कोड, Meta Pixel, Google Search Console सत्यापन (&lt;meta name=&quot;google-site-verification&quot; ...&gt;)।
                </div>
              </div>
            </div>

            {/* Footer Code Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-emerald-600" />
                  <span>फूटर कोड (&lt;body&gt; Bottom Code Injection)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  यह कोड वेबसाइट के प्रत्येक पेज के &lt;/body&gt; बंद होने से ठीक पहले लोड होगा।
                </p>
              </div>

              <textarea
                value={footerCode}
                onChange={(e) => setFooterCode(e.target.value)}
                rows={8}
                placeholder="<!-- Paste your footer scripts, live chat widget, conversion pixels or custom javascript here -->"
                className="w-full text-xs font-mono px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-950 text-emerald-400 leading-relaxed"
                spellCheck={false}
              />

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <strong>उपयोगी उदाहरण:</strong> लाइव चैट विजेट्स (Tawk.to, WhatsApp Widget), एफिलिएट ट्रैकिंग स्क्रिप्ट्स, बैक-टू-टॉप स्क्रिप्ट्स या कस्टम जावास्क्रिप्ट।
                </div>
              </div>
            </div>

            {/* Custom CSS */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-600" />
                  <span>कस्टम सीएसएस (Custom CSS)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  बिना कोड फाइल्स बदले वेबसाइट के किसी भी हिस्से का रंग, फ़ॉन्ट या स्टाइल बदलें।
                </p>
              </div>

              <textarea
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                rows={6}
                placeholder="/* e.g. .site-title { color: #dc2626; } */"
                className="w-full text-xs font-mono px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-950 text-purple-300 leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* TAB 2: QUICK IDS */}
        {activeTab === 'quick_ids' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>सीधी आईडी सेटिंग्स (Direct ID Integrations - No Code Needed)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                यहाँ आपको पूरा कोड पेस्ट करने की ज़रूरत नहीं है, केवल अपनी ID दर्ज करें — सिस्टम खुद सही स्क्रिप्ट लोड कर देगा।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Google Analytics 4 Measurement ID
                </label>
                <input
                  type="text"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full text-xs font-mono px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Google Analytics डैशबोर्ड में Data Streams से अपनी G- ID कॉपी करें।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Google AdSense Publisher Client ID
                </label>
                <input
                  type="text"
                  value={adsenseClientId}
                  onChange={(e) => setAdsenseClientId(e.target.value)}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="w-full text-xs font-mono px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Google AdSense खाते से अपनी पब्लिशर आईडी दर्ज करें।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BRANDING */}
        {activeTab === 'branding' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700" />
                <span>पोर्टल ब्रांडिंग व मूल विवरण</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                पोर्टल का नाम एवं मुख्य टैगलाइन जो सर्च इंजन और सोशल मीडिया शेयरिंग में दिखती है।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  न्यूज़ पोर्टल का नाम (Portal Name)
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="उदा. अपना बीकानेर / थार मीडिया"
                  className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  टैगलाइन (Tagline / Slogan)
                </label>
                <input
                  type="text"
                  value={siteTagline}
                  onChange={(e) => setSiteTagline(e.target.value)}
                  placeholder="उदा. सत्य, निष्पक्षता और मरुधरा की सच्ची आवाज"
                  className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'सेव हो रहा है...' : 'सभी सेटिंग्स सुरक्षित करें (Save Changes)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

