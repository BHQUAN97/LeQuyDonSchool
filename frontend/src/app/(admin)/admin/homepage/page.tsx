'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { Article, Event, PaginatedResponse } from '@/types';
import type { HomepageConfig } from '@/types/homepage';
import { DEFAULT_HOMEPAGE_CONFIG } from '@/types/homepage';
import BlockSortableList from './components/BlockSortableList';
import LayoutVariantPicker from './components/LayoutVariantPicker';
import ThemeEditor from './components/ThemeEditor';
import ImagePicker from '@/components/admin/ImagePicker';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
}

interface Testimonial {
  name: string;
  title: string;
  content: string;
  avatar_url: string;
}

type PageTab = 'config' | 'preview' | 'layout' | 'layout-detail' | 'theme';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptySlide = (): HeroSlide => ({
  title: '', subtitle: '', description: '', cta_text: '', cta_link: '', image_url: '',
});

const emptyTestimonial = (): Testimonial => ({
  name: '', title: '', content: '', avatar_url: '',
});

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Trang quan ly trang chu V2 — cau hinh hero slides, testimonials, stats, su kien noi bat.
 * Du lieu luu qua settings API (key-value, group = 'homepage').
 */
export default function HomepageAdminPage() {
  // Tab chinh
  const [activeTab, setActiveTab] = useState<PageTab>('config');

  // Loading / saving states
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  // Accordion — section nao dang mo
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    hero: true, testimonials: false, stats: false, featured_event: false,
  });

  // Data
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [statStudents, setStatStudents] = useState('');
  const [statTeachers, setStatTeachers] = useState('');
  const [statYears, setStatYears] = useState('');
  const [featuredEventId, setFeaturedEventId] = useState('');

  // Preview data
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  // Customizer config — bo cuc + giao dien trang chu
  const [custConfig, setCustConfig] = useState<HomepageConfig>(DEFAULT_HOMEPAGE_CONFIG);
  const [savingCust, setSavingCust] = useState(false);

  // Toast message
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ─── Fetch data ───────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, articlesRes, eventsRes, allEventsRes] = await Promise.allSettled([
        api<{ success: boolean; data: Record<string, any[]> }>('/settings'),
        api<PaginatedResponse<Article>>('/articles?page=1&limit=6&status=published'),
        api<PaginatedResponse<Event>>('/events?page=1&limit=4&status=upcoming'),
        api<PaginatedResponse<Event>>('/events?page=1&limit=50'),
      ]);

      // Parse settings
      if (settingsRes.status === 'fulfilled' && settingsRes.value.success) {
        const flat: Record<string, string> = {};
        for (const group of Object.values(settingsRes.value.data)) {
          for (const item of group) {
            flat[item.key] = item.value;
          }
        }

        // Hero slides — JSON array
        try {
          const slides = JSON.parse(flat['hero_slides'] || '[]');
          setHeroSlides(Array.isArray(slides) ? slides : []);
        } catch { setHeroSlides([]); }

        // Testimonials — JSON array
        try {
          const t = JSON.parse(flat['testimonials'] || '[]');
          setTestimonials(Array.isArray(t) ? t : []);
        } catch { setTestimonials([]); }

        // Stats
        setStatStudents(flat['stat_students'] || '');
        setStatTeachers(flat['stat_teachers'] || '');
        setStatYears(flat['stat_years'] || '');
        setFeaturedEventId(flat['featured_event_id'] || '');
      }

      // Load customizer config tu settings API
      try {
        const custRes = await api<{ success: boolean; data: HomepageConfig }>('/settings/homepage');
        if (custRes.success && custRes.data) {
          setCustConfig(custRes.data);
        }
      } catch {
        // Chua co config — dung default
      }

      if (articlesRes.status === 'fulfilled' && articlesRes.value.success) {
        setRecentArticles(articlesRes.value.data);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value.success) {
        setUpcomingEvents(eventsRes.value.data);
      }
      if (allEventsRes.status === 'fulfilled' && allEventsRes.value.success) {
        setAllEvents(allEventsRes.value.data);
      }
    } catch (err) {
      console.error('Loi tai du lieu trang chu:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── Save helpers ─────────────────────────────────────────────────────────

  /** Luu 1 hoac nhieu settings key vao group 'homepage' */
  const saveSettings = async (section: string, items: { key: string; value: string }[]) => {
    setSavingSection(section);
    try {
      await api('/settings', {
        method: 'PUT',
        body: JSON.stringify({
          items: items.map((i) => ({ ...i, group: 'homepage' })),
        }),
      });
      showToast('Đã lưu thành công!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi khi lưu';
      showToast(message, 'err');
    } finally {
      setSavingSection(null);
    }
  };

  const saveHeroSlides = () => saveSettings('hero', [{ key: 'hero_slides', value: JSON.stringify(heroSlides) }]);
  const saveTestimonials = () => saveSettings('testimonials', [{ key: 'testimonials', value: JSON.stringify(testimonials) }]);
  const saveStats = () => saveSettings('stats', [
    { key: 'stat_students', value: statStudents },
    { key: 'stat_teachers', value: statTeachers },
    { key: 'stat_years', value: statYears },
  ]);
  const saveFeaturedEvent = () => saveSettings('featured_event', [{ key: 'featured_event_id', value: featuredEventId }]);

  /** Luu customizer config (blocks + theme) */
  const saveCustomizerConfig = async () => {
    setSavingCust(true);
    try {
      await api('/settings/homepage', {
        method: 'PUT',
        body: JSON.stringify(custConfig),
      });
      showToast('Đã lưu cấu hình trang chủ!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi khi lưu';
      showToast(message, 'err');
    } finally {
      setSavingCust(false);
    }
  };

  /** Khoi phuc mac dinh */
  const resetCustomizerConfig = () => {
    if (!window.confirm('Khôi phục bố cục và giao diện về mặc định? Thay đổi chưa lưu sẽ mất.')) return;
    setCustConfig(DEFAULT_HOMEPAGE_CONFIG);
    showToast('Đã khôi phục mặc định — nhấn Lưu để áp dụng');
  };

  /** Xem truoc — tao preview token roi mo tab moi */
  const [previewing, setPreviewing] = useState(false);
  const previewHomepage = async () => {
    setPreviewing(true);
    try {
      const res = await api<{ success: boolean; data: { token: string } }>('/settings/homepage/preview', {
        method: 'POST',
        body: JSON.stringify(custConfig),
      });
      if (res.data?.token) {
        window.open(`/?preview=${res.data.token}`, '_blank');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi tạo preview';
      showToast(message, 'err');
    } finally {
      setPreviewing(false);
    }
  };

  // ─── Hero slide helpers ───────────────────────────────────────────────────

  const updateSlide = (idx: number, field: keyof HeroSlide, value: string) => {
    setHeroSlides((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const removeSlide = (idx: number) => {
    setHeroSlides((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveSlide = (idx: number, dir: -1 | 1) => {
    setHeroSlides((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  // ─── Testimonial helpers ──────────────────────────────────────────────────

  const updateTestimonial = (idx: number, field: keyof Testimonial, value: string) => {
    setTestimonials((prev) => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };

  const removeTestimonial = (idx: number) => {
    setTestimonials((prev) => prev.filter((_, i) => i !== idx));
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Đang tải cấu hình trang chủ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
          toast.type === 'ok' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý trang chủ</h1>
        <a href="/" target="_blank" className="text-sm text-green-700 hover:underline">
          Xem trang chủ &rarr;
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
        {[
          { key: 'config' as PageTab, label: 'Nội dung' },
          { key: 'layout' as PageTab, label: 'Bố cục' },
          { key: 'layout-detail' as PageTab, label: 'Bố cục chi tiết' },
          { key: 'theme' as PageTab, label: 'Giao diện' },
          { key: 'preview' as PageTab, label: 'Preview' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════ CONFIG TAB ═══════════════════════ */}
      {activeTab === 'config' && (
        <div className="space-y-3">

          {/* ── Section: Hero Slides ─────────────────────────── */}
          <SectionAccordion
            title="Hero Slides"
            subtitle={`${heroSlides.length} slide`}
            open={openSections.hero}
            onToggle={() => toggleSection('hero')}
          >
            <p className="text-xs text-slate-500 mb-4">
              Quản lý các slide hiển thị ở banner đầu trang. Kéo thứ tự bằng nút mũi tên.
            </p>

            {heroSlides.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Chưa có slide nào</p>
            )}

            <div className="space-y-4">
              {heroSlides.map((slide, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">Slide {idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveSlide(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Di chuyển lên"
                      ><ChevronUp className="w-4 h-4" /></button>
                      <button
                        onClick={() => moveSlide(idx, 1)}
                        disabled={idx === heroSlides.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Di chuyển xuống"
                      ><ChevronDown className="w-4 h-4" /></button>
                      <button
                        onClick={() => removeSlide(idx)}
                        className="p-1 text-red-400 hover:text-red-600 ml-2"
                        title="Xóa slide"
                      >&#10005;</button>
                    </div>
                  </div>

                  {/* Preview thumbnail */}
                  {slide.image_url && (
                    <img src={slide.image_url} alt="" className="w-full h-32 object-cover rounded" />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FieldInput label="Tiêu đề" value={slide.title} onChange={(v) => updateSlide(idx, 'title', v)} />
                    <FieldInput label="Phụ đề" value={slide.subtitle} onChange={(v) => updateSlide(idx, 'subtitle', v)} />
                  </div>
                  <FieldTextarea label="Mô tả" value={slide.description} onChange={(v) => updateSlide(idx, 'description', v)} rows={2} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FieldInput label="Nút CTA (text)" value={slide.cta_text} onChange={(v) => updateSlide(idx, 'cta_text', v)} placeholder="VD: Tìm hiểu thêm" />
                    <FieldInput label="CTA Link" value={slide.cta_link} onChange={(v) => updateSlide(idx, 'cta_link', v)} placeholder="/tuyen-sinh" />
                  </div>
                  <ImagePicker label="Hình ảnh slide" value={slide.image_url} onChange={(v) => updateSlide(idx, 'image_url', v)} />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => setHeroSlides((prev) => [...prev, emptySlide()])}
                className="text-sm text-green-700 hover:text-green-800 font-medium"
              >
                + Thêm slide
              </button>
              <SaveButton loading={savingSection === 'hero'} onClick={saveHeroSlides} />
            </div>
          </SectionAccordion>

          {/* ── Section: Testimonials ────────────────────────── */}
          <SectionAccordion
            title="Cảm nhận phụ huynh"
            subtitle={`${testimonials.length} lời nhận xét`}
            open={openSections.testimonials}
            onToggle={() => toggleSection('testimonials')}
          >
            <p className="text-xs text-slate-500 mb-4">
              Các lời nhận xét / cảm nhận từ phụ huynh hiển thị trên trang chủ.
            </p>

            {testimonials.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Chưa có lời nhận xét nào</p>
            )}

            <div className="space-y-4">
              {testimonials.map((t, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {t.avatar_url ? (
                        <img src={t.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold">
                          {t.name?.charAt(0) || '?'}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-slate-700">{t.name || `Nhận xét ${idx + 1}`}</span>
                    </div>
                    <button
                      onClick={() => removeTestimonial(idx)}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="Xóa"
                    >&#10005;</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FieldInput label="Họ tên" value={t.name} onChange={(v) => updateTestimonial(idx, 'name', v)} />
                    <FieldInput label="Vai trò / Chức danh" value={t.title} onChange={(v) => updateTestimonial(idx, 'title', v)} placeholder="VD: Phụ huynh lớp 3A" />
                  </div>
                  <FieldTextarea label="Nội dung" value={t.content} onChange={(v) => updateTestimonial(idx, 'content', v)} rows={3} />
                  <ImagePicker label="Ảnh đại diện" value={t.avatar_url} onChange={(v) => updateTestimonial(idx, 'avatar_url', v)} />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => setTestimonials((prev) => [...prev, emptyTestimonial()])}
                className="text-sm text-green-700 hover:text-green-800 font-medium"
              >
                + Thêm nhận xét
              </button>
              <SaveButton loading={savingSection === 'testimonials'} onClick={saveTestimonials} />
            </div>
          </SectionAccordion>

          {/* ── Section: Stats ────────────────────────────────── */}
          <SectionAccordion
            title="Số liệu nổi bật"
            subtitle="Học sinh, giáo viên, năm"
            open={openSections.stats}
            onToggle={() => toggleSection('stats')}
          >
            <p className="text-xs text-slate-500 mb-4">
              Các con số thống kê hiển thị trên trang chủ (VD: 1200+ học sinh).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FieldInput label="Số học sinh" value={statStudents} onChange={setStatStudents} placeholder="VD: 1200" />
              <FieldInput label="Số giáo viên" value={statTeachers} onChange={setStatTeachers} placeholder="VD: 80" />
              <FieldInput label="Số năm thành lập" value={statYears} onChange={setStatYears} placeholder="VD: 25" />
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
              <SaveButton loading={savingSection === 'stats'} onClick={saveStats} />
            </div>
          </SectionAccordion>

          {/* ── Section: Featured Event ──────────────────────── */}
          <SectionAccordion
            title="Sự kiện nổi bật"
            subtitle="Sidebar trang chủ"
            open={openSections.featured_event}
            onToggle={() => toggleSection('featured_event')}
          >
            <p className="text-xs text-slate-500 mb-4">
              Chọn sự kiện hiển thị nổi bật trên sidebar trang chủ. Để trống nếu không muốn hiển thị.
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sự kiện</label>
              <select
                value={featuredEventId}
                onChange={(e) => setFeaturedEventId(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">-- Không chọn --</option>
                {allEvents.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
              <SaveButton loading={savingSection === 'featured_event'} onClick={saveFeaturedEvent} />
            </div>
          </SectionAccordion>
        </div>
      )}

      {/* ═══════════════════════ LAYOUT TAB (Bo cuc) ═══════════════════════ */}
      {activeTab === 'layout' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Sắp xếp các khối trang chủ</h3>
            <p className="text-xs text-slate-400 mb-4">
              Kéo thả để thay đổi thứ tự. Bấm biểu tượng mắt để ẩn/hiện.
            </p>
            <BlockSortableList
              blocks={custConfig.blocks}
              onChange={(blocks) => setCustConfig((prev) => ({ ...prev, blocks }))}
            />
          </div>
          <CustomizerActionBar
            saving={savingCust}
            onSave={saveCustomizerConfig}
            onReset={resetCustomizerConfig}
            onPreview={previewHomepage}
            previewing={previewing}
          />
        </div>
      )}

      {/* ═══════════════════════ LAYOUT DETAIL TAB ═══════════════════════ */}
      {activeTab === 'layout-detail' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Chọn kiểu bố cục cho từng khối</h3>
            <p className="text-xs text-slate-400 mb-4">
              Mỗi khối có nhiều kiểu hiển thị khác nhau. Chọn kiểu phù hợp nhất.
            </p>
          </div>
          <LayoutVariantPicker
            blocks={custConfig.blocks}
            onChange={(blocks) => setCustConfig((prev) => ({ ...prev, blocks }))}
          />
          <CustomizerActionBar
            saving={savingCust}
            onSave={saveCustomizerConfig}
            onReset={resetCustomizerConfig}
            onPreview={previewHomepage}
            previewing={previewing}
          />
        </div>
      )}

      {/* ═══════════════════════ THEME TAB ═══════════════════════ */}
      {activeTab === 'theme' && (
        <div className="space-y-4">
          <ThemeEditor
            theme={custConfig.theme}
            onChange={(theme) => setCustConfig((prev) => ({ ...prev, theme }))}
          />
          <CustomizerActionBar
            saving={savingCust}
            onSave={saveCustomizerConfig}
            onReset={resetCustomizerConfig}
            onPreview={previewHomepage}
            previewing={previewing}
          />
        </div>
      )}

      {/* ═══════════════════════ PREVIEW TAB ═══════════════════════ */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Hero preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Hero Slides Preview</h3>
            {heroSlides.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Chưa có slide nào — vào tab Cấu hình để thêm</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heroSlides.map((slide, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-slate-200">
                    {slide.image_url ? (
                      <img src={slide.image_url} alt="" className="w-full h-36 object-cover" />
                    ) : (
                      <div className="w-full h-36 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                        <span className="text-white/50 text-xs">No image</span>
                      </div>
                    )}
                    <div className="p-3 space-y-1">
                      <p className="text-sm font-bold text-slate-900">{slide.title || '(Chưa có tiêu đề)'}</p>
                      {slide.subtitle && <p className="text-xs text-green-700 font-medium">{slide.subtitle}</p>}
                      {slide.description && <p className="text-xs text-slate-500 line-clamp-2">{slide.description}</p>}
                      {slide.cta_text && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded">
                          {slide.cta_text}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats preview */}
          {(statStudents || statTeachers || statYears) && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Số liệu nổi bật</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-700">{statStudents || '—'}</p>
                  <p className="text-xs text-slate-500">Học sinh</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{statTeachers || '—'}</p>
                  <p className="text-xs text-slate-500">Giáo viên</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{statYears || '—'}</p>
                  <p className="text-xs text-slate-500">Năm thành lập</p>
                </div>
              </div>
            </div>
          )}

          {/* Testimonials preview */}
          {testimonials.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Cảm nhận phụ huynh</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-700 text-sm font-bold">
                        {t.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.title}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-3">{t.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bai viet moi nhat */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Bài viết hiển thị trên trang chủ</h3>
              <a href="/admin/articles" className="text-xs text-green-700 hover:underline">
                Quản lý bài viết
              </a>
            </div>

            {recentArticles.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Chưa có bài viết đã đăng nào</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex gap-3 items-start">
                    {article.thumbnail_url ? (
                      <img src={article.thumbnail_url} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-300 text-xs">
                        N/A
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 line-clamp-2">{article.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(article.created_at).toLocaleDateString('vi-VN')}
                        {' · '}
                        {article.view_count} lượt xem
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Su kien sap toi */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Sự kiện sắp diễn ra</h3>
              <a href="/admin/events" className="text-xs text-green-700 hover:underline">
                Quản lý sự kiện
              </a>
            </div>

            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Chưa có sự kiện sắp diễn ra</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{event.title}</p>
                      <p className="text-xs text-slate-400">{event.location || 'Chưa có địa điểm'}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-medium text-green-700">
                        {new Date(event.start_date).toLocaleDateString('vi-VN', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(event.start_date).toLocaleTimeString('vi-VN', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Accordion section wrapper */
function SectionAccordion({
  title, subtitle, open, onToggle, children,
}: {
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div>
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          <span className="ml-2 text-xs text-slate-400">{subtitle}</span>
        </div>
        <span className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>
          &#9660;
        </span>
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-100">{children}</div>}
    </div>
  );
}

/** Input field voi label */
function FieldInput({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm"
      />
    </div>
  );
}

/** Textarea field voi label */
function FieldTextarea({
  label, value, onChange, rows = 2, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

/** Save button voi loading state */
function SaveButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
    </Button>
  );
}

/** Action bar cho cac tab customizer — Khoi phuc | Xem truoc | Luu */
function CustomizerActionBar({
  saving,
  onSave,
  onReset,
  onPreview,
  previewing,
}: {
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
  onPreview: () => void;
  previewing: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <button
        onClick={onReset}
        className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
      >
        Khôi phục mặc định
      </button>
      <button
        onClick={onPreview}
        disabled={previewing}
        className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
      >
        {previewing ? 'Đang tạo...' : 'Xem trước'}
      </button>
      <Button
        onClick={onSave}
        disabled={saving}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
      </Button>
    </div>
  );
}
