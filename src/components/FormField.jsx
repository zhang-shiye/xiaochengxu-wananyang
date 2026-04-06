// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Label } from '@/components/ui';

export default function FormField({
  label,
  required = false,
  error,
  children,
  className = ''
}) {
  return <div className={`space-y-2 ${className}`}>
      {label && <Label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>}
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>;
}