'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Vote, 
  ArrowLeft, 
  PlusCircle, 
  Trash2, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';

interface OptionItem {
  text: string;
  image: string;
  isUploading?: boolean;
}

export default function CreatePollPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('राजनीति व सियासत');
  const [options, setOptions] = useState<OptionItem[]>([
    { text: 'भारतीय जनता पार्टी (BJP)', image: '' },
    { text: 'भारतीय राष्ट्रीय कांग्रेस (INC)', image: '' },
    { text: 'अन्य / निर्दलीय उम्मीदवार', image: '' },
  ]);
  const [timerType, setTimerType] = useState<'none' | '24h' | '3d' | '7d' | '30d' | 'custom'>('3d');
  const [customExpiresAt, setCustomExpiresAt] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, { text: '', image: '' }]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionTextChange = (index: number, text: string) => {
    const updated = [...options];
    updated[index].text = text;
    setOptions(updated);
  };

  const handleOptionImageChange = (index: number, image: string) => {
    const updated = [...options];
    updated[index].image = image;
    setOptions(updated);
  };

  const handleFileUpload = async (index: number, file: File) => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('image', file);

    const updated = [...options];
    updated[index].isUploading = true;
    setOptions([...updated]);

    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/polls/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        updated[index].image = data.url;
      } else {
        alert(data.message || 'फोटो अपलोड करने में त्रुटि आई');
      }
    } catch {
      alert('अपलोड सर्वर से कनेक्ट नहीं हो सका');
    } finally {
      updated[index].isUploading = false;
      setOptions([...updated]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('कृपया सर्वेक्षण का मुख्य प्रश्न दर्ज करें।');
      return;
    }

    const validOptions = options
      .map((o) => ({
        text: o.text.trim(),
        image: o.image.trim() || null,
      }))
      .filter((o) => o.text.length > 0);

    if (validOptions.length < 2) {
      setError('कम से कम 2 वैध विकल्प होना आवश्यक है।');
      return;
    }

    if (timerType === 'custom' && !customExpiresAt) {
      setError('कृपया कस्टम समाप्ति तारीख एवं समय चुनें।');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('admin_token');
      const payload: any = {
        title: title.trim(),
        description: description.trim() || null,
        category,
        options: validOptions,
        timer_type: timerType,
        is_featured: isFeatured,
        status,
      };

      if (timerType === 'custom' && customExpiresAt) {
        payload.expires_at = customExpiresAt;
      }

      const res = await fetch(`${API_BASE}/api/v1/admin/polls`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'सर्वेक्षण बनाने में त्रुटि आई');
      }

      router.push('/admin/polls');
    } catch (e: any) {
      setError(e.message || 'तकनीकी त्रुटि आई');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/polls"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>सर्वेक्षण सूची पर वापस जाएं</span>
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center shadow-md">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              नया जनमत सर्वेक्षण बनाएं (Create Poll with Party/Option Images)
            </h1>
            <p className="text-xs text-slate-500">
              विकल्पों के लिए पार्टी चुनाव चिन्ह (BJP, कांग्रेस, आदि) या उम्मीदवारों की फोटो भी अपलोड कर सकते हैं।
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* 1. Poll Title / Question */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-900 text-sm">
              सर्वेक्षण प्रश्न (Poll Question) *
            </label>
            <textarea
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा. क्या राजस्थान में आगामी विधानसभा उपचुनाव में किस दल को बढ़त मिलेगी?"
              className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium leading-relaxed"
              required
            />
            <span className="text-[11px] text-slate-400">
              प्रश्न संक्षिप्त, स्पष्ट और जनरुचि का होना चाहिए।
            </span>
          </div>

          {/* 2. Category & Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-800">
                विषय / श्रेणी (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              >
                <option value="राजनीति व सियासत">राजनीति व सियासत</option>
                <option value="कृषि व ग्रामीण विकास">कृषि व ग्रामीण विकास</option>
                <option value="शिक्षा व रोजगार">शिक्षा व रोजगार</option>
                <option value="विकास व अर्थव्यवस्था">विकास व अर्थव्यवस्था</option>
                <option value="राजस्थान स्थानीय">राजस्थान स्थानीय</option>
                <option value="जनमत व समाज">जनमत व समाज</option>
                <option value="खेल व युवा">खेल व युवा</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-800">
                प्रकाशन स्थिति (Status)
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              >
                <option value="active">तुरंत लाइव करें (Active)</option>
                <option value="draft">ड्राफ्ट रखें (Draft)</option>
              </select>
            </div>
          </div>

          {/* Context / Background description */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">
              संदर्भ या पृष्ठभूमि (Optional Details)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="उदा. विधानसभा क्षेत्रों के मतदाताओं की राय और मूड..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* 3. Dynamic Options List with Image Upload */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-bold text-slate-900 text-sm">
                  मतदान विकल्प एवं लोगो/फोटो (Voting Options & Symbols) *
                </label>
                <span className="text-[11px] text-slate-500">
                  हर विकल्प के साथ पार्टी का चुनाव चिन्ह या फोटो अपलोड कर सकते हैं।
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {options.length} / 6 विकल्प
              </span>
            </div>

            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={idx} className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      placeholder={`विकल्प ${idx + 1} का नाम (उदा. बीजेपी, कांग्रेस, आप)...`}
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-bold text-xs"
                      required
                    />

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="विकल्प हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Image Symbol / Photo Row */}
                  <div className="flex flex-wrap items-center gap-2.5 pl-8">
                    {opt.image ? (
                      <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                        <img 
                          src={opt.image} 
                          alt="Option symbol" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                          className="w-7 h-7 object-contain rounded-md bg-slate-50 border p-0.5" 
                        />
                        <span className="text-[11px] text-slate-600 truncate max-w-[180px]">
                          लोगो / फोटो जुड़ी है
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOptionImageChange(idx, '')}
                          className="text-slate-400 hover:text-red-600 ml-1 cursor-pointer"
                          title="फोटो हटाएं"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
                        {/* File Upload Button */}
                        <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 hover:border-red-500 bg-white text-slate-600 hover:text-red-600 font-semibold cursor-pointer transition text-[11px]">
                          <Upload className="w-3 h-3" />
                          <span>{opt.isUploading ? 'अपलोड हो रहा है...' : 'लोगो / फोटो अपलोड करें'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={opt.isUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(idx, file);
                            }}
                            className="hidden"
                          />
                        </label>

                        <span className="text-slate-400 text-[11px]">या</span>

                        {/* URL input */}
                        <input
                          type="url"
                          placeholder="फोटो का वेब लिंक (URL) डालें..."
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              handleOptionImageChange(idx, e.target.value.trim());
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] w-48 focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {options.length < 6 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-2 text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ अन्य विकल्प जोड़ें</span>
              </button>
            )}
          </div>

          {/* 4. Timer & Expiration Setting */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>मतदान समय सीमा (Poll Timer & Duration)</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { key: '24h', label: '24 घंटे (1 दिन)' },
                { key: '3d', label: '3 दिन (72h)' },
                { key: '7d', label: '7 दिन (1 हफ्ता)' },
                { key: '30d', label: '30 दिन (1 माह)' },
                { key: 'custom', label: 'कस्टम तारीख' },
                { key: 'none', label: 'सदाबहार (No limit)' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setTimerType(item.key as any)}
                  className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                    timerType === item.key
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {timerType === 'custom' && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 mt-2">
                <label className="block font-bold text-amber-900">
                  कस्टम समाप्ति तारीख एवं समय चुनें:
                </label>
                <input
                  type="datetime-local"
                  value={customExpiresAt}
                  onChange={(e) => setCustomExpiresAt(e.target.value)}
                  className="p-2 rounded-lg border border-amber-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          {/* 5. Featured Toggle */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">होमपेज एवं साइडबार पर दिखाएं (Featured Poll)</span>
              <span className="text-[11px] text-slate-400">इसे चेक करने पर यह सर्वेक्षण मुख्य पृष्ठ पर प्रमुखता से प्रदर्शित होगा।</span>
            </div>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 accent-red-600 rounded cursor-pointer"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/admin/polls"
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition"
            >
              रद्द करें
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>प्रकाशित हो रहा है...</span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Vote className="w-4 h-4" />
                  <span>सर्वेक्षण प्रकाशित करें (Publish Poll)</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
