/**
 * Seed 3 su kien (events) cho LeQuyDon.
 * Chay qua seed-runner.ts hoac truc tiep: npx tsx scripts/seed-events.ts
 */

import { apiPost, login } from './seed-helpers';

const EVENTS = [
  {
    title: 'Kỷ niệm 20 năm thành lập Hệ thống Trường Liên cấp Lê Quý Đôn',
    startDate: '2025-08-04T08:00:00Z',
    endDate: '2025-08-04T17:00:00Z',
    location: 'Trường TH Lê Quý Đôn',
    status: 'upcoming',
    description: `<p>Hệ thống Trường Liên cấp Lê Quý Đôn trân trọng kính mời Quý Phụ huynh, các thế hệ học sinh và toàn thể cán bộ, giáo viên, nhân viên tham dự <strong>Lễ Kỷ niệm 20 năm thành lập</strong> (2005 — 2025).</p>
<h3>Chương trình</h3>
<ul>
  <li><strong>08:00 — 08:30:</strong> Đón khách, ổn định vị trí</li>
  <li><strong>08:30 — 09:00:</strong> Nghi thức khai mạc — Chào cờ, tuyên bố lý do</li>
  <li><strong>09:00 — 10:00:</strong> Phát biểu của Ban Giám hiệu, đại diện Phụ huynh và Cựu học sinh</li>
  <li><strong>10:00 — 11:00:</strong> Chương trình văn nghệ chào mừng do học sinh biểu diễn</li>
  <li><strong>11:00 — 11:30:</strong> Vinh danh giáo viên, học sinh xuất sắc qua các thời kỳ</li>
  <li><strong>11:30 — 13:30:</strong> Tiệc liên hoan</li>
  <li><strong>14:00 — 16:00:</strong> Tham quan khuôn viên trường, triển lãm ảnh 20 năm</li>
  <li><strong>16:00 — 17:00:</strong> Giao lưu, chụp ảnh kỷ niệm</li>
</ul>
<p>Đây là dịp để chúng ta cùng nhìn lại chặng đường 20 năm xây dựng và phát triển, tri ân những đóng góp của các thế hệ thầy cô, phụ huynh và học sinh đã đồng hành cùng Nhà trường.</p>
<p><em>Trân trọng kính mời!</em></p>`,
  },
  {
    title: 'Hội thảo 3 SẴN SÀNG cùng con vào lớp 1',
    startDate: '2026-03-21T08:30:00',
    endDate: '2026-03-21T11:30:00',
    location: 'Hội trường Trường TH Lê Quý Đôn',
    status: 'upcoming',
    description: `<p>Trường Tiểu học Lê Quý Đôn tổ chức <strong>Hội thảo "3 SẴN SÀNG cùng con vào lớp 1"</strong> dành cho Phụ huynh có con chuẩn bị vào lớp 1 năm học 2026 — 2027.</p>
<h3>Nội dung chính</h3>
<ol>
  <li><strong>Sẵn sàng về tâm lý:</strong> Giúp con tự tin, hứng khởi khi bước vào môi trường mới. Chuyên gia tâm lý chia sẻ cách đồng hành cùng con trong giai đoạn chuyển tiếp.</li>
  <li><strong>Sẵn sàng về kiến thức:</strong> Những kỹ năng nền tảng con cần có trước khi vào lớp 1 — đọc, viết, tính toán cơ bản và tư duy logic.</li>
  <li><strong>Sẵn sàng về kỹ năng sống:</strong> Kỹ năng tự phục vụ, giao tiếp, làm việc nhóm và an toàn cá nhân.</li>
</ol>
<h3>Thông tin chi tiết</h3>
<ul>
  <li><strong>Thời gian:</strong> 08:30 — 11:30, Thứ Bảy ngày 21/3/2026</li>
  <li><strong>Địa điểm:</strong> Hội trường Trường TH Lê Quý Đôn</li>
  <li><strong>Đối tượng:</strong> Phụ huynh có con sinh năm 2020</li>
  <li><strong>Phí tham dự:</strong> Miễn phí</li>
</ul>
<p>Quý Phụ huynh vui lòng đăng ký trước ngày <strong>18/3/2026</strong> qua hotline <strong>024 3835 1466</strong> hoặc email <strong>tuyensinh@lequydonhanoi.edu.vn</strong>.</p>`,
  },
  {
    title: 'Ngày hội Open Day 2026',
    startDate: '2026-05-15T08:00:00Z',
    endDate: '2026-05-15T16:00:00Z',
    location: 'Trường TH Lê Quý Đôn',
    status: 'upcoming',
    description: `<p>Trường Tiểu học Lê Quý Đôn trân trọng kính mời Quý Phụ huynh và các em học sinh tham dự <strong>Ngày hội Open Day 2026</strong> — cơ hội để trải nghiệm trực tiếp môi trường học tập tại trường.</p>
<h3>Hoạt động trong ngày</h3>
<ul>
  <li><strong>08:00 — 09:00:</strong> Đón tiếp, tham quan khuôn viên trường</li>
  <li><strong>09:00 — 10:00:</strong> Giới thiệu chương trình giáo dục, phương pháp giảng dạy</li>
  <li><strong>10:00 — 11:30:</strong> Trải nghiệm lớp học mẫu (Toán tư duy, Tiếng Anh, STEAM, Mỹ thuật)</li>
  <li><strong>11:30 — 13:00:</strong> Thưởng thức bữa trưa tại trường</li>
  <li><strong>13:00 — 14:30:</strong> Trải nghiệm CLB ngoại khóa (Robotics, Bơi lội, Bóng rổ, Âm nhạc)</li>
  <li><strong>14:30 — 15:30:</strong> Giao lưu với Ban Giám hiệu, giáo viên và phụ huynh đang theo học</li>
  <li><strong>15:30 — 16:00:</strong> Tư vấn tuyển sinh, giải đáp thắc mắc</li>
</ul>
<h3>Đăng ký</h3>
<p>Quý Phụ huynh đăng ký tham dự trước ngày <strong>10/5/2026</strong> qua:</p>
<ul>
  <li>Hotline: <strong>024 3835 1466</strong></li>
  <li>Email: <strong>tuyensinh@lequydonhanoi.edu.vn</strong></li>
  <li>Website: <strong>lequydonhanoi.edu.vn</strong></li>
</ul>
<p><em>Số lượng có hạn, vui lòng đăng ký sớm!</em></p>`,
  },
];

export default async function seedEvents() {
  for (let i = 0; i < EVENTS.length; i++) {
    const ev = EVENTS[i];
    const result = await apiPost('/events', ev);
    if (result.id) {
      console.log(`  OK   [${i + 1}/${EVENTS.length}] ${ev.title}`);
    }
  }
}

// Cho phep chay truc tiep
if (require.main === module) {
  login().then(() => seedEvents());
}
