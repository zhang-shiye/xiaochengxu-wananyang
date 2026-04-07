// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { MessageSquare, FileCheck, UserCheck, DollarSign, Database, QrCode, FileText, Upload } from 'lucide-react';

export default function AdminTabBar({
  currentPage
}) {
  const tabs = [{
    id: 'admin-dashboard',
    name: '验证码转发',
    icon: MessageSquare
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
  }, {
    id: 'admin-import',
    name: '数据导入',
    icon: Database
  }, {
    id: 'admin-bind-code',
    name: '绑定验证码',
    icon: QrCode
  }, {
    id: 'admin-daily-review',
    name: '日报审批',
    icon: FileText
  }, {
    id: 'admin-data-import',
    name: '数据导入',
    icon: Upload
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
        {tabs.slice(0, 5).map(tab => {
        const IconComponent = tab.icon;
        const isActive = currentPage === tab.id;
        return <Button key={tab.id} variant="ghost" size="sm" className={`flex flex-col items-center space-y-1 px-2 py-2 h-auto ${isActive ? 'text-amber-600 bg-amber-50' : 'text-gray-600 hover:text-amber-600'}`} onClick={() => handleTabClick(tab.id)}>
              <IconComponent className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.name}</span>
            </Button>;
      })}
      </div>
      <div className="flex justify-around items-center mt-2 pt-2 border-t border-gray-100">
        <div className="text-xs text-gray-500 font-medium mb-1">数据维护</div>
      </div>
      <div className="flex justify-around items-center">
        {tabs.slice(5).map(tab => {
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