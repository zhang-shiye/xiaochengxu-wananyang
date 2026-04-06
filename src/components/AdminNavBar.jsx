// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Home, Users, FileText, Calendar, DollarSign, Upload, Settings } from 'lucide-react';

export default function AdminNavBar(props) {
  const {
    currentPage = 'dashboard'
  } = props;

  // 管理端导航菜单
  const navItems = [{
    id: 'dashboard',
    label: '仪表盘',
    icon: Home,
    pageId: 'admin-dashboard'
  }, {
    id: 'elders',
    label: '老人管理',
    icon: Users,
    pageId: 'admin-elders'
  }, {
    id: 'reports',
    label: '护理日报',
    icon: FileText,
    pageId: 'admin-reports'
  }, {
    id: 'leaves',
    label: '请假审批',
    icon: Calendar,
    pageId: 'admin-leaves'
  }, {
    id: 'bills',
    label: '账单管理',
    icon: DollarSign,
    pageId: 'admin-bills'
  }, {
    id: 'upload',
    label: '数据导入',
    icon: Upload,
    pageId: 'admin-upload'
  }];
  const handleNavigation = pageId => {
    if (props.$w && props.$w.utils) {
      props.$w.utils.redirectTo({
        pageId: pageId,
        params: {}
      });
    }
  };
  return <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo和标题 */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">皖安养养老院管理系统</h1>
            </div>
          </div>

          {/* 导航菜单 */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return <Button key={item.id} variant={isActive ? "default" : "ghost"} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`} onClick={() => handleNavigation(item.pageId)}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>;
          })}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <Button variant="ghost" className="p-2">
              <span className="sr-only">打开菜单</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>;
}