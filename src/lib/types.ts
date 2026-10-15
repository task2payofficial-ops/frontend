export interface User {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'reporter' | 'ad_manager' | 'analyst' | 'user';
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
  is_active: boolean;
}

export interface Category {
  id: number;
  name_hi: string;
  name_en: string;
  slug: string;
  description?: string;
  parent_id?: number | null;
  sort_order: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  articles_count?: number;
  subcategories?: Category[];
}

export interface Location {
  id: number;
  type: 'state' | 'district' | 'city' | 'locality';
  name_hi: string;
  name_en: string;
  slug: string;
  district_name?: string;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  articles_count?: number;
}

export interface Tag {
  id: number;
  name_hi: string;
  name_en: string;
  slug: string;
}

export interface Article {
  id: number;
  title: string;
  title_en?: string | null;
  short_headline?: string | null;
  slug: string;
  summary: string;
  content: string;
  featured_image?: string | null;
  image_caption?: string | null;
  image_alt?: string | null;
  gallery?: Array<{ url: string; caption?: string; alt?: string }> | null;
  category_id?: number | null;
  location_id?: number | null;
  category?: Category | null;
  location?: Location | null;
  state?: string;
  district?: string;
  city?: string;
  locality?: string;
  user_id?: number | null;
  author?: User | null;
  reporter_name?: string | null;
  source_id?: number | null;
  original_source_name?: string | null;
  original_source_url?: string | null;
  source_published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  focus_keyword?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  schema_type?: string;
  is_featured: boolean;
  is_breaking: boolean;
  is_trending: boolean;
  is_video_story: boolean;
  video_url?: string | null;
  is_ai_generated: boolean;
  ai_model_used?: string | null;
  editorial_verification_status: 'unverified' | 'verified' | 'rejected' | 'correction_needed';
  correction_notes?: string | null;
  status: 'draft' | 'pending_review' | 'scheduled' | 'published' | 'archived';
  published_at?: string | null;
  scheduled_for?: string | null;
  view_count: number;
  read_time_minutes: number;
  language: string;
  tags?: Tag[];
  related_articles?: Article[];
  created_at: string;
  updated_at: string;
}

export interface Advertisement {
  id: number;
  title: string;
  position: 'header_leaderboard' | 'sidebar_top' | 'sidebar_bottom' | 'in_article' | 'between_sections' | 'footer_banner' | 'interstitial_popup';
  ad_type: 'custom_banner' | 'google_adsense' | 'sponsored_card';
  image_url?: string | null;
  destination_url?: string | null;
  adsense_client_id?: string | null;
  adsense_slot_id?: string | null;
  custom_html?: string | null;
  target_device: 'all' | 'desktop' | 'mobile';
  is_active: boolean;
  impression_count: number;
  click_count: number;
}

export interface HomepageSectionData {
  id: number;
  title_hi: string;
  title_en: string;
  section_type: string;
  layout_style: string;
  category?: Category | null;
  location?: Location | null;
  stories: Article[];
}

export interface HomepageData {
  breaking_news: Array<{ id: number; title: string; short_headline?: string; slug: string; published_at: string }>;
  hero: {
    main: Article | null;
    sub: Article[];
  };
  sections: HomepageSectionData[];
  rajasthan_local: Record<string, Article[]>;
  trending: Article[];
  featured_poll?: Poll | null;
  ads: Record<string, Advertisement | null>;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: string;
  wind: string;
  icon: string;
}

export interface PollOption {
  id: number;
  option_text: string;
  image?: string | null;
  votes_count: number;
  percentage: number;
  order: number;
}

export interface Poll {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  category: string;
  featured_image?: string | null;
  status: 'active' | 'closed' | 'draft';
  expires_at?: string | null;
  is_expired: boolean;
  seconds_remaining?: number | null;
  time_left_human?: string | null;
  is_featured: boolean;
  allow_multiple: boolean;
  total_votes: number;
  has_voted: boolean;
  user_voted_option_id?: number | null;
  options: PollOption[];
  share_url: string;
  created_at: string;
}
