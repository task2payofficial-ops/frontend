'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rss, ShieldCheck, Mail, MapPin, Phone, Heart } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Do not render public footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t-4 border-red-600 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* 1. Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-red-700 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md border border-red-500/30">
                अ
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-white tracking-tight">
                  अपना <span className="text-red-500">बीकानेर</span>
                </span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded">
                  APNA BIKANER
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              अपना बीकानेर (Apna Bikaner) बीकानेर व राजस्थान का प्रमुख और निर्भीक डिजिटल समाचार नेटवर्क है। हमारा संकल्प निष्पक्ष पत्रकारिता, तथ्यपरक विश्लेषण और जमीनी स्तर पर जनता की आवाज को मजबूती प्रदान करना है।
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-500" /> बीकानेर, राजस्थान, भारत</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-500" /> editor@apnabikaner.com</span>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              प्रमुख श्रेणियां
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><Link href="/polls" className="text-amber-400 font-bold hover:text-amber-300 transition">📊 जनमत पोल (Live Polls)</Link></li>
              <li><Link href="/category/rajasthan" className="hover:text-red-400 transition">राजस्थान हलचल</Link></li>
              <li><Link href="/category/politics" className="hover:text-red-400 transition">राजनीति व सियासत</Link></li>
              <li><Link href="/category/jobs-education" className="hover:text-red-400 transition">नौकरी एवं शिक्षा (REET)</Link></li>
              <li><Link href="/category/agriculture" className="hover:text-red-400 transition">कृषि, मंडी व मौसम</Link></li>
              <li><Link href="/category/crime" className="hover:text-red-400 transition">क्राइम व कानून</Link></li>
              <li><Link href="/gallery" className="hover:text-red-400 transition">फोटो व वीडियो गैलरी</Link></li>
            </ul>
          </div>

          {/* 3. Rajasthan Districts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              जिलावार समाचार
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><Link href="/location/jaipur" className="hover:text-red-400 transition">जयपुर समाचार</Link></li>
              <li><Link href="/location/bikaner" className="hover:text-red-400 transition">बीकानेर हलचल</Link></li>
              <li><Link href="/location/jodhpur" className="hover:text-red-400 transition">जोधपुर बुलेटिन</Link></li>
              <li><Link href="/location/jaisalmer" className="hover:text-red-400 transition">जैसलमेर व बाड़मेर</Link></li>
              <li><Link href="/location/kota" className="hover:text-red-400 transition">कोटा शिक्षा नगरी</Link></li>
              <li><Link href="/location/udaipur" className="hover:text-red-400 transition">उदयपुर लेकसिटी</Link></li>
            </ul>
          </div>

          {/* 4. Editorial Policies & Compliance */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              संपादकीय नीतियां
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><Link href="/editorial-policy" className="hover:text-red-400 transition">संपादकीय नीति (Editorial Policy)</Link></li>
              <li><Link href="/corrections-policy" className="hover:text-red-400 transition">सुधार नीति (Corrections Policy)</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-red-400 transition">गोपनीयता नीति (Privacy Policy)</Link></li>
              <li><Link href="/terms" className="hover:text-red-400 transition">नियम व शर्तें (Terms of Use)</Link></li>
              <li><Link href="/advertise" className="hover:text-red-400 transition">विज्ञापन दें (Advertise With Us)</Link></li>
              <li><Link href="/contact" className="hover:text-red-400 transition">संपर्क करें व शिकायत अधिकारी</Link></li>
            </ul>
          </div>
        </div>

        {/* SEO Feeds & Sitemaps Badges */}
        <div className="pt-6 pb-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">तकनीकी व सिंडिकेशन:</span>
            <Link href="/sitemap.xml" target="_blank" className="hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded">
              XML साइटमैप
            </Link>
            <Link href="/sitemap-news.xml" target="_blank" className="hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded text-amber-400">
              Google News साइटमैप
            </Link>
            <Link href="/rss.xml" target="_blank" className="hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded text-orange-400">
              <Rss className="w-3 h-3" /> RSS फीड्स
            </Link>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>डिजिटल मीडिया आचार संहिता 2021 के अनुरूप प्रमाणित</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-900/60 pt-6 text-center text-xs text-slate-500">
          <p>© {currentYear} अपना बीकानेर (Apna Bikaner Network) सर्वाधिकार सुरक्षित। किसी भी सामग्री की अनधिकृत प्रतिलिपि प्रतिबंधित है।</p>
        </div>
      </div>
    </footer>
  );
}

