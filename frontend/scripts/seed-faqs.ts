/**
 * Seed 8 FAQ tuyen sinh cho LeQuyDon.
 * Chay qua seed-runner.ts hoac truc tiep: npx tsx scripts/seed-faqs.ts
 */

import { apiPost, login } from './seed-helpers';

const FAQS = [
  {
    question: 'Đối tượng tuyển sinh?',
    answer: `<p>Trường Tiểu học Lê Quý Đôn tuyển sinh các đối tượng sau:</p>
<ul>
  <li><strong>Lớp 1:</strong> Trẻ em đủ 6 tuổi (sinh năm 2020), có hộ khẩu hoặc tạm trú tại Hà Nội. Ưu tiên trẻ đã học tại các trường Mầm non liên kết trong Hệ thống Lê Quý Đôn.</li>
  <li><strong>Lớp 2 — Lớp 5:</strong> Học sinh chuyển trường từ các trường tiểu học khác, có học bạ đầy đủ và kết quả học tập đạt yêu cầu. Học sinh cần tham gia kiểm tra đánh giá năng lực đầu vào.</li>
</ul>
<p>Nhà trường xét tuyển dựa trên hồ sơ, kết quả đánh giá năng lực và phỏng vấn phụ huynh — học sinh.</p>`,
    displayOrder: 1,
  },
  {
    question: 'Thời gian tuyển sinh?',
    answer: `<p>Lịch tuyển sinh năm học 2026 — 2027:</p>
<ul>
  <li><strong>Mở đăng ký ghi danh:</strong> Từ ngày <strong>27/12/2025</strong></li>
  <li><strong>Đợt 1:</strong> Xét tuyển và thông báo kết quả trước ngày <strong>24/01/2026</strong> (trước Tết Nguyên Đán)</li>
  <li><strong>Đợt 2:</strong> Xét tuyển và thông báo kết quả trước ngày <strong>21/03/2026</strong></li>
  <li><strong>Đợt bổ sung:</strong> Xét tuyển liên tục cho đến khi đủ chỉ tiêu (dự kiến hết tháng 5/2026)</li>
</ul>
<p><em>Lưu ý: Số lượng tuyển sinh có hạn, Phụ huynh nên đăng ký sớm để đảm bảo suất cho con.</em></p>`,
    displayOrder: 2,
  },
  {
    question: 'Hồ sơ tuyển sinh gồm những gì?',
    answer: `<p>Hồ sơ tuyển sinh bao gồm:</p>
<ol>
  <li><strong>Đơn đăng ký tuyển sinh</strong> (theo mẫu của Nhà trường — tải tại website hoặc nhận trực tiếp tại Phòng Tuyển sinh)</li>
  <li><strong>Bản sao Giấy khai sinh</strong> của học sinh (công chứng hoặc bản sao từ sổ gốc)</li>
  <li><strong>Bản sao Sổ hộ khẩu</strong> hoặc Giấy xác nhận tạm trú</li>
  <li><strong>02 ảnh thẻ 3x4</strong> của học sinh (chụp trong vòng 6 tháng)</li>
  <li><strong>Học bạ</strong> (đối với học sinh lớp 2 — 5 chuyển trường)</li>
  <li><strong>Giấy chuyển trường</strong> (đối với học sinh chuyển từ trường khác đến)</li>
  <li><strong>Các giấy tờ ưu tiên</strong> (nếu có): Giấy xác nhận con em cán bộ công nhân viên, giấy xác nhận đối tượng chính sách...</li>
</ol>
<p>Phụ huynh nộp hồ sơ trực tiếp tại <strong>Phòng Tuyển sinh — Trường TH Lê Quý Đôn</strong> hoặc gửi bản scan qua email <strong>tuyensinh@lequydonhanoi.edu.vn</strong>.</p>`,
    displayOrder: 3,
  },
  {
    question: 'Quy trình tuyển sinh?',
    answer: `<p>Quy trình tuyển sinh gồm <strong>4 bước</strong>:</p>
<ol>
  <li>
    <strong>Bước 1 — Đăng ký ghi danh:</strong>
    <p>Phụ huynh điền phiếu đăng ký trực tuyến trên website hoặc nộp trực tiếp tại Phòng Tuyển sinh. Nhà trường xác nhận tiếp nhận hồ sơ qua email trong vòng 3 — 5 ngày làm việc.</p>
  </li>
  <li>
    <strong>Bước 2 — Trải nghiệm / Đánh giá:</strong>
    <p><em>Lớp 1:</em> Học sinh tham gia buổi trải nghiệm tại trường (khoảng 60 phút), Nhà trường quan sát và đánh giá mức độ sẵn sàng vào lớp 1.<br>
    <em>Lớp 2 — 5:</em> Học sinh làm bài kiểm tra đánh giá năng lực Toán, Tiếng Việt và phỏng vấn.</p>
  </li>
  <li>
    <strong>Bước 3 — Thông báo kết quả:</strong>
    <p>Nhà trường gửi kết quả qua email và điện thoại trong vòng 7 — 10 ngày làm việc sau buổi đánh giá.</p>
  </li>
  <li>
    <strong>Bước 4 — Nhập học:</strong>
    <p>Phụ huynh hoàn tất thủ tục nhập học, đóng phí và nhận lịch học chính thức trong vòng 15 ngày kể từ ngày nhận thông báo trúng tuyển.</p>
  </li>
</ol>`,
    displayOrder: 4,
  },
  {
    question: 'Thời gian học?',
    answer: `<p>Thời gian học tại Trường Tiểu học Lê Quý Đôn:</p>
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
<thead><tr style="background:#1565c0;color:#fff"><th>Buổi</th><th>Thời gian</th><th>Nội dung</th></tr></thead>
<tbody>
<tr><td><strong>Buổi sáng</strong></td><td>07:15 — 11:30</td><td>Học chương trình chính khóa (Toán, Tiếng Việt, Tiếng Anh, Khoa học, Lịch sử — Địa lý, Đạo đức, Mỹ thuật, Âm nhạc, Thể dục)</td></tr>
<tr><td><strong>Nghỉ trưa</strong></td><td>11:30 — 13:30</td><td>Ăn trưa tại trường, nghỉ ngơi</td></tr>
<tr><td><strong>Buổi chiều</strong></td><td>13:30 — 16:30</td><td>Học buổi 2: Luyện tập, ôn tập, các môn năng khiếu, tiếng Anh tăng cường</td></tr>
<tr><td><strong>CLB ngoại khóa</strong></td><td>16:30 — 17:00</td><td>Câu lạc bộ: Robotics, Bơi lội, Bóng rổ, Cờ vua, Mỹ thuật sáng tạo, Âm nhạc...</td></tr>
</tbody></table>
<p><em>Lưu ý: Phụ huynh đón con từ 16:30. Nếu đăng ký CLB ngoại khóa, đón con sau 17:00.</em></p>`,
    displayOrder: 5,
  },
  {
    question: 'Con chuyển trường từ trường khác đến thì thủ tục như thế nào?',
    answer: `<p>Đối với học sinh chuyển trường từ trường tiểu học khác đến (lớp 2 — 5), quy trình như sau:</p>
<ol>
  <li><strong>Nộp hồ sơ:</strong> Phụ huynh liên hệ Phòng Tuyển sinh để nộp hồ sơ gồm: đơn xin chuyển trường, học bạ, giấy chuyển trường, bản sao giấy khai sinh.</li>
  <li><strong>Kiểm tra đánh giá năng lực:</strong> Học sinh tham gia bài kiểm tra đánh giá năng lực các môn <strong>Toán</strong> và <strong>Tiếng Việt</strong> (thời gian khoảng 60 phút). Đối với lớp 3 trở lên, có thêm phần kiểm tra <strong>Tiếng Anh</strong>.</li>
  <li><strong>Phỏng vấn:</strong> Ban Giám hiệu phỏng vấn phụ huynh và học sinh để tìm hiểu nguyện vọng, mong muốn và đánh giá sự phù hợp.</li>
  <li><strong>Kết quả:</strong> Nhà trường thông báo kết quả trong vòng 5 — 7 ngày làm việc qua email và điện thoại.</li>
  <li><strong>Nhập học:</strong> Hoàn tất thủ tục hành chính và đóng phí theo quy định.</li>
</ol>
<p>Nhà trường nhận hồ sơ chuyển trường <strong>quanh năm</strong>, tùy thuộc vào sĩ số lớp còn trống.</p>`,
    displayOrder: 6,
  },
  {
    question: 'Sau khi đăng ký ghi danh, bao lâu thì tôi nhận được email xác nhận từ Nhà trường?',
    answer: `<p>Sau khi Phụ huynh hoàn tất đăng ký ghi danh (trực tuyến hoặc trực tiếp), Nhà trường sẽ gửi <strong>email xác nhận tiếp nhận hồ sơ</strong> trong vòng <strong>3 — 5 ngày làm việc</strong>.</p>
<p>Email xác nhận bao gồm:</p>
<ul>
  <li>Mã hồ sơ tuyển sinh</li>
  <li>Thông tin đã đăng ký</li>
  <li>Lịch hẹn buổi trải nghiệm / đánh giá (nếu đã xếp lịch)</li>
  <li>Hướng dẫn các bước tiếp theo</li>
</ul>
<p>Nếu sau <strong>5 ngày làm việc</strong> chưa nhận được email, Phụ huynh vui lòng:</p>
<ul>
  <li>Kiểm tra thư mục <strong>Spam / Junk</strong> trong hộp thư</li>
  <li>Liên hệ Phòng Tuyển sinh qua hotline <strong>024 3835 1466</strong></li>
  <li>Gửi email đến <strong>tuyensinh@lequydonhanoi.edu.vn</strong></li>
</ul>`,
    displayOrder: 7,
  },
  {
    question: 'Tôi cần tư vấn chi tiết thì có thể liên hệ như thế nào?',
    answer: `<p>Quý Phụ huynh có thể liên hệ tư vấn tuyển sinh qua các kênh sau:</p>
<ul>
  <li><strong>Điện thoại / Zalo:</strong> <a href="tel:02438351466">024 3835 1466</a> (Phòng Tuyển sinh, giờ hành chính Thứ Hai — Thứ Sáu, 08:00 — 17:00)</li>
  <li><strong>Email:</strong> <a href="mailto:tuyensinh@lequydonhanoi.edu.vn">tuyensinh@lequydonhanoi.edu.vn</a></li>
  <li><strong>Website:</strong> <a href="https://lequydonhanoi.edu.vn" target="_blank">lequydonhanoi.edu.vn</a> — mục Tuyển sinh</li>
  <li><strong>Fanpage Facebook:</strong> Trường Tiểu học Lê Quý Đôn Hà Nội</li>
  <li><strong>Trực tiếp:</strong> Phòng Tuyển sinh — Trường TH Lê Quý Đôn, Khu đô thị Văn Khê, Hà Đông, Hà Nội. Phụ huynh có thể đến tham quan trường và tư vấn trực tiếp vào giờ hành chính (vui lòng đặt lịch hẹn trước qua điện thoại).</li>
</ul>
<p>Đội ngũ tư vấn tuyển sinh luôn sẵn sàng hỗ trợ Quý Phụ huynh!</p>`,
    displayOrder: 8,
  },
];

export default async function seedFaqs() {
  for (let i = 0; i < FAQS.length; i++) {
    const faq = FAQS[i];
    const result = await apiPost('/admissions/faq', faq);
    if (result.id) {
      console.log(`  OK   [${i + 1}/${FAQS.length}] ${faq.question}`);
    }
  }
}

// Cho phep chay truc tiep
if (require.main === module) {
  login().then(() => seedFaqs());
}
