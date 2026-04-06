// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Plus, Upload, FileText, Calendar, Settings, ChevronDown } from 'lucide-react';

export default function QuickActionsMenu(props) {
  const {
    $w,
    currentPage
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  // 快速操作菜单配置
  const quickActions = [{
    id: 'add_elder',
    label: '添加老人',
    icon: Plus,
    color: 'text-green-600',
    pageId: 'admin-elders',
    availableOn: ['dashboard', 'elders']
  }, {
    id: 'import_data',
    label: '导入数据',
    icon: Upload,
    color: 'text-blue-600',
    pageId: 'admin-upload',
    availableOn: ['dashboard', 'elders', 'reports', 'leaves', 'bills']
  }, {
    id: 'generate_bill',
    label: '生成账单',
    icon: FileText,
    color: 'text-purple-600',
    pageId: 'admin-bills',
    availableOn: ['dashboard', 'bills']
  }, {
    id: 'batch_approve',
    label: '批量审批',
    icon: Calendar,
    color: 'text-orange-600',
    pageId: 'admin-leaves',
    availableOn: ['dashboard', 'leaves']
  }, {
    id: 'system_settings',
    label: '系统设置',
    icon: Settings,
    color: 'text-gray-600',
    pageId: 'admin-dashboard',
    availableOn: ['dashboard']
  }];

  // 过滤当前页面可用的操作
  const availableActions = quickActions.filter(action => action.availableOn.includes(currentPage));
  const handleAction = pageId => {
    setIsOpen(false);
    if ($w && $w.utils) {
      $w.utils.redirectTo({
        pageId: pageId,
        params: {}
      });
    }
  };
  return <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
        <span>快速操作</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            {availableActions.map(action => {
          const IconComponent = action.icon;
          return <button key={action.id} onClick={() => handleAction(action.pageId)} className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                  <IconComponent className={`h-4 w-4 ${action.color}`} />
                  <span>{action.label}</span>
                </button>;
        })}
          </div>
        </div>}
    </div>;
}