import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'संपादकीय नीति (Editorial Policy) | राजस्थान समाचार',
  description: 'राजस्थान समाचार की संपादकीय नीति, निष्पक्षता के मानक और डिजिटल आचार संहिता।',
};

export default function EditorialPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" /> संपादकीय मानक एवं दिशानिर्देश
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            संपादकीय नीति (Editorial Policy)
          </h1>
        </div>

        <section className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            <strong>राजस्थान समाचार</strong> निष्पक्ष, तथ्यपरक और जनसरोकार से जुड़ी पत्रकारिता के प्रति पूर्णतः प्रतिबद्ध है। हमारा प्राथमिक ध्येय पाठकों तक बिना किसी पूर्वाग्रह के सत्य और प्रामाणिक सूचनाएं पहुंचाना है।
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. सत्यता और तथ्य-जांच (Fact-Checking)
          </h2>
          <p>
            हम किसी भी समाचार को प्रकाशित करने से पूर्व उसके मूल स्रोतों, आधिकारिक दस्तावेजों, अधिकृत प्रवक्ताओं और प्रत्यक्षदर्शियों से पुष्टि करते हैं। अपुष्ट या भ्रामक अफवाहों को हमारे मंच पर कोई स्थान नहीं दिया जाता।
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 2. निष्पक्षता एवं संतुलन
          </h2>
          <p>
            विवादास्पद या संवेदनशील मामलों में हम सभी पक्षों को अपनी बात रखने का समान अवसर प्रदान करते हैं। समाचार और व्यक्तिगत राय (Opinions) के बीच स्पष्ट भेद रखा जाता है।
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3. स्रोत आभार एवं कॉपीराइट सम्मान
          </h2>
          <p>
            समाचार एजेंसियों (जैसे PTI, भाषा, सरकारी पीआर विंग्स) से प्राप्त सूचनाओं में मूल स्रोत का स्पष्ट उल्लेख अनिवार्य रूप से किया जाता है। किसी भी अन्य प्रकाशक के कॉपीराइट का उल्लंघन नहीं किया जाता।
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 4. डिजिटल मीडिया आचार संहिता 2021
          </h2>
          <p>
            हम भारत सरकार के सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम, 2021 के प्रावधानों का पूर्ण सम्मान करते हैं तथा निर्धारित त्रि-स्तरीय शिकायत निवारण तंत्र का पालन करते हैं।
          </p>
        </section>
      </div>
    </main>
  );
}

