import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) | राजस्थान समाचार',
  description: 'राजस्थान समाचार की गोपनीयता नीति और डेटा सुरक्षा दिशानिर्देश।',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100">
          गोपनीयता नीति (Privacy Policy)
        </h1>
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            राजस्थान समाचार में हम अपने पाठकों की गोपनीयता का पूरा सम्मान करते हैं। यह नीति स्पष्ट करती है कि हमारी वेबसाइट पर आने वाले आगंतुकों की जानकारी का उपयोग किस प्रकार किया जाता है।
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">1. सूचना संग्रह</h2>
          <p>
            हम सामान्य सर्वर लॉग्स, आईपी पते, ब्राउज़र प्रकार और कुकीज़ के माध्यम से केवल वेबसाइट की कार्यप्रणाली, सुरक्षा और प्रदर्शन को बेहतर बनाने के उद्देश्य से डेटा संग्रहीत करते हैं।
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">2. कुकीज़ एवं गूगल विज्ञापन</h2>
          <p>
            हमारी वेबसाइट पर Google AdSense तथा तृतीय-पक्ष विज्ञापनदाता प्रासंगिक विज्ञापन प्रदर्शित करने के लिए कुकीज़ का उपयोग कर सकते हैं। पाठक अपनी ब्राउज़र सेटिंग्स से कुकीज़ को नियंत्रित कर सकते हैं।
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">3. डेटा सुरक्षा</h2>
          <p>
            हम किसी भी व्यक्तिगत पहचान योग्य जानकारी को किसी बाहरी व्यक्ति या संस्था को न तो बेचते हैं और न ही किराए पर देते हैं।
          </p>
        </div>
      </div>
    </main>
  );
}

