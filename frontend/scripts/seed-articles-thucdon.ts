/**
 * Seed 8 bai viet danh muc "Thuc don" — thuc don tuan va CLB NNMU.
 * Chay qua seed-runner.ts hoac truc tiep: npx tsx scripts/seed-articles-thucdon.ts
 */

import { apiPost, apiGet, login } from './seed-helpers';

/** Tao HTML table thuc don cho 1 ngay */
function menuTable(rows: { label: string; content: string }[]): string {
  return `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
<thead><tr style="background:#2e7d32;color:#fff"><th style="width:20%">Bữa</th><th>Món ăn</th></tr></thead>
<tbody>
${rows.map((r) => `<tr><td><strong>${r.label}</strong></td><td>${r.content}</td></tr>`).join('\n')}
</tbody></table>`;
}

/** Thuc don tuan — 5 ngay (Thu 2 → Thu 6) */
function weeklyMenuHtml(days: { day: string; meals: { label: string; content: string }[] }[]): string {
  return days
    .map(
      (d) =>
        `<h3>${d.day}</h3>\n${menuTable(d.meals)}`
    )
    .join('\n\n');
}

// Noi dung thuc don thuc te truong tieu hoc Viet Nam
const ARTICLES = [
  {
    title: 'Thực đơn CLB Ngôi nhà mơ ước 11/4/2026',
    slug: 'thuc-don-clb-nnmu-11-4-2026',
    publishedAt: '2026-04-11T07:00:00',
    image: 'https://picsum.photos/seed/lqd-thucdon-1/800/500',
    content: `<p>Thực đơn bữa ăn CLB Ngôi nhà mơ ước ngày <strong>11/4/2026</strong> (Thứ Sáu):</p>
${menuTable([
  { label: 'Bữa sáng', content: 'Phở bò, sữa tươi' },
  { label: 'Bữa trưa — Món chính', content: 'Cá basa sốt cà chua' },
  { label: 'Bữa trưa — Món rau', content: 'Rau muống xào tỏi' },
  { label: 'Bữa trưa — Món canh', content: 'Canh chua cá lóc' },
  { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
  { label: 'Bữa chiều', content: 'Bánh flan, nước cam' },
  { label: 'Tráng miệng', content: 'Chuối tiêu' },
])}`,
  },
  {
    title: 'Thực đơn tuần 06/4 — 10/4/2026',
    slug: 'thuc-don-tuan-06-10-4-2026',
    publishedAt: '2026-04-06T07:00:00',
    image: 'https://picsum.photos/seed/lqd-thucdon-2/800/500',
    content: `<p>Thực đơn tuần từ <strong>06/4 — 10/4/2026</strong>:</p>
${weeklyMenuHtml([
  {
    day: 'Thứ Hai — 06/4',
    meals: [
      { label: 'Bữa sáng', content: 'Bún bò Huế, sữa chua' },
      { label: 'Bữa trưa — Món chính', content: 'Thịt gà kho gừng' },
      { label: 'Bữa trưa — Món rau', content: 'Su su luộc' },
      { label: 'Bữa trưa — Món canh', content: 'Canh bí đỏ nấu tôm' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Chè đậu xanh' },
      { label: 'Tráng miệng', content: 'Thanh long' },
    ],
  },
  {
    day: 'Thứ Ba — 07/4',
    meals: [
      { label: 'Bữa sáng', content: 'Cháo sườn, bánh mì' },
      { label: 'Bữa trưa — Món chính', content: 'Cá thu chiên giòn' },
      { label: 'Bữa trưa — Món rau', content: 'Rau cải xào nấm' },
      { label: 'Bữa trưa — Món canh', content: 'Canh rau ngót thịt băm' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Sữa đậu nành, bánh quy' },
      { label: 'Tráng miệng', content: 'Dưa hấu' },
    ],
  },
  {
    day: 'Thứ Tư — 08/4',
    meals: [
      { label: 'Bữa sáng', content: 'Mì Quảng, sữa tươi' },
      { label: 'Bữa trưa — Món chính', content: 'Sườn xào chua ngọt' },
      { label: 'Bữa trưa — Món rau', content: 'Bông cải xanh luộc' },
      { label: 'Bữa trưa — Món canh', content: 'Canh mồng tơi nấu cua' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Bánh bao, nước cam' },
      { label: 'Tráng miệng', content: 'Xoài cát' },
    ],
  },
  {
    day: 'Thứ Năm — 09/4',
    meals: [
      { label: 'Bữa sáng', content: 'Phở gà, sữa chua' },
      { label: 'Bữa trưa — Món chính', content: 'Thịt heo rang cháy cạnh' },
      { label: 'Bữa trưa — Món rau', content: 'Đậu que xào tỏi' },
      { label: 'Bữa trưa — Món canh', content: 'Canh bầu nấu tôm' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Chè bưởi' },
      { label: 'Tráng miệng', content: 'Ổi ruột đỏ' },
    ],
  },
  {
    day: 'Thứ Sáu — 10/4',
    meals: [
      { label: 'Bữa sáng', content: 'Bánh cuốn Thanh Trì, sữa tươi' },
      { label: 'Bữa trưa — Món chính', content: 'Tôm rim thịt' },
      { label: 'Bữa trưa — Món rau', content: 'Rau muống luộc' },
      { label: 'Bữa trưa — Món canh', content: 'Canh cải thảo nấu giò sống' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Bánh flan, nước ép dứa' },
      { label: 'Tráng miệng', content: 'Chuối tiêu' },
    ],
  },
])}`,
  },
  {
    title: 'Thực đơn CLB NNMU 04/4/2026',
    slug: 'thuc-don-clb-nnmu-04-4-2026',
    publishedAt: '2026-04-04T07:00:00',
    image: 'https://picsum.photos/seed/lqd-thucdon-3/800/500',
    content: `<p>Thực đơn bữa ăn CLB Ngôi nhà mơ ước ngày <strong>04/4/2026</strong> (Thứ Sáu):</p>
${menuTable([
  { label: 'Bữa sáng', content: 'Bún riêu cua, sữa tươi' },
  { label: 'Bữa trưa — Món chính', content: 'Gà rán giòn sốt mật ong' },
  { label: 'Bữa trưa — Món rau', content: 'Cải ngọt xào tỏi' },
  { label: 'Bữa trưa — Món canh', content: 'Canh bí xanh nấu xương' },
  { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
  { label: 'Bữa chiều', content: 'Xôi lạc, sữa đậu nành' },
  { label: 'Tráng miệng', content: 'Dưa hấu' },
])}`,
  },
  {
    title: 'Thực đơn tuần 30/3 — 03/4/2026',
    slug: 'thuc-don-tuan-30-3-03-4-2026',
    publishedAt: '2026-03-30T07:00:00',
    image: 'https://picsum.photos/seed/lqd-thucdon-4/800/500',
    content: `<p>Thực đơn tuần từ <strong>30/3 — 03/4/2026</strong>:</p>
${weeklyMenuHtml([
  {
    day: 'Thứ Hai — 30/3',
    meals: [
      { label: 'Bữa sáng', content: 'Xôi gấc, sữa chua' },
      { label: 'Bữa trưa — Món chính', content: 'Thịt bò xào ớt chuông' },
      { label: 'Bữa trưa — Món rau', content: 'Rau cải luộc' },
      { label: 'Bữa trưa — Món canh', content: 'Canh khoai mỡ nấu tôm' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Chè hạt sen' },
      { label: 'Tráng miệng', content: 'Cam sành' },
    ],
  },
  {
    day: 'Thứ Ba — 31/3',
    meals: [
      { label: 'Bữa sáng', content: 'Bánh mì pate, sữa tươi' },
      { label: 'Bữa trưa — Món chính', content: 'Cá hồi áp chảo sốt chanh dây' },
      { label: 'Bữa trưa — Món rau', content: 'Bắp cải xào trứng' },
      { label: 'Bữa trưa — Món canh', content: 'Canh rau đay nấu cua' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Bánh bông lan, nước cam' },
      { label: 'Tráng miệng', content: 'Thanh long' },
    ],
  },
  {
    day: 'Thứ Tư — 01/4',
    meals: [
      { label: 'Bữa sáng', content: 'Cháo lươn, bánh mì' },
      { label: 'Bữa trưa — Món chính', content: 'Đùi gà nướng mật ong' },
      { label: 'Bữa trưa — Món rau', content: 'Rau mồng tơi luộc' },
      { label: 'Bữa trưa — Món canh', content: 'Canh su hào nấu sườn' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Sữa chua nếp cẩm' },
      { label: 'Tráng miệng', content: 'Bưởi Diễn' },
    ],
  },
  {
    day: 'Thứ Năm — 02/4',
    meals: [
      { label: 'Bữa sáng', content: 'Phở bò, sữa tươi' },
      { label: 'Bữa trưa — Món chính', content: 'Tôm chiên xù' },
      { label: 'Bữa trưa — Món rau', content: 'Su su xào tỏi' },
      { label: 'Bữa trưa — Món canh', content: 'Canh chua cá lóc' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Bánh flan, nước ép bưởi' },
      { label: 'Tráng miệng', content: 'Xoài cát Hòa Lộc' },
    ],
  },
  {
    day: 'Thứ Sáu — 03/4',
    meals: [
      { label: 'Bữa sáng', content: 'Bún chả Hà Nội, sữa chua' },
      { label: 'Bữa trưa — Món chính', content: 'Cá basa chiên sả ớt' },
      { label: 'Bữa trưa — Món rau', content: 'Rau muống xào tỏi' },
      { label: 'Bữa trưa — Món canh', content: 'Canh bí đỏ nấu xương' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Chè đậu đen' },
      { label: 'Tráng miệng', content: 'Chuối tiêu' },
    ],
  },
])}`,
  },
  {
    title: 'Thực đơn CLB NNMU 28/3/2026',
    slug: 'thuc-don-clb-nnmu-28-3-2026',
    publishedAt: '2026-03-28T07:00:00',
    image: 'https://picsum.photos/seed/lqd-thucdon-5/800/500',
    content: `<p>Thực đơn bữa ăn CLB Ngôi nhà mơ ước ngày <strong>28/3/2026</strong> (Thứ Bảy):</p>
${menuTable([
  { label: 'Bữa sáng', content: 'Bánh cuốn nhân thịt, sữa tươi' },
  { label: 'Bữa trưa — Món chính', content: 'Sườn non rim tiêu' },
  { label: 'Bữa trưa — Món rau', content: 'Bông cải xanh xào bò' },
  { label: 'Bữa trưa — Món canh', content: 'Canh mướp nấu tôm' },
  { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
  { label: 'Bữa chiều', content: 'Bánh bao nhân thịt, nước cam' },
  { label: 'Tráng miệng', content: 'Ổi đào' },
])}`,
  },
  {
    title: 'Thực đơn tuần 23/3 — 27/3/2026',
    slug: 'thuc-don-tuan-23-27-3-2026',
    publishedAt: '2026-03-23T07:00:00',
    image: 'https://picsum.photos/seed/lqd-thucdon-6/800/500',
    content: `<p>Thực đơn tuần từ <strong>23/3 — 27/3/2026</strong>:</p>
${weeklyMenuHtml([
  {
    day: 'Thứ Hai — 23/3',
    meals: [
      { label: 'Bữa sáng', content: 'Miến gà, sữa chua' },
      { label: 'Bữa trưa — Món chính', content: 'Thịt kho tàu' },
      { label: 'Bữa trưa — Món rau', content: 'Rau cải xào nấm' },
      { label: 'Bữa trưa — Món canh', content: 'Canh bầu nấu tôm' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Chè bưởi' },
      { label: 'Tráng miệng', content: 'Dưa hấu' },
    ],
  },
  {
    day: 'Thứ Ba — 24/3',
    meals: [
      { label: 'Bữa sáng', content: 'Bún mọc, sữa tươi' },
      { label: 'Bữa trưa — Món chính', content: 'Cá diêu hồng chiên xù' },
      { label: 'Bữa trưa — Món rau', content: 'Đậu que luộc' },
      { label: 'Bữa trưa — Món canh', content: 'Canh rau ngót thịt băm' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Xôi vò, sữa đậu nành' },
      { label: 'Tráng miệng', content: 'Cam sành' },
    ],
  },
  {
    day: 'Thứ Tư — 25/3',
    meals: [
      { label: 'Bữa sáng', content: 'Phở gà, sữa chua' },
      { label: 'Bữa trưa — Món chính', content: 'Thịt heo sốt BBQ' },
      { label: 'Bữa trưa — Món rau', content: 'Rau dền luộc' },
      { label: 'Bữa trưa — Món canh', content: 'Canh bí xanh nấu xương' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Bánh quy, nước cam' },
      { label: 'Tráng miệng', content: 'Thanh long' },
    ],
  },
  {
    day: 'Thứ Năm — 26/3',
    meals: [
      { label: 'Bữa sáng', content: 'Cháo sườn, bánh mì' },
      { label: 'Bữa trưa — Món chính', content: 'Gà nướng sả' },
      { label: 'Bữa trưa — Món rau', content: 'Bắp cải luộc' },
      { label: 'Bữa trưa — Món canh', content: 'Canh cải ngọt nấu thịt' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Sữa chua trái cây' },
      { label: 'Tráng miệng', content: 'Ổi ruột đỏ' },
    ],
  },
  {
    day: 'Thứ Sáu — 27/3',
    meals: [
      { label: 'Bữa sáng', content: 'Bún bò Huế, sữa tươi' },
      { label: 'Bữa trưa — Món chính', content: 'Tôm rim thịt' },
      { label: 'Bữa trưa — Món rau', content: 'Rau muống luộc' },
      { label: 'Bữa trưa — Món canh', content: 'Canh chua cá lóc' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Bánh flan, nước ép dứa' },
      { label: 'Tráng miệng', content: 'Xoài cát' },
    ],
  },
])}`,
  },
  {
    title: 'Thực đơn CLB NNMU 21/3/2026',
    slug: 'thuc-don-clb-nnmu-21-3-2026',
    publishedAt: '2026-03-21T07:00:00',
    image: 'https://picsum.photos/seed/lqd-thucdon-7/800/500',
    content: `<p>Thực đơn bữa ăn CLB Ngôi nhà mơ ước ngày <strong>21/3/2026</strong> (Thứ Bảy):</p>
${menuTable([
  { label: 'Bữa sáng', content: 'Xôi xéo, sữa chua' },
  { label: 'Bữa trưa — Món chính', content: 'Cánh gà chiên nước mắm' },
  { label: 'Bữa trưa — Món rau', content: 'Rau cải ngọt xào tỏi' },
  { label: 'Bữa trưa — Món canh', content: 'Canh rau đay nấu cua' },
  { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
  { label: 'Bữa chiều', content: 'Chè đậu xanh, bánh quy' },
  { label: 'Tráng miệng', content: 'Bưởi Diễn' },
])}`,
  },
  {
    title: 'Thực đơn tuần 16/3 — 20/3/2026',
    slug: 'thuc-don-tuan-16-20-3-2026',
    publishedAt: '2026-03-16T07:00:00',
    image: 'https://picsum.photos/seed/lqd-thucdon-8/800/500',
    content: `<p>Thực đơn tuần từ <strong>16/3 — 20/3/2026</strong>:</p>
${weeklyMenuHtml([
  {
    day: 'Thứ Hai — 16/3',
    meals: [
      { label: 'Bữa sáng', content: 'Phở bò, sữa tươi' },
      { label: 'Bữa trưa — Món chính', content: 'Thịt gà luộc chấm muối tiêu chanh' },
      { label: 'Bữa trưa — Món rau', content: 'Su hào luộc' },
      { label: 'Bữa trưa — Món canh', content: 'Canh mồng tơi nấu tôm' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Chè hạt sen long nhãn' },
      { label: 'Tráng miệng', content: 'Chuối tiêu' },
    ],
  },
  {
    day: 'Thứ Ba — 17/3',
    meals: [
      { label: 'Bữa sáng', content: 'Bún riêu cua, sữa chua' },
      { label: 'Bữa trưa — Món chính', content: 'Cá thu sốt cà chua' },
      { label: 'Bữa trưa — Món rau', content: 'Rau cải xào tỏi' },
      { label: 'Bữa trưa — Món canh', content: 'Canh bí đỏ nấu xương' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Bánh bao nhân thịt, nước cam' },
      { label: 'Tráng miệng', content: 'Dưa hấu' },
    ],
  },
  {
    day: 'Thứ Tư — 18/3',
    meals: [
      { label: 'Bữa sáng', content: 'Mì xào hải sản, sữa tươi' },
      { label: 'Bữa trưa — Món chính', content: 'Sườn xào chua ngọt' },
      { label: 'Bữa trưa — Món rau', content: 'Đậu que xào tỏi' },
      { label: 'Bữa trưa — Món canh', content: 'Canh rau ngót thịt băm' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Sữa chua nếp cẩm' },
      { label: 'Tráng miệng', content: 'Cam sành' },
    ],
  },
  {
    day: 'Thứ Năm — 19/3',
    meals: [
      { label: 'Bữa sáng', content: 'Bánh cuốn Thanh Trì, sữa chua' },
      { label: 'Bữa trưa — Món chính', content: 'Thịt bò hầm khoai tây cà rốt' },
      { label: 'Bữa trưa — Món rau', content: 'Bông cải xanh luộc' },
      { label: 'Bữa trưa — Món canh', content: 'Canh cải thảo nấu giò sống' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Bánh flan, nước ép bưởi' },
      { label: 'Tráng miệng', content: 'Thanh long' },
    ],
  },
  {
    day: 'Thứ Sáu — 20/3',
    meals: [
      { label: 'Bữa sáng', content: 'Bún chả Hà Nội, sữa tươi' },
      { label: 'Bữa trưa — Món chính', content: 'Tôm chiên xù sốt mayo' },
      { label: 'Bữa trưa — Món rau', content: 'Rau muống xào tỏi' },
      { label: 'Bữa trưa — Món canh', content: 'Canh bầu nấu xương' },
      { label: 'Bữa trưa — Tinh bột', content: 'Cơm trắng' },
      { label: 'Bữa chiều', content: 'Chè đậu đen, bánh quy' },
      { label: 'Tráng miệng', content: 'Xoài cát Hòa Lộc' },
    ],
  },
])}`,
  },
];

export default async function seedArticlesThucDon() {
  // Tim category "Thuc don"
  const catRes = await apiGet('/categories');
  const categories = catRes.data || catRes;
  const cat = Array.isArray(categories)
    ? categories.find((c: any) => c.slug === 'thuc-don')
    : null;

  if (!cat) {
    console.log('  SKIP: Category "Thuc don" chua ton tai');
    return;
  }

  console.log(`  Category: ${cat.name} (id=${cat.id})`);

  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i];
    const result = await apiPost('/articles', {
      title: a.title,
      slug: a.slug,
      content: a.content,
      excerpt: a.title,
      thumbnailUrl: a.image,
      categoryId: cat.id,
      status: 'published',
      publishedAt: a.publishedAt,
    });
    if (result.id) {
      console.log(`  OK   [${i + 1}/${ARTICLES.length}] ${a.title}`);
    }
  }
}

// Cho phep chay truc tiep
if (require.main === module) {
  login().then(() => seedArticlesThucDon());
}
