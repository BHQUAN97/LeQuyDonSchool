'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type {
  PaginatedResponse,
  ApiResponse,
  Article,
  Category,
  Contact,
  User,
  Event,
  Media,
  Page,
  AdmissionPost,
  AdmissionFaq,
  AdmissionRegistration,
  MenuItem,
  Setting,
} from '@/types';

// ─── GENERIC PAGINATED HOOK ──────────────────────────────

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UsePaginatedOptions {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | undefined;
}

/**
 * Hook chung cho cac API co phan trang.
 * Tra ve data, pagination, loading, error, va ham refetch.
 */
function usePaginated<T>(path: string, options: UsePaginatedOptions = {}) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit: 20, total: 0, totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serialize options thanh dep key de trigger refetch khi thay doi
  const depsKey = JSON.stringify(options);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      for (const [key, val] of Object.entries(options)) {
        if (val !== undefined && val !== '') {
          params.set(key, String(val));
        }
      }
      if (!params.has('page')) params.set('page', '1');
      if (!params.has('limit')) params.set('limit', '20');

      const res = await api<PaginatedResponse<T>>(`${path}?${params}`);
      if (res.success) {
        setData(res.data);
        setPagination(res.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Co loi xay ra');
      console.error(`Loi khi tai ${path}:`, err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, depsKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, pagination, loading, error, refetch: fetchData };
}

// ─── ARTICLES ─────────────────────────────────────────────

export function useArticles(filters: {
  page?: number;
  search?: string;
  status?: string;
} = {}) {
  return usePaginated<Article>('/articles', {
    page: filters.page,
    limit: 20,
    search: filters.search,
    status: filters.status,
  });
}

// ─── CATEGORIES ───────────────────────────────────────────

export function useCategories(filters: {
  page?: number;
  search?: string;
} = {}) {
  return usePaginated<Category>('/categories', {
    page: filters.page,
    limit: 20,
    search: filters.search,
    sort: 'display_order',
    order: 'ASC',
  });
}

/**
 * Lay toan bo categories dang tree (dung cho dropdown chon parent).
 */
export function useCategoryTree() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTree = useCallback(async () => {
    try {
      const res = await api<ApiResponse<Category[]>>('/categories?tree=true');
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Loi tai category tree:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTree(); }, [fetchTree]);

  return { categories, loading, refetch: fetchTree };
}

// ─── CONTACTS ─────────────────────────────────────────────

export function useContacts(filters: {
  page?: number;
  search?: string;
  status?: string;
} = {}) {
  return usePaginated<Contact>('/contacts', {
    page: filters.page,
    limit: 20,
    search: filters.search,
    status: filters.status,
  });
}

// ─── USERS ────────────────────────────────────────────────

export function useUsers(filters: {
  page?: number;
  search?: string;
  role?: string;
  status?: string;
} = {}) {
  return usePaginated<User>('/users', {
    page: filters.page,
    limit: 20,
    search: filters.search,
    role: filters.role,
    status: filters.status,
  });
}

// ─── EVENTS ───────────────────────────────────────────────

export function useEvents(filters: {
  page?: number;
  search?: string;
  status?: string;
} = {}) {
  return usePaginated<Event>('/events', {
    page: filters.page,
    limit: 20,
    search: filters.search,
    status: filters.status,
  });
}

// ─── MEDIA ────────────────────────────────────────────────

export function useMedia(filters: {
  page?: number;
  search?: string;
  mimeType?: string;
} = {}) {
  return usePaginated<Media>('/media', {
    page: filters.page,
    limit: 20,
    search: filters.search,
    mimeType: filters.mimeType,
  });
}

// ─── PAGES ────────────────────────────────────────────────

export function usePages(filters: {
  page?: number;
  search?: string;
} = {}) {
  return usePaginated<Page>('/pages', {
    page: filters.page,
    limit: 20,
    search: filters.search,
  });
}

// ─── ADMISSIONS ───────────────────────────────────────────

export function useAdmissionPosts(filters: {
  page?: number;
  search?: string;
} = {}) {
  return usePaginated<AdmissionPost>('/admissions/posts', {
    page: filters.page,
    limit: 20,
    search: filters.search,
  });
}

export function useAdmissionFaqs() {
  const [faqs, setFaqs] = useState<AdmissionFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<AdmissionFaq[]>('/admissions/faq/all');
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Co loi xay ra');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  return { faqs, loading, error, refetch: fetchFaqs };
}

export function useAdmissionRegistrations(filters: {
  page?: number;
  search?: string;
  status?: string;
} = {}) {
  return usePaginated<AdmissionRegistration>('/admissions/registrations', {
    page: filters.page,
    limit: 20,
    search: filters.search,
    status: filters.status,
  });
}

// ─── NAVIGATION / MENU ───────────────────────────────────

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<MenuItem[]>('/navigation/menu/all');
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Co loi xay ra');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
}

// ─── SETTINGS ─────────────────────────────────────────────

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ success: boolean; data: Record<string, Setting[]> }>('/settings');
      if (res.success) {
        const flat: Record<string, string> = {};
        for (const group of Object.values(res.data)) {
          for (const item of group) {
            flat[item.key] = item.value;
          }
        }
        setSettings(flat);
      }
    } catch (err: any) {
      setError(err.message || 'Co loi xay ra');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  return { settings, loading, error, refetch: fetchSettings };
}

// ─── DASHBOARD STATS ──────────────────────────────────────

export interface DashboardStats {
  totalArticles: number;
  newContacts: number;
  newRegistrations: number;
  recentArticles: Article[];
  recentContacts: Contact[];
  recentRegistrations: AdmissionRegistration[];
}

/**
 * Lay thong ke cho dashboard — goi nhieu API song song.
 */
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    newContacts: 0,
    newRegistrations: 0,
    recentArticles: [],
    recentContacts: [],
    recentRegistrations: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      // Goi song song nhieu API de lay tong quan
      const [articlesRes, contactsRes, registrationsRes] = await Promise.allSettled([
        api<PaginatedResponse<Article>>('/articles?page=1&limit=5'),
        api<PaginatedResponse<Contact>>('/contacts?page=1&limit=5&status=new'),
        api<PaginatedResponse<AdmissionRegistration>>('/admissions/registrations?page=1&limit=5&status=new'),
      ]);

      const newStats: DashboardStats = {
        totalArticles: 0,
        newContacts: 0,
        newRegistrations: 0,
        recentArticles: [],
        recentContacts: [],
        recentRegistrations: [],
      };

      if (articlesRes.status === 'fulfilled' && articlesRes.value.success) {
        newStats.totalArticles = articlesRes.value.pagination.total;
        newStats.recentArticles = articlesRes.value.data;
      }
      if (contactsRes.status === 'fulfilled' && contactsRes.value.success) {
        newStats.newContacts = contactsRes.value.pagination.total;
        newStats.recentContacts = contactsRes.value.data;
      }
      if (registrationsRes.status === 'fulfilled' && registrationsRes.value.success) {
        newStats.newRegistrations = registrationsRes.value.pagination.total;
        newStats.recentRegistrations = registrationsRes.value.data;
      }

      setStats(newStats);
    } catch (err) {
      console.error('Loi tai dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}
