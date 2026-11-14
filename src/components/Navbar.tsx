'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  CloudSun, 
  Menu, 
  X, 
  Flame, 
  ChevronDown, 
  ShieldCheck, 
  Globe,
  Radio,
  BookOpen,
  Vote
} from 'lucide-react';
import { Category, Location, WeatherData } from '@/lib/types';

interface NavbarProps {
  categories?: Category[];
  locations?: Location[];
  initialWeather?: WeatherData | null;
  breakingNews?: Array<{ id: number; title: string; slug: string }>;
}

export default function Navbar({
  categories = [],
  locations = [],
  initialWeather = null,
  breakingNews = [],
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(initialWeather?.city || 'Jaipur');
  const [weather, setWeather] = useState<WeatherData | null>(initialWeather);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const pathname = usePathname();
  const router = useRouter();

  // Do not render public navbar on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Date formatting for Indian context
  const today = new Intl.DateTimeFormat('hi-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const cities = ['Jaipur', 'Bikaner', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Jaisalmer', 'Barmer'];

  const handleCityChange = async (city: string) => {
    setSelectedCity(city);
    setLocationDropdownOpen(false);
    try {
      const res = await fetch(`/api/v1/weather?city=${city}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch {
      // fallback
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const mainCategories = categories.length > 0 ? categories : [
    { id: 1, name_hi: 'राजस्थान', name_en: 'Rajasthan', slug: 'rajasthan' },
    { id: 2, name_hi: 'राजनीति', name_en: 'Politics', slug: 'politics' },
    { id: 3, name_hi: 'देश', name_en: 'National', slug: 'national' },
    { id: 4, name_hi: 'शिक्षा व नौकरी', name_en: 'Jobs & Edu', slug: 'jobs-education' },
    { id: 5, name_hi: 'कृषि व मौसम', name_en: 'Agriculture', slug: 'agriculture' },
    { id: 6, name_hi: 'अपराध', name_en: 'Crime', slug: 'crime' },
    { id: 7, name_hi: 'व्यापार', name_en: 'Business', slug: 'business' },
    { id: 8, name_hi: 'खेल', name_en: 'Sports', slug: 'sports' },
    { id: 9, name_hi: 'मनोरंजन', name_en: 'Entertainment', slug: 'entertainment' },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* 1. TOP BAR: Date, Weather, Language & Quick Links */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Date & City Weather */}
          <div className="flex items-center gap-4">
            <span className="hidden md:inline font-medium text-slate-400">📅 {today}</span>

            {/* Weather Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 text-amber-400 font-semibold hover:text-amber-300 cursor-pointer"
              >
                <CloudSun className="w-3.5 h-3.5" />
                <span>{selectedCity}: {weather ? `${weather.temp}°C, ${weather.condition.split(' ')[0]}` : '32°C'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 text-slate-800 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    शहर चुनें (City Weather)
                  </div>
                  {cities.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleCityChange(c)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-red-50 hover:text-red-700 transition flex items-center justify-between ${selectedCity === c ? 'font-bold text-red-600 bg-red-50/50' : ''}`}
                    >
                      <span>{c}</span>
                      {selectedCity === c && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-3">
            <Link 
              href="/trending" 
              className="flex items-center gap-1 text-red-400 hover:text-red-300 font-medium"
            >
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
              <span className="hidden sm:inline">ट्रेंडिंग</span>
            </Link>

            <span className="text-slate-700">|</span>

            <Link 
              href="/polls" 
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold"
            >
              <Vote className="w-3.5 h-3.5 text-amber-400" />
              <span>जनमत पोल</span>
            </Link>

            <span className="text-slate-700">|</span>

            <Link 
              href="/gallery" 
              className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-white"
            >
              <span>गैलरी</span>
            </Link>

            <span className="hidden sm:inline text-slate-700">|</span>

            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1 text-slate-300 hover:text-white font-medium bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            <Link 
              href="/admin/login" 
              className="flex items-center gap-1 text-slate-400 hover:text-white font-medium pl-1"
              title="Editorial Admin Access"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">संपादक लॉगिन</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER: Logo & Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <div className="flex flex-col items-center lg:items-start">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-700 via-red-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md border border-red-500/30">
              अ
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  अपना <span className="text-red-600">बीकानेर</span>
                </span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded shadow-xs tracking-wider">
                  APNA BIKANER
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-slate-500 font-bold tracking-wider uppercase">
                सत्य, निष्पक्षता और बीकानेर की बुलंद आवाज
              </span>
            </div>
          </Link>
        </div>

        {/* Search bar & Live Badges */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-64 lg:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="खबरें, जिला या विषय खोजें..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-full border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <Link
            href="/rajasthan"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-semibold text-xs transition"
          >
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span>अपना शहर चुनें</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="खबरें, जिला या विषय खोजें..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-full border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </form>
        </div>
      )}

      {/* 3. PRIMARY NAVIGATION BAR */}
      <nav className="bg-red-700 text-white font-medium text-sm hidden lg:block shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center space-x-1 py-1">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md hover:bg-red-800 transition ${pathname === '/' ? 'bg-red-900 font-bold' : ''}`}
            >
              होम
            </Link>

            <Link 
              href="/rajasthan" 
              className={`px-3 py-2 rounded-md hover:bg-red-800 transition flex items-center gap-1 ${pathname.startsWith('/rajasthan') ? 'bg-red-900 font-bold' : ''}`}
            >
              <span>राजस्थान</span>
              <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded-full">खास</span>
            </Link>

            <Link 
              href="/polls" 
              className={`px-3 py-2 rounded-md hover:bg-red-800 transition flex items-center gap-1 text-amber-200 hover:text-white ${pathname.startsWith('/polls') ? 'bg-red-900 font-bold text-white' : ''}`}
            >
              <Vote className="w-3.5 h-3.5 text-amber-300" />
              <span>जनमत पोल</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full animate-pulse">Live</span>
            </Link>

            {mainCategories.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`px-3 py-2 rounded-md hover:bg-red-800 transition whitespace-nowrap ${isActive ? 'bg-red-900 font-bold' : ''}`}
                >
                  {cat.name_hi}
                </Link>
              );
            })}
          </div>

          <Link
            href="/sitemap.xml"
            target="_blank"
            className="text-xs text-red-200 hover:text-white flex items-center gap-1 pl-2"
          >
            <Radio className="w-3 h-3 text-amber-300" />
            <span>लाइव फीड</span>
          </Link>
        </div>
      </nav>

      {/* 4. BREAKING NEWS FLASH BAR */}
      {breakingNews.length > 0 && (
        <div className="bg-amber-400 border-b border-amber-500 text-slate-950 text-xs font-semibold py-1.5 px-4 overflow-hidden flex items-center">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
            <span className="bg-red-600 text-white text-[11px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 shrink-0 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              ब्रेकिंग न्यूज़
            </span>

            <div className="flex-1 overflow-hidden whitespace-nowrap relative">
              <div className="inline-block animate-ticker">
                {breakingNews.map((bn, idx) => (
                  <Link
                    key={bn.id}
                    href={`/news/${bn.slug}`}
                    className="hover:underline mr-8 inline-flex items-center gap-1 text-slate-900 hover:text-red-900"
                  >
                    <span>⚡ {bn.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-32 bg-slate-900/60 backdrop-blur-xs z-50">
          <div className="bg-white w-4/5 max-w-sm h-full overflow-y-auto p-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                श्रेणियां (Categories)
              </div>
              <div className="flex flex-col space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-800 hover:bg-red-50 hover:text-red-700 font-semibold"
                >
                  🏠 होम (Home)
                </Link>
                <Link
                  href="/rajasthan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-800 hover:bg-red-50 hover:text-red-700 font-semibold flex items-center justify-between"
                >
                  <span>📍 राजस्थान स्थानीय</span>
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">जिलावार</span>
                </Link>
                <Link
                  href="/polls"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-900 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-between border border-amber-200/60"
                >
                  <span className="flex items-center gap-2">
                    <Vote className="w-4 h-4 text-amber-600" />
                    <span>📊 जनमत पोल (Live Polls)</span>
                  </span>
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">वोट दें</span>
                </Link>
                {mainCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-700 font-medium"
                  >
                    {cat.name_hi} ({cat.name_en})
                  </Link>
                ))}
              </div>

              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pt-4 pb-2">
                स्थानिक जिले (Districts)
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {cities.map((city) => (
                  <Link
                    key={city}
                    href={`/location/${city.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded bg-slate-50 hover:bg-red-50 text-slate-700 font-medium text-center"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 mt-4">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 text-white font-semibold text-xs shadow-md"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>संपादकीय एडमिन पैनल</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

