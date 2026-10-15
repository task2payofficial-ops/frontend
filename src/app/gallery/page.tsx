import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getHomepageData } from '@/lib/api';
import SafeImage from '@/components/SafeImage';
import { PlayCircle, Image as ImageIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'फोटो एवं वीडियो गैलरी | Multimedia News Gallery',
  description: 'राजस्थान के खूबसूरत रंग, सांस्कृतिक उत्सव और विजुअल समाचार रिपोर्ट।',
};

export default async function GalleryPage() {
  const data = await getHomepageData();
  const stories = data?.hero?.sub || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ImageIcon className="w-4 h-4" /> राजस्थान विजुअल्स
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            फोटो एवं वीडियो गैलरी
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
            तस्वीरों और वीडियो के माध्यम से राजस्थान की संस्कृति, घटनाओं और विकास की एक झलक।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((art) => (
          <div key={art.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition">
            <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
              <SafeImage
                src={art.featured_image || ''}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-[11px] font-bold text-amber-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded flex items-center gap-1">
                  <PlayCircle className="w-3.5 h-3.5 text-red-500 fill-white" /> वीडियो स्टोरी
                </span>
              </div>
            </div>
            <div className="p-4">
              <Link href={`/news/${art.slug}`}>
                <h3 className="font-bold text-slate-900 group-hover:text-red-600 transition line-clamp-2 text-sm leading-snug">
                  {art.title}
                </h3>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

