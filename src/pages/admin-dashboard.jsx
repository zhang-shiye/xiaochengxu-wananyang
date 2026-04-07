// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Avatar, AvatarImage, useToast } from '@/components/ui';
// @ts-ignore;
import { Users, FileText, DollarSign, TrendingUp, CheckCircle, Clock, AlertCircle, ChevronRight, Home, BarChart3, Settings, Bell } from 'lucide-react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export default function AdminDashboard(props) {
  const {
    toast
  } = useToast();
  const [currentUser] = useState(props.$w?.auth?.currentUser);

  // 模拟数据 - 今日统计
  const [todayStats] = useState({
    checkIn: 3,
    leave: 8,
    payment: 12,
    totalResidents: 156
  });

  // 模拟数据 - 7天趋势
  const [trendData] = useState([{
    date: '04-01',
    checkIn: 2,
    leave: 5,
    payment: 8
  }, {
    date: '04-02',
    checkIn: 1,
    leave: 3,
    payment: 10
  }, {
    date: '04-03',
    checkIn: 4,
    leave: 6,
    payment: 15
  }, {
    date: '04-04',
    checkIn: 2,
    leave: 4,
    payment: 9
  }, {
    date: '04-05',
    checkIn: 3,
    leave: 7,
    payment: 11
  }, {
    date: '04-06',
    checkIn: 1,
    leave: 2,
    payment: 13
  }, {
    date: '04-07',
    checkIn: 3,
    leave: 8,
    payment: 12
  }]);

  // 模拟数据 - 待办事项
  const [todos, setTodos] = useState([{
    id: 1,
    title: '审批王奶奶的请假申请',
    priority: 'high',
    time: '10:30',
    type: 'leave',
    completed: false
  }, {
    id: 2,
    title: '处理李爷爷的缴费异常',
    priority: 'urgent',
    time: '09:15',
    type: 'payment',
    completed: false
  }, {
    id: 3,
    title: '安排新入住张爷爷的体检',
    priority: 'medium',
    time: '14:00',
    type: 'checkin',
    completed: false
  }, {
    id: 4,
    title: '更新护理计划文档',
    priority: 'low',
    time: '16:30',
    type: 'document',
    completed: false
  }]);
  const handleCardClick = type => {
    toast({
      title: '查看详情',
      description: `正在跳转到${type}管理页面...`
    });

    // 模拟页面跳转
    setTimeout(() => {
      if (type === 'checkIn') {
        props.$w.utils.navigateTo({
          pageId: 'checkin-management',
          params: {}
        });
      } else if (type === 'leave') {
        props.$w.utils.navigateTo({
          pageId: 'leave-management',
          params: {}
        });
      } else if (type === 'payment') {
        props.$w.utils.navigateTo({
          pageId: 'payment-management',
          params: {}
        });
      }
    }, 500);
  };
  const handleTodoComplete = id => {
    setTodos(todos.map(todo => todo.id === id ? {
      ...todo,
      completed: !todo.completed
    } : todo));
    toast({
      title: '任务更新',
      description: '待办事项状态已更新'
    });
  };
  const getPriorityColor = priority => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getPriorityIcon = priority => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4" />;
      case 'high':
        return <TrendingUp className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };
  const getTypeIcon = type => {
    switch (type) {
      case 'leave':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'checkin':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      {/* 顶部导航栏 */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-amber-900" style={{
                fontFamily: 'Playfair Display, serif'
              }}>
                  管理后台
                </h1>
                <p className="text-sm text-gray-600">皖安养 · 智慧管理</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="w-5 h-5 text-amber-600" />
              </Button>
              <Avatar className="w-10 h-10 border-2 border-amber-200">
                <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name} />
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* 今日数据概览 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 今日入住 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => handleCardClick('checkIn')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">今日入住</CardTitle>
                <Users className="w-5 h-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">{todayStats.checkIn}</div>
              <p className="text-xs text-gray-500 mt-1">待审批</p>
            </CardContent>
          </Card>

          {/* 今日请假 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => handleCardClick('leave')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">今日请假</CardTitle>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{todayStats.leave}</div>
              <p className="text-xs text-gray-500 mt-1">待审批</p>
            </CardContent>
          </Card>

          {/* 今日缴费 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => handleCardClick('payment')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">今日缴费</CardTitle>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{todayStats.payment}</div>
              <p className="text-xs text-gray-500 mt-1">待确认</p>
            </CardContent>
          </Card>

          {/* 在院人数 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">在院人数</CardTitle>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{todayStats.totalResidents}</div>
              <p className="text-xs text-gray-500 mt-1">当前</p>
            </CardContent>
          </Card>
        </div>

        {/* 7天趋势图 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">最近7天趋势</CardTitle>
                <CardDescription className="text-sm text-gray-600">入住、请假、缴费数据对比</CardDescription>
              </div>
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} />
                  <Line type="monotone" dataKey="checkIn" stroke="#d97706" strokeWidth={3} dot={{
                  fill: '#d97706',
                  strokeWidth: 2,
                  r: 4
                }} name="入住" />
                  <Line type="monotone" dataKey="leave" stroke="#2563eb" strokeWidth={3} dot={{
                  fill: '#2563eb',
                  strokeWidth: 2,
                  r: 4
                }} name="请假" />
                  <Line type="monotone" dataKey="payment" stroke="#059669" strokeWidth={3} dot={{
                  fill: '#059669',
                  strokeWidth: 2,
                  r: 4
                }} name="缴费" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 待办事项 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">待办事项</CardTitle>
                <CardDescription className="text-sm text-gray-600">今日需要处理的工作</CardDescription>
              </div>
              <span className="text-sm text-gray-500">{todos.filter(t => !t.completed).length} 项</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todos.map(todo => <div key={todo.id} className={`flex items-center space-x-3 p-3 rounded-xl border transition-all duration-200 ${todo.completed ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 hover:border-amber-200 hover:shadow-sm'}`}>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => handleTodoComplete(todo.id)}>
                  {todo.completed ? <CheckCircle className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                </Button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getTypeIcon(todo.type)}
                    <p className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {todo.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getPriorityColor(todo.priority)}`}>
                      {getPriorityIcon(todo.priority)}
                      <span className="ml-1">{todo.priority}</span>
                    </Badge>
                    <span className="text-xs text-gray-500">{todo.time}</span>
                  </div>
                </div>
                
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>)}
          </CardContent>
        </Card>
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-amber-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <Button variant="ghost" className="flex flex-col items-center space-y-1 h-auto py-2" onClick={() => props.$w.utils.navigateTo({
            pageId: 'admin-dashboard',
            params: {}
          })}>
              <Home className="w-5 h-5 text-amber-600" />
              <span className="text-xs text-amber-600 font-medium">首页</span>
            </Button>
            
            <Button variant="ghost" className="flex flex-col items-center space-y-1 h-auto py-2" onClick={() => props.$w.utils.navigateTo({
            pageId: 'admin-analytics',
            params: {}
          })}>
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600">统计</span>
            </Button>
            
            <Button variant="ghost" className="flex flex-col items-center space-y-1 h-auto py-2" onClick={() => props.$w.utils.navigateTo({
            pageId: 'admin-settings',
            params: {}
          })}>
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600">设置</span>
            </Button>
          </div>
        </div>
      </div>
    </div>;
}