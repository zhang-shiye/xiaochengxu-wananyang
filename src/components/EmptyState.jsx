// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) {
  return <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      {Icon && <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-amber-600" />
        </div>}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{description}</p>
      {actionText && onAction && <Button onClick={onAction} className="bg-amber-500 hover:bg-amber-600">
          {actionText}
        </Button>}
    </div>;
}