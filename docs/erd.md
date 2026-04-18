# LeQuyDon ERD

> Source of truth: `backend/src/modules/*/entities/*.entity.ts`. ERD la derived view, update cung commit khi sua entity. Ref: CROSS-0007

**Tong**: 19 entities, 14 modules
**Last sync**: 2026-04-18

> Quy uoc chung: tat ca entity extend `BaseEntity` (tru `RefreshToken`, `LoginAttempt`, `AppLog`, `AdminAction`, `PageView`, `PageViewDaily`, `Setting`) co cac truong: `id` (ULID PK), `created_at`, `updated_at`, `deleted_at` (soft delete). Cac truong `created_by` / `updated_by` la ULID tham chieu logic toi `users.id` (khong khai bao FK cung trong TypeORM).

---

## Module: users

```mermaid
erDiagram
    USER {
        char_26 id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        enum role
        enum status
    }
```

---

## Module: auth

```mermaid
erDiagram
    USER ||--o{ REFRESH_TOKEN : issues
    REFRESH_TOKEN {
        char_26 id PK
        char_26 user_id FK
        varchar token_hash
        timestamp expires_at
    }
    LOGIN_ATTEMPT {
        char_26 id PK
        varchar email
        varchar ip_address
        boolean success
        timestamp attempted_at
    }
    USER {
        char_26 id PK
        varchar email UK
    }
```

---

## Module: categories

```mermaid
erDiagram
    CATEGORY ||--o{ CATEGORY : "parent of"
    CATEGORY ||--o{ ARTICLE : classifies
    CATEGORY {
        char_26 id PK
        varchar name
        varchar slug UK
        char_26 parent_id FK
        enum status
    }
```

---

## Module: articles

```mermaid
erDiagram
    CATEGORY ||--o{ ARTICLE : classifies
    ARTICLE {
        char_26 id PK
        varchar title
        varchar slug UK
        char_26 category_id FK
        enum status
        timestamp published_at
    }
    CATEGORY {
        char_26 id PK
        varchar slug UK
    }
```

---

## Module: pages

```mermaid
erDiagram
    PAGE {
        char_26 id PK
        varchar title
        varchar slug UK
        longtext content
        enum status
    }
```

---

## Module: media

```mermaid
erDiagram
    MEDIA {
        char_26 id PK
        varchar filename
        varchar mime_type
        varchar url
        char_26 created_by
    }
```

---

## Module: events

```mermaid
erDiagram
    EVENT {
        char_26 id PK
        varchar title
        timestamp start_date
        timestamp end_date
        enum status
    }
```

---

## Module: contacts

```mermaid
erDiagram
    CONTACT {
        char_26 id PK
        varchar full_name
        varchar email
        text content
        enum status
    }
```

---

## Module: admissions

```mermaid
erDiagram
    ADMISSION_POST {
        char_26 id PK
        varchar title
        varchar slug UK
        enum status
        timestamp published_at
    }
    ADMISSION_REGISTRATION {
        char_26 id PK
        varchar full_name
        varchar phone
        varchar grade
        enum status
    }
    ADMISSION_FAQ {
        char_26 id PK
        varchar question
        text answer
        int display_order
    }
```

> Ghi chu: 3 entity nay khong co quan he FK truc tiep voi nhau. Post/Faq la noi dung cong khai, Registration la submission tu phu huynh.

---

## Module: navigation

```mermaid
erDiagram
    MENU_ITEM ||--o{ MENU_ITEM : "parent of"
    MENU_ITEM {
        char_26 id PK
        varchar label
        varchar url
        char_26 parent_id FK
        int display_order
        boolean is_visible
    }
```

---

## Module: menus (food menu — thuc don an uong)

```mermaid
erDiagram
    FOOD_MENU {
        char_26 id PK
        date date UK
        json breakfast
        json lunch
        json dinner
        enum status
    }
```

> Luu y: `food_menus` (thuc don bua an theo ngay) khac voi `menu_items` o module navigation (menu thanh dieu huong website).

---

## Module: settings

```mermaid
erDiagram
    SETTING {
        char_26 id PK
        varchar key UK
        text value
        varchar group
    }
```

---

## Module: logs

```mermaid
erDiagram
    USER ||--o{ ADMIN_ACTION : performs
    APP_LOG {
        char_26 id PK
        enum level
        varchar message
        varchar endpoint
        char_26 user_id
        json context
        timestamp created_at
    }
    ADMIN_ACTION {
        char_26 id PK
        enum action
        varchar entity_type
        char_26 entity_id
        char_26 user_id FK
        json changes
        timestamp created_at
    }
    USER {
        char_26 id PK
        varchar email UK
    }
```

> Ghi chu: `app_logs.user_id` la tham chieu logic (nullable, khong FK cung) — log van giu duoc khi user bi xoa.

---

## Module: analytics

```mermaid
erDiagram
    PAGE_VIEW {
        bigint id PK
        varchar page_path
        varchar visitor_ip
        enum device_type
        boolean is_bot
        timestamp viewed_at
    }
    PAGE_VIEW_DAILY {
        bigint id PK
        varchar page_path
        date view_date
        int total_views
        int unique_visitors
    }
```

> Aggregation: `page_view_daily` la rollup tu `page_views` theo (page_path, view_date) — unique constraint `uq_page_view_daily`. Khong FK truc tiep.
