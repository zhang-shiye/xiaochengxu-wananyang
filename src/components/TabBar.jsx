// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Heart, Calendar, FileText, CreditCard, Home, User, Clock, DollarSign } from 'lucide-react';

export default function TabBar({
  currentPage
}) {
  const tabs = [{
    id: 'care-home',
    name: '关爱首页',
    icon: Heart,
    color: 'from-pink-500 to-rose-500'
  }, {
    id: 'home',
    name: '护理日报',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-500'
  }, {
    id: 'leave',
    name: '请假申请',
    icon: FileText,
    color: 'from-green-500 to-emerald-500'
  }, {
    id: 'bill',
    name: '缴费账单',
    icon: CreditCard,
    color: 'from-orange-500 to-amber-500'
  }];
  const handleTabClick = pageId => {
    // 使用应用内导航
    window.$w?.utils?.navigateTo({
      pageId: pageId,
      params: {}
    }) || (window.location.href = `/${pageId}`);
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = currentPage === tab.id;
          return <Button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`
                  flex flex-col items-center space-y-1 px-4 py-3 
                  rounded-2xl transition-all duration-300 ease-out
                  ${isActive ? `bg-gradient-to-br ${tab.color} text-white shadow-lg transform scale-105` : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                `} variant="ghost" size="sm">
                <div className={`
                  p-2 rounded-full transition-all duration-300
                  ${isActive ? 'bg-white/20' : 'bg-gray-100'}
                `}>
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <span className={`
                  text-xs font-semibold transition-all duration-300
                  ${isActive ? 'text-white' : 'text-gray-600'}
                `} style={{
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