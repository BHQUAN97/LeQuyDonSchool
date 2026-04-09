import Breadcrumb from '@/components/public/Breadcrumb';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import ContactForm from './ContactForm';

/* Metadata da duoc export tu layout.tsx — khong can export lai o page */

export default function LienHePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: 'Liên hệ' }]} />
        </div>
      </div>

      {/* Section title voi flag bars */}
      <section className="max-w-7xl mx-auto px-4 pt-8 lg:pt-12">
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              <span className="w-1.5 h-7 bg-green-600 rounded-sm" />
              <span className="w-1.5 h-7 bg-red-600 rounded-sm" />
              <span className="w-1.5 h-7 bg-green-600 rounded-sm" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              LIÊN HỆ
            </h1>
          </div>
          <p className="text-base text-green-700 font-medium">Thông tin liên hệ</p>
        </div>
      </section>

      {/* Thong tin lien he */}
      <section className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <p className="text-base text-slate-800 font-medium mb-2">
          Cảm ơn Quý vị đã quan tâm đến Trường Tiểu học Lê Quý Đôn.
        </p>
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          Quý phụ huynh có thể liên hệ trực tiếp với nhà trường qua các kênh thông tin dưới đây,
          hoặc điền thông tin vào mẫu liên hệ để được tư vấn chi tiết.
        </p>

        {/* Contact info items voi green circle icons */}
        <div className="space-y-4 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-900">Địa chỉ: </span>
              <span className="text-sm text-slate-700">
                Số 50 Lưu Hữu Phước, KĐT Mỹ Đình 1, P. Từ Liêm, TP. Hà Nội
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-900">Số ĐT: </span>
              <span className="text-sm text-slate-700">
                024.62872079 (Số máy lẻ: 101 hoặc 105)
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-900">Email: </span>
              <a
                href="mailto:tuyensinh@lequydonhanoi.edu.vn"
                className="text-sm text-green-700 hover:underline"
              >
                tuyensinh@lequydonhanoi.edu.vn
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-900">Facebook: </span>
              <a
                href="https://www.facebook.com/lequydonhanoiprimaryschool"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-700 hover:underline break-all"
              >
                https://www.facebook.com/lequydonhanoiprimaryschool
              </a>
            </div>
          </div>
        </div>

        {/* Form lien he — client component */}
        <ContactForm />
      </section>

      {/* Google Maps section */}
      <section className="max-w-7xl mx-auto px-4 pb-12 lg:pb-16">
        <h2 className="text-lg lg:text-xl font-bold text-slate-900 mb-6 text-center">
          ĐỊA ĐIỂM CỦA TIỂU HỌC LÊ QUÝ ĐÔN TRÊN BẢN ĐỒ
        </h2>
        <div className="w-full h-[280px] sm:h-[400px] rounded-xl border border-slate-200 overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096!2d105.7728!3d21.0285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd1e8a5e7%3A0x8b0e76ae7a4b8b1c!2zVHLGsOG7nW5nIFRp4buDdSBo4buNYyBMw6ogUXXDvSDEkMO0bg!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ Trường Tiểu học Lê Quý Đôn"
          />
        </div>
      </section>
    </div>
  );
}
