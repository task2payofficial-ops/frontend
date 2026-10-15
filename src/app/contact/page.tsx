import React from 'react';
import { Metadata } from 'next';
import { MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'संपर्क करें एवं शिकायत अधिकारी | राजस्थान समाचार',
  description: 'राजस्थान समाचार संपादकीय कार्यालय का पता, फोन नंबर और शिकायत निवारण अधिकारी की जानकारी।',
};

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            संपर्क करें (Contact Us)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            समाचार सुझाव, फीडबैक या विज्ञापन के लिए हमारे कार्यालय से संपर्क करें
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <MapPin className="w-6 h-6 text-red-600" />
            <h3 className="font-bold text-slate-900 text-sm">संपादकीय कार्यालय</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              राजस्थान समाचार मीडिया भवन, प्रेस एन्क्लेव, मालवीय नगर, जयपुर, राजस्थान - 302017
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <Mail className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">ईमेल संपर्क</h3>
            <p className="text-xs text-slate-600">
              संपादक: editor@rajasthansamachar.com<br />
              सामान्य: info@rajasthansamachar.com
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <Phone className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">हेल्पलाइन नंबर</h3>
            <p className="text-xs text-slate-600">
              +91 141 2780000<br />
              समय: 10:00 AM - 06:00 PM (सोमवार - शनिवार)
            </p>
          </div>
        </div>

        {/* Grievance Officer Box */}
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <span>शिकायत निवारण अधिकारी (Grievance Redressal Officer)</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम 2021 के नियम 11 के तहत डिजिटल मीडिया सामग्री से जुड़ी किसी भी शिकायत के निवारण के लिए नियुक्त अधिकारी:
          </p>
          <div className="text-xs text-slate-800 font-medium">
            <strong>नाम:</strong> श्री विक्रम सिंह राठौड़ (विधिक सलाहकार)<br />
            <strong>ईमेल:</strong> grievance@rajasthansamachar.com<br />
            <strong>पता:</strong> लीगल सेल, राजस्थान समाचार, जयपुर।
          </div>
        </div>
      </div>
    </main>
  );
}

