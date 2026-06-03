import Image from 'next/image';
import Breadcrumb from './Breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  description?: string;
  breadcrumbItems: BreadcrumbItem[];
  /** URL anh nen — neu co se hien thi anh blur + overlay, neu khong dung gradient mac dinh */
  imageSrc?: string;
  /** Override gradient khi khong co anh */
  bgClass?: string;
}

/** Banner chung cho tat ca inner pages — ho tro ca anh nen lan gradient fallback */
export default function PageBanner({
  title,
  description,
  breadcrumbItems,
  imageSrc,
  bgClass = 'bg-gradient-to-r from-[#1a5276] to-[#2e86c1]',
}: PageBannerProps) {
  return (
    <section className="relative text-white overflow-hidden">
      {/* Nen: anh + overlay hoac gradient */}
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-[#1a5276]/75" />
        </>
      ) : (
        <div className={`absolute inset-0 ${bgClass}`} />
      )}

      {/* Noi dung */}
      <div className="relative max-w-7xl mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} variant="light" />
        <div className="pb-8 pt-2 lg:pb-12">
          <h1 className="text-2xl lg:text-4xl font-bold mb-2 drop-shadow-sm">{title}</h1>
          {description && (
            <p className="text-sm lg:text-base opacity-90 max-w-2xl drop-shadow-sm">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
}
