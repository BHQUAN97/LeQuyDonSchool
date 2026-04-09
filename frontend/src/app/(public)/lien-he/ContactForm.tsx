'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

/** Form lien he — client component tach ra tu page.tsx de page giu duoc metadata */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Client-side validation — chong spam va input doc hai
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (name.length < 2 || name.length > 100) {
      setError('Họ tên phải từ 2-100 ký tự.');
      setLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ.');
      setLoading(false);
      return;
    }
    if (phone && !/^[0-9+\-\s()]{8,15}$/.test(phone)) {
      setError('Số điện thoại không hợp lệ (8-15 ký tự, chỉ số và +-).');
      setLoading(false);
      return;
    }
    if (message.length < 10 || message.length > 2000) {
      setError('Nội dung phải từ 10-2000 ký tự.');
      setLoading(false);
      return;
    }

    try {
      // Gui form lien he len backend POST /api/contacts
      await api('/contacts', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          content: formData.message,
        }),
      });
      setSuccess(true);
      setFormData({ name: '', email: '', address: '', phone: '', message: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-12">
      <p className="text-sm text-slate-700 font-medium mb-6">
        Hoặc điền mẫu thông tin sau để được tư vấn trực tiếp:
      </p>

      {success && (
        <div className="flex items-center gap-2 p-4 mb-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</span>
        </div>
      )}
      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Ho ten + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              placeholder="Nhập họ và tên"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              placeholder="Nhập email"
            />
          </div>
        </div>

        {/* Row 2: Dia chi + So dien thoai */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-address" className="block text-sm font-medium text-slate-700 mb-1.5">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-address"
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              placeholder="Nhập địa chỉ"
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-700 mb-1.5">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>

        {/* Row 3: Noi dung (full width) */}
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-1.5">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors resize-none"
            placeholder="Nhập nội dung liên hệ..."
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang gửi...' : 'Gửi liên hệ'}
          </button>
        </div>
      </form>
    </div>
  );
}
