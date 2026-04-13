#!/bin/bash
# Script seed du lieu cho LeQuyDon qua API
# Su dung: bash scripts/seed-data.sh [BASE_URL]

BASE_URL="${1:-http://localhost:4200/api}"
echo "=== SEED DATA cho LeQuyDon ==="
echo "API: $BASE_URL"

# Login
echo -e "\n[1/6] Dang nhap..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lequydon.edu.vn","password":"Admin@123456"}')

TOKEN=$(echo "$LOGIN_RES" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  echo "FAIL: Khong dang nhap duoc. Response: $LOGIN_RES"
  exit 1
fi
echo "OK: Token nhan duoc"

AUTH="Authorization: Bearer $TOKEN"
CT="Content-Type: application/json"

# Helper: POST va in ket qua
post() {
  local endpoint="$1"
  local data="$2"
  local res=$(curl -s -X POST "$BASE_URL/$endpoint" -H "$AUTH" -H "$CT" -d "$data")
  local success=$(echo "$res" | grep -o '"success":true')
  if [ -n "$success" ]; then
    echo -n "."
  else
    echo -e "\n  WARN: $endpoint -> $(echo "$res" | head -c 200)"
  fi
  echo "$res"
}

# ============================================
# TAO CATEGORIES
# ============================================
echo -e "\n[2/6] Tao categories..."

declare -a CAT_IDS
declare -a CAT_SLUGS=("tin-tuc" "su-kien" "hoat-dong-ngoai-khoa" "hoc-tap" "tuyen-sinh" "doi-song-hoc-duong")
declare -a CAT_NAMES=("Tin tức" "Sự kiện" "Hoạt động ngoại khóa" "Học tập" "Tuyển sinh" "Đời sống học đường")

for i in "${!CAT_SLUGS[@]}"; do
  RES=$(curl -s -X POST "$BASE_URL/categories" -H "$AUTH" -H "$CT" \
    -d "{\"name\":\"${CAT_NAMES[$i]}\",\"slug\":\"${CAT_SLUGS[$i]}\",\"description\":\"Danh mục ${CAT_NAMES[$i]}\"}")
  CID=$(echo "$RES" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [ -n "$CID" ]; then
    CAT_IDS[$i]="$CID"
    echo -n "."
  else
    # Category co the da ton tai, thu GET
    EXISTING=$(curl -s "$BASE_URL/categories" -H "$AUTH" | grep -o "\"id\":\"[^\"]*\",\"name\":\"${CAT_NAMES[$i]}\"" | head -1)
    CID=$(echo "$EXISTING" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    CAT_IDS[$i]="$CID"
    echo -n "+"
  fi
done
echo " Done (${#CAT_IDS[@]} categories)"

# ============================================
# SEED ARTICLES — 15-20 bai cho moi category
# ============================================
echo -e "\n[3/6] Tao articles..."

# Anh tu Unsplash (free, legal)
SCHOOL_IMGS=(
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800"
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800"
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800"
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800"
  "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800"
  "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800"
  "https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800"
  "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800"
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800"
  "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800"
  "https://images.unsplash.com/photo-1564429238961-bf8b8bd096c4?w=800"
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800"
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
  "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800"
  "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800"
  "https://images.unsplash.com/photo-1594312915251-48db9280c8f0?w=800"
  "https://images.unsplash.com/photo-1509869175650-a1d97972541a?w=800"
  "https://images.unsplash.com/photo-1548449112-96a38a643324?w=800"
  "https://images.unsplash.com/photo-1605326073732-23fc92e28b08?w=800"
)

IMG_COUNT=${#SCHOOL_IMGS[@]}
ART_COUNT=0
ERRORS=""

# Category 0: Tin tuc — 18 bai
create_article() {
  local title="$1"
  local slug="$2"
  local excerpt="$3"
  local content="$4"
  local cat_id="$5"
  local img_idx="$6"
  local pub_date="$7"

  local thumb="${SCHOOL_IMGS[$((img_idx % IMG_COUNT))]}"

  local json=$(cat <<ENDJSON
{
  "title": "$title",
  "slug": "$slug",
  "excerpt": "$excerpt",
  "content": "$content",
  "categoryId": "$cat_id",
  "thumbnailUrl": "$thumb",
  "status": "published",
  "publishedAt": "${pub_date}T08:00:00.000Z"
}
ENDJSON
)

  local res=$(curl -s -X POST "$BASE_URL/articles" -H "$AUTH" -H "$CT" -d "$json")
  local success=$(echo "$res" | grep -o '"success":true')
  if [ -n "$success" ]; then
    echo -n "."
    ART_COUNT=$((ART_COUNT + 1))
  else
    local msg=$(echo "$res" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
    ERRORS="$ERRORS\n  - $slug: $msg"
  fi
}

# ─── CATEGORY: TIN TUC ───
CID="${CAT_IDS[0]}"

create_article \
  "Trường Tiểu học Lê Quý Đôn khai giảng năm học 2025-2026" \
  "khai-giang-nam-hoc-2025-2026" \
  "Sáng ngày 5/9/2025, Trường Tiểu học Lê Quý Đôn long trọng tổ chức lễ khai giảng năm học mới 2025-2026 với sự tham gia của toàn thể cán bộ giáo viên, học sinh và phụ huynh." \
  "<h2>Lễ khai giảng trang trọng và ấm áp</h2><p>Sáng ngày 5/9/2025, trong không khí trang nghiêm và phấn khởi, Trường Tiểu học Lê Quý Đôn đã long trọng tổ chức Lễ khai giảng năm học 2025-2026. Buổi lễ có sự tham gia của đại diện Phòng GD&ĐT quận Nam Từ Liêm, Ban Giám hiệu nhà trường, toàn thể giáo viên, nhân viên, hơn 1.500 học sinh và đông đảo phụ huynh.</p><p>Phát biểu tại buổi lễ, Thầy Hiệu trưởng nhấn mạnh: <em>\"Năm học 2025-2026 là năm bản lề quan trọng, đánh dấu chặng đường 20 năm xây dựng và phát triển của nhà trường. Chúng tôi cam kết tiếp tục nâng cao chất lượng giáo dục, đào tạo thế hệ học sinh toàn diện về Đức - Trí - Thể - Mỹ.\"</em></p><h3>Điểm nhấn của lễ khai giảng</h3><ul><li>Tiết mục văn nghệ đặc sắc do học sinh các khối trình diễn</li><li>Trao học bổng cho 50 học sinh xuất sắc</li><li>Ra mắt CLB Robotics và CLB Tiếng Anh PLC mới</li><li>Khánh thành phòng Lab STEM hiện đại</li></ul><p>Năm học mới hứa hẹn nhiều hoạt động bổ ích, giúp các em học sinh phát triển toàn diện trong môi trường giáo dục hiện đại và nhân văn.</p>" \
  "$CID" 0 "2025-09-05"

create_article \
  "Họp phụ huynh đầu năm học 2025-2026: Đồng hành cùng con" \
  "hop-phu-huynh-dau-nam-2025-2026" \
  "Ngày 10/9/2025, Trường Tiểu học Lê Quý Đôn tổ chức buổi họp phụ huynh đầu năm nhằm thông báo kế hoạch giáo dục, trao đổi phương pháp phối hợp giáo dục gia đình - nhà trường." \
  "<h2>Buổi họp phụ huynh ý nghĩa</h2><p>Với phương châm \"Gia đình và nhà trường cùng đồng hành\", buổi họp phụ huynh đầu năm được tổ chức tại từng lớp với sự chủ trì của giáo viên chủ nhiệm.</p><p>Nội dung chính bao gồm:</p><ul><li>Giới thiệu chương trình Quốc gia nâng cao và Tiếng Anh tăng cường</li><li>Kế hoạch hoạt động ngoại khóa năm học mới</li><li>Chế độ dinh dưỡng học đường với menu 4 tuần không trùng lặp</li><li>Ứng dụng quản lý học sinh thông minh</li><li>Bầu Ban đại diện cha mẹ học sinh</li></ul><p>Phụ huynh tích cực đặt câu hỏi và đóng góp ý kiến xây dựng, tạo nên buổi họp chất lượng và hiệu quả.</p>" \
  "$CID" 1 "2025-09-10"

create_article \
  "Thư ngỏ về đảm bảo an toàn thực phẩm tại Nhà trường" \
  "thu-ngo-an-toan-thuc-pham" \
  "Ban Giám hiệu Trường Tiểu học Lê Quý Đôn gửi thư ngỏ tới toàn thể phụ huynh về công tác đảm bảo an toàn thực phẩm, nguồn gốc nguyên liệu và quy trình kiểm soát chất lượng bữa ăn học đường." \
  "<h2>Cam kết an toàn thực phẩm</h2><p>Kính gửi quý phụ huynh học sinh Trường Tiểu học Lê Quý Đôn,</p><p>Trước sự quan tâm của dư luận về vấn đề an toàn thực phẩm trong trường học, Ban Giám hiệu nhà trường xin thông tin minh bạch đến quý phụ huynh về các biện pháp đảm bảo chất lượng bữa ăn:</p><h3>Nguồn cung ứng thực phẩm</h3><ul><li>100% thịt lợn, thịt bò từ trang trại GAP có giấy chứng nhận kiểm dịch</li><li>Rau củ quả từ vùng trồng VietGAP tại Mộc Châu, Sơn La</li><li>Gạo hữu cơ Japonica từ Ninh Bình</li><li>Sữa tươi Vinamilk organic đạt chuẩn châu Âu</li></ul><h3>Quy trình kiểm soát</h3><p>Mỗi ngày, đội ngũ y tế nhà trường thực hiện kiểm tra nguồn gốc, mẫu lưu thực phẩm 24h, và phối hợp với cơ quan y tế quận giám sát định kỳ hàng tháng.</p><p>Nhà trường luôn đặt sức khỏe và sự an toàn của học sinh lên hàng đầu.</p><p>Trân trọng,<br/>Ban Giám hiệu Trường Tiểu học Lê Quý Đôn</p>" \
  "$CID" 2 "2025-10-15"

create_article \
  "Kết quả thi Olympic Toán cấp Quận năm 2026" \
  "ket-qua-olympic-toan-cap-quan-2026" \
  "Học sinh Trường Tiểu học Lê Quý Đôn đạt thành tích xuất sắc tại kỳ thi Olympic Toán cấp Quận năm 2026 với 45 giải thưởng." \
  "<h2>45 giải thưởng Olympic Toán cấp Quận</h2><p>Trong kỳ thi Olympic Toán cấp Quận Nam Từ Liêm năm 2026, đội tuyển Toán của Trường Tiểu học Lê Quý Đôn đã xuất sắc giành được 45 giải thưởng, bao gồm:</p><ul><li><strong>8 giải Nhất</strong> — cao nhất trong các trường tham gia</li><li><strong>12 giải Nhì</strong></li><li><strong>15 giải Ba</strong></li><li><strong>10 giải Khuyến khích</strong></li></ul><p>Đặc biệt, em Nguyễn Minh Anh (lớp 5A1) đạt điểm cao nhất toàn quận với 98/100 điểm. Em chia sẻ: <em>\"Em rất vui và biết ơn các thầy cô đã hướng dẫn em trong suốt quá trình ôn luyện.\"</em></p><p>Cô Nguyễn Thị Hương, trưởng bộ môn Toán, cho biết: \"Kết quả này là minh chứng cho phương pháp dạy học tích cực, phát huy tư duy sáng tạo mà nhà trường đã áp dụng trong nhiều năm qua.\"</p>" \
  "$CID" 3 "2026-01-20"

create_article \
  "Chương trình Tiếng Anh tăng cường hợp tác PLC Sydney" \
  "chuong-trinh-tieng-anh-plc-sydney" \
  "Trường Tiểu học Lê Quý Đôn chính thức triển khai chương trình Tiếng Anh tăng cường hợp tác toàn diện với PLC Sydney (Úc) từ năm học 2025-2026." \
  "<h2>Hợp tác giáo dục quốc tế PLC Sydney</h2><p>Từ năm học 2025-2026, Trường Tiểu học Lê Quý Đôn chính thức triển khai chương trình Tiếng Anh tăng cường với sự hợp tác toàn diện từ PLC Sydney — một trong những trường tư thục danh tiếng nhất nước Úc, có lịch sử hơn 130 năm.</p><h3>Nội dung chương trình</h3><ul><li>8 tiết Tiếng Anh/tuần (gấp đôi chương trình thông thường)</li><li>Giáo viên bản ngữ từ PLC Sydney giảng dạy trực tiếp</li><li>Tài liệu học tập theo chuẩn Cambridge International</li><li>Trao đổi học sinh trực tuyến với học sinh PLC Sydney</li><li>Chương trình Summer Camp tại Úc mỗi hè</li></ul><p>Với chương trình này, học sinh Lê Quý Đôn sẽ đạt trình độ Tiếng Anh tương đương A2-B1 (CEFR) khi hoàn thành tiểu học, sẵn sàng cho các chương trình song ngữ cấp THCS.</p>" \
  "$CID" 4 "2025-08-20"

create_article \
  "Trường Tiểu học Lê Quý Đôn đón Đoàn kiểm tra chất lượng giáo dục" \
  "don-doan-kiem-tra-chat-luong-giao-duc" \
  "Ngày 15/11/2025, Đoàn kiểm tra của Sở GD&ĐT Hà Nội đã đến kiểm tra và đánh giá cao chất lượng giáo dục tại Trường Tiểu học Lê Quý Đôn." \
  "<h2>Đoàn kiểm tra Sở GD&ĐT Hà Nội đánh giá cao</h2><p>Ngày 15/11/2025, Đoàn kiểm tra của Sở GD&ĐT Hà Nội do ThS. Trần Văn Minh — Phó Giám đốc Sở dẫn đầu đã đến thăm và kiểm tra toàn diện hoạt động giáo dục tại Trường Tiểu học Lê Quý Đôn.</p><p>Qua một ngày kiểm tra thực tế, Đoàn đánh giá:</p><ul><li>Cơ sở vật chất hiện đại, đạt chuẩn quốc tế</li><li>Chương trình giáo dục phong phú, chú trọng phát triển toàn diện</li><li>Đội ngũ giáo viên có chuyên môn cao, tận tâm với nghề</li><li>Công tác quản lý học sinh khoa học, minh bạch</li><li>Bữa ăn học đường đảm bảo dinh dưỡng và an toàn</li></ul><p>ThS. Trần Văn Minh nhận xét: <em>\"Trường Tiểu học Lê Quý Đôn là một trong những trường tiểu học ngoài công lập tiêu biểu của Hà Nội, xứng đáng là mô hình để các trường khác tham khảo và học hỏi.\"</em></p>" \
  "$CID" 5 "2025-11-15"

create_article \
  "Phát động phong trào Giữ gìn vệ sinh trường học xanh - sạch - đẹp" \
  "phong-trao-truong-hoc-xanh-sach-dep" \
  "Trường Tiểu học Lê Quý Đôn phát động phong trào 'Trường học xanh - sạch - đẹp' nhằm nâng cao ý thức bảo vệ môi trường cho học sinh." \
  "<h2>Trường học xanh - sạch - đẹp</h2><p>Ngày 20/10/2025, Trường Tiểu học Lê Quý Đôn chính thức phát động phong trào \"Trường học xanh - sạch - đẹp\" với sự tham gia nhiệt tình của toàn thể cán bộ giáo viên và học sinh.</p><p>Phong trào bao gồm các hoạt động:</p><ul><li>Trồng cây xanh tại khuôn viên trường</li><li>Phân loại rác tại nguồn</li><li>Thi đua lớp học sạch đẹp nhất</li><li>Sáng kiến giảm rác thải nhựa</li></ul><p>Mỗi lớp được giao chăm sóc một bồn cây, học sinh luân phiên tưới nước và theo dõi sự phát triển. Hoạt động này không chỉ giúp làm đẹp khuôn viên mà còn giáo dục ý thức bảo vệ môi trường cho các em từ nhỏ.</p>" \
  "$CID" 6 "2025-10-20"

create_article \
  "Tổng kết học kỳ I năm học 2025-2026" \
  "tong-ket-hoc-ky-1-2025-2026" \
  "Trường Tiểu học Lê Quý Đôn tổ chức lễ tổng kết học kỳ I với nhiều thành tích đáng tự hào: 95% học sinh đạt loại Tốt." \
  "<h2>Thành tích học kỳ I ấn tượng</h2><p>Chiều ngày 15/1/2026, Trường Tiểu học Lê Quý Đôn long trọng tổ chức Lễ tổng kết học kỳ I năm học 2025-2026.</p><h3>Kết quả nổi bật</h3><ul><li>95% học sinh đạt loại Tốt</li><li>100% giáo viên hoàn thành tốt nhiệm vụ</li><li>45 giải Olympic Toán cấp Quận</li><li>32 giải Tiếng Anh cấp Thành phố</li><li>18 giải văn nghệ, thể thao các cấp</li></ul><p>Nhà trường trao 200 giấy khen cho học sinh có thành tích xuất sắc và 50 suất học bổng khuyến học. Buổi lễ kết thúc với chương trình văn nghệ đặc sắc do các em học sinh biểu diễn.</p>" \
  "$CID" 7 "2026-01-15"

create_article \
  "Chào đón Tết Nguyên đán 2026 tại Trường Lê Quý Đôn" \
  "chao-don-tet-nguyen-dan-2026" \
  "Không khí Tết Nguyên đán 2026 tràn ngập sân trường với Hội chợ Xuân, gói bánh chưng và nhiều hoạt động truyền thống đặc sắc." \
  "<h2>Hội Xuân Lê Quý Đôn 2026</h2><p>Những ngày cuối tháng 1/2026, Trường Tiểu học Lê Quý Đôn tổ chức chuỗi hoạt động chào đón Tết Nguyên đán Bính Ngọ 2026 đặc sắc.</p><h3>Các hoạt động nổi bật</h3><ul><li><strong>Hội chợ Xuân:</strong> Các gian hàng do học sinh tự quản lý, bán đồ handmade, mứt Tết, hoa tươi</li><li><strong>Gói bánh chưng:</strong> Các em cùng ông bà, cha mẹ gói bánh chưng ngay tại sân trường</li><li><strong>Viết thư pháp:</strong> Nghệ nhân thư pháp viết câu đối, chữ phúc tặng các gia đình</li><li><strong>Múa Lân - Sư - Rồng:</strong> Đội múa lân biểu diễn mở màn cho chương trình</li><li><strong>Trao quà Tết:</strong> 30 phần quà cho học sinh có hoàn cảnh khó khăn</li></ul><p>Đây là hoạt động thường niên, giúp các em hiểu và trân trọng những giá trị văn hóa truyền thống Việt Nam.</p>" \
  "$CID" 8 "2026-01-25"

create_article \
  "Trường Tiểu học Lê Quý Đôn ra mắt ứng dụng quản lý học sinh" \
  "ra-mat-ung-dung-quan-ly-hoc-sinh" \
  "Nhà trường chính thức ra mắt ứng dụng di động giúp phụ huynh theo dõi kết quả học tập, lịch học, bữa ăn và sức khỏe của con em mình." \
  "<h2>Ứng dụng quản lý học sinh thông minh</h2><p>Từ tháng 10/2025, Trường Tiểu học Lê Quý Đôn chính thức triển khai ứng dụng di động \"LQD Connect\" trên cả iOS và Android.</p><h3>Tính năng chính</h3><ul><li>Xem kết quả học tập, nhận xét của giáo viên theo thời gian thực</li><li>Thời khóa biểu và lịch hoạt động ngoại khóa</li><li>Menu bữa ăn hàng ngày với thông tin dinh dưỡng</li><li>Đăng ký xe đưa đón, CLB ngoại khóa online</li><li>Chat trực tiếp với giáo viên chủ nhiệm</li><li>Nhận thông báo quan trọng từ nhà trường</li></ul><p>Ứng dụng nhận được phản hồi tích cực từ 90% phụ huynh sau 2 tuần sử dụng.</p>" \
  "$CID" 9 "2025-10-01"

create_article \
  "Giáo viên Lê Quý Đôn đạt giải Giáo viên dạy giỏi cấp Thành phố" \
  "giao-vien-dat-giai-day-gioi-cap-thanh-pho" \
  "Cô Trần Thị Mai Hương đại diện Trường Tiểu học Lê Quý Đôn xuất sắc đạt giải Nhất cuộc thi Giáo viên dạy giỏi cấp Thành phố Hà Nội." \
  "<h2>Vinh danh giáo viên xuất sắc</h2><p>Cô Trần Thị Mai Hương — giáo viên chủ nhiệm lớp 4A2 Trường Tiểu học Lê Quý Đôn đã xuất sắc đạt giải Nhất cuộc thi Giáo viên dạy giỏi cấp Thành phố Hà Nội năm 2025.</p><p>Với bài giảng Toán lớp 4 chủ đề \"Phân số trong đời sống\", cô Hương đã sáng tạo phương pháp dạy học trải nghiệm, giúp học sinh tự khám phá kiến thức qua các hoạt động thực tế như đo lường nguyên liệu nấu ăn, chia phần bánh sinh nhật.</p><p>Cô chia sẻ: <em>\"Tôi luôn tin rằng mỗi đứa trẻ đều có tiềm năng riêng. Nhiệm vụ của giáo viên là tìm ra cách để khơi dậy niềm đam mê học tập trong mỗi em.\"</em></p><p>Đây là giải thưởng cá nhân thứ 3 của cô Hương trong 5 năm gần đây.</p>" \
  "$CID" 10 "2025-12-20"

create_article \
  "Chương trình Giáo dục STEM tại Trường Lê Quý Đôn" \
  "chuong-trinh-giao-duc-stem" \
  "Trường Tiểu học Lê Quý Đôn triển khai chương trình giáo dục STEM toàn diện với phòng Lab hiện đại và đội ngũ giáo viên chuyên biệt." \
  "<h2>STEM — Giáo dục cho tương lai</h2><p>Nhận thức tầm quan trọng của giáo dục STEM (Khoa học - Công nghệ - Kỹ thuật - Toán học) trong thời đại 4.0, Trường Tiểu học Lê Quý Đôn đã đầu tư mạnh mẽ vào chương trình này từ năm học 2024-2025.</p><h3>Cơ sở vật chất</h3><ul><li>Phòng Lab STEM 120m² với thiết bị hiện đại</li><li>Bộ kit Robotics LEGO Education cho từng nhóm học sinh</li><li>Máy in 3D, máy cắt laser cho các dự án sáng tạo</li><li>Khu vườn thực nghiệm 50m² cho môn Khoa học</li></ul><h3>Chương trình học</h3><p>Mỗi tuần, học sinh từ lớp 3-5 có 2 tiết STEM, trong đó 1 tiết Robotics và 1 tiết dự án khoa học. Học sinh lớp 1-2 được làm quen qua các hoạt động thí nghiệm đơn giản và xây dựng mô hình.</p>" \
  "$CID" 11 "2025-09-15"

create_article \
  "Trường Lê Quý Đôn tổ chức Ngày hội Đọc sách" \
  "ngay-hoi-doc-sach-2026" \
  "Ngày hội Đọc sách 2026 tại Trường Tiểu học Lê Quý Đôn thu hút hơn 1.200 học sinh tham gia với nhiều hoạt động sáng tạo." \
  "<h2>Ngày hội Đọc sách 2026</h2><p>Hưởng ứng Ngày Sách và Văn hóa đọc Việt Nam 21/4, Trường Tiểu học Lê Quý Đôn tổ chức Ngày hội Đọc sách với chủ đề \"Sách — Người bạn đồng hành\".</p><h3>Các hoạt động</h3><ul><li>Triển lãm sách với hơn 5.000 đầu sách các thể loại</li><li>Cuộc thi kể chuyện theo sách cho học sinh các khối</li><li>Workshop làm bookmark sáng tạo</li><li>Giao lưu với nhà văn Nguyễn Nhật Ánh</li><li>Quyên góp sách cho thư viện vùng cao</li></ul><p>Thư viện nhà trường cũng nhân dịp này bổ sung thêm 500 đầu sách mới, nâng tổng số lên hơn 15.000 cuốn, phục vụ nhu cầu đọc phong phú của học sinh.</p>" \
  "$CID" 12 "2026-04-10"

create_article \
  "Trường Lê Quý Đôn tham gia Chương trình Sữa học đường Hà Nội" \
  "chuong-trinh-sua-hoc-duong" \
  "100% học sinh Trường Tiểu học Lê Quý Đôn được uống sữa tươi organic mỗi ngày trong chương trình Sữa học đường." \
  "<h2>Sữa học đường — Dinh dưỡng cho sự phát triển</h2><p>Từ năm học 2025-2026, Trường Tiểu học Lê Quý Đôn tham gia Chương trình Sữa học đường Hà Nội với 100% học sinh được uống sữa tươi organic Vinamilk mỗi ngày.</p><p>Chương trình nhằm cung cấp nguồn dinh dưỡng bổ sung calcium, vitamin D và protein cho học sinh, hỗ trợ phát triển chiều cao và trí não.</p><p>Mỗi buổi sáng, các em được uống 1 hộp sữa tươi 180ml trước giờ ra chơi. Y tế nhà trường theo dõi chiều cao, cân nặng học sinh mỗi quý để đánh giá hiệu quả chương trình.</p><p>Sau 1 học kỳ, chiều cao trung bình tăng 2.3cm, cao hơn 0.5cm so với mức trung bình cùng lứa tuổi.</p>" \
  "$CID" 13 "2025-11-01"

create_article \
  "Kết quả cuộc thi Viết chữ đẹp cấp Trường năm 2026" \
  "ket-qua-cuoc-thi-viet-chu-dep-2026" \
  "Cuộc thi Viết chữ đẹp cấp trường thu hút 800 học sinh tham gia, chọn ra 50 bài xuất sắc nhất tham dự cấp Quận." \
  "<h2>Nét chữ nết người</h2><p>Với phương châm \"Nét chữ - Nết người\", cuộc thi Viết chữ đẹp năm 2026 thu hút sự tham gia nhiệt tình của 800 học sinh từ khối 1 đến khối 5.</p><p>Ban giám khảo gồm các thầy cô có kinh nghiệm đã chọn ra:</p><ul><li>10 giải Nhất (mỗi khối 2 giải)</li><li>15 giải Nhì</li><li>25 giải Ba</li></ul><p>50 bài viết xuất sắc nhất được gửi tham dự cuộc thi cấp Quận. Năm ngoái, Trường Lê Quý Đôn đạt 8 giải tại cấp Quận và 3 giải cấp Thành phố.</p><p>Cuộc thi không chỉ rèn luyện kỹ năng viết chữ mà còn giáo dục tính kiên nhẫn, cẩn thận cho học sinh.</p>" \
  "$CID" 14 "2026-03-15"

create_article \
  "Trường Lê Quý Đôn tổ chức Hội thảo Giáo dục hiện đại" \
  "hoi-thao-giao-duc-hien-dai-2026" \
  "Hội thảo 'Giáo dục hiện đại — Phát triển toàn diện' quy tụ 200 giáo viên và chuyên gia giáo dục hàng đầu." \
  "<h2>Hội thảo Giáo dục hiện đại</h2><p>Ngày 5/3/2026, Trường Tiểu học Lê Quý Đôn phối hợp với Viện Khoa học Giáo dục Việt Nam tổ chức Hội thảo \"Giáo dục hiện đại — Phát triển toàn diện\".</p><p>Hội thảo quy tụ hơn 200 đại biểu gồm giáo viên, nhà quản lý giáo dục, chuyên gia tâm lý và đại diện phụ huynh.</p><h3>Nội dung chính</h3><ul><li>Phương pháp dạy học tích cực trong bối cảnh chuyển đổi số</li><li>Ứng dụng AI hỗ trợ cá nhân hóa việc học</li><li>Phát triển kỹ năng mềm cho học sinh tiểu học</li><li>Vai trò của gia đình trong giáo dục hiện đại</li></ul><p>Kết quả hội thảo được tổng hợp thành bộ tài liệu tham khảo cho giáo viên toàn hệ thống.</p>" \
  "$CID" 15 "2026-03-05"

# ─── CATEGORY: SU KIEN ───
CID="${CAT_IDS[1]}"

create_article \
  "Lễ kỷ niệm 20 năm thành lập Hệ thống Trường Lê Quý Đôn" \
  "le-ky-niem-20-nam-thanh-lap" \
  "Lễ kỷ niệm 20 năm thành lập (2005-2025) Hệ thống Trường liên cấp Lê Quý Đôn với chủ đề 'From Building to Blooming — Dựng xây ngàn hoa'." \
  "<h2>20 năm xây dựng và phát triển</h2><p>Ngày 4/8/2025, Hệ thống Trường liên cấp Lê Quý Đôn long trọng tổ chức Lễ kỷ niệm 20 năm thành lập với chủ đề \"From Building to Blooming — Dựng xây ngàn hoa\".</p><p>Buổi lễ quy tụ hơn 3.000 khách mời gồm đại diện các cơ quan quản lý giáo dục, đối tác quốc tế PLC Sydney, cựu học sinh, phụ huynh và toàn thể cán bộ giáo viên.</p><h3>Điểm nhấn</h3><ul><li>Video hành trình 20 năm với những dấu mốc quan trọng</li><li>Tri ân các thầy cô thế hệ đầu tiên</li><li>Giao lưu cựu học sinh thành đạt</li><li>Chương trình nghệ thuật đặc biệt \"Ngàn hoa nở rộ\"</li><li>Khánh thành tòa nhà học tập mới 5 tầng</li></ul><p>20 năm — từ một cơ sở nhỏ với 200 học sinh, Lê Quý Đôn đã phát triển thành hệ thống 3 trường liên cấp với hơn 5.000 học sinh, khẳng định vị thế trong nền giáo dục Thủ đô.</p>" \
  "$CID" 0 "2025-08-04"

create_article \
  "Lễ kết nạp Đội Khối 3 tại Quảng trường Ba Đình" \
  "le-ket-nap-doi-khoi-3-ba-dinh" \
  "Học sinh Khối 3 Trường Tiểu học Lê Quý Đôn vinh dự được kết nạp Đội tại Quảng trường Ba Đình lịch sử." \
  "<h2>Dấu mốc thiêng liêng</h2><p>Sáng ngày 26/3/2026, tại Quảng trường Ba Đình lịch sử, 180 học sinh Khối 3 Trường Tiểu học Lê Quý Đôn đã vinh dự được kết nạp vào Đội Thiếu niên Tiền phong Hồ Chí Minh.</p><p>Buổi lễ diễn ra trang nghiêm với các nghi thức truyền thống: chào cờ, hát Quốc ca, tuyên thệ, đeo khăn quàng đỏ. Các em xếp hàng ngay ngắn trước Lăng Bác, tay giơ cao lời thề Đội viên.</p><p>Em Nguyễn Hoàng Minh (lớp 3A1) xúc động chia sẻ: <em>\"Con rất tự hào khi được đứng tại đây, nơi Bác Hồ đọc Tuyên ngôn Độc lập. Con hứa sẽ học tập thật tốt để xứng đáng là Đội viên.\"</em></p><p>Đây là truyền thống mỗi năm của Trường Tiểu học Lê Quý Đôn, giáo dục lòng yêu nước và tinh thần tự hào dân tộc cho học sinh.</p>" \
  "$CID" 1 "2026-03-26"

create_article \
  "Ngày hội Thể thao Lê Quý Đôn 2026" \
  "ngay-hoi-the-thao-2026" \
  "Ngày hội Thể thao thường niên với các nội dung thi đấu điền kinh, bơi lội, bóng đá mini và nhiều trò chơi dân gian." \
  "<h2>Ngày hội Thể thao — Khỏe để học tốt</h2><p>Ngày 20/3/2026, Trường Tiểu học Lê Quý Đôn tổ chức Ngày hội Thể thao thường niên với chủ đề \"Khỏe để học tốt\" tại sân vận động trường.</p><h3>Các nội dung thi đấu</h3><ul><li><strong>Điền kinh:</strong> Chạy 60m, 100m, nhảy xa, nhảy cao</li><li><strong>Bóng đá mini:</strong> Giải đấu 5 người giữa các lớp Khối 4-5</li><li><strong>Bơi lội:</strong> Bơi tự do 25m cho Khối 3-5</li><li><strong>Trò chơi dân gian:</strong> Kéo co, nhảy bao bố, đi cà kheo</li><li><strong>Aerobic:</strong> Thi đồng diễn giữa các lớp Khối 1-2</li></ul><p>Kết quả: Khối 5 giành giải Nhất toàn đoàn, Khối 3 giải phong cách. Tổng cộng 120 huy chương được trao cho các vận động viên nhí xuất sắc.</p>" \
  "$CID" 2 "2026-03-20"

create_article \
  "Đêm Gala Nghệ thuật Lê Quý Đôn 2025" \
  "dem-gala-nghe-thuat-2025" \
  "Đêm Gala Nghệ thuật với chủ đề 'Sắc màu tuổi thơ' quy tụ hơn 500 học sinh biểu diễn trên sân khấu hoành tráng." \
  "<h2>Đêm Gala — Sắc màu tuổi thơ</h2><p>Tối ngày 20/12/2025, Trường Tiểu học Lê Quý Đôn tổ chức Đêm Gala Nghệ thuật thường niên với chủ đề \"Sắc màu tuổi thơ\" tại sân khấu ngoài trời 500 chỗ.</p><p>Chương trình gồm 25 tiết mục đa dạng từ múa, hát, kịch, nhạc cụ đến thời trang, do hơn 500 học sinh từ Khối 1 đến Khối 5 biểu diễn.</p><h3>Các tiết mục ấn tượng</h3><ul><li>Màn đồng diễn mở màn \"Việt Nam ơi\" với 200 học sinh</li><li>Vở kịch tiếng Anh \"The Little Prince\" do CLB Tiếng Anh PLC trình diễn</li><li>Biểu diễn piano và violin của nhóm học sinh tài năng</li><li>Fashion show \"Áo dài em mặc\" với thiết kế sáng tạo</li><li>Màn pháo hoa kết thúc chương trình</li></ul><p>Đêm Gala nhận được sự cổ vũ nhiệt tình từ hơn 2.000 phụ huynh và khách mời.</p>" \
  "$CID" 3 "2025-12-20"

create_article \
  "Tham quan dã ngoại Ecopark cho học sinh Khối 2" \
  "tham-quan-da-ngoai-ecopark-khoi-2" \
  "Chuyến dã ngoại Ecopark giúp học sinh Khối 2 trải nghiệm thiên nhiên, học kỹ năng teamwork và khám phá thế giới xung quanh." \
  "<h2>Chuyến dã ngoại bổ ích</h2><p>Ngày 15/11/2025, 280 học sinh Khối 2 Trường Tiểu học Lê Quý Đôn đã có chuyến dã ngoại thú vị tại Khu đô thị sinh thái Ecopark (Hưng Yên).</p><p>Chương trình dã ngoại bao gồm:</p><ul><li>Tham quan vườn bách thảo với hơn 100 loài cây</li><li>Hoạt động teambuilding: thi đấu giữa các nhóm</li><li>Thí nghiệm khoa học ngoài trời: đo pH đất, quan sát côn trùng</li><li>Picnic và trò chơi dân gian tại bãi cỏ</li><li>Vẽ tranh phong cảnh thiên nhiên</li></ul><p>Cô giáo chủ nhiệm lớp 2A3 chia sẻ: <em>\"Mỗi chuyến dã ngoại đều giúp các em tự tin hơn, biết cách hợp tác với bạn bè. Nhiều em lần đầu tiên được tiếp xúc với thiên nhiên một cách gần gũi như vậy.\"</em></p>" \
  "$CID" 4 "2025-11-15"

create_article \
  "Cuộc thi Hùng biện Tiếng Anh Lê Quý Đôn 2026" \
  "cuoc-thi-hung-bien-tieng-anh-2026" \
  "Cuộc thi Hùng biện Tiếng Anh với chủ đề 'My Dream for Vietnam' thu hút 120 học sinh Khối 4-5 tham gia." \
  "<h2>My Dream for Vietnam</h2><p>Cuộc thi Hùng biện Tiếng Anh năm 2026 với chủ đề \"My Dream for Vietnam\" diễn ra trong 2 ngày 10-11/3/2026 tại Hội trường lớn.</p><p>120 học sinh Khối 4-5 tham gia với những bài thuyết trình đầy cảm xúc về ước mơ của các em cho Việt Nam trong tương lai.</p><h3>Kết quả</h3><ul><li><strong>Giải Nhất:</strong> Nguyễn Phương Linh (5A2) — \"My Vietnam, My Garden\"</li><li><strong>Giải Nhì:</strong> Trần Đức Anh (5A1) — \"Technology for Farmers\"</li><li><strong>Giải Ba:</strong> Lê Minh Châu (4A3) — \"Clean Water for Everyone\"</li></ul><p>Ban giám khảo gồm giáo viên bản ngữ từ PLC Sydney đánh giá cao khả năng phát âm và tư duy logic của học sinh Lê Quý Đôn.</p>" \
  "$CID" 5 "2026-03-11"

create_article \
  "Lễ tri ân Ngày Nhà giáo Việt Nam 20/11" \
  "le-tri-an-ngay-nha-giao-20-11" \
  "Trường Tiểu học Lê Quý Đôn tổ chức Lễ tri ân Ngày Nhà giáo Việt Nam 20/11 với chương trình đặc biệt xúc động." \
  "<h2>Tri ân Thầy Cô</h2><p>Ngày 20/11/2025, Trường Tiểu học Lê Quý Đôn tổ chức Lễ tri ân Ngày Nhà giáo Việt Nam với chương trình đặc biệt \"Thầy Cô — Người truyền cảm hứng\".</p><h3>Chương trình</h3><ul><li>Video clip \"Một ngày của Thầy Cô\" do học sinh tự quay và dựng</li><li>Cuộc thi viết thư \"Em yêu Thầy Cô\" — 1.500 bức thư từ học sinh toàn trường</li><li>Tiết mục ca nhạc đặc biệt của phụ huynh tặng giáo viên</li><li>Trao giải cho 20 giáo viên có đóng góp xuất sắc</li><li>Triển lãm tranh vẽ chân dung Thầy Cô do học sinh sáng tác</li></ul><p>Bức thư cảm động nhất thuộc về em Hoàng Minh Khang (lớp 3A2): <em>\"Con yêu cô giống như yêu mẹ vậy. Cô dạy con biết đọc, biết viết, biết yêu thương bạn bè. Con cảm ơn cô nhiều lắm.\"</em></p>" \
  "$CID" 6 "2025-11-20"

create_article \
  "Festival Khoa học Lê Quý Đôn 2026" \
  "festival-khoa-hoc-2026" \
  "Festival Khoa học với hơn 50 dự án sáng tạo của học sinh, từ robot dọn rác đến hệ thống tưới cây tự động." \
  "<h2>Festival Khoa học — Sáng tạo không giới hạn</h2><p>Ngày 25/2/2026, Festival Khoa học Lê Quý Đôn diễn ra với sự tham gia của hơn 50 dự án sáng tạo từ học sinh các khối.</p><h3>Các dự án nổi bật</h3><ul><li><strong>Robot dọn rác thông minh</strong> (Nhóm 5A1) — sử dụng Arduino điều khiển robot thu gom rác</li><li><strong>Hệ thống tưới cây tự động</strong> (Nhóm 4A2) — cảm biến độ ẩm + bơm nước tự động</li><li><strong>Máy đo nhiệt độ phòng học</strong> (Nhóm 3A3) — hiển thị nhiệt độ trên LCD, cảnh báo khi quá nóng</li><li><strong>Mô hình nhà xanh</strong> (Nhóm 2A1) — nhà sử dụng năng lượng mặt trời</li><li><strong>Kính hiển vi tự chế</strong> (Nhóm 5A2) — sử dụng ống kính tái chế</li></ul><p>3 dự án xuất sắc nhất được chọn tham dự cuộc thi Khoa học kỹ thuật cấp Quận.</p>" \
  "$CID" 7 "2026-02-25"

create_article \
  "Giải bóng đá mini Lê Quý Đôn Cup 2026" \
  "giai-bong-da-mini-lqd-cup-2026" \
  "Giải bóng đá mini Lê Quý Đôn Cup lần thứ 10 với sự tham gia của 16 đội từ các lớp Khối 4-5." \
  "<h2>Lê Quý Đôn Cup lần thứ 10</h2><p>Giải bóng đá mini Lê Quý Đôn Cup 2026 diễn ra từ ngày 1-15/3/2026 với sự tham gia của 16 đội từ các lớp Khối 4-5.</p><h3>Kết quả chung cuộc</h3><ul><li><strong>Vô địch:</strong> Đội 5A1 — thắng 3-1 trong trận chung kết</li><li><strong>Á quân:</strong> Đội 5A3</li><li><strong>Hạng ba:</strong> Đội 4A2 và 4A4</li><li><strong>Cầu thủ xuất sắc nhất:</strong> Nguyễn Đức Huy (5A1)</li><li><strong>Thủ môn xuất sắc:</strong> Trần Minh Quân (5A3)</li><li><strong>Vua phá lưới:</strong> Lê Hoàng Nam (5A1) — 8 bàn</li></ul><p>Giải đấu không chỉ rèn luyện thể lực mà còn giáo dục tinh thần fair play, teamwork và kỷ luật cho học sinh.</p>" \
  "$CID" 8 "2026-03-15"

create_article \
  "Chương trình Tết Trung thu cho học sinh toàn trường" \
  "tet-trung-thu-2025" \
  "Tết Trung thu 2025 tại Trường Lê Quý Đôn với rước đèn, phá cỗ và nhiều trò chơi dân gian đặc sắc." \
  "<h2>Trung thu ấm áp</h2><p>Tối ngày 14/9/2025 (Rằm tháng 8 Âm lịch), Trường Tiểu học Lê Quý Đôn tổ chức chương trình Tết Trung thu cho toàn thể học sinh.</p><h3>Các hoạt động</h3><ul><li>Rước đèn quanh khuôn viên trường với 500 chiếc đèn lồng tự làm</li><li>Phá cỗ Trung thu với bánh nướng, bánh dẻo</li><li>Múa Lân biểu diễn</li><li>Thi làm đèn lồng sáng tạo</li><li>Trò chơi dân gian: bịt mắt bắt dê, đập niêu</li></ul><p>Chị Hằng và Chú Cuội do giáo viên hóa trang giao lưu cùng các em, mang đến tiếng cười sảng khoái.</p>" \
  "$CID" 9 "2025-09-14"

create_article \
  "Lễ tốt nghiệp Khối 5 năm học 2024-2025" \
  "le-tot-nghiep-khoi-5-2024-2025" \
  "120 học sinh Khối 5 Trường Tiểu học Lê Quý Đôn tốt nghiệp xuất sắc, sẵn sàng bước vào cấp THCS." \
  "<h2>Chia tay và trưởng thành</h2><p>Chiều ngày 30/5/2025, Trường Tiểu học Lê Quý Đôn tổ chức Lễ tốt nghiệp cho 120 học sinh Khối 5 — khóa 2020-2025.</p><p>100% học sinh đạt kết quả tốt nghiệp, trong đó:</p><ul><li>85% đạt loại Xuất sắc</li><li>12% đạt loại Tốt</li><li>3% đạt loại Khá</li></ul><p>Đặc biệt, 40% học sinh Khối 5 đạt chứng chỉ Tiếng Anh Cambridge Flyers (tương đương A2), 30% đạt Movers (tương đương A1).</p><p>Video kỷ yếu 5 năm học đã khiến nhiều phụ huynh và giáo viên xúc động rơi nước mắt. Các em hứa sẽ tiếp tục phát huy truyền thống Lê Quý Đôn ở cấp học mới.</p>" \
  "$CID" 10 "2025-05-30"

create_article \
  "Ngày hội Văn hóa các dân tộc Việt Nam" \
  "ngay-hoi-van-hoa-dan-toc-2026" \
  "Ngày hội Văn hóa các dân tộc Việt Nam với 54 gian hàng đại diện 54 dân tộc do các lớp đảm nhận." \
  "<h2>54 dân tộc — Một Việt Nam</h2><p>Ngày 19/4/2026, Trường Tiểu học Lê Quý Đôn tổ chức Ngày hội Văn hóa các dân tộc Việt Nam, nhân kỷ niệm Ngày Văn hóa các dân tộc Việt Nam 19/4.</p><p>Mỗi lớp đảm nhận đại diện cho 1-2 dân tộc, với các hoạt động:</p><ul><li>Trang trí gian hàng theo bản sắc dân tộc</li><li>Trình diễn trang phục truyền thống</li><li>Giới thiệu ẩm thực đặc trưng</li><li>Biểu diễn nhạc cụ và điệu múa dân tộc</li></ul><p>Ngày hội giúp học sinh hiểu và trân trọng sự đa dạng văn hóa của dân tộc Việt Nam.</p>" \
  "$CID" 11 "2026-04-19"

# ─── CATEGORY: HOAT DONG NGOAI KHOA ───
CID="${CAT_IDS[2]}"

create_article \
  "CLB Robotics Lê Quý Đôn — Hành trình sáng tạo" \
  "clb-robotics-hanh-trinh-sang-tao" \
  "CLB Robotics với 80 thành viên tích cực, tham gia các cuộc thi Robotics quốc gia và quốc tế." \
  "<h2>CLB Robotics — Nơi ươm mầm sáng tạo</h2><p>CLB Robotics Trường Tiểu học Lê Quý Đôn được thành lập từ năm 2022, hiện có 80 thành viên từ Khối 3-5.</p><h3>Hoạt động</h3><ul><li>Học lập trình Scratch và Python cơ bản</li><li>Thiết kế và lắp ráp robot LEGO Mindstorms</li><li>Thi đấu robot sumo, robot dò line</li><li>Tham gia cuộc thi WRO (World Robot Olympiad) cấp quốc gia</li></ul><h3>Thành tích</h3><ul><li>Giải Nhì WRO Việt Nam 2025</li><li>Giải Nhất Robotics cấp Thành phố Hà Nội 2025</li><li>Đại diện Việt Nam tham dự WRO quốc tế tại Thổ Nhĩ Kỳ</li></ul><p>CLB sinh hoạt mỗi thứ 3 và thứ 5 sau giờ học, do thầy Nguyễn Văn Tuấn — thạc sĩ CNTT hướng dẫn.</p>" \
  "$CID" 0 "2025-10-10"

create_article \
  "CLB Tiếng Anh PLC — Nói Tiếng Anh như người bản ngữ" \
  "clb-tieng-anh-plc" \
  "CLB Tiếng Anh PLC với giáo viên bản ngữ từ Úc, giúp học sinh tự tin giao tiếp Tiếng Anh hàng ngày." \
  "<h2>CLB Tiếng Anh PLC</h2><p>CLB Tiếng Anh PLC là hoạt động ngoại khóa đặc biệt, được tổ chức phối hợp với PLC Sydney (Úc).</p><h3>Nội dung hoạt động</h3><ul><li>Giao tiếp Tiếng Anh qua đóng kịch, role-play</li><li>Đọc sách Tiếng Anh theo cấp độ (Graded Readers)</li><li>Giao lưu trực tuyến với học sinh PLC Sydney mỗi tháng</li><li>Chuẩn bị cho kỳ thi Cambridge YLE</li><li>Tổ chức English Day mỗi quý</li></ul><p>Kết quả: 95% thành viên CLB đạt chứng chỉ Cambridge Starters/Movers/Flyers, cao hơn mức trung bình toàn trường 30%.</p>" \
  "$CID" 1 "2025-09-20"

create_article \
  "CLB Bơi lội — Kỹ năng sinh tồn cho học sinh" \
  "clb-boi-loi-ky-nang-sinh-ton" \
  "Chương trình bơi lội bắt buộc cho học sinh từ lớp 2, đảm bảo 100% học sinh biết bơi khi tốt nghiệp." \
  "<h2>Bơi lội — Kỹ năng sinh tồn</h2><p>Trường Tiểu học Lê Quý Đôn là một trong số ít trường tiểu học tại Hà Nội có bể bơi riêng và chương trình bơi lội bắt buộc.</p><h3>Chương trình</h3><ul><li>Lớp 1: Làm quen với nước, kỹ thuật thở</li><li>Lớp 2-3: Học bơi ếch, bơi sải cơ bản</li><li>Lớp 4-5: Nâng cao kỹ thuật, thi đấu nội bộ</li></ul><p>Mục tiêu: 100% học sinh biết bơi ít nhất 1 kiểu khi tốt nghiệp tiểu học.</p><p>Bể bơi 25m x 12.5m, nước ấm quanh năm, có huấn luyện viên chuyên nghiệp và nhân viên cứu hộ. Mỗi buổi học tối đa 15 học sinh/1 huấn luyện viên để đảm bảo an toàn.</p>" \
  "$CID" 2 "2025-10-05"

create_article \
  "CLB Nghệ thuật — Hội họa và Âm nhạc" \
  "clb-nghe-thuat-hoi-hoa-am-nhac" \
  "CLB Nghệ thuật với 2 bộ môn Hội họa và Âm nhạc, phát triển tài năng sáng tạo cho học sinh." \
  "<h2>CLB Nghệ thuật</h2><p>CLB Nghệ thuật Lê Quý Đôn gồm 2 bộ môn chính:</p><h3>Hội họa</h3><ul><li>Vẽ tranh sáp dầu, màu nước, acrylic</li><li>Điêu khắc đất sét</li><li>Nghệ thuật cắt giấy origami</li><li>Triển lãm tranh học sinh mỗi quý</li></ul><h3>Âm nhạc</h3><ul><li>Piano, violin, guitar cơ bản</li><li>Hợp xướng và đơn ca</li><li>Nhạc cụ dân tộc: đàn tranh, sáo trúc</li><li>Biểu diễn tại các sự kiện trường</li></ul><p>CLB đã đạt 15 giải thưởng cấp Quận và Thành phố trong năm 2025 ở cả 2 bộ môn.</p>" \
  "$CID" 3 "2025-11-10"

create_article \
  "Chương trình Kỹ năng sống cho học sinh toàn trường" \
  "chuong-trinh-ky-nang-song" \
  "Chương trình Kỹ năng sống toàn diện bao gồm phòng cháy chữa cháy, sơ cấp cứu, giao thông an toàn và chống xâm hại." \
  "<h2>Kỹ năng sống — Bảo vệ bản thân</h2><p>Trường Tiểu học Lê Quý Đôn tích hợp chương trình Kỹ năng sống vào giờ sinh hoạt hàng tuần, bao gồm:</p><ul><li><strong>Phòng cháy chữa cháy:</strong> Diễn tập sơ tán mỗi quý, hướng dẫn sử dụng bình chữa cháy</li><li><strong>Sơ cấp cứu:</strong> Xử lý vết thương nhẹ, gọi số 115</li><li><strong>An toàn giao thông:</strong> Luật đi đường, đội mũ bảo hiểm</li><li><strong>Phòng chống xâm hại:</strong> Nhận biết hành vi không an toàn, quy tắc \"5 ngón tay\"</li><li><strong>Kỹ năng tài chính:</strong> Quản lý tiền tiêu vặt, tiết kiệm</li><li><strong>Phòng chống bắt nạt:</strong> Nhận diện và ứng xử đúng cách</li></ul><p>Chương trình được thiết kế bởi chuyên gia tâm lý và phối hợp với Công an Phòng cháy Quận Nam Từ Liêm.</p>" \
  "$CID" 4 "2025-09-25"

create_article \
  "CLB Cờ vua — Phát triển tư duy logic" \
  "clb-co-vua-tu-duy-logic" \
  "CLB Cờ vua với 60 thành viên, nhiều em đạt giải quốc gia, phát triển tư duy logic và khả năng tập trung." \
  "<h2>CLB Cờ vua</h2><p>CLB Cờ vua Lê Quý Đôn thành lập năm 2018, hiện có 60 thành viên từ Khối 2-5.</p><h3>Thành tích nổi bật 2025</h3><ul><li>Giải Nhất đồng đội cấp Thành phố</li><li>2 giải Nhất cá nhân cấp Quận</li><li>1 học sinh được triệu tập đội tuyển Hà Nội</li></ul><p>CLB sinh hoạt 3 buổi/tuần, do kiện tướng cờ vua Nguyễn Văn Hùng huấn luyện. Cờ vua giúp các em phát triển tư duy logic, khả năng tập trung, tính kiên nhẫn và kỹ năng ra quyết định.</p>" \
  "$CID" 5 "2025-12-10"

create_article \
  "CLB Nấu ăn nhí — Bé vào bếp cùng Mẹ" \
  "clb-nau-an-nhi-be-vao-bep" \
  "CLB Nấu ăn nhí giúp học sinh học cách chế biến món ăn đơn giản, hiểu về dinh dưỡng và yêu thương gia đình." \
  "<h2>CLB Nấu ăn nhí</h2><p>CLB Nấu ăn nhí \"Bé vào bếp cùng Mẹ\" là hoạt động ngoại khóa độc đáo của Trường Tiểu học Lê Quý Đôn.</p><h3>Nội dung sinh hoạt</h3><ul><li>Học cách chế biến các món ăn đơn giản: salad, sandwich, bánh cuốn</li><li>Tìm hiểu nhóm dinh dưỡng: tinh bột, protein, vitamin, chất xơ</li><li>An toàn vệ sinh thực phẩm</li><li>Bữa ăn cân bằng cho học sinh tiểu học</li></ul><p>Mỗi tháng, CLB tổ chức 1 buổi \"Bếp yêu thương\" mời phụ huynh cùng nấu ăn với các em. Hoạt động này vừa giáo dục dinh dưỡng vừa gắn kết tình cảm gia đình.</p>" \
  "$CID" 6 "2026-01-10"

create_article \
  "Chương trình Trại hè Lê Quý Đôn Summer Camp 2025" \
  "trai-he-summer-camp-2025" \
  "Summer Camp 2025 với 3 tuần hoạt động ngoài trời, STEM, nghệ thuật và thể thao tại khuôn viên trường." \
  "<h2>Summer Camp 2025</h2><p>Trại hè Lê Quý Đôn Summer Camp 2025 diễn ra từ ngày 15/6 đến 5/7/2025 với 3 chủ đề theo tuần:</p><ul><li><strong>Tuần 1 — Explorer:</strong> Khám phá thiên nhiên, thí nghiệm khoa học, dã ngoại</li><li><strong>Tuần 2 — Creator:</strong> STEM projects, coding, nghệ thuật sáng tạo</li><li><strong>Tuần 3 — Champion:</strong> Thể thao, teambuilding, kỹ năng lãnh đạo</li></ul><p>Camp phục vụ học sinh từ lớp 1-5 với tỷ lệ 1 giáo viên/10 học sinh. Mỗi ngày từ 7:30 đến 17:00 với bữa trưa và 2 bữa phụ.</p><p>Summer Camp 2025 thu hút 400 học sinh đăng ký, tăng 30% so với năm trước.</p>" \
  "$CID" 7 "2025-06-15"

create_article \
  "Học sinh Lê Quý Đôn tham gia thiện nguyện vùng cao" \
  "hoc-sinh-thien-nguyen-vung-cao" \
  "Chương trình thiện nguyện 'Sách cho em' quyên góp 3.000 cuốn sách cho trẻ em vùng cao Hà Giang." \
  "<h2>Sách cho em — Chương trình thiện nguyện</h2><p>Trong tháng 12/2025, Trường Tiểu học Lê Quý Đôn phát động chương trình \"Sách cho em\" nhằm quyên góp sách cho trẻ em vùng cao.</p><p>Kết quả: hơn 3.000 cuốn sách từ học sinh và phụ huynh, cùng 200 bộ quần áo ấm, 100 bộ đồ dùng học tập.</p><p>Ngày 20/12/2025, đoàn đại diện nhà trường gồm Ban Giám hiệu, giáo viên và 30 học sinh Khối 5 đã trực tiếp trao quà tại 3 điểm trường ở huyện Mèo Vạc, Hà Giang.</p><p>Em Phạm Minh Anh (5A2) chia sẻ: <em>\"Con rất vui khi nhìn thấy các bạn nhỏ vùng cao cười khi nhận sách. Con muốn làm nhiều hơn nữa.\"</em></p>" \
  "$CID" 8 "2025-12-20"

create_article \
  "CLB Đọc sách — 30 phút đọc mỗi ngày" \
  "clb-doc-sach-30-phut-moi-ngay" \
  "CLB Đọc sách với quy tắc 30 phút đọc mỗi ngày, xây dựng thói quen đọc sách cho học sinh từ nhỏ." \
  "<h2>CLB Đọc sách</h2><p>CLB Đọc sách \"30 phút mỗi ngày\" khuyến khích học sinh duy trì thói quen đọc sách mỗi ngày.</p><h3>Cách thức hoạt động</h3><ul><li>Mỗi học sinh có sổ theo dõi đọc sách</li><li>Chia sẻ sách hay mỗi tuần tại lớp</li><li>Viết cảm nhận ngắn sau mỗi cuốn sách</li><li>Thi \"Đại sứ đọc sách\" mỗi quý</li></ul><p>Thư viện trường mở cửa từ 7:00-17:30 với hơn 15.000 đầu sách. Học sinh được mượn tối đa 3 cuốn/lần, 2 tuần/lượt.</p><p>Kết quả: trung bình mỗi học sinh đọc 24 cuốn sách/năm, gấp 3 lần mức trung bình quốc gia.</p>" \
  "$CID" 9 "2026-02-01"

# ─── CATEGORY: HOC TAP ───
CID="${CAT_IDS[3]}"

create_article \
  "Phương pháp dạy Toán theo mô hình Singapore" \
  "phuong-phap-day-toan-singapore" \
  "Trường Tiểu học Lê Quý Đôn áp dụng phương pháp dạy Toán theo mô hình Singapore, giúp học sinh tư duy bậc cao." \
  "<h2>Toán Singapore tại Lê Quý Đôn</h2><p>Từ năm học 2024-2025, Trường Tiểu học Lê Quý Đôn triển khai phương pháp dạy Toán theo mô hình Singapore — được đánh giá là hệ thống giáo dục Toán tốt nhất thế giới theo PISA.</p><h3>Đặc điểm</h3><ul><li><strong>CPA (Concrete-Pictorial-Abstract):</strong> Từ vật thật → hình vẽ → ký hiệu toán học</li><li><strong>Bar Model:</strong> Sử dụng sơ đồ thanh để giải bài toán có lời văn</li><li><strong>Number Bonds:</strong> Phân tích số giúp tính nhẩm nhanh</li><li><strong>Problem Solving:</strong> Chú trọng giải quyết vấn đề, không chỉ tính toán</li></ul><p>Sau 1 năm áp dụng, điểm Toán trung bình tăng 15%, đặc biệt ở dạng bài giải quyết vấn đề.</p>" \
  "$CID" 0 "2025-09-10"

create_article \
  "Chương trình Quốc gia nâng cao — Điểm khác biệt" \
  "chuong-trinh-quoc-gia-nang-cao" \
  "Tìm hiểu chương trình Quốc gia nâng cao tại Trường Tiểu học Lê Quý Đôn với các môn học được tăng cường và mở rộng." \
  "<h2>Chương trình Quốc gia nâng cao</h2><p>Trường Tiểu học Lê Quý Đôn thực hiện Chương trình Quốc gia nâng cao — dựa trên chương trình chuẩn của Bộ GD&ĐT, bổ sung các nội dung nâng cao và kỹ năng thực tiễn.</p><h3>Điểm khác biệt</h3><ul><li><strong>Toán:</strong> Bổ sung phương pháp Singapore, tư duy logic, Toán tiếng Anh</li><li><strong>Tiếng Việt:</strong> Tăng cường đọc hiểu, sáng tạo văn bản</li><li><strong>Tiếng Anh:</strong> 8 tiết/tuần (gấp đôi chuẩn), giáo viên bản ngữ</li><li><strong>Khoa học:</strong> STEM, thí nghiệm thực hành</li><li><strong>Tin học:</strong> Lập trình Scratch, Robotics từ lớp 3</li><li><strong>Kỹ năng sống:</strong> 2 tiết/tuần</li></ul><p>Chương trình được thiết kế cân đối giữa kiến thức nền tảng và phát triển năng lực, đảm bảo học sinh đạt chuẩn đầu ra cao hơn mức quy định.</p>" \
  "$CID" 1 "2025-08-15"

create_article \
  "Ứng dụng công nghệ thông tin trong giảng dạy" \
  "ung-dung-cntt-trong-giang-day" \
  "Giáo viên Trường Lê Quý Đôn sử dụng bảng tương tác, iPad và phần mềm giáo dục hiện đại trong mỗi tiết học." \
  "<h2>Công nghệ trong giáo dục</h2><p>Mỗi phòng học tại Trường Tiểu học Lê Quý Đôn đều được trang bị:</p><ul><li>Bảng tương tác thông minh 86 inch</li><li>Máy chiếu và hệ thống âm thanh</li><li>Wifi tốc độ cao phủ toàn trường</li><li>iPad dùng chung cho hoạt động nhóm</li></ul><h3>Phần mềm giáo dục</h3><ul><li><strong>Kahoot/Quizizz:</strong> Trò chơi kiểm tra kiến thức</li><li><strong>Google Classroom:</strong> Quản lý bài tập và tài liệu</li><li><strong>Mathletics:</strong> Luyện Toán trực tuyến</li><li><strong>Reading Eggs:</strong> Luyện đọc Tiếng Anh</li></ul><p>Giáo viên được đào tạo sử dụng công nghệ 2 lần/năm với chuyên gia từ Microsoft Education.</p>" \
  "$CID" 2 "2025-10-20"

create_article \
  "Kết quả thi Cambridge YLE năm 2025" \
  "ket-qua-thi-cambridge-yle-2025" \
  "98% học sinh thi Cambridge YLE đạt kết quả xuất sắc, trong đó 65% đạt 15 khiên (điểm tuyệt đối)." \
  "<h2>Kết quả Cambridge YLE 2025</h2><p>Kỳ thi Cambridge Young Learners English (YLE) năm 2025 tại Trường Tiểu học Lê Quý Đôn đạt kết quả ấn tượng:</p><h3>Starters (Khối 2-3)</h3><ul><li>120 thí sinh tham gia</li><li>98% đạt kết quả, 65% đạt 15/15 khiên</li></ul><h3>Movers (Khối 3-4)</h3><ul><li>90 thí sinh tham gia</li><li>95% đạt kết quả, 50% đạt 15/15 khiên</li></ul><h3>Flyers (Khối 4-5)</h3><ul><li>60 thí sinh tham gia</li><li>92% đạt kết quả, 40% đạt 15/15 khiên</li></ul><p>Kết quả này cao hơn 25% so với mức trung bình toàn quốc, khẳng định chất lượng chương trình Tiếng Anh hợp tác PLC Sydney.</p>" \
  "$CID" 3 "2025-12-01"

create_article \
  "Bí quyết học tốt từ học sinh xuất sắc Lê Quý Đôn" \
  "bi-quyet-hoc-tot-hoc-sinh-xuat-sac" \
  "5 học sinh xuất sắc nhất trường chia sẻ bí quyết học tập hiệu quả và phương pháp quản lý thời gian." \
  "<h2>Bí quyết học tốt</h2><p>5 học sinh đạt thành tích cao nhất năm học 2025-2026 chia sẻ bí quyết:</p><h3>1. Nguyễn Minh Anh (5A1) — Thủ khoa Toán</h3><p><em>\"Em luôn làm bài tập ngay khi về nhà, không để dồn. Mỗi tối em dành 30 phút giải thêm các bài Toán nâng cao.\"</em></p><h3>2. Trần Đức Huy (5A2) — Giải Nhất Tiếng Anh</h3><p><em>\"Em xem phim hoạt hình tiếng Anh mỗi ngày 20 phút, rồi viết lại những từ mới em học được.\"</em></p><h3>3. Lê Phương Linh (4A1) — Giải Nhất Khoa học</h3><p><em>\"Em thích làm thí nghiệm ở nhà. Mỗi tuần em thử 1 thí nghiệm từ kênh YouTube khoa học.\"</em></p><h3>4. Hoàng Minh Quân (5A3) — Giải Nhất Văn</h3><p><em>\"Em đọc sách mỗi ngày và viết nhật ký. Viết nhiều giúp em diễn đạt tốt hơn.\"</em></p><h3>5. Nguyễn Thu Hà (4A2) — Đa tài</h3><p><em>\"Em lập thời gian biểu cho mỗi ngày, chia đều thời gian cho học và chơi.\"</em></p>" \
  "$CID" 4 "2026-02-15"

create_article \
  "Kiểm tra giữa kỳ II — Hướng dẫn ôn tập hiệu quả" \
  "kiem-tra-giua-ky-2-huong-dan-on-tap" \
  "Hướng dẫn ôn tập kiểm tra giữa kỳ II cho phụ huynh và học sinh với lịch thi và tài liệu ôn tập." \
  "<h2>Hướng dẫn ôn tập kiểm tra giữa kỳ II</h2><p>Kỳ kiểm tra giữa kỳ II diễn ra từ ngày 10-14/3/2026. Dưới đây là hướng dẫn ôn tập cho phụ huynh và học sinh:</p><h3>Lịch thi</h3><ul><li>Thứ 2 (10/3): Toán</li><li>Thứ 3 (11/3): Tiếng Việt</li><li>Thứ 4 (12/3): Tiếng Anh</li><li>Thứ 5 (13/3): Khoa học + Lịch sử - Địa lý (Khối 4-5)</li><li>Thứ 6 (14/3): Tin học + Đạo đức</li></ul><h3>Phương pháp ôn tập</h3><ul><li>Ôn tập theo hệ thống kiến thức, không học tủ</li><li>Làm lại các bài kiểm tra 15 phút đã sửa</li><li>Ngủ đủ 8-9 tiếng mỗi đêm trong tuần thi</li><li>Ăn sáng đầy đủ trước giờ thi</li></ul><p>Tài liệu ôn tập được đăng trên ứng dụng LQD Connect. Phụ huynh cần tạo môi trường yên tĩnh cho con ôn bài.</p>" \
  "$CID" 5 "2026-03-01"

create_article \
  "Dạy học phân hóa — Mỗi học sinh một lộ trình" \
  "day-hoc-phan-hoa-moi-hoc-sinh" \
  "Trường Tiểu học Lê Quý Đôn áp dụng phương pháp dạy học phân hóa, thiết kế lộ trình riêng cho từng nhóm năng lực." \
  "<h2>Dạy học phân hóa</h2><p>Nhận thức rằng mỗi học sinh có năng lực và tốc độ tiếp thu khác nhau, Trường Tiểu học Lê Quý Đôn áp dụng phương pháp dạy học phân hóa từ năm 2023.</p><h3>Cách thực hiện</h3><ul><li><strong>Đánh giá đầu vào:</strong> Test năng lực mỗi môn đầu năm</li><li><strong>Phân nhóm linh hoạt:</strong> 3 nhóm năng lực (nâng cao, chuẩn, hỗ trợ)</li><li><strong>Bài tập phân tầng:</strong> Mỗi nhóm có bộ bài tập phù hợp</li><li><strong>Giáo viên hỗ trợ:</strong> Lớp có thêm giáo viên trợ giảng cho nhóm cần hỗ trợ</li></ul><p>Kết quả: sau 2 năm, tỷ lệ học sinh đạt loại Tốt tăng từ 85% lên 95%. Đặc biệt, nhóm cần hỗ trợ tiến bộ rõ rệt với 80% đạt chuẩn đầu ra.</p>" \
  "$CID" 6 "2025-11-05"

create_article \
  "Học qua dự án — Project-Based Learning tại Lê Quý Đôn" \
  "hoc-qua-du-an-pbl-le-quy-don" \
  "Phương pháp học qua dự án (PBL) giúp học sinh áp dụng kiến thức vào thực tiễn, phát triển kỹ năng làm việc nhóm." \
  "<h2>Project-Based Learning</h2><p>Mỗi học kỳ, học sinh Khối 3-5 thực hiện 2 dự án liên môn (PBL — Project-Based Learning), kết hợp kiến thức từ nhiều môn học:</p><h3>Ví dụ dự án học kỳ I/2025-2026</h3><ul><li><strong>Khối 3:</strong> \"Khu vườn của em\" — Toán (đo diện tích) + Khoa học (cây trồng) + Mỹ thuật (vẽ sơ đồ)</li><li><strong>Khối 4:</strong> \"Chợ quê Việt Nam\" — Toán (tính tiền) + Xã hội (nghề nghiệp) + Tiếng Việt (quảng cáo)</li><li><strong>Khối 5:</strong> \"Thành phố thông minh\" — STEM (mô hình) + Khoa học (năng lượng) + Tiếng Anh (thuyết trình)</li></ul><p>Học sinh làm việc theo nhóm 4-5 em, được hướng dẫn bởi giáo viên mentor. Sản phẩm cuối cùng được trưng bày và thuyết trình trước hội đồng.</p>" \
  "$CID" 7 "2026-01-05"

create_article \
  "Thư viện số và nguồn tài liệu học tập trực tuyến" \
  "thu-vien-so-tai-lieu-truc-tuyen" \
  "Trường Tiểu học Lê Quý Đôn cung cấp hệ thống thư viện số với hàng nghìn tài liệu, video bài giảng và bài tập trực tuyến." \
  "<h2>Thư viện số Lê Quý Đôn</h2><p>Từ năm 2024, Trường Tiểu học Lê Quý Đôn triển khai hệ thống thư viện số, bổ sung cho thư viện vật lý 15.000 cuốn sách:</p><h3>Tài nguyên số</h3><ul><li>5.000+ ebook tiếng Việt và tiếng Anh</li><li>500+ video bài giảng theo chương trình</li><li>2.000+ bài tập trực tuyến tự chấm</li><li>Kho đề thi các năm trước</li><li>Sách nói cho học sinh thích nghe</li></ul><h3>Cách truy cập</h3><p>Học sinh đăng nhập qua ứng dụng LQD Connect hoặc website trường với tài khoản được cấp. Phụ huynh có thể theo dõi lịch sử đọc sách của con.</p><p>Trung bình mỗi ngày có 300 lượt truy cập thư viện số, cao nhất vào khung 19:00-21:00.</p>" \
  "$CID" 8 "2025-10-15"

create_article \
  "Chương trình Giáo dục STEAM tích hợp nghệ thuật" \
  "giao-duc-steam-tich-hop-nghe-thuat" \
  "Bổ sung Arts vào STEM, chương trình STEAM giúp học sinh kết hợp sáng tạo nghệ thuật với khoa học công nghệ." \
  "<h2>STEAM — Khoa học gặp Nghệ thuật</h2><p>Nâng cấp từ STEM, chương trình STEAM tại Trường Tiểu học Lê Quý Đôn tích hợp yếu tố Nghệ thuật (Arts) vào các dự án khoa học:</p><h3>Ví dụ hoạt động STEAM</h3><ul><li>Thiết kế poster khoa học bằng Canva</li><li>Vẽ mô hình 3D cho robot trước khi lắp ráp</li><li>Sáng tác nhạc nền cho video thuyết trình dự án</li><li>Thiết kế bao bì sản phẩm thân thiện môi trường</li></ul><p>STEAM không chỉ dạy kỹ thuật mà còn phát triển khả năng tư duy sáng tạo, thẩm mỹ — những kỹ năng mà AI không thể thay thế.</p>" \
  "$CID" 9 "2026-02-20"

# ─── CATEGORY: TUYEN SINH ───
CID="${CAT_IDS[4]}"

create_article \
  "Thông báo tuyển sinh lớp 1 năm học 2026-2027" \
  "thong-bao-tuyen-sinh-lop-1-2026-2027" \
  "Trường Tiểu học Lê Quý Đôn thông báo kế hoạch tuyển sinh lớp 1 năm học 2026-2027 với nhiều ưu đãi hấp dẫn." \
  "<h2>Tuyển sinh lớp 1 năm học 2026-2027</h2><p>Trường Tiểu học Lê Quý Đôn trân trọng thông báo kế hoạch tuyển sinh lớp 1 năm học 2026-2027:</p><h3>Thông tin tuyển sinh</h3><ul><li><strong>Đối tượng:</strong> Trẻ sinh năm 2020 (đủ 6 tuổi)</li><li><strong>Chỉ tiêu:</strong> 5 lớp x 35 học sinh = 175 học sinh</li><li><strong>Hồ sơ:</strong> Nộp từ 01/3 đến 30/6/2026</li><li><strong>Phí tuyển sinh:</strong> Miễn phí</li></ul><h3>Ưu đãi đăng ký sớm</h3><ul><li>Đăng ký trước 30/4: Giảm 20% học phí kỳ 1</li><li>Anh chị em ruột đang học tại trường: Giảm 10% học phí</li><li>Con em cán bộ giáo viên: Giảm 15% học phí</li></ul><h3>Quy trình xét tuyển</h3><ol><li>Nộp hồ sơ trực tuyến hoặc trực tiếp</li><li>Tham quan trường (mỗi thứ 7)</li><li>Phỏng vấn phụ huynh và đánh giá sự sẵn sàng của trẻ</li><li>Thông báo kết quả trong 7 ngày làm việc</li></ol>" \
  "$CID" 0 "2026-02-01"

create_article \
  "Chính sách học phí và hỗ trợ tài chính năm 2026-2027" \
  "chinh-sach-hoc-phi-ho-tro-tai-chinh" \
  "Thông tin chi tiết về học phí, các khoản phí và chính sách hỗ trợ tài chính cho phụ huynh." \
  "<h2>Học phí và hỗ trợ tài chính</h2><p>Trường Tiểu học Lê Quý Đôn cam kết mức học phí phù hợp với chất lượng giáo dục hàng đầu:</p><h3>Học phí năm 2026-2027</h3><ul><li>Học phí: từ 8.5 triệu/tháng (10 tháng/năm)</li><li>Bao gồm: học phí, Tiếng Anh tăng cường, STEM, bữa ăn chính</li><li>Chưa bao gồm: xe đưa đón, CLB ngoại khóa tự chọn</li></ul><h3>Chính sách hỗ trợ</h3><ul><li>Học bổng xuất sắc: Miễn 50-100% học phí cho học sinh giỏi toàn diện</li><li>Hỗ trợ anh chị em: Giảm 10% cho gia đình có 2+ con học tại trường</li><li>Trả góp: Hỗ trợ trả góp 0% lãi suất qua ngân hàng đối tác</li></ul>" \
  "$CID" 1 "2026-01-15"

create_article \
  "Ngày hội Tuyển sinh Lê Quý Đôn Open Day 2026" \
  "open-day-tuyen-sinh-2026" \
  "Mời phụ huynh và học sinh tham dự Ngày hội Tuyển sinh Open Day — trải nghiệm thực tế môi trường học tập." \
  "<h2>Open Day — Trải nghiệm thực tế</h2><p>Trường Tiểu học Lê Quý Đôn tổ chức Ngày hội Tuyển sinh Open Day vào các ngày thứ 7 hàng tuần trong tháng 3-4/2026.</p><h3>Chương trình Open Day</h3><ul><li>09:00 — Đón tiếp, giới thiệu tổng quan</li><li>09:30 — Tham quan cơ sở vật chất: phòng học, Lab STEM, bể bơi, thư viện</li><li>10:30 — Trải nghiệm tiết học mẫu (Toán, Tiếng Anh, STEM)</li><li>11:30 — Giao lưu với Ban Giám hiệu, giáo viên</li><li>12:00 — Ăn trưa cùng học sinh (tùy chọn)</li></ul><h3>Đăng ký</h3><p>Phụ huynh đăng ký qua hotline 024 xxxx xxxx hoặc website trường. Mỗi buổi giới hạn 30 gia đình để đảm bảo trải nghiệm tốt nhất.</p>" \
  "$CID" 2 "2026-02-15"

create_article \
  "Hướng dẫn nộp hồ sơ tuyển sinh trực tuyến" \
  "huong-dan-nop-ho-so-truc-tuyen" \
  "Hướng dẫn từng bước nộp hồ sơ tuyển sinh trực tuyến qua website và ứng dụng LQD Connect." \
  "<h2>Nộp hồ sơ trực tuyến</h2><p>Từ năm 2026, phụ huynh có thể nộp hồ sơ tuyển sinh hoàn toàn trực tuyến:</p><h3>Các bước thực hiện</h3><ol><li>Truy cập website trường, chọn mục \"Tuyển sinh\"</li><li>Điền thông tin học sinh và phụ huynh</li><li>Upload ảnh giấy khai sinh, sổ hộ khẩu (scan hoặc chụp rõ nét)</li><li>Upload ảnh 3x4 của học sinh</li><li>Chọn lịch tham quan và phỏng vấn</li><li>Xác nhận và nhận mã hồ sơ</li></ol><h3>Hồ sơ bao gồm</h3><ul><li>Đơn xin nhập học (form online)</li><li>Giấy khai sinh (bản sao)</li><li>Sổ hộ khẩu hoặc giấy tạm trú (bản sao)</li><li>Sổ tiêm chủng</li><li>Bảng đánh giá của trường mầm non</li></ul>" \
  "$CID" 3 "2026-03-01"

create_article \
  "Câu hỏi thường gặp về tuyển sinh Lê Quý Đôn" \
  "cau-hoi-thuong-gap-tuyen-sinh" \
  "Giải đáp 10 câu hỏi thường gặp nhất của phụ huynh về tuyển sinh, chương trình học và chế độ chăm sóc." \
  "<h2>FAQ — Câu hỏi thường gặp</h2><h3>1. Trường có nhận học sinh chuyển cấp không?</h3><p>Có. Nhà trường nhận xét tuyển học sinh từ lớp 2-5 khi còn chỉ tiêu. Học sinh cần qua bài đánh giá năng lực.</p><h3>2. Chương trình có khác trường công không?</h3><p>Trường dạy chương trình Quốc gia nâng cao — đầy đủ nội dung Bộ GD&ĐT quy định, bổ sung Tiếng Anh tăng cường, STEM, Kỹ năng sống.</p><h3>3. Xe đưa đón hoạt động thế nào?</h3><p>Trường có 10 tuyến xe buýt phủ các quận nội thành. Phụ huynh theo dõi vị trí xe qua ứng dụng. Phí từ 1.5 triệu/tháng tùy tuyến.</p><h3>4. Bữa ăn của học sinh ra sao?</h3><p>Mỗi ngày 1 bữa chính + 2 bữa phụ. Menu 4 tuần không trùng lặp, nguồn thực phẩm VietGAP.</p><h3>5. Giáo viên bản ngữ dạy những gì?</h3><p>Giáo viên bản ngữ từ PLC Sydney dạy Speaking, Listening và các tiết CLIL (Content and Language Integrated Learning).</p>" \
  "$CID" 4 "2026-02-10"

create_article \
  "Chương trình học bổng tài năng năm 2026" \
  "hoc-bong-tai-nang-2026" \
  "Trường Tiểu học Lê Quý Đôn dành 20 suất học bổng toàn phần cho học sinh có năng khiếu đặc biệt." \
  "<h2>Học bổng tài năng 2026</h2><p>Nhằm phát hiện và bồi dưỡng tài năng trẻ, Trường Tiểu học Lê Quý Đôn dành 20 suất học bổng cho năm học 2026-2027:</p><h3>Các loại học bổng</h3><ul><li><strong>Học bổng Toàn phần (5 suất):</strong> Miễn 100% học phí — dành cho học sinh xuất sắc toàn diện</li><li><strong>Học bổng 75% (5 suất):</strong> Dành cho học sinh giỏi có năng khiếu đặc biệt</li><li><strong>Học bổng 50% (10 suất):</strong> Dành cho học sinh đạt giải cấp Quận trở lên</li></ul><h3>Điều kiện</h3><ul><li>Học sinh đang học lớp 1-4 tại bất kỳ trường nào</li><li>Có thành tích học tập tốt (xếp loại Tốt trở lên)</li><li>Đạt giải trong các cuộc thi cấp Quận/Thành phố</li><li>Vượt qua bài đánh giá năng lực của trường</li></ul>" \
  "$CID" 5 "2026-03-10"

create_article \
  "Phụ huynh chia sẻ lý do chọn Lê Quý Đôn" \
  "phu-huynh-chia-se-ly-do-chon-truong" \
  "Lắng nghe chia sẻ chân thật từ 5 phụ huynh về lý do họ tin tưởng gửi gắm con em tại Trường Tiểu học Lê Quý Đôn." \
  "<h2>Vì sao chọn Lê Quý Đôn?</h2><p>5 phụ huynh chia sẻ lý do chọn Trường Tiểu học Lê Quý Đôn:</p><h3>Chị Nguyễn Thu Hương — Lớp 3A2</h3><p><em>\"Tôi chọn Lê Quý Đôn vì chương trình Tiếng Anh. Con trai tôi sau 2 năm đã tự tin giao tiếp với giáo viên nước ngoài.\"</em></p><h3>Anh Trần Minh Đức — Lớp 5A1</h3><p><em>\"Điều tôi ấn tượng nhất là sự minh bạch. Mọi thông tin về con đều được cập nhật trên app, từ bữa ăn đến kết quả học tập.\"</em></p><h3>Chị Lê Thị Mai — Lớp 1A3</h3><p><em>\"Con gái tôi từ nhút nhát đã trở nên tự tin sau 1 tháng. Các cô rất kiên nhẫn và yêu thương học sinh.\"</em></p><h3>Anh Phạm Văn Hùng — Lớp 4A2</h3><p><em>\"Bể bơi và chương trình thể thao là yếu tố quyết định. Con trai tôi khỏe mạnh hẳn từ khi học bơi tại trường.\"</em></p><h3>Chị Đỗ Thị Lan — Lớp 2A1</h3><p><em>\"Tôi yên tâm vì bữa ăn. Menu thay đổi liên tục, con ăn ngon miệng và tăng cân tốt.\"</em></p>" \
  "$CID" 6 "2026-03-20"

# ─── CATEGORY: DOI SONG HOC DUONG ───
CID="${CAT_IDS[5]}"

create_article \
  "Thực đơn dinh dưỡng tháng 4/2026" \
  "thuc-don-dinh-duong-thang-4-2026" \
  "Thực đơn dinh dưỡng học đường tháng 4/2026 với 4 tuần menu không trùng lặp, đảm bảo cân bằng dinh dưỡng." \
  "<h2>Thực đơn tháng 4/2026</h2><p>Bữa ăn học đường tại Trường Tiểu học Lê Quý Đôn được thiết kế bởi chuyên gia dinh dưỡng, đảm bảo đủ nhóm chất cho sự phát triển của trẻ:</p><h3>Nguyên tắc</h3><ul><li>Menu 4 tuần không trùng lặp</li><li>Đủ 4 nhóm chất: tinh bột, protein, chất béo, vitamin</li><li>Năng lượng: 600-700 kcal/bữa chính</li><li>Nguồn thực phẩm VietGAP, kiểm tra hàng ngày</li></ul><h3>Ví dụ menu 1 tuần</h3><ul><li><strong>Thứ 2:</strong> Cơm + Thịt kho trứng cút + Canh bí đỏ + Sữa chua</li><li><strong>Thứ 3:</strong> Cơm + Cá hồi sốt cam + Rau muống xào + Trái cây</li><li><strong>Thứ 4:</strong> Phở bò + Nem rán + Nước ép dưa hấu</li><li><strong>Thứ 5:</strong> Cơm + Gà teriyaki + Súp kem nấm + Bánh flan</li><li><strong>Thứ 6:</strong> Cơm + Bò xào rau cải + Canh chua tôm + Chè đậu</li></ul>" \
  "$CID" 0 "2026-04-01"

create_article \
  "Y tế học đường — Chăm sóc sức khỏe toàn diện" \
  "y-te-hoc-duong-cham-soc-suc-khoe" \
  "Phòng y tế trường với 2 y tá thường trực, trang thiết bị đầy đủ, phục vụ sức khỏe học sinh 24/5." \
  "<h2>Phòng y tế học đường</h2><p>Phòng y tế Trường Tiểu học Lê Quý Đôn hoạt động từ 7:00 đến 17:30 hàng ngày với 2 y tá có chứng chỉ hành nghề:</p><h3>Dịch vụ y tế</h3><ul><li>Sơ cứu các trường hợp tai nạn nhẹ</li><li>Theo dõi sức khỏe học sinh có bệnh mãn tính</li><li>Quản lý thuốc cho học sinh cần uống thuốc theo giờ</li><li>Tư vấn dinh dưỡng cho phụ huynh</li><li>Kiểm tra sức khỏe định kỳ mỗi quý</li></ul><h3>Trang thiết bị</h3><ul><li>Giường nghỉ, tủ thuốc đầy đủ</li><li>Máy đo huyết áp, nhiệt kế điện tử</li><li>Bộ sơ cứu chuyên nghiệp</li><li>Hệ thống hồ sơ sức khỏe điện tử</li></ul><p>Trong trường hợp khẩn cấp, trường phối hợp với Bệnh viện Đa khoa Mỹ Đình (cách 2km) để chuyển viện nhanh chóng.</p>" \
  "$CID" 1 "2025-09-05"

create_article \
  "Chế độ xe đưa đón học sinh an toàn" \
  "che-do-xe-dua-don-an-toan" \
  "10 tuyến xe buýt phủ các quận nội thành, có GPS tracking, camera giám sát và bảo mẫu đi kèm." \
  "<h2>Xe đưa đón an toàn</h2><p>Trường Tiểu học Lê Quý Đôn vận hành 10 tuyến xe buýt đưa đón học sinh:</p><h3>An toàn</h3><ul><li>Xe 29-45 chỗ, đạt tiêu chuẩn an toàn ĐKVN</li><li>GPS tracking — phụ huynh theo dõi qua app</li><li>Camera giám sát 360 độ trong xe</li><li>Mỗi xe có 1 bảo mẫu đi kèm</li><li>Tài xế được đào tạo lái xe an toàn cho trẻ em</li></ul><h3>Tuyến đường</h3><p>Phủ các quận: Nam Từ Liêm, Bắc Từ Liêm, Cầu Giấy, Thanh Xuân, Hà Đông, Đống Đa, Ba Đình, Hoàng Mai, Long Biên, Hai Bà Trưng.</p><p>Lịch xe: Sáng đón 6:30-7:15, chiều trả 16:45-17:30. Phụ huynh nhận thông báo khi xe đến điểm đón/trả.</p>" \
  "$CID" 2 "2025-10-10"

create_article \
  "Cơ sở vật chất hiện đại tại khuôn viên 6000m²" \
  "co-so-vat-chat-hien-dai-6000m2" \
  "Tham quan cơ sở vật chất hiện đại với phòng học thông minh, Lab STEM, bể bơi, sân bóng và thư viện." \
  "<h2>Khuôn viên 6000m² hiện đại</h2><p>Trường Tiểu học Lê Quý Đôn tọa lạc tại KĐT Mỹ Đình, quận Nam Từ Liêm với khuôn viên 6000m²:</p><h3>Cơ sở vật chất</h3><ul><li><strong>30 phòng học thông minh:</strong> Bảng tương tác, điều hòa, đèn LED bảo vệ mắt</li><li><strong>Phòng Lab STEM:</strong> 120m² với thiết bị Robotics, máy in 3D</li><li><strong>Bể bơi:</strong> 25m x 12.5m, nước ấm, hệ thống lọc ion bạc</li><li><strong>Sân bóng cỏ nhân tạo:</strong> Sân bóng đá mini 5 người</li><li><strong>Thư viện:</strong> 200m², 15.000+ cuốn sách, khu đọc yên tĩnh</li><li><strong>Nhà ăn:</strong> 500 chỗ, bếp một chiều đạt chuẩn ATTP</li><li><strong>Phòng âm nhạc + phòng múa:</strong> Cách âm, gương tường</li><li><strong>Khu vui chơi ngoài trời:</strong> Cầu trượt, xích đu, leo trèo an toàn</li></ul>" \
  "$CID" 3 "2025-08-01"

create_article \
  "Chương trình chăm sóc tâm lý học đường" \
  "chuong-trinh-cham-soc-tam-ly-hoc-duong" \
  "Trường có chuyên gia tâm lý thường trực, hỗ trợ học sinh xử lý stress, khó khăn trong học tập và mối quan hệ." \
  "<h2>Tâm lý học đường</h2><p>Trường Tiểu học Lê Quý Đôn có phòng tư vấn tâm lý với 1 chuyên gia tâm lý trẻ em (ThS. Tâm lý học) thường trực:</p><h3>Dịch vụ</h3><ul><li>Tư vấn cá nhân cho học sinh gặp khó khăn</li><li>Đánh giá phát triển tâm lý định kỳ</li><li>Hỗ trợ học sinh hòa nhập (chuyển trường, chuyển cấp)</li><li>Workshop cho phụ huynh về nuôi dạy con</li><li>Đào tạo giáo viên về tâm lý lứa tuổi</li></ul><h3>Phương pháp</h3><p>Sử dụng liệu pháp chơi (Play Therapy), nghệ thuật trị liệu (Art Therapy) phù hợp với lứa tuổi tiểu học. Mỗi trường hợp được lập hồ sơ theo dõi riêng, bảo mật tuyệt đối.</p><p>Trong năm 2025, phòng tâm lý đã hỗ trợ thành công 45 trường hợp, chủ yếu về lo âu thi cử và giao tiếp xã hội.</p>" \
  "$CID" 4 "2025-11-20"

create_article \
  "An ninh trường học — Hệ thống bảo vệ đa lớp" \
  "an-ninh-truong-hoc-bao-ve-da-lop" \
  "Hệ thống an ninh đa lớp với camera AI, cổng từ, bảo vệ 24/7 và quy trình đón trả nghiêm ngặt." \
  "<h2>An ninh trường học</h2><p>An toàn của học sinh là ưu tiên số 1. Trường Tiểu học Lê Quý Đôn triển khai hệ thống an ninh đa lớp:</p><h3>Hệ thống kỹ thuật</h3><ul><li>64 camera AI giám sát 24/7, phát hiện hành vi bất thường</li><li>Cổng từ nhận diện thẻ học sinh</li><li>Hàng rào an ninh quanh khuôn viên</li><li>Hệ thống báo cháy tự động liên kết Công an quận</li></ul><h3>Nhân sự</h3><ul><li>4 nhân viên bảo vệ chuyên nghiệp, trực 24/7</li><li>Bảo mẫu tại cổng trường giờ đón trả</li></ul><h3>Quy trình đón trả</h3><ul><li>Phụ huynh quét mã QR tại cổng</li><li>Chỉ người được ủy quyền mới nhận trẻ</li><li>Trường hợp người lạ đến đón: gọi xác nhận phụ huynh</li></ul>" \
  "$CID" 5 "2025-09-15"

create_article \
  "Hoạt động bán trú — Một ngày của học sinh Lê Quý Đôn" \
  "hoat-dong-ban-tru-mot-ngay" \
  "Lịch sinh hoạt bán trú từ 7:15 đến 17:00 với các hoạt động học tập, vui chơi, nghỉ trưa và ngoại khóa." \
  "<h2>Một ngày tại Lê Quý Đôn</h2><h3>Lịch sinh hoạt</h3><ul><li><strong>7:15 — 7:30:</strong> Đón học sinh, thể dục sáng</li><li><strong>7:30 — 8:00:</strong> Ăn sáng tại trường</li><li><strong>8:00 — 11:15:</strong> 4 tiết học buổi sáng</li><li><strong>11:15 — 11:30:</strong> Bữa phụ (sữa/trái cây)</li><li><strong>11:30 — 12:00:</strong> Ăn trưa</li><li><strong>12:00 — 13:30:</strong> Nghỉ trưa (phòng nghỉ có giường)</li><li><strong>13:30 — 15:30:</strong> 2-3 tiết học buổi chiều</li><li><strong>15:30 — 15:45:</strong> Bữa phụ chiều</li><li><strong>15:45 — 16:45:</strong> CLB ngoại khóa / Tự học có giáo viên</li><li><strong>16:45 — 17:00:</strong> Trả học sinh / Lên xe đưa về</li></ul><p>Phụ huynh đón muộn (sau 17:00) có dịch vụ trông giữ đến 18:00 với phí bổ sung.</p>" \
  "$CID" 6 "2025-08-25"

create_article \
  "Đồng phục học sinh Lê Quý Đôn — Phong cách và thoải mái" \
  "dong-phuc-hoc-sinh-phong-cach" \
  "Bộ đồng phục mới thiết kế năm 2025 với chất liệu thoáng mát, phù hợp khí hậu Việt Nam." \
  "<h2>Đồng phục học sinh</h2><p>Bộ đồng phục Trường Tiểu học Lê Quý Đôn được thiết kế lại năm 2025 với phong cách trẻ trung, hiện đại:</p><h3>Các bộ đồng phục</h3><ul><li><strong>Đồng phục hàng ngày:</strong> Áo polo trắng + quần/váy xanh navy — chất liệu cotton organic thoáng mát</li><li><strong>Đồng phục lễ:</strong> Sơ mi trắng + vest xanh + cà vạt/nơ đỏ</li><li><strong>Đồng phục thể thao:</strong> Áo thun + quần short — chất liệu thể thao thoáng khí</li><li><strong>Áo khoác mùa đông:</strong> Áo khoác lông cừu xanh navy có logo trường</li></ul><p>Đồng phục được bán tại trường đầu năm học. Phụ huynh có thể đặt thêm qua ứng dụng LQD Connect.</p>" \
  "$CID" 7 "2025-07-15"

create_article \
  "Phòng chống dịch bệnh mùa đông xuân" \
  "phong-chong-dich-benh-mua-dong-xuan" \
  "Các biện pháp phòng chống dịch bệnh trong mùa đông xuân: vệ sinh phòng học, khử khuẩn và theo dõi sức khỏe." \
  "<h2>Phòng chống dịch bệnh</h2><p>Mùa đông xuân là thời điểm các bệnh hô hấp, tay chân miệng dễ bùng phát. Trường Tiểu học Lê Quý Đôn triển khai các biện pháp:</p><h3>Phòng ngừa</h3><ul><li>Khử khuẩn phòng học, nhà ăn mỗi ngày bằng dung dịch chuyên dụng</li><li>Rửa tay sát khuẩn trước và sau bữa ăn</li><li>Đo thân nhiệt học sinh khi đến trường</li><li>Tăng cường thông khí phòng học</li><li>Phun thuốc diệt muỗi định kỳ 2 tuần/lần</li></ul><h3>Khi có ca bệnh</h3><ul><li>Cách ly tạm thời tại phòng y tế</li><li>Thông báo ngay cho phụ huynh</li><li>Khử khuẩn toàn bộ phòng học</li><li>Theo dõi học sinh cùng lớp 14 ngày</li></ul><p>Phụ huynh cho con nghỉ ở nhà khi có triệu chứng ho, sốt và thông báo cho giáo viên chủ nhiệm.</p>" \
  "$CID" 8 "2025-12-05"

create_article \
  "Câu lạc bộ Bữa trưa vui vẻ" \
  "clb-bua-trua-vui-ve" \
  "Hoạt động 'Bữa trưa vui vẻ' giúp học sinh ăn ngon miệng hơn qua trò chơi, âm nhạc và trang trí bàn ăn." \
  "<h2>Bữa trưa vui vẻ</h2><p>Để khuyến khích học sinh ăn ngon miệng và đầy đủ dinh dưỡng, Trường Tiểu học Lê Quý Đôn tổ chức CLB \"Bữa trưa vui vẻ\":</p><h3>Hoạt động</h3><ul><li>Nhạc nhẹ nhàng trong giờ ăn</li><li>Trang trí bàn ăn theo chủ đề mỗi tuần</li><li>\"Ngôi sao ăn ngoan\" — khen thưởng học sinh ăn hết suất</li><li>\"Thứ Sáu khám phá\" — thử món ăn mới mỗi tuần</li><li>Học sinh tự phục vụ (lớp 3-5) rèn kỹ năng tự lập</li></ul><p>Từ khi triển khai, tỷ lệ học sinh ăn hết suất tăng từ 65% lên 85%. Đặc biệt, nhiều em trước đây biếng ăn nay đã chủ động ăn thêm rau và canh.</p>" \
  "$CID" 9 "2026-01-20"

echo -e "\n\nDone! Tao $ART_COUNT articles."
if [ -n "$ERRORS" ]; then
  echo -e "\nErrors:$ERRORS"
fi

# ============================================
# SEED EVENTS
# ============================================
echo -e "\n[4/6] Tao events..."
EVT_COUNT=0

create_event() {
  local title="$1"
  local desc="$2"
  local img="${SCHOOL_IMGS[$((RANDOM % IMG_COUNT))]}"
  local start="$3"
  local end="$4"
  local loc="$5"
  local status="$6"

  local json=$(cat <<ENDJSON
{
  "title": "$title",
  "description": "$desc",
  "imageUrl": "$img",
  "startDate": "${start}T08:00:00.000Z",
  "endDate": "${end}T17:00:00.000Z",
  "location": "$loc",
  "status": "$status"
}
ENDJSON
)

  local res=$(curl -s -X POST "$BASE_URL/events" -H "$AUTH" -H "$CT" -d "$json")
  local success=$(echo "$res" | grep -o '"success":true')
  if [ -n "$success" ]; then
    echo -n "."
    EVT_COUNT=$((EVT_COUNT + 1))
  else
    echo -e "\n  WARN: $title -> $(echo "$res" | head -c 150)"
  fi
}

create_event "Ngày hội Tuyển sinh Open Day" "Trải nghiệm môi trường học tập tại Trường Tiểu học Lê Quý Đôn" "2026-04-12" "2026-04-12" "Trường Tiểu học Lê Quý Đôn" "upcoming"
create_event "Ngày hội Văn hóa các dân tộc" "54 gian hàng đại diện 54 dân tộc Việt Nam" "2026-04-19" "2026-04-19" "Sân trường" "upcoming"
create_event "Tổng kết năm học 2025-2026" "Lễ tổng kết và trao phần thưởng" "2026-05-25" "2026-05-25" "Hội trường" "upcoming"
create_event "Summer Camp 2026" "Trại hè 3 tuần với STEM, thể thao, nghệ thuật" "2026-06-15" "2026-07-05" "Trường Tiểu học Lê Quý Đôn" "upcoming"
create_event "Ngày hội Thể thao 2026" "Điền kinh, bóng đá, bơi lội, trò chơi dân gian" "2026-03-20" "2026-03-20" "Sân vận động trường" "past"
create_event "Festival Khoa học 2026" "50+ dự án STEM sáng tạo của học sinh" "2026-02-25" "2026-02-25" "Hội trường + Sân trường" "past"

echo -e "\nDone! Tao $EVT_COUNT events."

# ============================================
# SEED ADMISSION POSTS
# ============================================
echo -e "\n[5/6] Tao admission posts..."
ADM_COUNT=0

create_admission() {
  local title="$1"
  local slug="$2"
  local content="$3"
  local img="${SCHOOL_IMGS[$((RANDOM % IMG_COUNT))]}"

  local json=$(cat <<ENDJSON
{
  "title": "$title",
  "slug": "$slug",
  "content": "$content",
  "thumbnailUrl": "$img",
  "status": "published",
  "publishedAt": "2026-02-01T08:00:00.000Z"
}
ENDJSON
)

  local res=$(curl -s -X POST "$BASE_URL/admissions/posts" -H "$AUTH" -H "$CT" -d "$json")
  local success=$(echo "$res" | grep -o '"success":true')
  if [ -n "$success" ]; then
    echo -n "."
    ADM_COUNT=$((ADM_COUNT + 1))
  else
    echo -e "\n  WARN: $slug -> $(echo "$res" | head -c 150)"
  fi
}

create_admission "Hướng dẫn tuyển sinh lớp 1" "huong-dan-tuyen-sinh-lop-1" "<h2>Tuyển sinh lớp 1</h2><p>Hướng dẫn chi tiết quy trình tuyển sinh lớp 1 tại Trường Tiểu học Lê Quý Đôn năm học 2026-2027.</p><ul><li>Đối tượng: Trẻ sinh năm 2020</li><li>Chỉ tiêu: 175 học sinh</li><li>Hồ sơ: Nộp từ 01/3 đến 30/6/2026</li></ul>"
create_admission "Chính sách ưu đãi tuyển sinh" "chinh-sach-uu-dai-tuyen-sinh" "<h2>Ưu đãi tuyển sinh</h2><p>Các chính sách ưu đãi dành cho phụ huynh đăng ký sớm và gia đình có nhiều con học tại trường.</p><ul><li>Đăng ký sớm: giảm 20% học phí kỳ 1</li><li>Anh chị em ruột: giảm 10%</li></ul>"
create_admission "Chương trình học tại Lê Quý Đôn" "chuong-trinh-hoc-le-quy-don" "<h2>Chương trình Quốc gia nâng cao</h2><p>Chương trình học tại Trường Tiểu học Lê Quý Đôn kết hợp chuẩn Quốc gia với Tiếng Anh tăng cường và STEM.</p>"

echo -e "\nDone! Tao $ADM_COUNT admission posts."

# ============================================
# SEED FAQs
# ============================================
echo -e "\n[6/6] Tao FAQs..."
FAQ_COUNT=0

create_faq() {
  local q="$1"
  local a="$2"
  local order="$3"

  local json=$(cat <<ENDJSON
{
  "question": "$q",
  "answer": "$a",
  "displayOrder": $order,
  "isVisible": true
}
ENDJSON
)

  local res=$(curl -s -X POST "$BASE_URL/admissions/faq" -H "$AUTH" -H "$CT" -d "$json")
  local success=$(echo "$res" | grep -o '"success":true')
  if [ -n "$success" ]; then
    echo -n "."
    FAQ_COUNT=$((FAQ_COUNT + 1))
  else
    echo -e "\n  WARN: FAQ $order -> $(echo "$res" | head -c 150)"
  fi
}

create_faq "Trường có nhận học sinh chuyển cấp không?" "Có. Nhà trường nhận xét tuyển học sinh từ lớp 2-5 khi còn chỉ tiêu. Học sinh cần qua bài đánh giá năng lực phù hợp với khối lớp đăng ký." 1
create_faq "Chương trình học có khác trường công không?" "Trường dạy chương trình Quốc gia nâng cao — đầy đủ nội dung Bộ GD&ĐT quy định, bổ sung Tiếng Anh tăng cường (8 tiết/tuần), STEM, Robotics và Kỹ năng sống." 2
create_faq "Xe đưa đón hoạt động như thế nào?" "Trường có 10 tuyến xe buýt phủ các quận nội thành. Mỗi xe có GPS tracking, camera giám sát và bảo mẫu đi kèm. Phụ huynh theo dõi vị trí xe qua ứng dụng LQD Connect." 3
create_faq "Bữa ăn của học sinh được chuẩn bị ra sao?" "Mỗi ngày 1 bữa chính + 2 bữa phụ. Menu 4 tuần không trùng lặp, nguồn thực phẩm VietGAP. Bếp một chiều đạt chuẩn ATTP, kiểm tra mẫu lưu 24h." 4
create_faq "Học phí là bao nhiêu?" "Học phí từ 8.5 triệu/tháng (10 tháng/năm), bao gồm học phí, Tiếng Anh tăng cường, STEM và bữa ăn chính. Chưa bao gồm xe đưa đón và CLB ngoại khóa tự chọn." 5
create_faq "Trường có chương trình học bổng không?" "Có. Mỗi năm trường dành 20 suất học bổng (5 toàn phần, 5 giảm 75%, 10 giảm 50%) cho học sinh có thành tích xuất sắc và năng khiếu đặc biệt." 6
create_faq "Giáo viên bản ngữ dạy những gì?" "Giáo viên bản ngữ từ PLC Sydney dạy Speaking, Listening và CLIL. Mỗi tuần học sinh có 4 tiết với giáo viên bản ngữ." 7
create_faq "Trường có phòng tâm lý không?" "Có. Trường có 1 chuyên gia tâm lý trẻ em (ThS. Tâm lý học) thường trực, hỗ trợ tư vấn cá nhân và Workshop cho phụ huynh." 8

echo -e "\nDone! Tao $FAQ_COUNT FAQs."

echo -e "\n=== HOAN TAT SEED DATA ==="
echo "Articles: $ART_COUNT"
echo "Events: $EVT_COUNT"
echo "Admission posts: $ADM_COUNT"
echo "FAQs: $FAQ_COUNT"
