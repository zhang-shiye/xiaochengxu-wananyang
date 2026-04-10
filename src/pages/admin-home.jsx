// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Calendar, DollarSign, UserCheck, AlertCircle, CheckCircle, Clock, ArrowRight, Bell, Database, Users } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
export default function AdminHome(props) {
  const {
    toast
  } = useToast();
  const [pendingCounts, setPendingCounts] = useState({
    dailyReports: 0,
    leaveRequests: 0,
    billApprovals: 0
  });
  const [elderCount, setElderCount] = useState(0);
  const [todayDate, setTodayDate] = useState('');
  useEffect(() => {
    const today = new Date();
    setTodayDate(today.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }));
    loadPendingData();
  }, []);
  const loadPendingData = async () => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const _ = db.command;

      // 统计待审核日报
      const dailyResult = await db.collection('daily_reports').where({
        status: 'pending'
      }).count();

      // 统计待审核请假
      const leaveResult = await db.collection('leave_requests').where({
        status: 'pending'
      }).count();

      // 统计待审核账单
      const billResult = await db.collection('bills').where({
        status: 'pending'
      }).count();

      // 统计老人数量
      const elderResult = await db.collection('elders').where({
        status: 'active'
      }).count();
      setPendingCounts({
        dailyReports: dailyResult.total,
        leaveRequests: leaveResult.total,
        billApprovals: billResult.total
      });
      setElderCount(elderResult.total);
    } catch (error) {
      console.error('加载待办数据失败:', error);
      toast({
        title: '数据加载失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleQuickAction = action => {
    const pageMap = {
      'daily': 'admin-daily',
      'leave': 'admin-leave',
      'bill': 'admin-bill',
      'elder': 'admin-elder',
      'data': 'admin-data'
    };
    toast({
      title: '正在跳转',
      description: '即将进入相应管理页面',
      duration: 1500
    });
    setTimeout(() => {
      props.$w.utils.navigateTo({
        pageId: pageMap[action],
        params: {}
      });
    }, 300);
  };
  const getStatusBadge = count => {
    if (count === 0) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">已完成</Badge>;
    } else if (count > 10) {
      return <Badge variant="destructive" className="bg-red-100 text-red-800">{count} 待办</Badge>;
    } else {
      return <Badge className="bg-amber-100 text-amber-800">{count} 待办</Badge>;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-24">
      {/* 头部信息 */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold font-['Ma_Shan_Zheng'] text-gray-800">管理首页</h1>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
        </div>
        <p className="text-gray-600 text-sm">{todayDate}</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-xs mb-1">在院老人</p>
                <p className="text-3xl font-bold">{elderCount}</p>
                <p className="text-blue-100 text-xs mt-2">正常在院</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-amber-100 text-xs mb-1">待审核总数</p>
                <p className="text-3xl font-bold">
                  {pendingCounts.dailyReports + pendingCounts.leaveRequests + pendingCounts.billApprovals}
                </p>
                <p className="text-amber-100 text-xs mt-2">需及时处理</p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-200" />
            </div>
          </Card>
        </div>

        {/* 审核管理入口 */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-amber-600" />
            审核管理
          </h2>
          <div className="space-y-3">
            {/* 日报审核 */}
            <Card className="bg-white p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">日报审核</h3>
                    <p className="text-xs text-gray-500">审核护理日报内容</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(pendingCounts.dailyReports)}
                  <Button size="sm" variant="ghost" onClick={() => handleQuickAction('daily')} className="text-blue-600 hover:text-blue-800">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* 请假审核 */}
            <Card className="bg-white p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">请假审核</h3>
                    <p className="text-xs text-gray-500">审核外出请假申请</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(pendingCounts.leaveRequests)}
                  <Button size="sm" variant="ghost" onClick={() => handleQuickAction('leave')} className="text-green-600 hover:text-green-800">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* 账单审核 */}
            <Card className="bg-white p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">账单审核</h3>
                    <p className="text-xs text-gray-500">审核缴费账单明细</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(pendingCounts.billApprovals)}
                  <Button size="sm" variant="ghost" onClick={() => handleQuickAction('bill')} className="text-amber-600 hover:text-amber-800">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 快捷操作 */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            快捷操作
          </h2>
          <div className="space-y-3">
            {/* 老人管理 */}
            <Card className="bg-white p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">老人管理</h3>
                    <p className="text-xs text-gray-500">管理老人信息和验证码</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleQuickAction('elder')} className="text-purple-600 hover:text-purple-800">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* 数据导入 */}
            <Card className="bg-white p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">数据导入</h3>
                    <p className="text-xs text-gray-500">批量导入系统数据</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleQuickAction('data')} className="text-rose-600 hover:text-rose-800">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AdminTabBar />
    </div>;
}