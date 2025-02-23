import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  items: { label: string; onClick?: () => void }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={16} className="text-gray-400" />}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-gray-900 hover:underline"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}