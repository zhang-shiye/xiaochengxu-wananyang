// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { ChevronRight } from 'lucide-react';

export default function AdminBreadcrumb(props) {
  const {
    items = []
  } = props;
  if (items.length === 0) {
    return null;
  }
  return <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <span className="text-gray-400">位置:</span>
      {items.map((item, index) => <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
          {item.active ? <span className="text-gray-900 font-medium">{item.label}</span> : <button onClick={() => item.onClick && item.onClick()} className={`hover:text-blue-600 ${item.onClick ? 'cursor-pointer' : 'text-gray-600'}`}>
              {item.label}
            </button>}
        </React.Fragment>)}
    </nav>;
}