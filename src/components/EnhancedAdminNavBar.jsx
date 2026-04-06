// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Avatar, AvatarImage, AvatarFallback } from '@/components/ui';
// @ts-ignore;
import { Home, Users, FileText, Calendar, DollarSign, Upload, Settings, Bell, Search, Menu, X } from 'lucide-react';

export default function EnhancedAdminNavBar(props) {
  const {
    currentPage = 'dashboard',
    $w
  } = props;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 管理端导航菜单
  const navItems = [{
    id: 'dashboard',
    label: '仪表盘',
    icon: Home,
    pageId: 'admin-dashboard',
    description: '查看系统概览和统计数据'
  }, {
    id: 'elders',
    label: '老人管理',
    icon: Users,
    pageId: 'admin-elders',
    description: '管理老人信息和档案'
  }, {
    id: 'reports',
    label: '护理日报',
    icon: FileText,
    pageId: 'admin-reports',
    description: '查看和管理护理日报'
  }, {
    id: 'leaves',
    label: '请假审批',
    icon: Calendar,
    pageId: 'admin-leaves',
    description: '处理请假申请和审批'
  }, {
    id: 'bills',
    label: '账单管理',
    icon: DollarSign,
    pageId: 'admin-bills',
    description: '管理账单和费用'
  }, {
    id: 'upload',
    label: '数据导入',
    icon: Upload,
    pageId: 'admin-upload',
    description: '批量导入数据'
  }];
  const handleNavigation = pageId => {
    if ($w && $w.utils) {
      $w.utils.redirectTo({
        pageId: pageId,
        params: {}
      });
    }
    setIsMobileMenuOpen(false);
  };
  return <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo和标题 */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">养老院管理系统</h1>
            </div>
          </div>
          
          {/* 桌面端导航菜单 */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return <button key={item.id} onClick={() => handleNavigation(item.pageId)} className={`group relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`} title={item.description}>
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  
                  {/* 活跃状态指示器 */}
                  {isActive && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>}
                </button>;
          })}
          </div>
          
          {/* 右侧操作区域 */}
          <div className="flex items-center space-x-4">
            {/* 搜索框 */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="搜索..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            
            {/* 通知铃铛 */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* 用户头像 */}
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" alt="管理员" />
                <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                  管
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900">管理员</div>
                <div className="text-xs text-gray-500">系统管理员</div>
              </div>
            </div>
            
            {/* 移动端菜单按钮 */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {isMobileMenuOpen && <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return <button key={item.id} onClick={() => handleNavigation(item.pageId)} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </button>;
          })}
            </div>
          </div>}
      </div>
    </nav>;
}