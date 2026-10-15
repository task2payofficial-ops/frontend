import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Award, Heart, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'हमारे बारे में (About Us) | राजस्थान समाचार',
  description: 'राजस्थान समाचार की यात्रा, विजन, मिशन और संपादकीय नेतृत्व।',
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            परिचय एवं दृष्टि
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            राजस्थान समाचार: सत्य और जनसरोकार का प्रतीक
          </h1>
        </div>

        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            <strong>राजस्थान समाचार</strong> डिजिटल युग में राजस्थान की सांस्कृतिक विरासत, विकासात्मक उपलब्धियों और जनता की जमीनी समस्याओं को निर्भीकता से उठाने वाला प्रमुख हिंदी डिजिटल न्यूज़ पोर्टल है।
          </p>

          <p>
            जयपुर में स्थापित हमारे केंद्रीय समाचार कक्ष और राज्य के सभी 50 जिलों में फैले संवाददाताओं के नेटवर्क के जरिए हम 24x7 सटीक, निष्पक्ष और तथ्यपरक खबरें प्रसारित करते हैं।
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-3">हमारा मूल संकल्प:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-red-600" /> शून्य फेक न्यूज़ नीति
              </h3>
              <p className="text-xs text-slate-600">
                प्रत्येक खबर का प्रकाशन कठोर संपादकीय समीक्षा और फैक्ट-चेकिंग के बाद ही किया जाता है।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-red-600" /> ग्रामीण राजस्थान को प्राथमिकता
              </h3>
              <p className="text-xs text-slate-600">
                गांवों, किसानों, ढाणियों और वंचित वर्गों की समस्याओं को मुखरता से मंच प्रदान करना।
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

