import React from 'react';
import { Metadata } from 'next';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'सुधार नीति (Corrections Policy) | राजस्थान समाचार',
  description: 'राजस्थान समाचार की पारदर्शी सुधार नीति और त्रुटि निवारण प्रक्रिया।',
};

export default function CorrectionsPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-4 h-4" /> पारदर्शिता एवं उत्तरदायित्व
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            सुधार नीति (Corrections Policy)
          </h1>
        </div>

        <section className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            <strong>राजस्थान समाचार</strong> अपनी रिपोर्टिंग में 100% सटीकता का प्रयास करता है। फिर भी यदि किसी खबर में अनजाने में कोई तथ्यात्मक त्रुटि रह जाती है, तो हम उसे तुरंत और पारदर्शी तरीके से सुधारने के लिए प्रतिबद्ध हैं।
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">
            त्रुटि सुधार प्रक्रिया:
          </h2>
          <ul className="list-disc list-inside space-y-2 text-slate-600">
            <li><strong>त्वरित संशोधन:</strong> तथ्यात्मक त्रुटि संज्ञान में आते ही संबंधित रिपोर्ट को तुरंत अपडेट किया जाता है।</li>
            <li><strong>संपादकीय नोट (Editorial Note):</strong> खबर के अंत में स्पष्ट रूप से लिखा जाता है कि मूल लेख में क्या गलती थी और उसे कब संशोधित किया गया।</li>
            <li><strong>पिछला संस्करण सुरक्षित:</strong> हमारे डेटाबेस में लेख का पिछला संशोधन हमेशा सुरक्षित रहता है ताकि कोई भी मनमाना फेरबदल न हो सके।</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 pt-2">
            त्रुटि की सूचना कैसे दें?
          </h2>
          <p>
            यदि आपको किसी खबर में तथ्य, नाम, तारीख या आंकड़े में कोई गड़बड़ी दिखे, तो कृपया खबर के लिंक और सही संदर्भ के साथ हमारे संपादकीय डेस्क को ईमेल करें:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-red-600">
            corrections@rajasthansamachar.com
          </div>
        </section>
      </div>
    </main>
  );
}

