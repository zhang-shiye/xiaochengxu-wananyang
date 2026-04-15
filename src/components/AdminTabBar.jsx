// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Home, FileCheck, UserCheck, DollarSign } from 'lucide-react';

export default function AdminTabBar({
  currentPage,
  isDemo
}) {
  const tabs = [{
    id: 'admin-home',
    name: '管理首页',
    icon: Home
  }, {
    id: 'admin-daily',
    name: '日报审批',
    icon: FileCheck
  }, {
    id: 'admin-leave',
    name: '请假审批',
    icon: UserCheck
  }, {
    id: 'admin-bill',
    name: '缴费审批',
    icon: DollarSign
  }];
  const handleTabClick = pageId => {
    const params = isDemo ? {
      demo: 'admin'
    } : {};
    window.$w?.utils?.navigateTo({
      pageId,
      params: params
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