import Breadcrumb from './Breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  description?: string;
  breadcrumbItems: BreadcrumbItem[];
  /** Background gradient class, default green */
  bgClass?: string;
}

/** Banner chung cho tat ca inner pages — hien thi breadcrumb + tieu de + mo ta */
export default function PageBanner({
  title,
  description,
  breadcrumbItems,
  bgClass = 'bg-gradient-to-r from-green-700 to-green-600',
}: PageBannerProps) {
  return (
    <section className={`${bgClass} text-white`}>
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} variant="light" />
        <div className="pb-8 pt-2 lg:pb-12">
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">{title}</h1>
          {description && (
            <p className="text-sm lg:text-base opacity-90 max-w-2xl">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
}
