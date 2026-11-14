import { HomepageData, Article, Category, Location, WeatherData, Advertisement, Poll, SiteSettings } from './types';

const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}/api/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const res = await fetch(url, {
      next: { revalidate: 30 }, // Next.js ISR cache
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.warn(`API returned ${res.status} for ${url}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn(`Failed fetching from API [${endpoint}]:`, error);
    return null;
  }
}

// ----------------------------------------------------------------------
// Public News API Calls
// ----------------------------------------------------------------------

export async function getHomepageData(): Promise<HomepageData | null> {
  return await fetchFromApi<HomepageData>('/homepage');
}

export async function getArticleBySlug(slug: string): Promise<{ article: Article; related: Article[]; suggested_videos?: Article[]; schema_json_ld: Record<string, any> } | null> {
  return await fetchFromApi<{ article: Article; related: Article[]; suggested_videos?: Article[]; schema_json_ld: Record<string, any> }>(`/news/${slug}`);
}

export async function getBreakingNews(): Promise<Array<{ id: number; title: string; short_headline?: string; slug: string; published_at: string }>> {
  const data = await fetchFromApi<Array<{ id: number; title: string; short_headline?: string; slug: string; published_at: string }>>('/news/breaking');
  return data || [];
}

export async function getTrendingNews(): Promise<Article[]> {
  const data = await fetchFromApi<Article[]>('/news/trending');
  return data || [];
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchFromApi<Category[]>('/categories');
  return data || [];
}

export async function getCategoryBySlug(slug: string, page = 1): Promise<{ category: Category; articles: { data: Article[]; current_page: number; last_page: number; total: number } } | null> {
  return await fetchFromApi<{ category: Category; articles: { data: Article[]; current_page: number; last_page: number; total: number } }>(`/categories/${slug}?page=${page}`);
}

export async function getLocations(): Promise<Location[]> {
  const data = await fetchFromApi<Location[]>('/locations');
  return data || [];
}

export async function getLocationBySlug(slug: string, page = 1): Promise<{ location: Location; articles: { data: Article[]; current_page: number; last_page: number; total: number } } | null> {
  return await fetchFromApi<{ location: Location; articles: { data: Article[]; current_page: number; last_page: number; total: number } }>(`/locations/${slug}?page=${page}`);
}

export async function getRajasthanNews(district = 'all', page = 1): Promise<{ data: Article[]; current_page: number; last_page: number; total: number } | null> {
  return await fetchFromApi<{ data: Article[]; current_page: number; last_page: number; total: number }>(`/news/rajasthan?district=${district}&page=${page}`);
}

export async function searchNews(query: string, page = 1): Promise<{ data: Article[]; current_page: number; last_page: number; total: number } | null> {
  return await fetchFromApi<{ data: Article[]; current_page: number; last_page: number; total: number }>(`/news?search=${encodeURIComponent(query)}&page=${page}`);
}

export async function getWeather(city = 'Jaipur'): Promise<WeatherData | null> {
  return await fetchFromApi<WeatherData>(`/weather?city=${encodeURIComponent(city)}`);
}

export async function getAdForPosition(position: string): Promise<Advertisement | null> {
  return await fetchFromApi<Advertisement>(`/ads/${position}`);
}

export async function trackAdClick(adId: number): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/ads/${adId}/click`, { method: 'POST' });
    const data = await res.json();
    return data.destination_url || null;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------------
// Polls (जनमत सर्वेक्षण) API
// ----------------------------------------------------------------------

export async function getPolls(page = 1, category = ''): Promise<{ data: Poll[]; current_page: number; last_page: number; total: number } | null> {
  const catQuery = category ? `&category=${encodeURIComponent(category)}` : '';
  return await fetchFromApi<{ data: Poll[]; current_page: number; last_page: number; total: number }>(`/polls?page=${page}${catQuery}`);
}

export async function getFeaturedPoll(): Promise<{ poll: Poll | null } | null> {
  return await fetchFromApi<{ poll: Poll | null }>('/polls/featured');
}

export async function getPollBySlug(slug: string): Promise<{ poll: Poll } | null> {
  return await fetchFromApi<{ poll: Poll }>(`/polls/${slug}`);
}

export async function castPollVote(pollId: number, optionId: number, voterToken?: string): Promise<{ success: boolean; message: string; poll?: Poll }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/polls/${pollId}/vote`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Voter-Token': voterToken || '',
      },
      body: JSON.stringify({
        option_id: optionId,
        voter_token: voterToken,
      }),
    });

    const data = await res.json();
    return {
      success: res.ok,
      message: data.message || (res.ok ? 'वोट दर्ज हो गया' : 'वोट दर्ज करने में असमर्थ'),
      poll: data.poll,
    };
  } catch (e: any) {
    return {
      success: false,
      message: 'नेटवर्क समस्या के कारण वोट दर्ज नहीं हो सका।',
    };
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return await fetchFromApi<SiteSettings>('/settings');
}


