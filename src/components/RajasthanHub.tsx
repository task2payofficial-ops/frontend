'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Article } from '@/lib/types';
import NewsCard from './NewsCard';

interface RajasthanHubProps {
  initialStoriesByDistrict?: Record<string, Article[]>;
}

export default function RajasthanHub({ initialStoriesByDistrict = {} }: RajasthanHubProps) {
  const districts = [
    { id: 'Jaipur', label_hi: 'जयपुर', count: initialStoriesByDistrict['Jaipur']?.length || 0 },
    { id: 'Bikaner', label_hi: 'बीकानेर', count: initialStoriesByDistrict['Bikaner']?.length || 0 },
    { id: 'Jodhpur', label_hi: 'जोधपुर', count: initialStoriesByDistrict['Jodhpur']?.length || 0 },
    { id: 'Udaipur', label_hi: 'उदयपुर', count: initialStoriesByDistrict['Udaipur']?.length || 0 },
    { id: 'Kota', label_hi: 'कोटा', count: initialStoriesByDistrict['Kota']?.length || 0 },
    { id: 'Ajmer', label_hi: 'अजमेर', count: initialStoriesByDistrict['Ajmer']?.length || 0 },
    { id: 'Jaisalmer', label_hi: 'जैसलमेर', count: initialStoriesByDistrict['Jaisalmer']?.length || 0 },
    { id: 'Barmer', label_hi: 'बाड़मेर', count: initialStoriesByDistrict['Barmer']?.length || 0 },
  ];

  const [activeDistrict, setActiveDistrict] = useState('Bikaner');

  const currentStories = initialStoriesByDistrict[activeDistrict] || [];

  return (
    <section className="my-10 bg-slate-50/80 rounded-2xl p-5 md:p-8 border border-slate-200">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-600 text-white shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              राजस्थान अपना जिला (Local News Hub)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              बीकानेर, जयपुर, जोधपुर, जैसलमेर सहित अपने शहर की हर छोटी-बड़ी खबर
            </p>
          </div>
        </div>

        <Link
          href={`/location/${activeDistrict.toLowerCase()}`}
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>{districts.find(d => d.id === activeDistrict)?.label_hi} की सभी खबरें</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* District Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {districts.map((d) => {
          const isActive = activeDistrict === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDistrict(d.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                isActive
                  ? 'bg-red-600 text-white ring-2 ring-red-600 ring-offset-2'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{d.label_hi}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-red-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {d.id}
              </span>
            </button>
          );
        })}
      </div>

      {/* District News Stories Grid */}
      {currentStories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentStories.slice(0, 6).map((art) => (
            <NewsCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            {districts.find(d => d.id === activeDistrict)?.label_hi} के लिए अभी कोई नई रिपोर्ट दर्ज नहीं हुई है।
          </p>
          <p className="text-xs text-slate-400 mt-1">हमारे संवाददाता नवीनतम अपडेट संकलित कर रहे हैं।</p>
        </div>
      )}
    </section>
  );
}

