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
    id: 'care-home',
    name: '皖安养',
    icon: Home
  }, {
    id: 'home',
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
  return <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-amber-200 shadow-lg safe-area-inset-bottom">
      <div className="container max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = currentPage === tab.id;
          return <Button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`flex flex-col items-center space-y-1 px-4 py-3 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${isActive ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-600 hover:bg-amber-50'}`} variant="ghost" size="sm">
              <IconComponent className={`w-6 h-6 transition-all ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-semibold transition-all" style={{
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
                {tab.name}
              </span>
              {isActive && <div className="absolute -top-1 w-2 h-1 bg-amber-500 rounded-full"></div>}
            </Button>;
        })}
        </div>
      </div>
    </div>;
}