// @ts-ignore;
import React from 'react';

import AdminNavBar from '@/components/AdminNavBar';
import AdminBreadcrumb from '@/components/AdminBreadcrumb';
import QuickActionsMenu from '@/components/QuickActionsMenu';
// 获取页面描述信息
function getPageDescription(currentPage) {
  const descriptions = {
    'dashboard': '查看系统概览和统计数据',
    'elders': '管理老人信息和档案资料',
    'reports': '查看和审核护理日报记录',
    'leaves': '审批和管理老人请假申请',
    'bills': '管理账单和费用结算',
    'upload': '批量导入和管理数据文件'
  };
  return descriptions[currentPage] || '管理页面';
}
export default function AdminPageLayout(props) {
  const {
    children,
    currentPage,
    title,
    actions,
    $w,
    showBreadcrumb = true,
    showQuickActions = true
  } = props;
  return <div className="min-h-screen bg-gray-50">
      {/* 管理端导航栏 */}
      <AdminNavBar $w={$w} currentPage={currentPage} />
      
      {/* 页面内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 面包屑导航 */}
        {showBreadcrumb && <AdminBreadcrumb $w={$w} currentPage={currentPage} />}
        
        {/* 页面标题和操作按钮 */}
        {(title || actions || showQuickActions) && <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              {title && <div>
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {getPageDescription(currentPage)}
                  </p>
                </div>}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 快速操作菜单 */}
              {showQuickActions && <QuickActionsMenu $w={$w} currentPage={currentPage} />}
              
              {/* 自定义操作按钮 */}
              {actions}
            </div>
          </div>}
        
        {/* 页面内容 */}
        {children}
      </div>
    </div>;
}