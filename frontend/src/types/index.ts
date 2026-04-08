// ─── RESPONSE WRAPPERS ────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

// ─── USER ─────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'super_admin' | 'editor';
  status: 'active' | 'inactive';
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── CATEGORY ─────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  display_order: number;
  status: 'active' | 'inactive';
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

// ─── ARTICLE ──────────────────────────────────────────────

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: 'draft' | 'published' | 'hidden';
  view_count: number;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_by: string;
  updated_by: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

// ─── MEDIA ────────────────────────────────────────────────

export interface Media {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ─── PAGE ─────────────────────────────────────────────────

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'hidden';
  seo_title: string | null;
  seo_description: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

// ─── SETTING ──────────────────────────────────────────────

export interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
  created_at: string;
  updated_at: string;
}

// ─── EVENT ────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  link_url: string | null;
  status: 'upcoming' | 'ongoing' | 'past';
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

// ─── CONTACT ──────────────────────────────────────────────

export interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  content: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

// ─── ADMISSION ────────────────────────────────────────────

export interface AdmissionPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail_url: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdmissionFaq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdmissionRegistration {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  grade: string;
  is_club_member: boolean;
  status: 'new' | 'contacted' | 'completed';
  note: string | null;
  created_at: string;
  updated_at: string;
}

// ─── NAVIGATION / MENU ───────────────────────────────────

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  target: '_self' | '_blank';
  parent_id: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  children?: MenuItem[];
}
