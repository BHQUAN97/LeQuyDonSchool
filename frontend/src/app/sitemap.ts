import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://demo.remoteterminal.online';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface ApiItem {
  slug: string;
  updatedAt?: string;
}

/** Fetch slugs tu API, fallback [] neu loi */
async function fetchSlugs(endpoint: string): Promise<ApiItem[]> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    // Ho tro ca { data: [] } va { data: { items: [] } }
    return json.data?.items || json.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic content tu API
  const [articles, admissions, menus] = await Promise.all([
    fetchSlugs('/articles?status=published'),
    fetchSlugs('/admissions'),
    fetchSlugs('/menus'),
  ]);

  // Trang tinh — tat ca cac trang public
  const staticPages: MetadataRoute.Sitemap = [
    // Trang chu
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },

    // Tong quan
    { url: `${SITE_URL}/tong-quan/tam-nhin-su-menh`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tong-quan/cot-moc-phat-trien`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tong-quan/gia-dinh-doners`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tong-quan/ngoi-nha-le-quy-don`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tong-quan/sac-mau-le-quy-don`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // Chuong trinh giao duc
    { url: `${SITE_URL}/chuong-trinh/quoc-gia-nang-cao`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/chuong-trinh/tieng-anh-tang-cuong`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/chuong-trinh/the-chat-nghe-thuat`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/chuong-trinh/ky-nang-song`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // Dich vu hoc duong
    { url: `${SITE_URL}/dich-vu-hoc-duong/thuc-don`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/dich-vu-hoc-duong/y-te-hoc-duong`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // Tuyen sinh
    { url: `${SITE_URL}/tuyen-sinh/thong-tin`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/tuyen-sinh/clb-ngoi-nha-mo-uoc`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tuyen-sinh/cau-hoi-thuong-gap`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // Tin tuc (trang danh muc)
    { url: `${SITE_URL}/tin-tuc/su-kien`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/tin-tuc/ngoai-khoa`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/tin-tuc/hoc-tap`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },

    // Lien he
    { url: `${SITE_URL}/lien-he`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Trang dong — bai viet
  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/tin-tuc/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Trang dong — tuyen sinh chi tiet
  const admissionPages: MetadataRoute.Sitemap = admissions.map((a) => ({
    url: `${SITE_URL}/tuyen-sinh/thong-tin/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Trang dong — thuc don chi tiet
  const menuPages: MetadataRoute.Sitemap = menus.map((m) => ({
    url: `${SITE_URL}/dich-vu-hoc-duong/thuc-don/${m.slug}`,
    lastModified: m.updatedAt ? new Date(m.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages, ...admissionPages, ...menuPages];
}
