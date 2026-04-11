'use client';

import { useState } from 'react';
import {
  BookOpen, FileText, FolderTree, File, Home, Link2,
  GraduationCap, UtensilsCrossed, Calendar, Mail, ImageIcon,
  Users, Settings, Lightbulb, ChevronDown, ChevronRight,
  Info, AlertTriangle, Printer, LayoutDashboard,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Kieu du lieu cho moi section huong dan                            */
/* ------------------------------------------------------------------ */
interface GuideSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component: hop ghi chu mau (vang = canh bao, xanh = meo)         */
/* ------------------------------------------------------------------ */
function NoteBox({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const isWarning = type === 'warning';
  return (
    <div
      className={`flex gap-3 p-4 rounded-lg my-3 text-sm leading-relaxed ${
        isWarning
          ? 'bg-amber-50 border border-amber-200 text-amber-900'
          : 'bg-blue-50 border border-blue-200 text-blue-900'
      }`}
    >
      {isWarning ? (
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
      ) : (
        <Info className="w-5 h-5 shrink-0 text-blue-500 mt-0.5" />
      )}
      <div>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component: danh sach buoc (numbered)                              */
/* ------------------------------------------------------------------ */
function Steps({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal list-inside space-y-2 my-3 text-sm text-slate-700 leading-relaxed">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/*  Noi dung tung section                                             */
/* ------------------------------------------------------------------ */
const sections: GuideSection[] = [
  /* 1. Tong quan */
  {
    id: 'tong-quan',
    title: 'Tong quan he thong',
    icon: LayoutDashboard,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          He thong quan tri website Truong Tieu hoc Le Quy Don cho phep ban quan ly toan bo noi dung
          hien thi tren website cong khai cua truong. Tu trang chu, bai dang, danh muc, den thuc don,
          su kien, tuyen sinh — tat ca deu duoc chinh sua truc tiep tai day.
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Thanh dieu huong ben trai (Sidebar)</h4>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li><strong>Dashboard</strong> — Tong quan thong ke, bai viet gan day</li>
          <li><strong>Bai dang</strong> — Tao va quan ly cac bai viet (tin tuc, hoat dong...)</li>
          <li><strong>Danh muc</strong> — Phan loai bai viet theo nhom</li>
          <li><strong>Trang</strong> — Tao trang tinh voi duong dan tuy chinh</li>
          <li><strong>Trang chu</strong> — Chinh sua slider, thong ke, testimonial</li>
          <li><strong>Menu & URL</strong> — Quan ly trinh don dieu huong website</li>
          <li><strong>Tuyen sinh</strong> — Bai tuyen sinh, cau hoi thuong gap, don dang ky</li>
          <li><strong>Thuc don</strong> — Thuc don an tuan cua truong</li>
          <li><strong>Su kien</strong> — Quan ly su kien co ngay, gio, dia diem</li>
          <li><strong>Lien he</strong> — Xem tin nhan lien he tu phu huynh</li>
          <li><strong>Media</strong> — Thu vien hinh anh cua website</li>
          <li><strong>Nguoi dung</strong> — Quan ly tai khoan quan tri (chi Super Admin)</li>
          <li><strong>Cai dat</strong> — Cau hinh thong tin truong, SEO, nut lien he nhanh</li>
        </ul>

        <NoteBox type="info">
          Vai tro <strong>Super Admin</strong> co quyen truy cap tat ca chuc nang.
          Vai tro <strong>Editor</strong> chi thay cac muc quan ly noi dung (Bai dang, Danh muc, Trang, Tuyen sinh, Thuc don, Su kien, Lien he, Media).
        </NoteBox>
      </>
    ),
  },

  /* 2. Bai dang */
  {
    id: 'bai-dang',
    title: 'Quan ly Bai dang (Articles)',
    icon: FileText,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Bai dang la noi dung chinh cua website — bao gom tin tuc, hoat dong, thong bao, bai viet chuyen mon...
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Tao bai dang moi</h4>
        <Steps
          items={[
            'Vao menu Bai dang > bam nut "Tao bai dang moi".',
            'Nhap tieu de — he thong tu dong tao slug (duong dan) tu tieu de.',
            'Chon danh muc phu hop (co the chon nhieu danh muc).',
            'Nhap noi dung bai viet trong trinh soan thao.',
            'Bam "Chon anh dai dien" de chon anh thumbnail tu thu vien Media.',
            'Nhap mo ta ngan (excerpt) — doan nay hien thi o trang danh sach.',
            'Chon trang thai: Nhap (Draft) hoac Xuat ban (Published).',
            'Bam "Luu" de hoan tat.',
          ]}
        />

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Chinh sua / Xoa</h4>
        <Steps
          items={[
            'O danh sach bai dang, bam vao tieu de hoac bieu tuong but chi de sua.',
            'Sau khi chinh sua, bam "Luu" de cap nhat.',
            'De xoa, bam bieu tuong thung rac va xac nhan trong hop thoai.',
          ]}
        />

        <NoteBox type="warning">
          Bai dang da xuat ban se hien thi ngay tren website. Hay kiem tra ky noi dung truoc khi chuyen sang trang thai &ldquo;Xuat ban&rdquo;.
        </NoteBox>

        <NoteBox type="info">
          Meo: Dung trang thai <strong>Nhap (Draft)</strong> de luu bai dang chua hoan chinh. Chi chuyen sang
          &ldquo;Xuat ban&rdquo; khi da san sang.
        </NoteBox>
      </>
    ),
  },

  /* 3. Danh muc */
  {
    id: 'danh-muc',
    title: 'Quan ly Danh muc (Categories)',
    icon: FolderTree,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Danh muc giup phan loai bai dang thanh cac nhom de doc gia de tim kiem. He thong ho tro danh muc cha-con (nhieu cap).
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Tao danh muc</h4>
        <Steps
          items={[
            'Vao menu Danh muc > bam "Tao danh muc".',
            'Nhap ten danh muc — slug se duoc tao tu dong.',
            'Neu la danh muc con, chon "Danh muc cha" tu danh sach.',
            'Nhap mo ta (khong bat buoc).',
            'Bam "Luu".',
          ]}
        />

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Cau truc cha-con</h4>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>Danh muc cha: <strong>Tin tuc</strong></li>
          <li className="ml-4">Danh muc con: Tin tuc truong, Tin tuc giao duc, Thong bao</li>
          <li>Danh muc cha: <strong>Hoat dong</strong></li>
          <li className="ml-4">Danh muc con: Ngoai khoa, Van nghe, The thao</li>
        </ul>

        <NoteBox type="warning">
          Xoa danh muc cha se <strong>khong</strong> tu dong xoa danh muc con. Hay chuyen cac danh muc con sang noi khac truoc khi xoa cha.
        </NoteBox>
      </>
    ),
  },

  /* 4. Trang */
  {
    id: 'trang',
    title: 'Quan ly Trang (Pages)',
    icon: File,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Trang (Page) la noi dung tinh — khac voi bai dang, trang khong thuoc danh muc va co duong dan tuy chinh.
          Vi du: Gioi thieu, Tam nhin, Co so vat chat...
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Tao trang moi</h4>
        <Steps
          items={[
            'Vao menu Trang > bam "Tao trang moi".',
            'Nhap tieu de trang.',
            'Nhap slug (duong dan). Vi du: gioi-thieu, co-so-vat-chat.',
            'De tao trang long nhau, dung dau "/" trong slug. Vi du: tong-quan/tam-nhin se hien thi tai website.com/tong-quan/tam-nhin.',
            'Nhap noi dung bang trinh soan thao.',
            'Chon anh dai dien neu can.',
            'Bam "Luu".',
          ]}
        />

        <NoteBox type="info">
          <strong>Trang long nhau (nested):</strong> Slug <code className="bg-blue-100 px-1 rounded">tong-quan/tam-nhin</code> se
          tao trang con cua tong-quan. Dieu nay huu ich de to chuc noi dung theo cau truc cay.
        </NoteBox>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Trang hien thi tren website nhu the nao?</h4>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>Moi trang co URL rieng dua tren slug da nhap.</li>
          <li>De trang xuat hien tren menu website, can them lien ket trong phan <strong>Menu & URL</strong>.</li>
          <li>Trang co trang thai Draft se khong hien thi voi nguoi xem.</li>
        </ul>
      </>
    ),
  },

  /* 5. Trang chu */
  {
    id: 'trang-chu',
    title: 'Trang chu (Homepage)',
    icon: Home,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Trang chu la trang dau tien khach truy cap thay. Ban co the tuy chinh cac thanh phan: slider hinh anh,
          thong ke, testimonial (cam nhan), va bo cuc tong the.
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Quan ly Hero Slides</h4>
        <Steps
          items={[
            'Vao Trang chu > tab "Hero Slides".',
            'Bam "Them slide" de tao moi.',
            'Chon hinh anh (kich thuoc khuyen nghi: 1920x600px).',
            'Nhap tieu de va phu de (khong bat buoc).',
            'Nhap lien ket khi bam vao slide (khong bat buoc).',
            'Keo tha de sap xep thu tu slides.',
            'Bam "Luu" de cap nhat.',
          ]}
        />

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Thong ke (Stats)</h4>
        <p className="text-sm text-slate-700 mb-2">
          Hien thi cac con so noi bat: so nam thanh lap, so hoc sinh, so giao vien...
        </p>
        <Steps
          items={[
            'Vao tab "Thong ke".',
            'Chinh sua gia tri va nhan cho tung muc.',
            'Bam "Luu".',
          ]}
        />

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Testimonials (Cam nhan)</h4>
        <Steps
          items={[
            'Vao tab "Testimonials".',
            'Bam "Them" de tao cam nhan moi.',
            'Nhap ten nguoi, vai tro (phu huynh, cuu hoc sinh...), noi dung cam nhan.',
            'Chon anh dai dien (avatar).',
            'Bam "Luu".',
          ]}
        />

        <NoteBox type="info">
          Nut <strong>&ldquo;Xem truoc&rdquo;</strong> cho phep ban xem trang chu se nhu the nao truoc khi luu thay doi.
        </NoteBox>
      </>
    ),
  },

  /* 6. Menu & URL */
  {
    id: 'menu-url',
    title: 'Menu & URL (Navigation)',
    icon: Link2,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Menu dieu huong la thanh trinh don phia tren website. Ban co the tao menu da cap (cha-con) de to chuc noi dung.
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Them muc menu</h4>
        <Steps
          items={[
            'Vao Menu & URL.',
            'Bam "Them muc menu".',
            'Nhap ten hien thi (vi du: "Gioi thieu").',
            'Nhap URL dich. Co the la: duong dan noi bo (/gioi-thieu), lien ket ngoai (https://...), hoac de trong (chi la menu cha).',
            'Chon menu cha neu la menu con.',
            'Bam "Luu".',
          ]}
        />

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Sap xep menu</h4>
        <Steps
          items={[
            'Keo tha cac muc menu de thay doi thu tu.',
            'Keo vao trong muc khac de bien thanh menu con.',
            'Bam "Luu thu tu" khi hoan tat.',
          ]}
        />

        <NoteBox type="warning">
          Menu ho tro toi da <strong>2 cap</strong> (cha va con). Khong nen tao qua nhieu muc menu de tranh gay roi cho nguoi dung.
        </NoteBox>
      </>
    ),
  },

  /* 7. Tuyen sinh */
  {
    id: 'tuyen-sinh',
    title: 'Tuyen sinh (Admissions)',
    icon: GraduationCap,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Quan ly thong tin tuyen sinh: bai viet tuyen sinh, cau hoi thuong gap (FAQ), va danh sach don dang ky.
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Bai viet tuyen sinh</h4>
        <Steps
          items={[
            'Vao Tuyen sinh > tab "Bai viet".',
            'Tao bai viet tuong tu nhu Bai dang — nhap tieu de, noi dung, anh.',
            'Bai viet tuyen sinh se hien thi tren trang tuyen sinh cua website.',
          ]}
        />

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Cau hoi thuong gap (FAQ)</h4>
        <Steps
          items={[
            'Chuyen sang tab "FAQ".',
            'Bam "Them cau hoi".',
            'Nhap cau hoi va cau tra loi.',
            'Sap xep thu tu bang keo tha.',
          ]}
        />

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Don dang ky</h4>
        <Steps
          items={[
            'Chuyen sang tab "Don dang ky".',
            'Xem danh sach cac don da gui tu website.',
            'Bam vao tung don de xem chi tiet thong tin phu huynh va hoc sinh.',
            'Danh dau trang thai: Da lien he, Dang xu ly, Hoan tat.',
          ]}
        />

        <NoteBox type="info">
          Don dang ky duoc gui tu trang tuyen sinh cong khai. He thong se gui email thong bao moi khi co don moi.
        </NoteBox>
      </>
    ),
  },

  /* 8. Thuc don */
  {
    id: 'thuc-don',
    title: 'Thuc don (Menus)',
    icon: UtensilsCrossed,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Dang thuc don an trua hang tuan cua truong de phu huynh theo doi.
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Tao thuc don tuan</h4>
        <Steps
          items={[
            'Vao Thuc don > bam "Tao thuc don moi".',
            'Chon tuan (ngay bat dau — ngay ket thuc).',
            'Nhap thuc don cho tung ngay (Thu 2 — Thu 6).',
            'Co the dinh kem hinh anh mon an.',
            'Bam "Xuat ban" de hien thi tren website.',
          ]}
        />

        <NoteBox type="info">
          Chi thuc don cua tuan hien tai va tuan toi moi hien thi tren website. Cac tuan cu se tu dong an di.
        </NoteBox>
      </>
    ),
  },

  /* 9. Su kien */
  {
    id: 'su-kien',
    title: 'Su kien (Events)',
    icon: Calendar,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Quan ly cac su kien, hoat dong cua truong voi thoi gian va dia diem cu the.
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Tao su kien</h4>
        <Steps
          items={[
            'Vao Su kien > bam "Tao su kien moi".',
            'Nhap ten su kien.',
            'Chon ngay bat dau va ngay ket thuc.',
            'Nhap dia diem to chuc.',
            'Nhap mo ta chi tiet su kien.',
            'Chon anh dai dien.',
            'Bam "Luu".',
          ]}
        />

        <NoteBox type="info">
          Su kien sap dien ra se hien thi noi bat tren website. Su kien da qua se tu dong chuyen vao muc &ldquo;Da dien ra&rdquo;.
        </NoteBox>
      </>
    ),
  },

  /* 10. Lien he */
  {
    id: 'lien-he',
    title: 'Lien he (Contacts)',
    icon: Mail,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Xem va quan ly cac tin nhan lien he tu phu huynh gui qua form tren website.
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Xu ly tin nhan</h4>
        <Steps
          items={[
            'Vao Lien he de xem danh sach tin nhan.',
            'Tin nhan moi se co nhan "Moi" (chua doc).',
            'Bam vao tung tin nhan de xem chi tiet: ho ten, email, so dien thoai, noi dung.',
            'Danh dau "Da doc" hoac "Da phan hoi" de theo doi trang thai.',
            'Lien he lai voi phu huynh qua email hoac dien thoai da cung cap.',
          ]}
        />

        <NoteBox type="warning">
          Hay phan hoi tin nhan trong vong <strong>24-48 gio</strong> de dam bao trai nghiem tot cho phu huynh.
        </NoteBox>
      </>
    ),
  },

  /* 11. Media */
  {
    id: 'media',
    title: 'Media (Thu vien hinh anh)',
    icon: ImageIcon,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Thu vien media luu tru tat ca hinh anh su dung tren website. Ban co the tai len, xem va xoa hinh anh tai day.
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Tai hinh anh len</h4>
        <Steps
          items={[
            'Vao Media > bam "Tai len" hoac keo tha file vao vung upload.',
            'Chon mot hoac nhieu file hinh anh (JPG, PNG, WebP).',
            'Doi he thong xu ly — hinh anh se hien trong thu vien.',
          ]}
        />

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Su dung ImagePicker</h4>
        <p className="text-sm text-slate-700 mb-2">
          Khi tao bai dang, trang, hoac bat ky noi dung nao can hinh anh, ban se thay nut <strong>&ldquo;Chon anh&rdquo;</strong>.
        </p>
        <Steps
          items={[
            'Bam "Chon anh" — hop thoai ImagePicker se mo ra.',
            'Chon anh tu thu vien co san, hoac tai len anh moi ngay trong hop thoai.',
            'Bam "Chon" de su dung anh da chon.',
          ]}
        />

        <NoteBox type="info">
          <strong>Khuyen nghi kich thuoc anh:</strong><br />
          - Anh dai dien bai viet: 800x500px<br />
          - Anh slider trang chu: 1920x600px<br />
          - Anh trong bai viet: toi da 1200px chieu rong<br />
          - Dinh dang khuyen nghi: WebP hoac JPG (nen duoi 500KB)
        </NoteBox>
      </>
    ),
  },

  /* 12. Cai dat */
  {
    id: 'cai-dat',
    title: 'Cai dat (Settings)',
    icon: Settings,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Cau hinh thong tin chung cua truong va cac tuy chon hien thi tren website.
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Cac tab cai dat</h4>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2 my-3">
          <li><strong>Chung</strong> — Ten truong, slogan, logo, favicon.</li>
          <li><strong>Lien he</strong> — Dia chi, so dien thoai, email, Google Maps.</li>
          <li><strong>Mang xa hoi</strong> — Lien ket Facebook, YouTube, Zalo, Messenger.</li>
          <li><strong>SEO</strong> — Tieu de mac dinh, mo ta meta, anh OG, Google Analytics ID.</li>
          <li><strong>Nut lien he nhanh</strong> — Bat/tat nut goi dien va Messenger noi phia cuoi website.</li>
        </ul>

        <NoteBox type="info">
          <strong>SEO</strong> (Search Engine Optimization) giup website xuat hien tot hon tren Google.
          Hay dien day du tieu de va mo ta meta.
        </NoteBox>

        <NoteBox type="warning">
          Chi <strong>Super Admin</strong> moi co quyen truy cap phan Cai dat.
        </NoteBox>
      </>
    ),
  },

  /* 13. Nguoi dung */
  {
    id: 'nguoi-dung',
    title: 'Nguoi dung (Users)',
    icon: Users,
    content: (
      <>
        <p className="text-sm text-slate-700 leading-relaxed">
          Quan ly tai khoan dang nhap he thong quan tri. Chi Super Admin moi co quyen nay.
        </p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Vai tro nguoi dung</h4>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2 my-3">
          <li>
            <strong>Super Admin</strong> — Quyen cao nhat. Truy cap tat ca chuc nang, bao gom: quan ly nguoi dung,
            cai dat, trang chu, menu, thong ke.
          </li>
          <li>
            <strong>Editor</strong> — Quyen soan thao noi dung. Co the tao/sua/xoa: bai dang, danh muc, trang,
            tuyen sinh, thuc don, su kien, lien he, media.
          </li>
        </ul>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Tao tai khoan moi</h4>
        <Steps
          items={[
            'Vao Nguoi dung > bam "Tao nguoi dung".',
            'Nhap ho ten, email, mat khau.',
            'Chon vai tro: Super Admin hoac Editor.',
            'Bam "Luu".',
          ]}
        />

        <NoteBox type="warning">
          Han che so luong <strong>Super Admin</strong>. Chi cap quyen nay cho nguoi thuc su can quan ly toan bo he thong.
        </NoteBox>
      </>
    ),
  },

  /* 14. Meo su dung */
  {
    id: 'meo-su-dung',
    title: 'Meo su dung',
    icon: Lightbulb,
    content: (
      <>
        <h4 className="font-semibold text-slate-800 mb-2">Toi uu hinh anh</h4>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>Nen anh truoc khi tai len (dung <a href="https://squoosh.app" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">squoosh.app</a> hoac <a href="https://tinypng.com" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">tinypng.com</a>).</li>
          <li>Su dung dinh dang WebP de giam dung luong ma van giu chat luong.</li>
          <li>Toi da 500KB cho anh thuong, 1MB cho anh slider.</li>
          <li>Dat ten file co y nghia: <code className="bg-slate-100 px-1 rounded text-xs">khai-giang-2026.jpg</code> thay vi <code className="bg-slate-100 px-1 rounded text-xs">IMG_1234.jpg</code>.</li>
        </ul>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">SEO tot hon</h4>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>Viet tieu de bai dang ro rang, co tu khoa chinh.</li>
          <li>Luon nhap mo ta ngan (excerpt) cho moi bai viet.</li>
          <li>Su dung tieu de phu (H2, H3) trong noi dung bai viet de cau truc ro rang.</li>
          <li>Dat ten anh co y nghia thay vi de ten mac dinh.</li>
        </ul>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Phim tat huu ich</h4>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono">Ctrl + S</kbd> — Luu nhanh (trong trinh soan thao).</li>
          <li><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono">Ctrl + Z</kbd> — Hoan tac thao tac vua thuc hien.</li>
          <li><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono">Ctrl + B</kbd> — In dam van ban dang chon.</li>
          <li><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono">Ctrl + K</kbd> — Chen lien ket.</li>
        </ul>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Thuc hanh tot</h4>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>Luu nhap thuong xuyen khi soan bai dai — tranh mat du lieu.</li>
          <li>Xem truoc bai viet truoc khi xuat ban.</li>
          <li>Kiem tra hien thi tren dien thoai — da so phu huynh xem tu dien thoai.</li>
          <li>Cap nhat thong tin tuyen sinh truoc mua tuyen sinh it nhat 1 thang.</li>
          <li>Dang thuc don an tuan vao thu Hai dau tuan.</li>
        </ul>
      </>
    ),
  },
];

