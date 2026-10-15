import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'नियम एवं शर्तें (Terms of Use) | राजस्थान समाचार',
  description: 'राजस्थान समाचार पोर्टल के उपयोग की शर्तें एवं नियम।',
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100">
          नियम एवं शर्तें (Terms of Use)
        </h1>
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            राजस्थान समाचार पोर्टल का उपयोग करके आप इन नियमों और शर्तों से बंधे होने की सहमति देते हैं। यदि आप इन शर्तों से असहमत हैं, तो कृपया पोर्टल का उपयोग न करें।
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">1. कॉपीराइट एवं बौद्धिक संपदा</h2>
          <p>
            इस पोर्टल पर प्रकाशित सभी समाचार, लेख, ग्राफिक्स और लोगो राजस्थान समाचार अथवा इसके संबंधित सूचना प्रदाताओं के कॉपीराइट हैं। बिना लिखित अनुमति के किसी भी सामग्री का व्यावसायिक उपयोग पूर्णतः निषिद्ध है।
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">2. कानूनी क्षेत्राधिकार</h2>
          <p>
            इस पोर्टल से संबंधित किसी भी विवाद का निपटारा केवल जयपुर (राजस्थान) स्थित न्यायालयों के अधिकार क्षेत्र के अंतर्गत होगा।
          </p>
        </div>
      </div>
    </main>
  );
}

