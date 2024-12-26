import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactElement<LucideIcon>;
  stats?: string;
  color: string;
  onClick: () => void;
}

export function DashboardCard({
  title,
  description,
  icon,
  stats,
  color,
  onClick
}: DashboardCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 w-full text-left`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="p-2 rounded-lg inline-block">
            {icon}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          {stats && (
            <p className="text-sm font-medium text-gray-900">{stats}</p>
          )}
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );
}