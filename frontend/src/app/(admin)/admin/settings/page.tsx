'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TabKey = 'general' | 'contact' | 'social' | 'seo' | 'floating';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'general', label: 'Chung' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'social', label: 'Mạng xã hội' },
  { key: 'seo', label: 'SEO' },
  { key: 'floating', label: 'Nút liên hệ nhanh' },
];

/** Cau hinh cac field cho moi tab */
const TAB_FIELDS: Record<TabKey, { key: string; label: string; type: 'text' | 'textarea' | 'toggle' }[]> = {
  general: [
    { key: 'school_name', label: 'Tên trường', type: 'text' },
    { key: 'slogan', label: 'Slogan', type: 'text' },
    { key: 'logo_url', label: 'URL Logo', type: 'text' },
    { key: 'favicon_url', label: 'URL Favicon', type: 'text' },
  ],
  contact: [
    { key: 'address', label: 'Địa chỉ', type: 'text' },
    { key: 'phone', label: 'Số điện thoại', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'google_maps_url', label: 'URL Google Maps', type: 'text' },
  ],
  social: [
    { key: 'facebook_url', label: 'Facebook URL', type: 'text' },
    { key: 'youtube_url', label: 'YouTube URL', type: 'text' },
    { key: 'zalo_url', label: 'Zalo URL', type: 'text' },
    { key: 'messenger_url', label: 'Messenger URL', type: 'text' },
  ],
  seo: [
    { key: 'default_title', label: 'Tiêu đề mặc định', type: 'text' },
    { key: 'meta_description', label: 'Mô tả meta', type: 'textarea' },
    { key: 'og_image_url', label: 'OG Image URL', type: 'text' },
    { key: 'google_analytics_id', label: 'Google Analytics ID', type: 'text' },
  ],
  floating: [
    { key: 'phone_enabled', label: 'Hiện nút Gọi điện', type: 'toggle' },
    { key: 'phone_number', label: 'Số điện thoại', type: 'text' },
    { key: 'messenger_enabled', label: 'Hiện nút Messenger', type: 'toggle' },
    { key: 'messenger_url_floating', label: 'Messenger URL', type: 'text' },
    { key: 'zalo_enabled', label: 'Hiện nút Zalo', type: 'toggle' },
    { key: 'zalo_url_floating', label: 'Zalo URL', type: 'text' },
    { key: 'form_enabled', label: 'Hiện nút Form', type: 'toggle' },
    { key: 'form_url', label: 'Form URL', type: 'text' },
  ],
};

export default function SettingsAdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /** Tai tat ca settings tu API */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api<{ success: boolean; data: Record<string, any[]> }>('/settings');
        if (res.success) {
          // Chuyen grouped settings thanh flat {key: value}
          const flat: Record<string, string> = {};
          for (const group of Object.values(res.data)) {
            for (const item of group) {
              flat[item.key] = item.value;
            }
          }
          setValues(flat);
        }
      } catch (err) {
        console.error('Loi tai settings:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /** Luu settings cua tab hien tai */
  const handleSave = async () => {
    setSaving(true);
    try {
      const fields = TAB_FIELDS[activeTab];
      const items = fields.map((f) => ({
        key: f.key,
        value: values[f.key] || '',
        group: activeTab,
      }));

      await api('/settings', {
        method: 'PUT',
        body: JSON.stringify({ items }),
      });

      alert('Đã lưu cấu hình');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu');
    } finally {
      setSaving(false);
    }
  };

  /** Cap nhat gia tri 1 field */
  const updateValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  /** Toggle boolean (luu dang 'true'/'false') */
  const toggleValue = (key: string) => {
    setValues((prev) => ({ ...prev, [key]: prev[key] === 'true' ? 'false' : 'true' }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Đang tải cấu hình...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Cài đặt hệ thống</h1>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        {TAB_FIELDS[activeTab].map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
            </label>

            {field.type === 'toggle' ? (
              <button
                onClick={() => toggleValue(field.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  values[field.key] === 'true' ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    values[field.key] === 'true' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            ) : field.type === 'textarea' ? (
              <textarea
                value={values[field.key] || ''}
                onChange={(e) => updateValue(field.key, e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <Input
                value={values[field.key] || ''}
                onChange={(e) => updateValue(field.key, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-slate-200">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </div>
    </div>
  );
}
