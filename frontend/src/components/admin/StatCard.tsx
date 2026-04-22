import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export default function StatCard({ label, value, icon: Icon, trend, className }: Props) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-4 lg:p-5', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {trend && <p className="text-sm text-slate-400 mt-1">{trend}</p>}
        </div>
        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-green-700" />
        </div>
      </div>
    </div>
  );
}
