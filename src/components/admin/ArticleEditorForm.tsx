'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  Sparkles,
  Search,
  History,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Flame,
  Star,
  MapPin,
  ExternalLink,
  Eye,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { Category, Location } from '@/lib/types';

interface ArticleEditorFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function ArticleEditorForm({ initialData, isEdit = false }: ArticleEditorFormProps) {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [titleEn, setTitleEn] = useState(initialData?.title_en || '');
  const [shortHeadline, setShortHeadline] = useState(initialData?.short_headline || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || '');
  const [imageCaption, setImageCaption] = useState(initialData?.image_caption || '');
  const [imageAlt, setImageAlt] = useState(initialData?.image_alt || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [locationId, setLocationId] = useState(initialData?.location_id || '');
  const [district, setDistrict] = useState(initialData?.district || 'Jaipur');
  const [city, setCity] = useState(initialData?.city || '');
  const [reporterName, setReporterName] = useState(initialData?.reporter_name || '');
  const [originalSourceName, setOriginalSourceName] = useState(initialData?.original_source_name || '');
  const [originalSourceUrl, setOriginalSourceUrl] = useState(initialData?.original_source_url || '');
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || '');
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonical_url || '');
  const [focusKeyword, setFocusKeyword] = useState(initialData?.focus_keyword || '');
  const [schemaType, setSchemaType] = useState(initialData?.schema_type || 'NewsArticle');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [isBreaking, setIsBreaking] = useState(initialData?.is_breaking || false);
  const [isTrending, setIsTrending] = useState(initialData?.is_trending || false);
  const [status, setStatus] = useState(initialData?.status || 'published');
  const [verificationStatus, setVerificationStatus] = useState(initialData?.editorial_verification_status || 'verified');
  const [correctionNotes, setCorrectionNotes] = useState(initialData?.correction_notes || '');
  const [changeSummary, setChangeSummary] = useState('');

  // Revisions & Duplicate Detection
  const [revisions, setRevisions] = useState<any[]>(initialData?.revisions || []);
  const [duplicateWarning, setDuplicateWarning] = useState<any>(null);
  const [showRevisionDrawer, setShowRevisionDrawer] = useState(false);
  const [comparingRevision, setComparingRevision] = useState<any>(null);

  // Categories & Locations state
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [saving, setSaving] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load categories and locations
    fetch('/api/v1/categories').then((r) => r.json()).then(setCategories).catch(() => {});
    fetch('/api/v1/locations').then((r) => r.json()).then(setLocations).catch(() => {});
  }, []);

  // Check Duplicate on Title blur
  const checkDuplicate = async () => {
    if (!title || title.length < 5) return;
    try {
      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams({ title });
      if (initialData?.id) params.set('exclude_id', String(initialData.id));

      const res = await fetch(`/api/v1/admin/articles/check-duplicate?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDuplicateWarning(data.is_duplicate ? data.duplicate_article : null);
      }
    } catch {
      // ignore
    }
  };

  // AI Assistant: Generate Summary and Highlights
  const runAiAssistant = async () => {
    if (!title || !content) {
      alert('कृपया पहले शीर्षक और कुछ सामग्री दर्ज करें।');
      return;
    }
    setAiProcessing(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/v1/admin/articles/ai-process', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          source_name: originalSourceName || 'संवाददाता',
        }),
      });

      if (res.ok) {
        const aiData = await res.json();
        if (aiData.summary) setSummary(aiData.summary);
        if (aiData.short_headline) setShortHeadline(aiData.short_headline);
        if (aiData.content) setContent(aiData.content);
        if (aiData.meta_title) setMetaTitle(aiData.meta_title);
        if (aiData.meta_description) setMetaDescription(aiData.meta_description);
        if (aiData.focus_keyword) setFocusKeyword(aiData.focus_keyword);
        if (aiData.district) setDistrict(aiData.district);
        if (aiData.category_id && !categoryId) setCategoryId(aiData.category_id);
        setMessage({ type: 'success', text: 'AI द्वारा हिंदी समाचार सारांश व मुख्य बिंदु तैयार किए गए!' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: 'AI संसाधन में त्रुटि हुई।' });
    } finally {
      setAiProcessing(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      title,
      title_en: titleEn || null,
      short_headline: shortHeadline || null,
      slug: slug || null,
      summary,
      content,
      featured_image: featuredImage || null,
      image_caption: imageCaption || null,
      image_alt: imageAlt || title,
      category_id: categoryId || null,
      location_id: locationId || null,
      state: 'Rajasthan',
      district,
      city: city || null,
      reporter_name: reporterName || null,
      original_source_name: originalSourceName || null,
      original_source_url: originalSourceUrl || null,
      meta_title: metaTitle || title,
      meta_description: metaDescription || summary,
      canonical_url: canonicalUrl || null,
      focus_keyword: focusKeyword || null,
      schema_type: schemaType,
      is_featured: isFeatured,
      is_breaking: isBreaking,
      is_trending: isTrending,
      status,
      editorial_verification_status: verificationStatus,
      correction_notes: correctionNotes || null,
      change_summary: changeSummary || 'संपादकीय अद्यतन',
    };

    try {
      const token = localStorage.getItem('admin_token');
      const url = isEdit ? `/api/v1/admin/articles/${initialData.id}` : '/api/v1/admin/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'समाचार सुरक्षित करने में समस्या हुई।');
      }

      setMessage({ type: 'success', text: 'समाचार सफलतापूर्वक सुरक्षित किया गया!' });

      if (!isEdit) {
        router.push(`/admin/articles/${data.id}/edit`);
      } else {
        if (data.revisions) {
          setRevisions(data.revisions);
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'त्रुटि हुई' });
    } finally {
      setSaving(false);
    }
  };

  // Restore Revision
  const handleRestoreRevision = async (revId: number) => {
    if (!confirm('क्या आप इस पूर्व संशोधन (Revision) को पुनर्स्थापित करना चाहते हैं?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/v1/admin/articles/${initialData.id}/revisions/${revId}/restore`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const art = data.article;
        setTitle(art.title);
        setSummary(art.summary || '');
        setContent(art.content || '');
        setComparingRevision(null);
        setShowRevisionDrawer(false);
        setMessage({ type: 'success', text: `संशोधन #${revId} पुनर्स्थापित हुआ!` });
      }
    } catch (e: any) {
      alert('संशोधन पुनर्स्थापित करने में त्रुटि: ' + e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="text-xs text-slate-500 hover:text-red-600 font-bold">
            ← समाचार सूची
          </Link>
          <span className="text-slate-300">|</span>
          <span className="font-extrabold text-sm text-slate-900">
            {isEdit ? `संपादित करें: #${initialData?.id}` : 'नया समाचार लिखें (New Article)'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runAiAssistant}
            disabled={aiProcessing}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiProcessing ? 'AI विश्लेषक सक्रिय...' : 'AI से सारांश व मुख्य बिंदु बनाएं'}</span>
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={() => setShowRevisionDrawer(!showRevisionDrawer)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>संशोधन इतिहास ({revisions.length})</span>
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'सुरक्षित हो रहा है...' : 'प्रकाशित / सुरक्षित करें'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Duplicate Warning Alert */}
      {duplicateWarning && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>संभावित डुप्लिकेट समाचार का पता चला:</strong> शीर्षक &ldquo;{duplicateWarning.title}&rdquo; (ID: #{duplicateWarning.id}) से मिलता-जुलता है।
            </span>
          </div>
          <Link
            href={`/admin/articles/${duplicateWarning.id}/edit`}
            target="_blank"
            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded text-xs shrink-0"
          >
            मौजूदा खबर देखें →
          </Link>
        </div>
      )}

      {/* Editor Grid: Main Form (8 cols) + Right Sidebar Meta (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Headline, Content & Media (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                मुख्य हिंदी शीर्षक (Headline) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={checkDuplicate}
                required
                placeholder="आकर्षक एवं तथ्यपरक हिंदी हेडलाइन दर्ज करें..."
                className="w-full text-base font-bold px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  संक्षिप्त हेडलाइन (Short Headline / Ticker)
                </label>
                <input
                  type="text"
                  value={shortHeadline}
                  onChange={(e) => setShortHeadline(e.target.value)}
                  placeholder="ब्रेकिंग टिकर के लिए पंचलाइन..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  कस्टम यूआरएल स्लग (URL Slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="rajasthan-news-slug-2026"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                प्रारंभिक सारांश / लीड (Short Summary - 2-3 पंक्तियां)
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                placeholder="समाचार की मुख्य भूमिका जो पाठकों को आकर्षित करे..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>विस्तृत समाचार सामग्री (Full Article HTML/Rich Content) *</span>
                <span className="text-[11px] font-normal text-slate-400">HTML टैग्स समर्थित हैं</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                required
                placeholder="<p>जयपुर। समाचार का पूर्ण विवरण यहाँ लिखें...</p>"
                className="w-full text-xs sm:text-sm font-mono px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50 focus:bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* Media & Images Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-red-600" />
              <span>मुख्य छवि एवं मीडिया (Featured Image)</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                मुख्य तस्वीर यूआरएल (Image URL)
              </label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {featuredImage && (
              <div className="w-48 aspect-16/10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  चित्र कैप्शन (Image Caption)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="चित्र का विवरण या क्रेडिट..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  इमेज Alt टेक्स्ट (SEO के लिए)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="तस्वीर का विवरण..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* SEO & Search Engine Optimization Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              सर्च इंजन अनुकूलन (Advanced SEO & Meta)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  फोकस कीवर्ड (Focus Keyword)
                </label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="जैसे: REET 2026, बीकानेर मौसम"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Schema प्रकार (Schema Type)
                </label>
                <select
                  value={schemaType}
                  onChange={(e) => setSchemaType(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="NewsArticle">NewsArticle (Google News अनुशंसित)</option>
                  <option value="Article">Standard Article</option>
                  <option value="Report">Official Report</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                एसईओ शीर्षक (Meta Title - अधिकतम 60 अक्षर)
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Google SERP में प्रदर्शित होने वाला शीर्षक..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                एसईओ मेटा विवरण (Meta Description - 150-160 अक्षर)
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                placeholder="Google सर्च स्निपेट के लिए विवरण..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                कैनोनिकल यूआरएल (Canonical URL)
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Taxonomy, Status & Flags (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Publication Settings Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              प्रकाशन स्थिति (Publishing)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                स्थिति (Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="published">🟢 प्रकाशित (Published)</option>
                <option value="pending_review">🟡 समीक्षा हेतु लंबित (Pending Review)</option>
                <option value="draft">⚪ ड्राफ्ट (Draft)</option>
                <option value="scheduled">🔵 शेड्यूल करें (Scheduled)</option>
                <option value="archived">⚫ संग्रहीत (Archived)</option>
              </select>
            </div>

            {isEdit && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  संशोधन टिप्पणी (Change Summary) *
                </label>
                <input
                  type="text"
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder="जैसे: नए आंकड़े जोड़े गए"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            )}

            {/* Flags */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span className="font-bold text-red-600">⚡ ब्रेकिंग न्यूज़ फ्लैश (Breaking News)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span className="font-semibold text-slate-800">⭐ मुख्य पृष्ठ लीड स्टोरी (Featured)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">🔥 ट्रेंडिंग सेक्शन में दिखाएं</span>
              </label>
            </div>
          </div>

          {/* Categorization & Local Geography Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              श्रेणी एवं राजस्थान जिला (Taxonomy)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                श्रेणी (Category) *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="">-- श्रेणी चुनें --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_hi} ({c.name_en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                राजस्थान जिला (District) *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                {['Jaipur', 'Bikaner', 'Jodhpur', 'Kota', 'Udaipur', 'Ajmer', 'Jaisalmer', 'Barmer', 'Sikar', 'Alwar', 'Bhilwara', 'Nagaur'].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                शहर / कस्बा / गांव (Locality)
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="जैसे: गजनेर, सांगानेर"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          {/* Attribution & Reporter Info Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              स्रोत एवं संवाददाता (Attribution)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                रिपोर्टर / संवाददाता का नाम
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="सुरेश विश्नोई (बीकानेर ब्यूरो)"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                मूल स्रोत नाम (Source Name)
              </label>
              <input
                type="text"
                value={originalSourceName}
                onChange={(e) => setOriginalSourceName(e.target.value)}
                placeholder="DIPR Rajasthan / PTI"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                मूल स्रोत लिंक (Source URL)
              </label>
              <input
                type="url"
                value={originalSourceUrl}
                onChange={(e) => setOriginalSourceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Revision Drawer / Version History */}
      {showRevisionDrawer && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-slate-200 z-50 p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-red-600" />
              <span>संशोधन इतिहास (Revisions)</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowRevisionDrawer(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕ बंद करें
            </button>
          </div>

          <p className="text-xs text-slate-500">
            हर बार प्रकाशित लेख को अपडेट करने पर पुराना संस्करण यहाँ सुरक्षित हो जाता है।
          </p>

          <div className="space-y-3">
            {revisions.map((rev) => (
              <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-bold text-slate-800">संशोधन #{rev.id}</span>
                  <span>{new Date(rev.created_at).toLocaleDateString('hi-IN')}</span>
                </div>
                <div className="font-bold text-slate-900 line-clamp-1">{rev.title}</div>
                {rev.change_summary && (
                  <div className="text-[11px] text-slate-600 bg-white p-1.5 rounded border border-slate-100">
                    टिप्पणी: {rev.change_summary}
                  </div>
                )}
                <div className="pt-1 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleRestoreRevision(rev.id)}
                    className="px-2.5 py-1 rounded bg-red-600 text-white font-bold text-[11px] hover:bg-red-700 cursor-pointer"
                  >
                    इस संस्करण को पुनर्स्थापित करें
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

