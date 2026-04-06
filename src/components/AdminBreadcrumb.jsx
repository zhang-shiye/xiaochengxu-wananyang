// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { ChevronRight } from 'lucide-react';

export default function AdminBreadcrumb(props) {
  const {
    currentPage,
    $w
  } = props;

  // 面包屑导航配置
  const breadcrumbConfig = {
    'dashboard': {
      label: '仪表盘',
      path: 'admin-dashboard'
    },
    'elders': {
      label: '老人管理',
      path: 'admin-elders'
    },
    'reports': {
      label: '护理日报',
      path: 'admin-reports'
    },
    'leaves': {
      label: '请假审批',
      path: 'admin-leaves'
    },
    'bills': {
      label: '账单管理',
      path: 'admin-bills'
    },
    'upload': {
      label: '数据导入',
      path: 'admin-upload'
    }
  };
  const currentPageInfo = breadcrumbConfig[currentPage] || {
    label: '未知页面',
    path: 'admin-dashboard'
  };
  return <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <button onClick={() => {
      if ($w && $w.utils) {
        $w.utils.redirectTo({
          pageId: 'admin-dashboard',
          params: {}
        });
      }
    }} className="hover:text-gray-700 transition-colors">
        管理控制台
      </button>
      <ChevronRight className="h-4 w-4" />
      <span className="text-gray-900 font-medium">{currentPageInfo.label}</span>
    </nav>;
}