'use client';

import { useState } from 'react';
import PageBanner from '@/components/public/PageBanner';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const contactInfo = [
  { icon: MapPin, title: 'Địa chỉ', lines: ['Khu đô thị Mỹ Đình - Mễ Trì,', 'Quận Nam Từ Liêm, Hà Nội'] },
  { icon: Phone, title: 'Điện thoại', lines: ['024 1234 5678', '0912 345 678 (Hotline)'] },
  { icon: Mail, title: 'Email', lines: ['info@lequydon.edu.vn', 'tuyensinh@lequydon.edu.vn'] },
  { icon: Clock, title: 'Giờ làm việc', lines: ['Thứ 2 - Thứ 6: 7:30 - 17:00', 'Thứ 7: 8:00 - 12:00'] },
];

export default function LienHePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Se xu ly gui form sau khi ket noi API
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
  };

  return (
    <div>
      <PageBanner
        title="Liên hệ"
        description="Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào"
        breadcrumbItems={[{ label: 'Liên hệ' }]}
      />

      {/* Contact info cards */}
      <section className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactInfo.map((info) => (
            <div key={info.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                <info.icon className="w-5 h-5 text-green-700" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">{info.title}</h3>
              {info.lines.map((line, i) => (
                <p key={i} className="text-xs text-slate-600">{line}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="max-w-7xl mx-auto px-4 pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0912 345 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Chủ đề</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="tuyen-sinh">Tuyển sinh</option>
                    <option value="hoc-phi">Học phí</option>
                    <option value="chuong-trinh">Chương trình học</option>
                    <option value="gop-y">Góp ý</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Nhập nội dung tin nhắn..."
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors text-sm"
              >
                <Send className="w-4 h-4" />
                Gửi tin nhắn
              </button>
            </form>
          </div>

          {/* Google Maps embed */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="h-full min-h-[400px] bg-slate-100 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MapPin className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="text-sm">Google Maps</p>
                <p className="text-xs mt-1">Trường Tiểu học Lê Quý Đôn</p>
                <p className="text-xs">Nam Từ Liêm, Hà Nội</p>
                {/* Se thay bang iframe Google Maps khi co API key */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
