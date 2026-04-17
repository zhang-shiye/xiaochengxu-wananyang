// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Eye, ArrowLeft } from 'lucide-react';

/**
 * 演示模式横幅组件
 * 在演示模式下显示在页面顶部，提示用户当前为演示模式
 */
export function DemoBanner({
  role,
  onBack
}) {
  if (!role) return null;
  const isAdmin = role === 'admin';
  return <div className={`sticky top-0 z-50 ${isAdmin ? 'bg-blue-600' : 'bg-green-600'} text-white px-4 py-2.5 flex items-center justify-between shadow-lg`}>
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4" />
        <span className="text-sm font-medium">
          演示模式 · {isAdmin ? '管理端' : '家属端'}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 h-7 px-2">
        <ArrowLeft className="w-3 h-3 mr-1" />
        <span className="text-xs">退出演示</span>
      </Button>
    </div>;
}