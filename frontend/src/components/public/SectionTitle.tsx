interface SectionTitleProps {
  subtitle?: string;
  title: string;
  center?: boolean;
}

/** Tieu de section dung chung trong cac trang noi dung */
export default function SectionTitle({ subtitle, title, center = false }: SectionTitleProps) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      {subtitle && <p className="text-sm text-green-700 font-medium mb-1">{subtitle}</p>}
      <h2 className="text-xl lg:text-2xl font-bold text-slate-900">{title}</h2>
    </div>
  );
}
