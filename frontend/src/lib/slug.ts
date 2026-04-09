/**
 * Tao slug tu ten/title — bo dau tieng Viet, lowercase, thay khoang trang bang dau gach.
 * Dung chung cho categories, articles, va cac entity khac.
 */
export function generateSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 280);
}
