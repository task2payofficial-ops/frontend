import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCodeInjector from "@/components/CustomCodeInjector";
import { getCategories, getLocations, getWeather, getBreakingNews, getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: {
    default: "Thar Media | थार मीडिया - निष्पक्ष, सटीक और भरोसेमंद डिजिटल न्यूज़ नेटवर्क",
    template: "%s | Thar Media",
  },
  description: "थार मीडिया (Thar Media) - राजस्थान, बीकानेर, जयपुर, जोधपुर, अपराध, राजनीति, शिक्षा, REET और कृषि से जुड़ी ताज़ा, प्रामाणिक और विस्तृत हिंदी खबरें।",
  keywords: ["थार मीडिया", "Thar Media", "Thar News", "Rajasthan News in Hindi", "Bikaner News", "Jaipur News", "REET 2026", "कृषि समाचार", "हिंदी न्यूज़"],
  authors: [{ name: "Thar Media Editorial Team" }],
  creator: "Thar Media",
  publisher: "Thar Media Network",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: "/",
    siteName: "Thar Media",
    title: "Thar Media (थार मीडिया) - सत्य, निष्पक्षता और मरुधरा की सच्ची आवाज",
    description: "थार मीडिया - राजस्थान, बीकानेर, जयपुर और देश-विदेश की ताज़ा एवं विश्वसनीय खबरें।",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Thar Media - थार मीडिया",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thar Media | थार मीडिया",
    description: "राजस्थान और मरुधरा का प्रमुख डिजिटल समाचार नेटवर्क",
    creator: "@TharMedia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SSR fetch for navigation data & site settings
  const [categories, locations, weather, breaking, settings] = await Promise.all([
    getCategories(),
    getLocations(),
    getWeather('Jaipur'),
    getBreakingNews(),
    getSiteSettings(),
  ]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": settings?.site_name || "Thar Media (थार मीडिया)",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "logo": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/logo.png`,
      "width": 600,
      "height": 60,
    },
    "sameAs": [
      "https://facebook.com/tharmedianetwork",
      "https://twitter.com/tharmedia",
      "https://youtube.com/tharmedia",
    ],
  };

  return (
    <html lang="hi">
      <head>
        <CustomCodeInjector
          headerCode={settings?.header_code}
          footerCode={settings?.footer_code}
          customCss={settings?.custom_css}
          googleAnalyticsId={settings?.google_analytics_id}
          adsenseClientId={settings?.adsense_client_id}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-100/40 text-slate-900 antialiased">
        <Navbar
          categories={categories}
          locations={locations}
          initialWeather={weather}
          breakingNews={breaking}
        />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