/* ================================================================== */
/*  Trang chinh: Huong dan su dung he thong quan tri                  */
/* ================================================================== */
export default function AdminGuidePage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    // Mac dinh mo section dau tien
    () => Object.fromEntries(sections.map((s, i) => [s.id, i === 0])),
  );

  const toggle = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandAll = () =>
    setOpenSections(Object.fromEntries(sections.map((s) => [s.id, true])));

  const collapseAll = () =>
    setOpenSections(Object.fromEntries(sections.map((s) => [s.id, false])));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-green-700" />
          <h1 className="text-2xl font-bold text-slate-800">Huong dan su dung</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-xs text-green-700 hover:underline"
          >
            Mo tat ca
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={collapseAll}
            className="text-xs text-green-700 hover:underline"
          >
            Dong tat ca
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            In trang
          </button>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 print:border-none">
        <h2 className="font-semibold text-slate-800 mb-3">Muc luc</h2>
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenSections((prev) => ({ ...prev, [section.id]: true }));
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>
                  {i + 1}. {section.title}
                </span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section, i) => {
          const Icon = section.icon;
          const isOpen = openSections[section.id];

          return (
            <div
              key={section.id}
              id={section.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden print:border print:break-inside-avoid"
            >
              {/* Section header — bam de mo/dong */}
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-green-700" />
                </div>
                <span className="flex-1 font-semibold text-slate-800">
                  {i + 1}. {section.title}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Section body */}
              {isOpen && (
                <div className="px-5 pb-5 pt-0 border-t border-slate-100">
                  <div className="pt-4">{section.content}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 mb-12 text-center text-xs text-slate-400">
        Phien ban huong dan: 1.0 — Cap nhat thang 4/2026
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          /* An sidebar, header, footer khi in */
          aside, header, footer, button { display: none !important; }
          /* Hien thi tat ca section khi in */
          [id] > div:last-child { display: block !important; }
          /* Bo margin */
          .max-w-4xl { max-width: 100% !important; margin: 0 !important; padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
}
