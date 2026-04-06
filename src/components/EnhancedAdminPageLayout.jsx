// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Badge } from '@/components/ui';
// @ts-ignore;
import { Bell, TrendingUp, Users, FileText, Clock } from 'lucide-react';

import EnhancedAdminNavBar from '@/components/EnhancedAdminNavBar';
import AdminBreadcrumb from '@/components/AdminBreadcrumb';
import AdminQuickActions from '@/components/AdminQuickActions';
export default function EnhancedAdminPageLayout(props) {
  const {
    children,
    currentPage,
    title,
    actions,
    $w,
    breadcrumbItems = [],
    showQuickActions = true,
    showStats = true
  } = props;
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    pendingTasks: 5,
    newReports: 3,
    pendingApprovals: 2,
    systemAlerts: 1
  });

  // 模拟获取通知和统计数据
  useEffect(() => {
    // 这里可以连接实际的API获取数据
    const mockNotifications = [{
      id: 1,
      type: 'warning',
      message: '有3个请假申请待审批',
      time: '5分钟前'
    }, {
      id: 2,
      type: 'info',
      message: '今日护理日报已生成',
      time: '1小时前'
    }, {
      id: 3,
      type: 'success',
      message: '数据导入成功完成',
      time: '2小时前'
    }];
    setNotifications(mockNotifications);
  }, []);

  // 获取页面特定的统计信息
  const getPageStats = () => {
    const pageStats = {
      dashboard: [{
        label: '待处理任务',
        value: stats.pendingTasks,
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      }, {
        label: '新护理日报',
        value: stats.newReports,
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      }, {
        label: '待审批',
        value: stats.pendingApprovals,
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }, {
        label: '系统提醒',
        value: stats.systemAlerts,
        icon: Bell,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }],
      elders: [{
        label: '在院老人',
        value: 42,
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      }, {
        label: '今日新增',
        value: 2,
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }, {
        label: '待更新档案',
        value: 5,
        icon: FileText,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      }, {
        label: '生日提醒',
        value: 3,
        icon: Bell,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      }],
      reports: [{
        label: '今日报告',
        value: 38,
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      }, {
        label: '待审核',
        value: 5,
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      }, {
        label: '异常报告',
        value: 2,
        icon: Bell,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }, {
        label: '完成率',
        value: '92%',
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }],
      leaves: [{
        label: '待审批',
        value: 5,
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      }, {
        label: '今日请假',
        value: 3,
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      }, {
        label: '本周累计',
        value: 12,
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }, {
        label: '异常申请',
        value: 1,
        icon: Bell,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }],
      bills: [{
        label: '待生成账单',
        value: 8,
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      }, {
        label: '未付款账单',
        value: 12,
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      }, {
        label: '本月收入',
        value: '¥45,600',
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }, {
        label: '逾期账单',
        value: 3,
        icon: Bell,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }],
      upload: [{
        label: '今日导入',
        value: 5,
        icon: TrendingUp,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      }, {
        label: '导入成功',
        value: 4,
        icon: FileText,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }, {
        label: '导入失败',
        value: 1,
        icon: Bell,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }, {
        label: '数据校验',
        value: '98%',
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      }]
    };
    return pageStats[currentPage] || pageStats.dashboard;
  };
  const pageStats = getPageStats();
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* 增强的导航栏 */}
      <EnhancedAdminNavBar $w={$w} currentPage={currentPage} />
      
      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 面包屑导航 */}
        <AdminBreadcrumb items={breadcrumbItems} />
        
        {/* 页面标题和操作区域 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">管理养老院日常运营和护理工作</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 快速操作菜单 */}
            {showQuickActions && <AdminQuickActions $w={$w} />}
            
            {/* 自定义操作按钮 */}
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </div>
        
        {/* 页面统计信息卡片 */}
        {showStats && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {pageStats.map((stat, index) => {
          const Icon = stat.icon;
          return <Card key={index} className="p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </Card>;
        })}
          </div>}
        
        {/* 通知提醒区域 */}
        {notifications.length > 0 && <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">系统通知</h3>
              <Button variant="ghost" size="sm" className="text-blue-600">
                查看全部
              </Button>
            </div>
            <div className="space-y-2">
              {notifications.slice(0, 3).map(notification => <div key={notification.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${notification.type === 'warning' ? 'bg-orange-500' : notification.type === 'error' ? 'bg-red-500' : notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className="text-sm text-gray-700">{notification.message}</span>
                  </div>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>)}
            </div>
          </div>}
        
        {/* 页面主要内容 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {children}
        </div>
      </div>
    </div>;
}