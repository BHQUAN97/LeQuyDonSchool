# LeQuyDon — Tài liệu Luồng Nghiệp Vụ Toàn Diện

> Trường Tiểu học Lê Quý Đôn — Hệ thống Quản lý Nội dung (CMS)
> Stack: Next.js 14 + NestJS 10 + MySQL 8.0 + Redis 7 + Cloudflare R2
> Cập nhật: 2026-04-16

---

## Mục lục

1. [Xác thực & Phân quyền](#1-xác-thực--phân-quyền)
2. [Quản lý Người dùng](#2-quản-lý-người-dùng)
3. [Quản lý Bài viết](#3-quản-lý-bài-viết)
4. [Quản lý Danh mục](#4-quản-lý-danh-mục)
5. [Quản lý Trang tĩnh](#5-quản-lý-trang-tĩnh)
6. [Quản lý Media](#6-quản-lý-media)
7. [Liên hệ (Contact Form)](#7-liên-hệ-contact-form)
8. [Sự kiện](#8-sự-kiện)
9. [Tuyển sinh](#9-tuyển-sinh)
10. [Menu điều hướng](#10-menu-điều-hướng)
11. [Tìm kiếm](#11-tìm-kiếm)
12. [Cài đặt & Trang chủ](#12-cài-đặt--trang-chủ)
13. [Nhật ký & Audit](#13-nhật-ký--audit)
14. [Phân tích truy cập](#14-phân-tích-truy-cập)
15. [Hiển thị công khai (Public)](#15-hiển-thị-công-khai-public)

---

## 1. Xác thực & Phân quyền

### Summary
Hệ thống xác thực JWT 2 lớp (access token + refresh token) bảo vệ toàn bộ admin panel. Chỉ admin (SUPER_ADMIN, EDITOR) mới có tài khoản — không có đăng ký công khai. Rate limiting chống brute-force, token rotation chống token theft.

### Workflow

```
┌─────────────┐     POST /api/auth/login      ┌──────────┐
│  Admin User  │ ──────────────────────────────▶│ Backend  │
│  (Browser)   │  { email, password }           │  Auth    │
└──────┬───────┘                                └────┬─────┘
       │                                             │
       │  ◄── { accessToken, user }                  │ 1. Check rate limit (5/IP/30min)
       │  ◄── Set-Cookie: refreshToken (httpOnly)    │ 2. Verify password (bcrypt)
       │                                             │ 3. Check user status = ACTIVE
       ▼                                             │ 4. Generate JWT (15min)
┌─────────────┐                                      │ 5. Generate refresh token (7 ngày)
│  AuthContext │  Lưu accessToken trong memory        │ 6. Hash & lưu refresh token vào DB
│  (Frontend)  │  Auto-refresh khi 401               │ 7. Log login action + IP
└──────┬───────┘                                     │
       │                                             │
       │  GET /api/auth/refresh                      │
       │  (Cookie: refreshToken) ───────────────────▶│
       │  ◄── { new accessToken }                    │ Token rotation:
       │  ◄── Set-Cookie: new refreshToken           │ - Xóa token cũ
       │                                             │ - Tạo token mới
       │  POST /api/auth/logout                      │ - Detect token theft
       │ ───────────────────────────────────────────▶│   → xóa TẤT CẢ sessions
       │  ◄── Clear cookie + invalidate all tokens   │
       │                                             │
       │  PUT /api/auth/change-password              │
       │  { oldPassword, newPassword } ─────────────▶│ Verify old → hash new
       │  ◄── Success + invalidate all refresh tokens│   → force re-login
       ▼                                             ▼
```

### Chi tiết giải pháp

**Rate Limiting (chống brute-force):**
- 5 lần thất bại/IP trong 30 phút → khóa IP 30 phút
- 20 lần thất bại/email trong 60 phút → khóa email 60 phút
- Ghi log mọi login attempt (thành công/thất bại) kèm IP, timestamp

**Token Security:**
- Access token: JWT, 15 phút, lưu trong memory (không localStorage)
- Refresh token: random string, 7 ngày, httpOnly cookie (chống XSS)
- Refresh token hash bằng bcrypt trước khi lưu DB
- Token rotation: mỗi lần refresh → xóa cũ, tạo mới
- Token theft detection: nếu token không khớp nhưng có records → xóa TẤT CẢ sessions

**Frontend middleware (`middleware.ts`):**
- Mọi route `/admin/*` kiểm tra cookie `refreshToken`
- Không có cookie → redirect `/admin/login?from={originalPath}`
- Route `/admin/login` được bypass

**Roles & Guards:**
| Role | Quyền |
|------|-------|
| `SUPER_ADMIN` | Toàn quyền: CRUD tất cả, quản lý user, xóa dữ liệu, settings |
| `EDITOR` | Tạo/sửa nội dung (articles, pages, media), xem contacts |

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| POST | `/api/auth/login` | Public | Đăng nhập |
| POST | `/api/auth/refresh` | Cookie | Refresh token |
| POST | `/api/auth/logout` | JWT | Đăng xuất |
| GET | `/api/auth/me` | JWT | Thông tin user hiện tại |
| PUT | `/api/auth/change-password` | JWT | Đổi mật khẩu |

---

## 2. Quản lý Người dùng

### Summary
SUPER_ADMIN quản lý tài khoản admin. Hỗ trợ tạo/sửa/xóa mềm tài khoản, phân quyền role, lọc/tìm kiếm. Bảo vệ: không thể xóa/vô hiệu hóa SUPER_ADMIN cuối cùng.

### Workflow

```
┌───────────────┐                        ┌──────────────┐
│  Super Admin   │                        │   Backend    │
│  (Dashboard)   │                        │   Users API  │
└───────┬────────┘                        └──────┬───────┘
        │                                        │
        │ GET /api/users?page=1&search=...       │
        │ ──────────────────────────────────────▶ │ Phân trang, tìm kiếm, lọc role/status
        │ ◄── { data: users[], pagination }      │
        │                                        │
        │ POST /api/users                        │
        │ { email, full_name, password, role }   │
        │ ──────────────────────────────────────▶ │ 1. Check email unique
        │ ◄── { data: newUser }                  │ 2. Hash password (bcrypt 10)
        │                                        │ 3. Gán role (default: EDITOR)
        │ PUT /api/users/:id                     │
        │ { full_name, role, status }            │
        │ ──────────────────────────────────────▶ │ Check: không vô hiệu hóa
        │ ◄── { data: updatedUser }              │   Super Admin cuối cùng
        │                                        │
        │ DELETE /api/users/:id                  │
        │ ──────────────────────────────────────▶ │ Soft delete (set deleted_at)
        │ ◄── Success                            │ Check: không xóa SA cuối cùng
        ▼                                        ▼
```

### Chi tiết giải pháp

**Tạo user:**
- Kiểm tra email unique (trừ đã soft-delete)
- Password hash bcrypt salt 10 rounds
- Password yêu cầu: ≥8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số
- Ghi `created_by` = ID user hiện tại

**Bảo vệ Super Admin cuối cùng:**
- Trước khi deactivate/đổi role/xóa → đếm số SUPER_ADMIN active
- Nếu chỉ còn 1 → reject action

**Soft delete:**
- Set `deleted_at = NOW()` thay vì xóa thật
- Mọi query lọc `WHERE deleted_at IS NULL`

**Lọc & Sắp xếp:**
- Search: tìm trong `full_name` + `email`
- Filter: `role` (super_admin, editor), `status` (active, inactive)
- Sort: created_at, updated_at, full_name, email, last_login_at

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/api/users` | SUPER_ADMIN | Danh sách (phân trang) |
| GET | `/api/users/:id` | SUPER_ADMIN | Chi tiết |
| POST | `/api/users` | SUPER_ADMIN | Tạo mới |
| PUT | `/api/users/:id` | SUPER_ADMIN | Cập nhật |
| DELETE | `/api/users/:id` | SUPER_ADMIN | Xóa mềm |

---

## 3. Quản lý Bài viết

### Summary
CMS core — quản lý tin tức, hoạt động, bài viết với đầy đủ tính năng: soạn thảo rich text (Tiptap), SEO, phân loại danh mục, quản lý trạng thái xuất bản. Public hiển thị bài đã xuất bản, tự động đếm lượt xem.

### Workflow

```
┌──────────────┐                              ┌──────────────┐
│   Editor /    │                              │   Backend    │
│  Super Admin  │                              │ Articles API │
└──────┬────────┘                              └──────┬───────┘
       │                                              │
       │  === TẠO BÀI VIẾT ===                       │
       │                                              │
       │  GET /api/categories?tree=true               │
       │ ───────────────────────────────────────────▶  │ Lấy danh mục cho dropdown
       │ ◄── categories tree                          │
       │                                              │
       │  Nhập: title, content (Tiptap editor),       │
       │  excerpt, category, thumbnail, SEO fields    │
       │                                              │
       │  POST /api/articles                          │
       │  { title, slug, content, excerpt,            │
       │    categoryId, thumbnailUrl, status,         │
       │    seoTitle, seoDescription, publishedAt }   │
       │ ───────────────────────────────────────────▶  │ 1. Auto-generate slug từ title
       │ ◄── { data: article }                        │    (bỏ dấu tiếng Việt)
       │                                              │ 2. Nếu status=PUBLISHED
       │                                              │    → set published_at = NOW()
       │  === DANH SÁCH & LỌC ===                     │ 3. Ghi created_by
       │                                              │
       │  GET /api/articles?status=draft&search=...   │
       │ ───────────────────────────────────────────▶  │ Admin: mọi status
       │ ◄── { data[], pagination }                   │
       │                                              │
       │  GET /api/articles/public?category=hoc-tap   │
       │ ───────────────────────────────────────────▶  │ Public: chỉ PUBLISHED
       │ ◄── { data[], pagination }                   │
       │                                              │
       │  === XEM BÀI (PUBLIC) ===                    │
       │                                              │
       │  GET /api/articles/slug/:slug                │
       │ ───────────────────────────────────────────▶  │ 1. Trả bài viết
       │ ◄── { data: article }                        │ 2. Tăng view_count (fire & forget)
       │                                              │
       │  === SỬA / XÓA ===                           │
       │                                              │
       │  PUT /api/articles/:id                       │
       │ ───────────────────────────────────────────▶  │ Cập nhật + ghi updated_by
       │                                              │
       │  DELETE /api/articles/:id                    │
       │ ───────────────────────────────────────────▶  │ Soft delete (SUPER_ADMIN only)
       ▼                                              ▼
```

### Chi tiết giải pháp

**Trạng thái bài viết:**
```
DRAFT ──────▶ PUBLISHED ──────▶ HIDDEN
  ▲               │                │
  └───────────────┘                │
  └────────────────────────────────┘
```
- `DRAFT`: Bản nháp, chỉ admin thấy
- `PUBLISHED`: Đã xuất bản, public có thể xem
- `HIDDEN`: Ẩn khỏi public nhưng không xóa

**Auto-slug:**
- Tự tạo từ title: `"Hoạt động ngoại khóa"` → `"hoat-dong-ngoai-khoa"`
- Loại bỏ dấu tiếng Việt
- Có thể chỉnh sửa thủ công
- Đảm bảo unique

**Rich Text Editor (Tiptap):**
- 17 nút toolbar: Bold, Italic, Underline, Strikethrough, H2-H4, Lists, Blockquote, Code, Links, Images, Alignment, Undo/Redo
- Keyboard shortcuts
- Sticky toolbar khi scroll
- Output: HTML

**SEO Fields:**
- `seo_title`: max 60 ký tự (fallback: title)
- `seo_description`: max 160 ký tự (fallback: excerpt)
- OpenGraph + Twitter Card metadata tự động

**Đếm lượt xem:**
- Khi truy cập `/api/articles/slug/:slug` → view_count++
- Fire-and-forget: lỗi không ảnh hưởng response

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/api/articles` | Editor+ | Danh sách admin (mọi status) |
| GET | `/api/articles/public` | Public | Danh sách public (PUBLISHED) |
| GET | `/api/articles/slug/:slug` | Public | Chi tiết theo slug |
| GET | `/api/articles/:id` | Editor+ | Chi tiết theo ID (admin) |
| POST | `/api/articles` | Editor+ | Tạo bài viết |
| PUT | `/api/articles/:id` | Editor+ | Cập nhật |
| DELETE | `/api/articles/:id` | SUPER_ADMIN | Xóa mềm |

---

## 4. Quản lý Danh mục

### Summary
Danh mục phân cấp (parent-child) để tổ chức bài viết. Hỗ trợ cấu trúc cây, sắp xếp thủ công, auto-slug. Bảo vệ: không xóa danh mục có danh mục con.

### Workflow

```
┌──────────────┐                              ┌──────────────┐
│    Admin      │                              │   Backend    │
│  Categories   │                              │ Categories   │
└──────┬────────┘                              └──────┬───────┘
       │                                              │
       │  GET /api/categories?tree=true               │
       │ ───────────────────────────────────────────▶  │ Trả cấu trúc cây lồng nhau
       │ ◄── [{ id, name, children: [...] }]          │
       │                                              │
       │  POST /api/categories                        │
       │  { name, parentId?, displayOrder, status }   │
       │ ───────────────────────────────────────────▶  │ 1. Auto-slug từ name
       │ ◄── { data: category }                       │ 2. Check slug unique
       │                                              │ 3. Validate parentId tồn tại
       │                                              │ 4. Check circular reference
       │  DELETE /api/categories/:id                  │
       │ ───────────────────────────────────────────▶  │ 1. Check không có children
       │                                              │ 2. Set articles.category_id = NULL
       │                                              │ 3. Soft delete
       ▼                                              ▼
```

### Chi tiết giải pháp

**Cấu trúc cây mặc định:**
```
├── Sự kiện (su-kien)
├── Ngoại khóa (ngoai-khoa)
├── Hoạt động học tập (hoc-tap)
├── Tuyển sinh (tuyen-sinh)
└── Thực đơn (thuc-don)
```

**Chống circular reference:** Trước khi set parent_id → kiểm tra danh mục đích không phải descendant của danh mục hiện tại.

**Khi xóa danh mục:** Tất cả articles thuộc danh mục → `category_id = NULL` (orphan, không bị mất).

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/api/categories` | Public | Danh sách (flat hoặc tree) |
| GET | `/api/categories/:id` | Public | Chi tiết + children |
| POST | `/api/categories` | Editor+ | Tạo mới |
| PUT | `/api/categories/:id` | Editor+ | Cập nhật |
| DELETE | `/api/categories/:id` | SUPER_ADMIN | Xóa mềm |

---

## 5. Quản lý Trang tĩnh

### Summary
Trang nội dung tĩnh (giới thiệu trường, chương trình, dịch vụ). Hỗ trợ đường dẫn lồng nhau (nested slug), rich text content, SEO metadata.

### Workflow

```
┌──────────────┐                              ┌──────────────┐
│    Admin      │                              │   Backend    │
│    Pages      │                              │  Pages API   │
└──────┬────────┘                              └──────┬───────┘
       │                                              │
       │  POST /api/pages                             │
       │  { title, slug, content, status,             │
       │    seoTitle, seoDescription }                │
       │ ───────────────────────────────────────────▶  │ 1. Auto-slug (conflict → -2, -3)
       │ ◄── { data: page }                           │ 2. Set status
       │                                              │
       │  === PUBLIC ACCESS ===                        │
       │                                              │
       │  GET /api/pages/slug/:slug                   │
       │ ───────────────────────────────────────────▶  │ Chỉ PUBLISHED
       │                                              │
       │  GET /api/pages/by-path?path=tong-quan/...   │
       │ ───────────────────────────────────────────▶  │ Hỗ trợ nested path
       ▼                                              ▼
```

### Chi tiết giải pháp

**Nested Path:** URL `/tong-quan/tam-nhin-su-menh` → API query `path=tong-quan/tam-nhin-su-menh` → tìm page với slug tương ứng.

**Auto-slug với conflict resolution:** Nếu slug `"gioi-thieu"` đã tồn tại → tự động thêm `-2`, `-3`...

**Danh sách trang tĩnh (seeded):**
| Đường dẫn | Nội dung |
|-----------|----------|
| `/tong-quan/tam-nhin-su-menh` | Tầm nhìn & Sứ mệnh |
| `/tong-quan/cot-moc-phat-trien` | Cột mốc phát triển |
| `/tong-quan/gia-dinh-doners` | Gia đình Doners |
| `/tong-quan/ngoi-nha-le-quy-don` | Ngôi nhà LQĐ |
| `/tong-quan/sac-mau-le-quy-don` | Sắc màu LQĐ |
| `/chuong-trinh/quoc-gia-nang-cao` | Chương trình quốc gia nâng cao |
| `/chuong-trinh/tieng-anh-tang-cuong` | Tiếng Anh tăng cường |
| `/chuong-trinh/the-chat-nghe-thuat` | Thể chất & Nghệ thuật |
| `/chuong-trinh/ky-nang-song` | Kỹ năng sống |
| `/dich-vu-hoc-duong/y-te-hoc-duong` | Y tế học đường |

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/api/pages` | Editor+ | Danh sách admin |
| GET | `/api/pages/slug/:slug` | Public | Theo slug |
| GET | `/api/pages/by-path` | Public | Theo nested path |
| GET | `/api/pages/:id` | Editor+ | Chi tiết admin |
| POST | `/api/pages` | Editor+ | Tạo mới |
| PUT | `/api/pages/:id` | Editor+ | Cập nhật |
| DELETE | `/api/pages/:id` | SUPER_ADMIN | Xóa mềm |

---

## 6. Quản lý Media

### Summary
Upload và quản lý file (ảnh, tài liệu). Hỗ trợ 2 storage backend: Cloudflare R2 (production) hoặc local (development). Upload đơn/hàng loạt, tìm kiếm, lọc theo loại file.

### Workflow

```
┌──────────────┐                              ┌──────────────┐
│    Admin      │                              │   Backend    │
│   Media Mgr   │                              │  Media API   │
└──────┬────────┘                              └──────┬───────┘
       │                                              │
       │  === UPLOAD (Single) ===                     │
       │                                              │
       │  POST /api/media/upload                      │
       │  (FormData: file) ─────────────────────────▶  │
       │                                              │ 1. Multer nhận file → temp
       │                                              │ 2. Tạo ULID filename
       │                                              │ 3. IF R2 configured:
       │                                              │      Upload lên Cloudflare R2
       │                                              │    ELSE:
       │                                              │      Copy vào /uploads/
       │                                              │ 4. Xóa temp file
       │ ◄── { data: { id, url, filename, size } }   │ 5. Lưu metadata vào DB
       │                                              │
       │  === UPLOAD (Batch, max 20) ===              │
       │                                              │
       │  POST /api/media/upload-multiple             │
       │  (FormData: files[]) ──────────────────────▶  │ Xử lý song song
       │ ◄── { data: media[] }                        │
       │                                              │
       │  === FILE SERVING ===                        │
       │                                              │
       │  GET /uploads/:filename                      │
       │ ───────────────────────────────────────────▶  │ Cache 30 ngày
       │                                              │ Image → inline display
       │                                              │ Non-image → force download
       │                                              │ X-Content-Type-Options: nosniff
       ▼                                              ▼
```

### Chi tiết giải pháp

**Storage Strategy:**
```
R2_ACCOUNT_ID + R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY có?
    ├── CÓ → Upload lên Cloudflare R2 (S3-compatible)
    └── KHÔNG → Lưu local /uploads/ directory
```

**Security:**
- MIME type validation: chỉ cho phép image types (jpeg, png, gif, webp) hiển thị inline
- Non-image files: `Content-Disposition: attachment` (force download)
- `X-Content-Type-Options: nosniff` chống MIME sniffing attack
- File serving: cache 30 ngày

**ImagePicker Component (Frontend):**
- Dùng trong article/page forms để chọn ảnh
- Grid view + modal detail
- Upload trực tiếp từ picker
- Copy URL để dùng trong editor

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/api/media` | Editor+ | Danh sách (phân trang, tìm kiếm, lọc MIME) |
| GET | `/api/media/:id` | Editor+ | Chi tiết metadata |
| POST | `/api/media/upload` | Editor+ | Upload 1 file |
| POST | `/api/media/upload-multiple` | Editor+ | Upload nhiều file (max 20) |
| PUT | `/api/media/:id` | Editor+ | Sửa metadata (alt_text, original_name) |
| DELETE | `/api/media/:id` | SUPER_ADMIN | Xóa mềm |

---

## 7. Liên hệ (Contact Form)

### Summary
Form liên hệ công khai cho phụ huynh/khách thăm gửi thông tin. Admin quản lý trạng thái xử lý. Rate limit 3 requests/phút/IP chống spam.

### Workflow

```
┌──────────────┐     POST /api/contacts       ┌──────────────┐
│  Phụ huynh   │  { full_name, email,         │   Backend    │
│  (Public)    │    phone, content }           │ Contacts API │
│              │ ───────────────────────────▶   │              │
│              │ ◄── "Cảm ơn bạn đã liên hệ!" │ Rate limit: 3/min/IP
└──────────────┘                               │ Status = NEW
                                               └──────┬───────┘
                                                      │
┌──────────────┐                                      │
│    Admin      │  GET /api/contacts?status=new       │
│  (Dashboard)  │ ───────────────────────────────────▶ │
│              │ ◄── danh sách contacts               │
│              │                                      │
│              │  Xem chi tiết contact                │
│              │  PUT /api/contacts/:id/status         │
│              │  { status: "read" }                  │
│              │ ───────────────────────────────────▶  │
│              │                                      │
│              │  Trả lời qua email/phone             │
│              │  PUT /api/contacts/:id/status         │
│              │  { status: "replied" }               │
│              │ ───────────────────────────────────▶  │
└──────────────┘                                      ▼
```

### Chi tiết giải pháp

**Trạng thái xử lý:**
```
NEW (Mới) ──▶ READ (Đã đọc) ──▶ REPLIED (Đã trả lời)
  🔵 blue        🟡 yellow         🟢 green
```

**Validation (Frontend - ContactForm.tsx):**
| Field | Yêu cầu |
|-------|---------|
| `full_name` | Bắt buộc, 2-100 ký tự |
| `email` | Bắt buộc, regex validation |
| `phone` | Bắt buộc, 8-15 ký tự, chỉ số/+/- |
| `content` | Bắt buộc, 10-2000 ký tự |

**Admin UI:**
- Tab lọc: Tất cả | Mới | Đã đọc | Đã trả lời
- Modal xem chi tiết với nội dung đầy đủ
- Nút đổi trạng thái nhanh
- Tìm kiếm theo tên, email, SĐT

---

## 8. Sự kiện

### Summary
Quản lý sự kiện trường học với ngày bắt đầu/kết thúc, địa điểm, link. Public hiển thị sự kiện sắp tới và đang diễn ra.

### Workflow

```
┌──────────────┐                              ┌──────────────┐
│    Admin      │                              │   Backend    │
│   Events      │                              │  Events API  │
└──────┬────────┘                              └──────┬───────┘
       │                                              │
       │  POST /api/events                            │
       │  { title, description, image_url,            │
       │    start_date, end_date, location,           │
       │    link_url, status }                        │
       │ ───────────────────────────────────────────▶  │
       │ ◄── { data: event }                          │
       │                                              │
       │  === PUBLIC ===                               │
       │                                              │
       │  GET /api/events/upcoming                    │
       │ ───────────────────────────────────────────▶  │ Status: UPCOMING + ONGOING
       │ ◄── events sorted by start_date ASC          │
       ▼                                              ▼
```

### Chi tiết giải pháp

**Trạng thái sự kiện:**
- `UPCOMING`: Sắp diễn ra
- `ONGOING`: Đang diễn ra
- `PAST`: Đã kết thúc

**Hiển thị trên Homepage:** Featured event có thể được chọn trong Homepage Customizer để hiển thị nổi bật.

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/api/events` | Editor+ | Danh sách admin |
| GET | `/api/events/upcoming` | Public | Sự kiện sắp tới |
| GET | `/api/events/:id` | Editor+ | Chi tiết |
| POST | `/api/events` | Editor+ | Tạo mới |
| PUT | `/api/events/:id` | Editor+ | Cập nhật |
| DELETE | `/api/events/:id` | SUPER_ADMIN | Xóa mềm |

---

## 9. Tuyển sinh

### Summary
Module tuyển sinh gồm 3 phần: bài đăng thông tin tuyển sinh, câu hỏi thường gặp (FAQ), và form đăng ký nhập học. Phụ huynh xem thông tin + đăng ký online, admin quản lý toàn bộ quy trình.

### Workflow

```
┌───────────────────────────────────────────────────────────┐
│                    TUYỂN SINH MODULE                       │
├──────────────┬──────────────────┬─────────────────────────┤
│  Bài đăng    │      FAQ         │    Đăng ký nhập học     │
│  (Posts)     │  (Questions)     │   (Registrations)       │
└──────┬───────┴────────┬─────────┴────────────┬────────────┘
       │                │                      │
       ▼                ▼                      ▼

=== BÀI ĐĂNG TUYỂN SINH ===

Admin ──▶ CRUD bài đăng (title, slug, content, thumbnail, status)
Public ──▶ GET /api/admissions/posts/public → danh sách PUBLISHED

=== CÂU HỎI THƯỜNG GẶP ===

Admin ──▶ CRUD FAQ (question, answer, display_order, is_visible)
        Toggle is_visible để ẩn/hiện
Public ──▶ GET /api/admissions/faq → visible=true, sorted by display_order
        Hiển thị dạng Accordion (AccordionFAQ component)

=== ĐĂNG KÝ NHẬP HỌC ===

Phụ huynh ──▶ POST /api/admissions/registrations (Public, rate limit 3/min)
              { full_name, phone, email, grade, is_club_member, note }
              Status = NEW

Admin ──▶ GET /api/admissions/registrations (SUPER_ADMIN only)
          Xem danh sách + cập nhật trạng thái
          PUT /api/admissions/registrations/:id/status
```

### Chi tiết giải pháp

**Trạng thái đăng ký:**
```
NEW (Mới) ──▶ CONTACTED (Đã liên hệ) ──▶ COMPLETED (Hoàn thành)
```

**CLB Ngôi nhà mơ ước:** Checkbox `is_club_member` đánh dấu đăng ký qua CLB → hiển thị badge đặc biệt trong admin list.

**FAQ Accordion (Frontend):**
- Component `AccordionFAQ.tsx` hiển thị dạng collapsible
- Sắp xếp theo `display_order`
- Admin toggle `is_visible` qua switch

**Admin UI — 3 tabs:**
1. **Bài đăng**: CRUD với modal form (title, slug, content, thumbnail, status)
2. **FAQ**: CRUD với toggle visibility
3. **Đăng ký**: Read-only list + status dropdown (NEW → CONTACTED → COMPLETED)

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/api/admissions/posts` | Editor+ | Danh sách admin |
| GET | `/api/admissions/posts/public` | Public | Danh sách public |
| POST | `/api/admissions/posts` | Editor+ | Tạo bài đăng |
| PUT | `/api/admissions/posts/:id` | Editor+ | Cập nhật |
| DELETE | `/api/admissions/posts/:id` | SUPER_ADMIN | Xóa mềm |
| GET | `/api/admissions/faq` | Public | FAQ (visible) |
| GET | `/api/admissions/faq/all` | Editor+ | Tất cả FAQ |
| POST | `/api/admissions/faq` | SUPER_ADMIN | Tạo FAQ |
| PUT | `/api/admissions/faq/:id` | SUPER_ADMIN | Sửa FAQ |
| DELETE | `/api/admissions/faq/:id` | SUPER_ADMIN | Xóa FAQ |
| POST | `/api/admissions/registrations` | Public | Gửi đăng ký |
| GET | `/api/admissions/registrations` | SUPER_ADMIN | Danh sách đăng ký |
| PUT | `/api/admissions/registrations/:id/status` | SUPER_ADMIN | Đổi trạng thái |

---

## 10. Menu điều hướng

### Summary
Quản lý menu chính website dạng cây phân cấp. SUPER_ADMIN có thể thay đổi cấu trúc menu, ẩn/hiện items, sắp xếp thứ tự. Hỗ trợ cả link nội bộ và external.

### Workflow

```
┌──────────────┐                              ┌──────────────┐
│  Super Admin  │                              │   Backend    │
│  Navigation   │                              │ Navigation   │
└──────┬────────┘                              └──────┬───────┘
       │                                              │
       │  GET /api/navigation/menu/all                │
       │ ───────────────────────────────────────────▶  │ Trả toàn bộ tree (cả ẩn)
       │ ◄── menuTree[]                               │
       │                                              │
       │  Kéo thả sắp xếp, thêm/xóa items           │
       │                                              │
       │  PUT /api/navigation/menu                    │
       │  { items: [...entire tree...] }              │
       │ ───────────────────────────────────────────▶  │ Strategy: REPLACE ALL
       │                                              │ 1. Soft delete tất cả cũ
       │                                              │ 2. Insert toàn bộ tree mới
       │                                              │ 3. Flatten recursive children
       │ ◄── { data: newTree }                        │ 4. Trả tree mới
       │                                              │
       │  === PUBLIC ===                               │
       │                                              │
       │  GET /api/navigation/menu                    │
       │ ───────────────────────────────────────────▶  │ Chỉ is_visible = true
       │ ◄── publicMenuTree[]                         │ Sorted by display_order
       ▼                                              ▼
```

### Chi tiết giải pháp

**Cấu trúc menu mặc định:**
```
├── Tổng quan
│   ├── Tầm nhìn & Sứ mệnh
│   ├── Cột mốc phát triển
│   ├── Gia đình Doners
│   ├── Ngôi nhà Lê Quý Đôn
│   └── Sắc màu Lê Quý Đôn
├── Chương trình
│   ├── Quốc gia nâng cao
│   ├── Tiếng Anh tăng cường
│   ├── Thể chất & Nghệ thuật
│   └── Kỹ năng sống
├── Dịch vụ học đường
│   ├── Thực đơn
│   └── Y tế học đường
├── Tuyển sinh
│   ├── Thông tin tuyển sinh
│   ├── CLB Ngôi nhà mơ ước
│   └── Câu hỏi thường gặp
├── Tin tức
│   ├── Sự kiện
│   ├── Ngoại khóa
│   └── Hoạt động học tập
└── Liên hệ
```

**Save strategy — Replace All:** Toàn bộ tree cũ bị soft-delete, tree mới được insert. Đảm bảo consistency, không có orphan items.

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/api/navigation/menu` | Public | Menu public (visible) |
| GET | `/api/navigation/menu/all` | SUPER_ADMIN | Toàn bộ menu |
| PUT | `/api/navigation/menu` | SUPER_ADMIN | Lưu toàn bộ tree |

---

## 11. Tìm kiếm

### Summary
Tìm kiếm toàn cục across 4 loại nội dung: bài viết, trang, sự kiện, tuyển sinh. Real-time với debounce, kết quả gộp và sắp xếp theo relevance.

### Workflow

```
┌──────────────┐                              ┌──────────────┐
│   Visitor     │                              │   Backend    │
│  (Search bar) │                              │  Search API  │
└──────┬────────┘                              └──────┬───────┘
       │                                              │
       │  Gõ từ khóa (debounce 300ms)                │
       │  Minimum 2 ký tự                            │
       │                                              │
       │  GET /api/search?q=keyword&page=1&limit=12  │
       │ ───────────────────────────────────────────▶  │
       │                                              │ 1. Query song song:
       │                                              │    - Articles (PUBLISHED)
       │                                              │    - Pages (PUBLISHED)
       │                                              │    - Events (non-deleted)
       │                                              │    - Admission Posts (PUBLISHED)
       │                                              │ 2. Merge kết quả
       │                                              │ 3. Sort: title match → newest
       │                                              │ 4. Strip HTML tags
       │                                              │ 5. Truncate desc → 150 chars
       │ ◄── { data: results[], pagination }          │
       │                                              │
       │  Click kết quả → điều hướng                  │
       │  article → /tin-tuc/{slug}                   │
       │  page → /{slug}                              │
       │  event → /su-kien                            │
       │  admission → /tuyen-sinh/{slug}              │
       ▼                                              ▼
```

### Chi tiết giải pháp

**Rate limit:** 20 requests/phút/IP

**Quick suggestions (Frontend):** Hiển thị gợi ý phổ biến: "Tuyển sinh", "Học phí", "Lịch học", "Thực đơn", "Ngoại khóa"

**Kết quả format:**
```typescript
{
  id: string,
  type: 'article' | 'page' | 'event' | 'admission',
  title: string,
  description: string,  // HTML stripped, max 150 chars
  slug: string,
  thumbnail_url?: string,
  category?: string,
  date: string  // dd/mm/yyyy
}
```

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/api/search` | Public | Tìm kiếm (q, type, page, limit) |

---

## 12. Cài đặt & Trang chủ

### Summary
2 phần: (1) Settings chung — thông tin trường, SEO, social, contact. (2) Homepage Customizer — tùy chỉnh layout, hero slides, testimonials, theme trang chủ. Hỗ trợ preview trước khi publish.

### Workflow — Settings

```
┌──────────────┐                              ┌──────────────┐
│  Super Admin  │                              │   Backend    │
│   Settings    │                              │ Settings API │
└──────┬────────┘                              └──────┬───────┘
       │                                              │
       │  GET /api/settings                           │
       │ ───────────────────────────────────────────▶  │ Trả tất cả settings theo group
       │ ◄── { general: {...}, seo: {...},            │
       │       social: {...}, contact: {...} }        │
       │                                              │
       │  PUT /api/settings                           │
       │  { items: [{ key, value, group }] }          │
       │ ───────────────────────────────────────────▶  │ Upsert: tạo nếu chưa có,
       │ ◄── Success                                  │   cập nhật nếu đã tồn tại
       │                                              │
       │  === PUBLIC ===                               │
       │                                              │
       │  GET /api/settings/public                    │
       │ ───────────────────────────────────────────▶  │ Chỉ trả settings public:
       │ ◄── { school_name, slogan, logo_url,        │ tên trường, logo, contact,
       │       phone, email, address, social... }     │ social media, SEO defaults
       ▼                                              ▼
```

### Workflow — Homepage Customizer

```
┌──────────────┐                              ┌──────────────┐
│  Super Admin  │  5 tabs:                     │   Backend    │
│  Homepage     │  1. Nội dung (Content)       │ Settings API │
│  Customizer   │  2. Bố cục (Layout)         │              │
│              │  3. Layout chi tiết           │              │
│              │  4. Giao diện (Theme)        │              │
│              │  5. Preview                   │              │
└──────┬────────┘                              └──────┬───────┘
       │                                              │
       │  === TAB 1: NỘI DUNG ===                    │
       │  Hero Slides:                                │
       │  - Thêm/xóa/sắp xếp slides                 │
       │  - Mỗi slide: title, subtitle, desc,        │
       │    CTA text, CTA link, image                 │
       │  Testimonials:                                │
       │  - Thêm/xóa testimonials                     │
       │  - Mỗi item: name, role, content, avatar     │
       │  Stats: số học sinh, giáo viên, năm          │
       │  Featured Event: chọn từ events list         │
       │                                              │
       │  === TAB 2: BỐ CỤC ===                      │
       │  Kéo thả reorder blocks                      │
       │  Toggle visibility (eye icon)                │
       │  Blocks: hero, features, news,               │
       │          testimonials, stats, event...       │
       │                                              │
       │  === TAB 3: LAYOUT VARIANTS ===              │
       │  Chọn variant cho mỗi block                  │
       │  VD: hero-banner-v1, features-grid-v2        │
       │                                              │
       │  === TAB 4: THEME ===                        │
       │  Colors, fonts (ThemeEditor component)       │
       │                                              │
       │  === TAB 5: PREVIEW ===                      │
       │                                              │
       │  POST /api/settings/homepage/preview         │
       │ ───────────────────────────────────────────▶  │ Tạo preview token (1 giờ)
       │ ◄── { token: "abc123" }                      │
       │  Mở: /?preview=abc123                        │
       │                                              │
       │  PUT /api/settings/homepage                  │
       │  { blocks, theme, content }                  │
       │ ───────────────────────────────────────────▶  │ Validate: ≥1 visible block
       │ ◄── Success → LIVE                           │ Lưu dạng JSON
       ▼                                              ▼
```

### Chi tiết giải pháp

**Homepage Config (JSON):**
```typescript
{
  blocks: [
    { type: 'hero', variant: 'hero-banner-v1', visible: true, order: 0 },
    { type: 'features', variant: 'features-grid-v2', visible: true, order: 1 },
    { type: 'news', variant: 'news-list-v1', visible: true, order: 2 },
    // ...
  ],
  theme: { primaryColor, accentColor, fontFamily },
  content: { heroSlides, testimonials, stats, featuredEventId }
}
```

**Preview mode:** Token 1 giờ, truy cập qua `/?preview={token}`, hiển thị config chưa publish.

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/api/settings` | SUPER_ADMIN | Tất cả settings |
| GET | `/api/settings/public` | Public | Settings công khai |
| PUT | `/api/settings` | SUPER_ADMIN | Bulk upsert |
| GET | `/api/settings/homepage` | Public | Homepage config |
| PUT | `/api/settings/homepage` | SUPER_ADMIN | Cập nhật homepage |
| POST | `/api/settings/homepage/preview` | SUPER_ADMIN | Tạo preview token |
| GET | `/api/settings/homepage/preview/:token` | Public | Xem preview |

---

## 13. Nhật ký & Audit

### Summary
2 loại log: (1) Application logs — tự động ghi mọi HTTP request. (2) Admin action logs — ghi hành động CRUD của admin. Hỗ trợ lọc, tìm kiếm, xóa bulk.

### Workflow

```
┌──────────────┐                              ┌──────────────┐
│  Mọi request  │                              │   Backend    │
│  HTTP         │                              │  Interceptors│
└──────┬────────┘                              └──────┬───────┘
       │                                              │
       │  ═══ TỰ ĐỘNG GHI LOG ═══                    │
       │                                              │
       │  LoggingInterceptor                          │
       │  → Ghi: method, URL, status, duration,       │
       │    IP, user-agent                            │
       │  → Level: INFO (2xx), WARN (4xx), ERROR (5xx)│
       │                                              │
       │  AdminActionLogInterceptor                   │
       │  → Ghi: user, action type, entity,           │
       │    changes, IP                               │
       │  → Non-blocking (lỗi log không ảnh hưởng    │
       │    response)                                  │
       │                                              │
       │  ═══ XEM LOG (Admin) ═══                     │
       │                                              │
       │  GET /api/logs?level=ERROR&search=...        │
       │  GET /api/logs/stats → đếm theo level        │
       │  GET /api/logs/actions?type=DELETE            │
       │  GET /api/logs/actions/stats                  │
       │                                              │
       │  ═══ XÓA LOG ═══                             │
       │                                              │
       │  DELETE /api/logs/bulk { ids: [...] }        │ Max 500 IDs/request
       │  DELETE /api/logs/all?level=DEBUG             │ Xóa theo level
       ▼                                              ▼
```

### Chi tiết giải pháp

**Application Log Levels:**
| Level | Mô tả | Trigger |
|-------|--------|---------|
| `ERROR` | Lỗi server | HTTP 5xx |
| `WARN` | Client errors | HTTP 4xx |
| `INFO` | Requests thành công | HTTP 2xx |
| `DEBUG` | Debug info | Manual |

**Admin Action Types:**
| Action | Mô tả | Ví dụ |
|--------|--------|-------|
| CREATE | Tạo entity mới | Tạo bài viết, tạo user |
| UPDATE | Cập nhật entity | Sửa bài viết, đổi status |
| DELETE | Xóa entity | Xóa media, xóa contact |
| LOGIN | Đăng nhập thành công | Admin login |
| LOGOUT | Đăng xuất | Admin logout |
| UPLOAD | Upload file | Upload ảnh/tài liệu |

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/api/logs` | SUPER_ADMIN | Danh sách log (phân trang, lọc) |
| GET | `/api/logs/stats` | SUPER_ADMIN | Thống kê theo level |
| GET | `/api/logs/:id` | SUPER_ADMIN | Chi tiết log |
| DELETE | `/api/logs/bulk` | SUPER_ADMIN | Xóa nhiều (max 500) |
| DELETE | `/api/logs/all` | SUPER_ADMIN | Xóa tất cả (theo level) |
| GET | `/api/logs/actions` | SUPER_ADMIN | Danh sách admin actions |
| GET | `/api/logs/actions/stats` | SUPER_ADMIN | Thống kê actions |

---

## 14. Phân tích truy cập

### Summary
Theo dõi pageview, phân tích thiết bị, thống kê trang phổ biến. Tự động aggregate hàng ngày, purge dữ liệu raw sau 90 ngày.

### Workflow

```
┌──────────────┐                              ┌──────────────┐
│   Visitor     │                              │   Backend    │
│  (PageTracker │                              │ Analytics    │
│   component)  │                              │              │
└──────┬────────┘                              └──────┬───────┘
       │                                              │
       │  POST /api/analytics/pageview                │
       │  { path, referrer, userAgent }               │
       │ ───────────────────────────────────────────▶  │
       │                                              │ 1. Dedup: skip nếu cùng IP+path
       │                                              │    trong 30 giây
       │                                              │ 2. Detect device:
       │                                              │    MOBILE / TABLET / DESKTOP
       │                                              │ 3. Detect bot (regex crawlers)
       │                                              │ 4. Ghi vào page_view table
       │                                              │ (Fire & forget)
       │                                              │
       │  ═══ CRON JOBS ═══                           │
       │                                              │
       │  2:00 AM hàng ngày:                          │
       │    Aggregate hôm qua → page_view_daily       │
       │                                              │
       │  3:00 AM Chủ nhật:                           │
       │    Purge raw views > 90 ngày                 │
       │                                              │
       │  ═══ DASHBOARD (Admin) ═══                   │
       │                                              │
       │  GET /api/analytics/dashboard                │
       │ ───────────────────────────────────────────▶  │ Trả:
       │ ◄── {                                        │ - Total views, unique visitors
       │       totalViews, uniqueVisitors,            │ - Device breakdown
       │       deviceBreakdown: {                     │ - Daily trend
       │         mobile, tablet, desktop, bot         │ - Top 10 pages
       │       },                                     │
       │       dailyTrend: [...],                     │
       │       topPages: [...]                        │
       │     }                                        │
       ▼                                              ▼
```

### Chi tiết giải pháp

**Deduplication:** Cùng IP + cùng path trong 30 giây → bỏ qua (tránh đếm trùng khi reload).

**Device detection:** Phân tích User-Agent:
- `MOBILE`: iPhone, Android phone
- `TABLET`: iPad, Android tablet
- `DESKTOP`: Windows, Mac, Linux
- `BOT`: Googlebot, Bingbot, etc. (regex match)

**Data lifecycle:**
```
Raw (page_view) ──[2AM daily]──▶ Aggregated (page_view_daily)
       │
       └──[3AM Sunday]──▶ Purge > 90 ngày
```

**Rate limit:** 10 pageview/phút/IP

**API Endpoints:**
| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| POST | `/api/analytics/pageview` | Public | Ghi pageview |
| GET | `/api/analytics/dashboard` | SUPER_ADMIN | Dashboard thống kê |
| GET | `/api/analytics/pages` | SUPER_ADMIN | Thống kê theo trang |

---

## 15. Hiển thị công khai (Public)

### Summary
Frontend public phục vụ phụ huynh và khách thăm. Server-side rendered (SSR) cho SEO, cache response, responsive mobile-first. Bao gồm trang chủ tùy chỉnh, tin tức theo danh mục, trang tĩnh, tuyển sinh, liên hệ, tìm kiếm.

### Sitemap & Luồng truy cập

```
                        ┌─────────────────┐
                        │    TRANG CHỦ    │
                        │   / (Homepage)   │
                        └────────┬─────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
   ┌────▼─────┐           ┌─────▼──────┐          ┌──────▼─────┐
   │ Tổng quan │           │ Chương trình│          │ Dịch vụ    │
   │ /tong-quan│           │ /chuong-trinh│         │ /dich-vu   │
   └────┬──────┘           └─────┬───────┘          └──────┬─────┘
        │                        │                         │
   5 trang tĩnh            4 trang tĩnh            Thực đơn + Y tế
   (SSR, cache 5min)       (SSR, cache 5min)       (Articles + Pages)
        │                        │                         │
        │           ┌────────────┼────────────┐            │
        │           │            │            │            │
   ┌────▼───┐  ┌────▼───┐  ┌────▼───┐  ┌────▼───┐  ┌────▼───┐
   │Tuyển   │  │Tin tức  │  │Liên hệ │  │Tìm kiếm│  │[...slug]│
   │sinh    │  │/tin-tuc │  │/lien-he │  │/tim-kiem│  │Dynamic  │
   │/tuyen- │  │         │  │         │  │         │  │Pages    │
   │sinh    │  │         │  │         │  │         │  │         │
   └────┬───┘  └────┬────┘  └────┬────┘  └────┬────┘  └─────────┘
        │           │            │             │
   3 sub-pages  3 danh mục    Form +        Global
   + FAQ        (sự kiện,     Google Maps   search
   + Form ĐK   ngoại khóa,                 across
               học tập)                     4 entity types
```

### Chi tiết các trang

**Homepage `/`:**
- SSR, cache 60 giây
- Render dynamic blocks từ homepage config
- Hero slides auto-play 5 giây
- Feature cards "Chỉ có tại LQĐ"
- Testimonial slider
- Bài viết mới nhất (10 bài)
- Featured event
- Hỗ trợ preview mode (`/?preview=token`)

**Tin tức (3 danh mục):**
| Route | Danh mục | API |
|-------|---------|-----|
| `/tin-tuc/su-kien` | Sự kiện | `articles/public?category=su-kien` |
| `/tin-tuc/ngoai-khoa` | Ngoại khóa | `articles/public?category=ngoai-khoa` |
| `/tin-tuc/hoc-tap` | Học tập | `articles/public?category=hoc-tap` |
- 8 bài/trang, phân trang
- Sidebar: bài viết gần đây, danh mục phổ biến

**Chi tiết bài viết `/tin-tuc/:slug`:**
- SSR, tăng view_count
- Prose typography (Tailwind)
- Related posts
- SEO: OpenGraph + Twitter Card

**Trang tĩnh `/[...slug]`:**
- Catch-all route cho nested paths
- SSR, cache 5 phút
- Breadcrumb từ slug hierarchy

**Tuyển sinh:**
| Route | Nội dung |
|-------|---------|
| `/tuyen-sinh/thong-tin` | Bài đăng tuyển sinh (paginated) |
| `/tuyen-sinh/clb-ngoi-nha-mo-uoc` | Trang CLB + form đăng ký |
| `/tuyen-sinh/cau-hoi-thuong-gap` | FAQ Accordion |

**Liên hệ `/lien-he`:**
- Thông tin trường: địa chỉ, SĐT, email, Facebook
- Google Maps iframe
- Contact form (validated)

**Tìm kiếm `/tim-kiem`:**
- Client-side, debounce 300ms
- 12 kết quả/trang
- Gợi ý nhanh phổ biến

### Layout chung

**Header:** Logo + tên trường + Menu chính (6 mục + dropdown) + Sticky on scroll

**Footer:** 4 cột — Giới thiệu | Liên kết | Liên hệ | Fanpage + Copyright

**Floating Buttons:**
- Desktop: Fixed bottom-right (Phone, Messenger, Zalo, Form)
- Mobile: Fixed bottom navigation bar

**PageTracker:** Component tự động POST pageview analytics cho mọi trang.

---

## Tổng quan Kiến trúc

### Database Entities (18 bảng)

| Entity | Quan hệ | Soft Delete |
|--------|---------|-------------|
| User | — | Yes |
| Article | → Category (many-to-one) | Yes |
| Category | → Parent (self-ref) | Yes |
| Page | — | Yes |
| Media | — | Yes |
| Contact | — | Yes |
| Event | — | Yes |
| AdmissionPost | — | Yes |
| AdmissionFaq | — | Yes |
| AdmissionRegistration | — | Yes |
| NavigationMenu | → Parent (self-ref) | Yes |
| Setting | — | No |
| AppLog | — | No |
| AdminAction | — | No |
| RefreshToken | → User | No |
| LoginAttempt | — | No |
| PageView | — | No |
| PageViewDaily | — | No |

### Rate Limiting tổng hợp

| Endpoint | Limit | Scope |
|----------|-------|-------|
| Global | 100/min | IP |
| Login | 5/30min (block 30min) | IP |
| Login | 20/60min (block 60min) | Email |
| Auth refresh | 10/min | IP |
| Contact form | 3/min | IP |
| Registration form | 3/min | IP |
| Search | 20/min | IP |
| PageView | 10/min | IP |

### Response Format chuẩn

```json
{
  "success": true,
  "data": {},
  "message": "OK",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Deployment Architecture

```
                    Internet
                       │
                    ┌──▼──┐
                    │Nginx │  SSL termination
                    │:443  │  Reverse proxy
                    └──┬───┘
                       │
              ┌────────┼────────┐
              │                 │
         ┌────▼────┐      ┌────▼────┐
         │Frontend │      │Backend  │
         │Next.js  │      │NestJS   │
         │:3000    │ ────▶│:4000    │
         └─────────┘      └────┬────┘
                               │
                    ┌──────────┼──────────┐
                    │                     │
               ┌────▼────┐          ┌────▼────┐
               │ MySQL   │          │ Redis   │
               │ :3306   │          │ :6379   │
               └─────────┘          └─────────┘
                    │
               ┌────▼────┐
               │Cloudflare│
               │   R2     │  Media storage
               └──────────┘
```

### Security tổng hợp

| Layer | Giải pháp |
|-------|-----------|
| Password | bcrypt (salt 10 rounds) |
| Token | JWT 15min + refresh 7d + rotation + theft detection |
| XSS | httpOnly cookie, DOMPurify, Content-Security-Policy |
| MIME | X-Content-Type-Options: nosniff, force download non-image |
| Clickjacking | X-Frame-Options: SAMEORIGIN |
| CORS | Whitelist allowed origins |
| Rate Limit | IP-based + email-based per endpoint |
| Audit | Mọi admin action được log với IP |
| Data | Soft delete, no hard delete |
| Admin | Bảo vệ Super Admin cuối cùng |

---

> **Tài liệu này bao gồm toàn bộ 15 luồng nghiệp vụ chính của hệ thống LeQuyDon CMS.**
> Mỗi luồng gồm: Summary (tóm tắt), Workflow (sơ đồ luồng), Chi tiết giải pháp (API, logic, validation).
