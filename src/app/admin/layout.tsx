'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  PlusCircle,
  Radio,
  FolderTree,
  DollarSign,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Vote
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // If on /admin/login, don't show the dashboard shell
    if (pathname === '/admin/login') {
      return;
    }

    const token = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');

    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
      return;
    }

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.role === 'user') {
          // Regular users only have access to polls (/admin/polls and /admin/polls/*)
          if (!pathname.startsWith('/admin/polls')) {
            router.replace('/admin/polls');
            return;
          }
        }
      } catch {
        // ignore
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const isRegularUser = user?.role === 'user';

  const navItems = isRegularUser
    ? [
        { label: 'मेरे जनमत पोल (My Polls)', href: '/admin/polls', icon: Vote },
        { label: 'नया पोल बनाएं (Create Poll)', href: '/admin/polls/create', icon: PlusCircle },
      ]
    : [
        { label: 'डैशबोर्ड (Overview)', href: '/admin', icon: LayoutDashboard },
        { label: 'समाचार प्रबंधन (Articles)', href: '/admin/articles', icon: Newspaper },
        { label: 'नया समाचार लिखें', href: '/admin/articles/create', icon: PlusCircle },
        { label: 'ऑटोमेशन व स्रोत (Sources)', href: '/admin/sources', icon: Radio },
        { label: 'जनमत पोल (Polls)', href: '/admin/polls', icon: Vote },
        { label: 'विज्ञापन प्रबंधन (Ads)', href: '/admin/ads', icon: DollarSign },
        { label: 'हेडर व फूटर कोड (Settings)', href: '/admin/settings', icon: Sliders },
      ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden"
        />
      )}

      {/* 1. FIXED SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-slate-950 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="p-5 border-b border-slate-900 flex items-center justify-between">
            <Link href={isRegularUser ? '/admin/polls' : '/admin'} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                था
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight block">
                  अपना बीकानेर <span className="text-red-500">{isRegularUser ? 'यूजर पैनल' : 'एडमिन'}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {isRegularUser ? 'APNA BIKANER • जनमत पोल सेंटर' : 'APNA BIKANER • संपादकीय कक्ष'}
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & actions footer */}
        <div className="p-4 border-t border-slate-900 space-y-3 bg-slate-950">
          {user && (
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-slate-500 uppercase">{user.role}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>वेबसाइट</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 font-medium cursor-pointer transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="lg:pl-64 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              {isRegularUser ? 'अपना बीकानेर • जनमत पोल सेंटर (User Panel)' : 'अपना बीकानेर (Apna Bikaner) डिजिटल पोर्टल v1.0'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isRegularUser ? (
              <Link
                href="/admin/polls/create"
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <Vote className="w-3.5 h-3.5" />
                <span>+ नया पोल बनाएं</span>
              </Link>
            ) : (
              <Link
                href="/admin/articles/create"
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>नया समाचार जोड़ें</span>
              </Link>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

