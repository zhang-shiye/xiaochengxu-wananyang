// @ts-ignore;
import React, { useEffect, useState } from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { MessageSquare, FileCheck, UserCheck, DollarSign } from 'lucide-react';

export default function AdminTabBar({
  currentPage
}) {
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    // 从本地存储获取用户角色
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    // 如果角色是 family，跳转到家属端页面
    if (role === 'family') {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/admin-')) {
        window.$w?.utils?.navigateTo({
          pageId: 'care-home',
          params: {}
        });
      }
    }
  }, []);

  // 如果不是管理端角色，不显示管理端导航栏
  if (userRole === 'family') {
    return null;
  }
  const tabs = [{
    id: 'admin-home',
    name: '管理首页',
    icon: MessageSquare
  }, {
    id: 'admin-daily',
    name: '日报审核',
    icon: FileCheck
  }, {
    id: 'admin-leave',
    name: '请假审核',
    icon: UserCheck
  }, {
    id: 'admin-bill',
    name: '缴费审核',
    icon: DollarSign
  }];
  const handleTabClick = pageId => {
    // 使用应用内导航
    window.$w?.utils?.navigateTo({
      pageId,
      params: {}
    });
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {tabs.map(tab => {
        const IconComponent = tab.icon;
        const isActive = currentPage === tab.id;
        return <Button key={tab.id} variant="ghost" size="sm" className={`flex flex-col items-center space-y-1 px-2 py-2 h-auto ${isActive ? 'text-amber-600 bg-amber-50' : 'text-gray-600 hover:text-amber-600'}`} onClick={() => handleTabClick(tab.id)}>
              <IconComponent className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.name}</span>
            </Button>;
      })}
      </div>
    </div>;
}