import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCodeInjector from "@/components/CustomCodeInjector";
import { getCategories, getLocations, getWeather, getBreakingNews, getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: {
    default: "अपना बीकानेर | Apna Bikaner - निष्पक्ष, सटीक और भरोसेमंद डिजिटल न्यूज़ नेटवर्क",
    template: "%s | Apna Bikaner",
  },
  description: "अपना बीकानेर (Apna Bikaner) - बीकानेर, राजस्थान, अपराध, राजनीति, शिक्षा, REET और कृषि से जुड़ी ताज़ा, प्रामाणिक और विस्तृत हिंदी खबरें।",
  keywords: ["अपना बीकानेर", "Apna Bikaner", "Apna Bikaner News", "Bikaner News in Hindi", "Jaipur News", "REET 2026", "कृषि समाचार", "राजस्थान न्यूज़"],
  authors: [{ name: "Apna Bikaner Editorial Team" }],
  creator: "Apna Bikaner",
  publisher: "Apna Bikaner Network",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://apnabikaner.com"),
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
    siteName: "Apna Bikaner",
    title: "अपना बीकानेर (Apna Bikaner) - सत्य, निष्पक्षता और बीकानेर की सच्ची आवाज",
    description: "अपना बीकानेर - बीकानेर, राजस्थान और देश-विदेश की ताज़ा एवं विश्वसनीय खबरें।",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "अपना बीकानेर - Apna Bikaner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "अपना बीकानेर | Apna Bikaner",
    description: "बीकानेर और राजस्थान का प्रमुख डिजिटल समाचार नेटवर्क",
    creator: "@ApnaBikaner",
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
    "name": settings?.site_name || "अपना बीकानेर (Apna Bikaner)",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://apnabikaner.com",
    "logo": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://apnabikaner.com"}/logo.png`,
      "width": 600,
      "height": 60,
    },
    "sameAs": [
      "https://facebook.com/apnabikanernews",
      "https://twitter.com/apnabikaner",
      "https://youtube.com/apnabikaner",
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
