// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui';
// @ts-ignore;
import { Plus, MoreVertical, Upload, FileText, Calendar, UserPlus, Settings } from 'lucide-react';

export default function AdminQuickActions(props) {
  const {
    $w
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const quickActions = [{
    id: 'add_elder',
    label: '添加老人',
    icon: UserPlus,
    pageId: 'admin-elders',
    color: 'text-green-600'
  }, {
    id: 'upload_data',
    label: '数据导入',
    icon: Upload,
    pageId: 'admin-upload',
    color: 'text-blue-600'
  }, {
    id: 'generate_bill',
    label: '生成账单',
    icon: FileText,
    pageId: 'admin-bills',
    color: 'text-purple-600'
  }, {
    id: 'approve_leave',
    label: '请假审批',
    icon: Calendar,
    pageId: 'admin-leaves',
    color: 'text-orange-600'
  }];
  const handleAction = pageId => {
    if ($w && $w.utils) {
      $w.utils.redirectTo({
        pageId: pageId,
        params: {}
      });
    }
    setIsOpen(false);
  };
  return <div className="flex items-center space-x-2">
      {/* 主要快速操作按钮 */}
      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleAction('admin-elders')}>
        <Plus className="h-4 w-4 mr-1" />
        添加老人
      </Button>
      
      {/* 更多操作下拉菜单 */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {quickActions.map(action => <DropdownMenuItem key={action.id} onClick={() => handleAction(action.pageId)} className="flex items-center space-x-2">
              <action.icon className={`h-4 w-4 ${action.color}`} />
              <span>{action.label}</span>
            </DropdownMenuItem>)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>;
}