import { MetadataRoute } from 'next';
import { getCategories, getLocations, getHomepageData } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [categories, locations, homepageData] = await Promise.all([
    getCategories(),
    getLocations(),
    getHomepageData(),
  ]);

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: 'always', priority: 1.0 },
    { url: `${siteUrl}/rajasthan`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/trending`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${siteUrl}/gallery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/editorial-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/corrections-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Category routes
  categories.forEach((cat) => {
    routes.push({
      url: `${siteUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.85,
    });
  });

  // Location routes
  locations.forEach((loc) => {
    routes.push({
      url: `${siteUrl}/location/${loc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    });
  });

  // Recent Articles from Homepage
  const articles = [
    ...(homepageData?.hero?.main ? [homepageData.hero.main] : []),
    ...(homepageData?.hero?.sub || []),
  ];

  articles.forEach((art) => {
    routes.push({
      url: `${siteUrl}/news/${art.slug}`,
      lastModified: art.updated_at ? new Date(art.updated_at) : new Date(),
      changeFrequency: 'never',
      priority: 0.9,
    });
  });

  return routes;
}

