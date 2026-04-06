// @ts-ignore;
import React from 'react';

export function SkeletonLoader({
  count = 3,
  className = ''
}) {
  return <div className={`space-y-3 ${className}`}>
      {Array.from({
      length: count
    }).map((_, index) => <div key={index} className="animate-pulse bg-gray-200 rounded-lg h-20"></div>)}
    </div>;
}
export default function LoadingSpinner({
  size = 'md',
  text = '加载中...'
}) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };
  return <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-amber-600 ${sizeClasses[size]}`}></div>
      {text && <p className="mt-4 text-gray-600 text-sm">{text}</p>}
    </div>;
}