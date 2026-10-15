import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-4xl font-black mx-auto">
          404
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            समाचार पृष्ठ उपलब्ध नहीं है
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            यह पृष्ठ हटा दिया गया है, इसका यूआरएल बदल गया है या यह कभी मौजूद नहीं था।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>मुख्य पृष्ठ (Home)</span>
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>समाचार खोजें</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

