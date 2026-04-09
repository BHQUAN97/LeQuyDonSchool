'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

type TabKey = 'general' | 'contact' | 'social' | 'seo' | 'floating';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'general', label: 'Chung' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'social', label: 'Mạng xã hội' },
  { key: 'seo', label: 'SEO' },
  { key: 'floating', label: 'Nút liên hệ nhanh' },
];

/** Cau hinh cac field cho moi tab */
const TAB_FIELDS: Record<TabKey, { key: string; label: string; type: 'text' | 'textarea' | 'toggle'; help?: string; maxLength?: number }[]> = {
  general: [
    { key: 'school_name', label: 'Tên trường', type: 'text', help: 'Tên chính thức của trường hiển thị trên website' },
    { key: 'slogan', label: 'Slogan', type: 'text', help: 'Khẩu hiệu ngắn gọn của trường' },
    { key: 'logo_url', label: 'URL Logo', type: 'text', help: 'Đường dẫn ảnh logo (khuyến nghị PNG trong suốt)' },
    { key: 'favicon_url', label: 'URL Favicon', type: 'text', help: 'Icon nhỏ hiển thị trên tab trình duyệt (16x16 hoặc 32x32)' },
  ],
  contact: [
    { key: 'address', label: 'Địa chỉ', type: 'text', help: 'Địa chỉ đầy đủ của trường' },
    { key: 'phone', label: 'Số điện thoại', type: 'text', help: 'Số điện thoại liên hệ chính' },
    { key: 'email', label: 'Email', type: 'text', help: 'Email liên hệ chính của trường' },
    { key: 'google_maps_url', label: 'URL Google Maps', type: 'text', help: 'Link nhúng Google Maps (embed URL)' },
  ],
  social: [
    { key: 'facebook_url', label: 'Facebook URL', type: 'text', help: 'Đường dẫn trang Facebook của trường' },
    { key: 'youtube_url', label: 'YouTube URL', type: 'text', help: 'Đường dẫn kênh YouTube của trường' },
    { key: 'zalo_url', label: 'Zalo URL', type: 'text', help: 'Đường dẫn Zalo OA của trường' },
    { key: 'messenger_url', label: 'Messenger URL', type: 'text', help: 'Đường dẫn Messenger của trường' },
  ],
  seo: [
    { key: 'default_title', label: 'Tiêu đề mặc định', type: 'text', help: 'Tiêu đề hiển thị trên tab trình duyệt và kết quả tìm kiếm' },
    { key: 'meta_description', label: 'Mô tả meta', type: 'textarea', help: 'Mô tả ngắn hiển thị trên kết quả Google', maxLength: 160 },
    { key: 'og_image_url', label: 'OG Image URL', type: 'text', help: 'URL ảnh đại diện khi chia sẻ lên mạng xã hội' },
    { key: 'google_analytics_id', label: 'Google Analytics ID', type: 'text', help: 'Mã theo dõi Google Analytics (VD: G-XXXXXXXXXX)' },
  ],
  floating: [
    { key: 'phone_enabled', label: 'Hiện nút Gọi điện', type: 'toggle' },
    { key: 'phone_number', label: 'Số điện thoại', type: 'text', help: 'Số điện thoại khi nhấn nút gọi nhanh' },
    { key: 'messenger_enabled', label: 'Hiện nút Messenger', type: 'toggle' },
    { key: 'messenger_url_floating', label: 'Messenger URL', type: 'text', help: 'Link Messenger cho nút liên hệ nhanh' },
    { key: 'zalo_enabled', label: 'Hiện nút Zalo', type: 'toggle' },
    { key: 'zalo_url_floating', label: 'Zalo URL', type: 'text', help: 'Link Zalo cho nút liên hệ nhanh' },
    { key: 'form_enabled', label: 'Hiện nút Form', type: 'toggle' },
    { key: 'form_url', label: 'Form URL', type: 'text', help: 'Link form đăng ký / liên hệ' },
  ],
};

export default function SettingsAdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

      setSettingsMsg({ type: 'success', text: 'Đã lưu cấu hình thành công' });
    } catch (err: any) {
      setSettingsMsg({ type: 'error', text: err.message || 'Lỗi khi lưu' });
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
              <>
                <textarea
                  value={values[field.key] || ''}
                  onChange={(e) => { if (!field.maxLength || e.target.value.length <= field.maxLength) updateValue(field.key, e.target.value); }}
                  rows={3}
                  maxLength={field.maxLength}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {field.maxLength && (
                  <p className={`text-xs mt-1 ${(values[field.key] || '').length >= field.maxLength - 20 ? 'text-orange-500' : 'text-slate-400'}`}>
                    {(values[field.key] || '').length}/{field.maxLength}
                  </p>
                )}
              </>
            ) : (
              <Input
                value={values[field.key] || ''}
                onChange={(e) => updateValue(field.key, e.target.value)}
              />
            )}
            {field.help && (
              <p className="text-xs text-slate-400 mt-1">{field.help}</p>
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-slate-200">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </div>

      {/* Success/Error dialog */}
      <ConfirmDialog
        open={!!settingsMsg}
        title={settingsMsg?.type === 'success' ? 'Thành công' : 'Lỗi'}
        message={settingsMsg?.text || ''}
        confirmLabel="Đóng"
        cancelLabel="Đóng"
        variant={settingsMsg?.type === 'success' ? 'warning' : 'warning'}
        onConfirm={() => setSettingsMsg(null)}
        onCancel={() => setSettingsMsg(null)}
      />
    </div>
  );
}
