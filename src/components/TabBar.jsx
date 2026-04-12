// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Home, BookOpen, FileText, DollarSign } from 'lucide-react';

export default function TabBar({
  currentPage
}) {
  const tabs = [{
    id: 'home',
    name: '首页',
    icon: Home
  }, {
    id: 'care',
    name: '护理日报',
    icon: BookOpen
  }, {
    id: 'leave',
    name: '请假申请',
    icon: FileText
  }, {
    id: 'bill',
    name: '缴费账单',
    icon: DollarSign
  }];
  const handleTabClick = pageId => {
    // 使用应用内导航
    window.$w?.utils?.navigateTo({
      pageId: pageId,
      params: {}
    }) || (window.location.href = `/${pageId}`);
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-amber-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {tabs.map(tab => {
          const IconComponent = tab.icon;
          return <Button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${currentPage === tab.id ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`} variant="ghost" size="sm">
              <IconComponent className="w-5 h-5" />
              <span className="text-xs font-medium" style={{
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
                {tab.name}
              </span>
            </Button>;
        })}
        </div>
      </div>
    </div>;
}