// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Users, UserCheck, DollarSign, TrendingUp, Calendar, Bell, Search, Menu, X, ChevronRight, Activity, Heart, Clock } from 'lucide-react';
// @ts-ignore;
import { Card, Button, Input, Badge, useToast } from '@/components/ui';

import AdminSidebar from '@/components/AdminSidebar';
export default function AdminDashboard(props) {
  const {
    $w
  } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalResidents: 156,
    activeResidents: 142,
    totalRevenue: 284500,
    monthlyGrowth: 12.5,
    pendingLeaves: 8,
    todayTasks: 24
  });
  const {
    toast
  } = useToast();
  const recentActivities = [{
    id: 1,
    type: '入住',
    message: '李奶奶入住 3楼301房',
    time: '2小时前',
    status: 'success'
  }, {
    id: 2,
    type: '请假',
    message: '王爷爷请假申请待审批',
    time: '3小时前',
    status: 'warning'
  }, {
    id: 3,
    type: '缴费',
    message: '张奶奶本月费用已缴清',
    time: '5小时前',
    status: 'info'
  }, {
    id: 4,
    type: '护理',
    message: '刘爷爷护理等级调整为二级',
    time: '1天前',
    status: 'success'
  }];
  const quickActions = [{
    id: 1,
    title: '住户管理',
    icon: Users,
    color: 'bg-blue-500',
    pageId: 'admin-residents'
  }, {
    id: 2,
    title: '员工管理',
    icon: UserCheck,
    color: 'bg-green-500',
    pageId: 'admin-staff'
  }, {
    id: 3,
    title: '护理记录',
    icon: Heart,
    color: 'bg-red-500',
    pageId: 'admin-care-records'
  }, {
    id: 4,
    title: '财务管理',
    icon: DollarSign,
    color: 'bg-amber-500',
    pageId: 'admin-finance'
  }];
  const handleQuickAction = pageId => {
    $w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  return <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentPage="dashboard" $w={$w} />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800" style={{
              fontFamily: 'Space Mono, monospace'
            }}>
                管理仪表板
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type="text" placeholder="搜索住户、员工..." className="pl-10 pr-4 py-2 w-64 border-gray-300 focus:border-amber-500 focus:ring-amber-500" />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">3</Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <main className="flex-1 p-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总住户数</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalResidents}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>较上月增长 5.2%</span>
              </div>
            </Card>

            <Card className="bg-white p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">活跃住户</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeResidents}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>入住率 91.0%</span>
              </div>
            </Card>

            <Card className="bg-white p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">本月收入</p>
                  <p className="text-3xl font-bold text-gray-900">¥{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-amber-100 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>较上月增长 {stats.monthlyGrowth}%</span>
              </div>
            </Card>

            <Card className="bg-white p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">待处理</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingLeaves}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <span>请假申请待审批</span>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 快捷操作 */}
            <div className="lg:col-span-2">
              <Card className="bg-white p-6 border-0 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">快捷操作</h3>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map(action => {
                  const IconComponent = action.icon;
                  return <Button key={action.id} variant="outline" className="h-20 border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group" onClick={() => handleQuickAction(action.pageId)}>
                        <div className="flex items-center space-x-3">
                          <div className={`${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium text-gray-700">{action.title}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                        </div>
                      </Button>;
                })}
                </div>
              </Card>
            </div>

            {/* 最近活动 */}
            <div>
              <Card className="bg-white p-6 border-0 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">最近活动</h3>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {recentActivities.map(activity => <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${activity.status === 'success' ? 'bg-green-500' : activity.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>)}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>;
}