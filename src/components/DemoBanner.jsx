// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Eye, ArrowLeft, Clock } from 'lucide-react';

/**
 * 演示模式横幅组件
 * 在演示模式下显示在页面顶部，提示用户当前为演示模式
 * 包含环境标识和数据自动重置提示
 */
export function DemoBanner({
  role,
  onBack
}) {
  if (!role) return null;
  const isAdmin = role === 'admin';
  return <div className={`sticky top-0 z-50 ${isAdmin ? 'bg-blue-600' : 'bg-green-600'} text-white shadow-lg`}>
      {/* 主横幅 */}
      <div className="px-4 py-2.5 flex items-center justify-between">
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
      </div>
      
      {/* 环境提示条 */}
      <div className={`${isAdmin ? 'bg-blue-700' : 'bg-green-700'} px-4 py-1.5 flex items-center justify-center gap-2 text-xs`}>
        <Clock className="w-3 h-3 opacity-80" />
        <span className="opacity-90">当前处于演示环境，数据每日自动重置</span>
      </div>
    </div>;
}

/**
 * 演示模式重置工具
 * 用于重置演示数据到初始状态
 */
export const DemoResetUtil = {
  // 演示数据模型列表
  demoDataModels: ['demo_elders', 'demo_family_members', 'demo_employee', 'demo_leave_records', 'demo_care_records', 'demo_branding'],
  /**
   * 检查是否需要重置演示数据
   * 基于本地存储的最后重置时间判断
   */
  shouldReset: () => {
    const lastResetDate = localStorage.getItem('demo_last_reset_date');
    const today = new Date().toDateString();
    return lastResetDate !== today;
  },
  /**
   * 标记今日已重置
   */
  markResetDone: () => {
    localStorage.setItem('demo_last_reset_date', new Date().toDateString());
    localStorage.setItem('demo_reset_timestamp', Date.now().toString());
  },
  /**
   * 获取上次重置时间
   */
  getLastResetTime: () => {
    const timestamp = localStorage.getItem('demo_reset_timestamp');
    return timestamp ? new Date(parseInt(timestamp)) : null;
  },
  /**
   * 重置演示数据
   * 调用云函数重置所有演示数据模型
   */
  resetDemoData: async cloud => {
    console.log('[Demo] 开始重置演示数据...');
    try {
      // 调用云函数重置演示数据
      const result = await cloud.callFunction({
        name: 'demoResetData',
        data: {
          action: 'resetAll',
          timestamp: Date.now()
        }
      });
      if (result.result?.success) {
        console.log('[Demo] 演示数据重置成功');
        DemoResetUtil.markResetDone();
        return {
          success: true,
          message: '数据已重置为初始状态'
        };
      } else {
        throw new Error(result.result?.message || '重置失败');
      }
    } catch (error) {
      console.error('[Demo] 重置演示数据失败:', error);
      // 即使重置失败也标记为已重置，避免重复尝试
      DemoResetUtil.markResetDone();
      return {
        success: false,
        message: error.message
      };
    }
  },
  /**
   * 初始化演示模式
   * 检查并重置演示数据
   */
  initDemoMode: async cloud => {
    if (DemoResetUtil.shouldReset()) {
      console.log('[Demo] 检测到新的一天，需要重置演示数据');
      return await DemoResetUtil.resetDemoData(cloud);
    } else {
      console.log('[Demo] 演示数据已在今日重置过');
      return {
        success: true,
        message: '数据状态正常',
        skipped: true
      };
    }
  }
};