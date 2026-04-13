/**
 * Tạo dữ liệu demo chi tiết cho các trang/chuyên mục:
 * - Trang chủ
 * - Tầm nhìn sứ mệnh
 * - Thực đơn
 * - Tuyển sinh
 * Chạy: node scripts/seed-custom-demo.js
 */

const BASE_URL = process.argv[2] || 'http://localhost:4200/api';
let TOKEN = '';

async function login() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@lequydon.edu.vn', password: 'Admin@123456' }),
  });
  const json = await res.json();
  if (!json.success) throw new Error('Login failed: ' + json.message);
  TOKEN = json.data.accessToken;
  console.log('Login OK');
}

async function postPage(data) {
  const res = await fetch(`${BASE_URL}/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.success) {
    console.log(`+ Page created: ${data.title}`);
  } else {
    console.log(`  WARN: Failed to create page ${data.title} -> ${json.message}`);
  }
}

// Nội dung bám sát thiết kế hiện đại, sử dụng Tailwind CSS thay vì inline styles (đảm bảo an toàn SafeHtml)
const pages = [
  {
    title: 'Trang chủ',
    slug: 'trang-chu',
    status: 'published',
    content: `
      <div class="not-prose max-w-5xl mx-auto py-8">
        <h1 class="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-6">Hệ Thống Giáo Dục Lê Quý Đôn</h1>
        <p class="text-lg md:text-xl text-slate-600 text-center max-w-3xl mx-auto mb-12">
          Nơi ươm mầm tài năng, nuôi dưỡng tình yêu học tập và trang bị những kỹ năng thiết yếu cho công dân toàn cầu trong thế kỷ 21.
        </p>
        <div class="rounded-xl overflow-hidden shadow-2xl mb-12">
          <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200" alt="LQD Campus" class="w-full h-auto object-cover" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="bg-blue-50 rounded-2xl text-center shadow-sm hover:shadow-md transition overflow-hidden">
            <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600" alt="Chuẩn Quốc Tế" class="w-full h-48 object-cover" />
            <div class="p-8">
              <h3 class="text-xl font-bold text-blue-800 mb-4">Chương Trình Chuẩn Quốc Tế</h3>
              <p class="text-slate-600">Kết hợp giữa chương trình của Bộ GD&ĐT cùng khung năng lực Cambridge.</p>
            </div>
          </div>
          <div class="bg-blue-50 rounded-2xl text-center shadow-sm hover:shadow-md transition overflow-hidden">
            <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600" alt="Cơ Sở Vật Chất" class="w-full h-48 object-cover" />
            <div class="p-8">
              <h3 class="text-xl font-bold text-blue-800 mb-4">Cơ Sở Vật Chất Hiện Đại</h3>
              <p class="text-slate-600">Khuôn viên 6000m² với phòng Lab STEM, thư viện số và không gian mở.</p>
            </div>
          </div>
          <div class="bg-blue-50 rounded-2xl text-center shadow-sm hover:shadow-md transition overflow-hidden">
            <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600" alt="Phát Triển Toàn Diện" class="w-full h-48 object-cover" />
            <div class="p-8">
              <h3 class="text-xl font-bold text-blue-800 mb-4">Phát Triển Toàn Diện</h3>
              <p class="text-slate-600">Chú trọng ngoại ngữ, kỹ năng mềm, thể chất và tư duy thực tiễn.</p>
            </div>
          </div>
        </div>
      </div>
    `,
    seoTitle: 'Trang chủ | Hệ Thống Giáo Dục Lê Quý Đôn',
    seoDescription: 'Nơi ươm mầm tài năng công dân toàn cầu thế kỷ 21.',
  },
  {
    title: 'Tầm nhìn và Sứ mệnh',
    slug: 'tam-nhin-su-menh',
    status: 'published',
    content: `
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-extrabold text-blue-900 mb-4 mt-0">Tổng quan, Tầm nhìn & Sứ mệnh</h1>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto">
            Hệ thống giáo dục Lê Quý Đôn luôn nỗ lực không ngừng nghỉ để xây dựng và phát triển một môi trường học tập lý tưởng, hướng tới các giá trị bền vững và triết lý giáo dục mang đậm tính nhân văn.
          </p>
        </div>

        <h2 class="text-3xl font-bold text-blue-800 mb-6 pb-2 border-b-2 border-slate-200 mt-10">Tổng quan (Overview)</h2>
        <div class="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-r-lg mb-10 text-lg text-slate-700 leading-relaxed">
          Được thành lập với tâm huyết của những nhà giáo dục uy tín, Hệ thống Giáo dục Lê Quý Đôn tự hào là đơn vị đi tiên phong trong việc đổi mới phương pháp giảng dạy. Chúng tôi luôn chú trọng kết hợp hài hòa giữa tri thức chuẩn mực quốc gia và tư duy hội nhập toàn cầu, chuẩn bị hành trang vững chắc cho mọi thế hệ học sinh trên chặng đường bước vào kỷ nguyên số.
        </div>

        <h2 class="text-3xl font-bold text-blue-800 mb-6 pb-2 border-b-2 border-slate-200 mt-10">Tầm Nhìn (Vision)</h2>
        <p class="text-xl text-slate-700 leading-relaxed mb-8">
          Trở thành hệ thống giáo dục liên cấp hàng đầu, nơi cung cấp môi trường học tập tiên tiến, nhân văn, 
          hướng tới việc phát triển toàn diện cả <strong>Tâm - Trí - Thể - Mỹ</strong> cho từng học sinh.
        </p>
        
        <div class="rounded-xl overflow-hidden shadow-lg mb-12">
          <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000" alt="Vision" class="w-full h-auto object-cover" />
        </div>
        
        <h2 class="text-3xl font-bold text-blue-800 mb-6 pb-2 border-b-2 border-slate-200">Sứ Mệnh (Mission)</h2>
        
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
          <p class="text-lg font-medium text-blue-900 m-0">
            Nuôi dưỡng một thế hệ học sinh có đạo đức tốt, có tư duy độc lập, sáng tạo, và có đủ bản lĩnh để hội nhập quốc tế nhưng vẫn giữ gìn bản sắc văn hóa dân tộc.
          </p>
        </div>
        
        <ul class="space-y-4 text-lg text-slate-700 list-disc pl-6 marker:text-blue-500">
          <li><strong class="text-slate-900">Đối với học sinh:</strong> Xây dựng niềm vui học hỏi, kích thích sự sáng tạo.</li>
          <li><strong class="text-slate-900">Đối với phụ huynh:</strong> Trở thành đối tác tin cậy, đồng hành chặt chẽ trong việc giáo dục.</li>
          <li><strong class="text-slate-900">Đối với xã hội:</strong> Đào tạo ra những công dân có trách nhiệm, đóng góp tích cực cho cộng đồng.</li>
        </ul>
      </div>
    `,
    seoTitle: 'Tầm nhìn và Sứ mệnh | Lê Quý Đôn',
  },
  {
    title: 'Thực đơn tiêu chuẩn',
    slug: 'thuc-don',
    status: 'published',
    content: `
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-3xl lg:text-4xl font-bold text-green-700 mb-4 m-0">Thực Đơn Học Đường Đạt Chuẩn Dinh Dưỡng</h2>
          <p class="text-lg text-slate-600">
            Tại Lê Quý Đôn, mỗi bữa ăn không chỉ ngon miệng mà còn là một bài học về văn hóa ẩm thực và chế độ dinh dưỡng cân bằng.
          </p>
        </div>
        
        <div class="rounded-xl overflow-hidden shadow-lg mb-10">
          <img src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1000" alt="Lunch time" class="w-full h-auto object-cover m-0" />
        </div>

        ${[1, 2, 3, 4, 5].map(week => `
        <h3 class="text-2xl font-bold text-green-800 mb-4 ${week > 1 ? 'mt-8' : ''}">Thực đơn Tuần ${week}</h3>
        <div class="not-prose overflow-x-auto mb-6 shadow-sm rounded-xl">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-green-100 text-green-800">
                <th class="p-4 border border-green-200 font-semibold w-24">Thứ</th>
                <th class="p-4 border border-green-200 font-semibold">Bữa Trưa</th>
                <th class="p-4 border border-green-200 font-semibold">Bữa Chiều</th>
              </tr>
            </thead>
            <tbody class="text-slate-700">
              <tr class="bg-white hover:bg-slate-50 transition">
                <td class="p-4 border border-slate-200 font-medium">Thứ 2</td>
                <td class="p-4 border border-slate-200">Cơm trắng, Thịt lợn xào chua ngọt, Canh rau ngót nấu thịt băm, Chuối tráng miệng</td>
                <td class="p-4 border border-slate-200">Bánh Muffin, Sữa tươi tiệt trùng</td>
              </tr>
              <tr class="bg-slate-50 hover:bg-slate-100 transition">
                <td class="p-4 border border-slate-200 font-medium">Thứ 3</td>
                <td class="p-4 border border-slate-200">Cơm trắng, Gà rán sốt mật ong, Canh bí đỏ, Thanh long</td>
                <td class="p-4 border border-slate-200">Chè hạt ${week % 2 === 0 ? 'chỗ' : 'sen'} đậu xanh</td>
              </tr>
              <tr class="bg-white hover:bg-slate-50 transition">
                <td class="p-4 border border-slate-200 font-medium">Thứ 4</td>
                <td class="p-4 border border-slate-200">Phở bò truyền thống, Quẩy giòn, Nước ép ${week % 2 !== 0 ? 'quýt' : 'dưa hấu'}</td>
                <td class="p-4 border border-slate-200">Bánh flan kem caramen</td>
              </tr>
              <tr class="bg-slate-50 hover:bg-slate-100 transition">
                <td class="p-4 border border-slate-200 font-medium">Thứ 5</td>
                <td class="p-4 border border-slate-200">Cơm trắng, Tôm sốt cà chua, Rau muống xào tỏi, Dưa hấu</td>
                <td class="p-4 border border-slate-200">Sữa chua Vinamilk, Bánh quy</td>
              </tr>
              <tr class="bg-white hover:bg-slate-50 transition">
                <td class="p-4 border border-slate-200 font-medium">Thứ 6</td>
                <td class="p-4 border border-slate-200">Cơm xiên nướng BBQ, Canh chua thịt băm, Nho Mỹ</td>
                <td class="p-4 border border-slate-200">Xúc xích Đức nướng, Nước lúa mạch Milo</td>
              </tr>
            </tbody>
          </table>
        </div>
        `).join('')}
        
        <div class="bg-orange-50 border border-orange-200 p-6 rounded-xl">
          <h3 class="text-xl font-bold text-orange-700 mt-0 mb-3">Cam kết về nguồn thực phẩm</h3>
          <ul class="text-orange-900 m-0 pl-5 marker:text-orange-500 space-y-2">
            <li>Sử dụng 100% thực phẩm hữu cơ, VietGAP có truy xuất nguồn gốc.</li>
            <li>Bếp ăn 1 chiều khép kín, đạt chứng nhận ATVSTP cao nhất.</li>
            <li>Thực đơn được tư vấn bởi Viện Dinh Dưỡng Quốc Gia.</li>
          </ul>
        </div>
      </div>
    `,
    seoTitle: 'Thực Đơn Học Đường | Lê Quý Đôn',
  },
  {
    title: 'Tuyển sinh năm học 2026 - 2027',
    slug: 'thong-tin-tuyen-sinh-chi-tiet',
    status: 'published',
    content: `
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-10">
          <h1 class="text-3xl lg:text-4xl font-bold text-blue-900 mb-3 m-0">Tuyển Sinh Năm Học 2026 - 2027</h1>
          <p class="text-lg text-slate-500">Mở ra cánh cửa tương lai cho con em bạn tại Trường Tiểu Học Lê Quý Đôn</p>
        </div>
        
        <div class="rounded-xl overflow-hidden shadow-lg mb-10">
          <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000" alt="Học sinh" class="w-full h-auto object-cover m-0" />
        </div>
        
        <div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div class="bg-teal-50 p-8 rounded-2xl border-t-4 border-teal-500 shadow-sm">
            <h3 class="text-2xl font-bold text-teal-900 mb-4">Khối Lớp 1</h3>
            <ul class="space-y-3 text-lg text-teal-800 list-disc pl-5">
              <li><strong>Chỉ tiêu dự kiến:</strong> 150 học sinh (5 khối lớp).</li>
              <li><strong>Đối tượng:</strong> Học sinh sinh năm 2020.</li>
              <li><strong>Hình thức:</strong> Xét tuyển và Đánh giá kỹ năng mềm trực tiếp.</li>
            </ul>
          </div>
          <div class="bg-blue-50 p-8 rounded-2xl border-t-4 border-blue-500 shadow-sm">
            <h3 class="text-2xl font-bold text-blue-900 mb-4">Tuyển Sinh Bổ Sung</h3>
            <ul class="space-y-3 text-lg text-blue-800 list-disc pl-5">
              <li><strong>Khối lớp 2, 3, 4:</strong> Chỉ tiêu từ 10 - 15 học sinh/khối.</li>
              <li><strong>Đối tượng:</strong> Hoàn thành tốt nhiệm vụ học kỳ.</li>
              <li><strong>Yêu cầu:</strong> Bài kiểm tra Toán, Tiếng Việt, Tiếng Anh.</li>
            </ul>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b-2 border-slate-200 mt-0">Quy trình tuyển sinh</h2>
        <ol class="space-y-4 text-lg text-slate-700 pl-6 marker:text-blue-500 marker:font-bold">
          <li><strong>Đăng ký trực tuyến:</strong> Điền form quan tâm trên website dự kiến từ ngày 01/03/2026.</li>
          <li><strong>Nộp hồ sơ:</strong> Khai báo thông tin vào hệ thống Tuyển sinh điện tử.</li>
          <li><strong>Trải nghiệm & Đánh giá:</strong> Học sinh tham gia "1 Ngày Làm Học Sinh Lê Quý Đôn" để thầy cô đánh giá khả năng tự lập và tương tác.</li>
          <li><strong>Phỏng vấn phụ huynh:</strong> Gặp gỡ Ban Giám Hiệu nhằm hiểu rõ định hướng giáo dục giữa hai bên.</li>
          <li><strong>Nhận kết quả và Hoàn tất thủ tục:</strong> Nhận giấy báo trúng tuyển trong vòng 03 ngày làm việc sau khi đánh giá.</li>
        </ol>

        <h2 class="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b-2 border-slate-200 mt-10">Lịch Trình 10 Đợt Tuyển Sinh 2026</h2>
        <div class="not-prose grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
          ${Array.from({length: 10}).map((_, i) => {
            const startDate = i < 5 ? (i * 5 + 1) : ((i - 5) * 5 + 1);
            const endDate = startDate + 3;
            const month = i < 5 ? 3 : 4;
            return `
            <div class="bg-white border text-center border-blue-100 p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <h4 class="text-lg font-bold text-blue-700 m-0">Đợt ${i + 1}</h4>
              <p class="text-sm text-slate-600 mt-2 mb-1">Nhận hồ sơ:<br/>${startDate.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')} - ${endDate.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}</p>
              <p class="text-sm text-slate-600 m-0 text-blue-500 font-semibold">Đánh giá: ${(endDate + 1).toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}</p>
            </div>
            `;
          }).join('')}
        </div>

        <div class="text-center mt-12 mb-8 not-prose">
          <a href="#" class="inline-block bg-red-600 hover:bg-red-700 text-white py-4 px-10 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            Đăng Ký Khảo Sát Ngay
          </a>
        </div>
      </div>
    `,
    seoTitle: 'Thông tin tuyển sinh 2026 | Lê Quý Đôn',
  }
];

async function main() {
  console.log('=== SEED DEMO CUSTOM PAGES ===');
  await login();
  
  for (const p of pages) {
    await postPage(p);
  }
  
  console.log('=== DONE ===');
}

main().catch(console.error);
