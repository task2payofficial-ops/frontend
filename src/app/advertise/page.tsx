import React from 'react';
import { Metadata } from 'next';
import { TrendingUp, Users, Smartphone, Mail, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'विज्ञापन दें (Advertise With Us) | राजस्थान समाचार',
  description: 'राजस्थान के 50+ लाख मासिक पाठकों तक अपने ब्रांड और उत्पाद का प्रचार करें।',
};

export default function AdvertisePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-8">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            डिजिटल ब्रांडिंग एवं साझेदारी
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            राजस्थान समाचार पर विज्ञापन दें
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            राजस्थान के हर शहर, कस्बे और गांव में सक्रिय पाठकों के साथ अपने व्यवसाय को नई ऊंचाइयों पर पहुंचाएं।
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <Users className="w-6 h-6 text-red-600 mx-auto mb-1.5" />
            <div className="text-2xl font-black text-slate-900">25 लाख+</div>
            <div className="text-xs text-slate-500">मासिक सक्रिय पाठक</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <Smartphone className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
            <div className="text-2xl font-black text-slate-900">85%</div>
            <div className="text-xs text-slate-500">मोबाइल एंगेजमेंट</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
            <div className="text-2xl font-black text-slate-900">50+ जिले</div>
            <div className="text-xs text-slate-500">राजस्थान में जमीनी पहुंच</div>
          </div>
        </div>

        {/* Ad Formats */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">उपलब्ध विज्ञापन प्रारूप (Ad Formats):</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <li className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>हेडर लीडरबोर्ड बैनर (728x90 / 320x50)</span>
            </li>
            <li className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>प्रीमियम साइडबार बैनर (300x250 / 336x280)</span>
            </li>
            <li className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>इन-आर्टिकल नेटिव स्पॉन्सर्ड कार्ड</span>
            </li>
            <li className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>जिला-वार लक्षित (District-Targeted) विज्ञापन</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base">दर सूची (Rate Card) एवं प्रस्ताव प्राप्त करें</h3>
            <p className="text-xs text-slate-400 mt-1">हमारी विज्ञापन टीम 24 घंटे के भीतर संपर्क करेगी।</p>
          </div>
          <a
            href="mailto:ads@rajasthansamachar.com"
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition shrink-0"
          >
            ads@rajasthansamachar.com
          </a>
        </div>
      </div>
    </main>
  );
}

