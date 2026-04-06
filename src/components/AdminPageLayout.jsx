// @ts-ignore;
import React from 'react';

import AdminNavBar from '@/components/AdminNavBar';
export default function AdminPageLayout(props) {
  const {
    children,
    currentPage,
    title,
    actions,
    $w
  } = props;
  return <div className="min-h-screen bg-gray-50">
      {/* 管理端导航栏 */}
      <AdminNavBar $w={$w} currentPage={currentPage} />
      
      {/* 页面内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 页面标题和操作按钮 */}
        {(title || actions) && <div className="flex justify-between items-center mb-6">
            {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
            {actions && <div className="flex items-center space-x-4">
                {actions}
              </div>}
          </div>}
        
        {/* 页面内容 */}
        {children}
      </div>
    </div>;
}