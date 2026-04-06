// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { LayoutDashboard, Users, UserCheck, Heart, DollarSign, Settings, LogOut, ChevronLeft, Menu } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { cn } from '@/lib/utils';

export default function AdminSidebar({
  isOpen,
  onClose,
  currentPage,
  $w
}) {
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = [{
    id: 'dashboard',
    title: '仪表板',
    icon: LayoutDashboard,
    pageId: 'admin-dashboard'
  }, {
    id: 'residents',
    title: '住户管理',
    icon: Users,
    pageId: 'admin-residents'
  }, {
    id: 'staff',
    title: '员工管理',
    icon: UserCheck,
    pageId: 'admin-staff'
  }, {
    id: 'care-records',
    title: '护理记录',
    icon: Heart,
    pageId: 'admin-care-records'
  }, {
    id: 'finance',
    title: '财务管理',
    icon: DollarSign,
    pageId: 'admin-finance'
  }, {
    id: 'settings',
    title: '系统设置',
    icon: Settings,
    pageId: 'admin-settings'
  }];
  const handleNavigation = pageId => {
    $w.utils.navigateTo({
      pageId,
      params: {}
    });
    if (onClose) onClose();
  };
  const handleLogout = () => {
    $w.utils.navigateTo({
      pageId: 'admin-login',
      params: {}
    });
    if (onClose) onClose();
  };
  return <>
      {/* 移动端遮罩 */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* 侧边栏 */}
      <div className={cn("fixed lg:static inset-y-0 left-0 z-50 bg-gray-900 text-white transition-all duration-300 ease-in-out", collapsed ? "w-16" : "w-64", isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        {/* 头部 */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          {!collapsed && <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">皖</span>
              </div>
              <span className="font-bold text-lg" style={{
            fontFamily: 'Space Mono, monospace'
          }}>
                皖安养
              </span>
            </div>}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-white hover:bg-gray-800">
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* 菜单 */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-2 space-y-1">
            {menuItems.map(item => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            return <Button key={item.id} variant="ghost" className={cn("w-full justify-start text-left transition-colors", isActive ? "bg-amber-600/20 text-amber-400 border-r-2 border-amber-400" : "text-gray-300 hover:text-white hover:bg-gray-800", collapsed && "justify-center px-2")} onClick={() => handleNavigation(item.pageId)}>
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="ml-3 flex-1 text-left">{item.title}</span>}
                </Button>;
          })}
          </div>
        </nav>

        {/* 底部 */}
        <div className="border-t border-gray-800 p-4">
          <Button variant="ghost" className={cn("w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800", collapsed && "justify-center px-2")} onClick={handleLogout}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3">退出登录</span>}
          </Button>
        </div>
      </div>
    </>;
}