// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Progress, useToast } from '@/components/ui';
// @ts-ignore;
import { Users, Calendar, DollarSign, Activity, Clock, CheckCircle, AlertTriangle, Menu, LogOut, User } from 'lucide-react';

export default function AdminDashboard(props) {
  const [role, setRole] = useState('caregiver');
  const [activeTab, setActiveTab] = useState('overview');
  const {
    toast
  } = useToast();
  useEffect(() => {
    const userRole = props.$w.page.dataset.params.role || 'caregiver';
    setRole(userRole);
  }, [props.$w.page.dataset.params.role]);

  // 模拟数据
  const dashboardData = {
    overview: {
      totalSeniors: 42,
      activeCaregivers: 8,
      todayTasks: 15,
      completedTasks: 9,
      pendingApprovals: 3,
      monthlyRevenue: 125600
    },
    tasks: [{
      id: 1,
      senior: '张爷爷',
      task: '晨间护理',
      time: '08:00',
      status: 'completed'
    }, {
      id: 2,
      senior: '李奶奶',
      task: '服药提醒',
      time: '09:30',
      status: 'pending'
    }, {
      id: 3,
      senior: '王爷爷',
      task: '康复训练',
      time: '10:00',
      status: 'in-progress'
    }, {
      id: 4,
      senior: '赵奶奶',
      task: '午餐照料',
      time: '12:00',
      status: 'pending'
    }],
    alerts: [{
      id: 1,
      type: 'warning',
      message: '张爷爷血压偏高',
      time: '10分钟前'
    }, {
      id: 2,
      type: 'info',
      message: '李奶奶药物即将用完',
      time: '1小时前'
    }, {
      id: 3,
      type: 'success',
      message: '王爷爷康复训练完成',
      time: '2小时前'
    }]
  };
  const handleLogout = () => {
    props.$w.utils.redirectTo({
      pageId: 'admin-login',
      params: {}
    });
    toast({
      title: '已退出登录',
      description: '欢迎再次使用皖安养管理系统'
    });
  };
  const renderOverview = () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">在院老人</p>
              <p className="text-3xl font-bold text-blue-900">{dashboardData.overview.totalSeniors}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">今日任务</p>
              <p className="text-3xl font-bold text-green-900">{dashboardData.overview.todayTasks}</p>
              <Progress value={dashboardData.overview.completedTasks / dashboardData.overview.todayTasks * 100} className="mt-2" />
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">活跃护工</p>
              <p className="text-3xl font-bold text-amber-900">{dashboardData.overview.activeCaregivers}</p>
            </div>
            <Users className="w-8 h-8 text-amber-500" />
          </div>
        </CardContent>
      </Card>

      {role === 'admin' && <>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">待审批</p>
                  <p className="text-3xl font-bold text-red-900">{dashboardData.overview.pendingApprovals}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">月收入</p>
                  <p className="text-3xl font-bold text-purple-900">¥{dashboardData.overview.monthlyRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </>}
    </div>;
  const renderTasks = () => <div className="space-y-4">
      {dashboardData.tasks.map(task => <Card key={task.id} className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{task.senior} - {task.task}</p>
                  <p className="text-sm text-gray-500">{task.time}</p>
                </div>
              </div>
              <Badge variant={task.status === 'completed' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'outline'}>
                {task.status === 'completed' ? '已完成' : task.status === 'in-progress' ? '进行中' : '待处理'}
              </Badge>
            </div>
          </CardContent>
        </Card>)}
    </div>;
  const renderAlerts = () => <div className="space-y-4">
      {dashboardData.alerts.map(alert => <Card key={alert.id} className={alert.type === 'warning' ? 'border-l-4 border-l-red-500' : alert.type === 'info' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-green-500'}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-red-500" />}
              {alert.type === 'info' && <Activity className="w-5 h-5 text-blue-500" />}
              {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{alert.message}</p>
                <p className="text-sm text-gray-500">{alert.time}</p>
              </div>
            </div>
          </CardContent>
        </Card>)}
    </div>;
  return <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">皖</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900" style={{
                fontFamily: 'Noto Sans SC, sans-serif'
              }}>
                  皖安养管理系统
                </h1>
                <p className="text-sm text-gray-500">{role === 'admin' ? '院长' : '护工'}工作台</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>退出</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 功能导航 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" onClick={() => setActiveTab('overview')}>
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">数据概览</h3>
              <p className="text-sm text-blue-600 mt-1">实时监控关键指标</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100 border-green-200" onClick={() => props.$w.utils.redirectTo({
          pageId: 'caregiver-tasks',
          params: {}
        })}>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">任务管理</h3>
              <p className="text-sm text-green-600 mt-1">护理任务分配跟踪</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" onClick={() => props.$w.utils.redirectTo({
          pageId: 'senior-management',
          params: {}
        })}>
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">老人管理</h3>
              <p className="text-sm text-purple-600 mt-1">老人信息健康档案</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200" onClick={() => setActiveTab('alerts')}>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <h3 className="font-semibold text-amber-900">提醒通知</h3>
              <p className="text-sm text-amber-600 mt-1">重要提醒实时推送</p>
            </CardContent>
          </Card>
        </div>

        {/* 内容展示 */}
        <div className="space-y-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'tasks' && renderTasks()}
          {activeTab === 'alerts' && renderAlerts()}
          {activeTab === 'reports' && role === 'admin' && <Card>
              <CardHeader>
                <CardTitle>统计报表</CardTitle>
                <CardDescription>院长专属功能 - 数据分析与报表生成</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">财务报表、护理质量分析、人员绩效统计等功能开发中...</p>
              </CardContent>
            </Card>}
        </div>
      </main>
    </div>;
}