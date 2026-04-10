// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Calendar, DollarSign, UserCheck, AlertCircle, CheckCircle, Clock, ArrowRight, Bell, Users } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
export default function AdminHome(props) {
  const {
    toast
  } = useToast();

  // 检查用户角色权限
  useEffect(() => {
    const user = props.$w.auth.currentUser;
    const allowedTypes = ['nurse', 'staff', 'admin'];
    if (user?.type && !allowedTypes.includes(user.type)) {
      toast({
        title: '权限限制',
        description: '此页面仅管理员、护工、文员可以访问',
        variant: 'destructive'
      });
      props.$w.utils.redirectTo({
        pageId: 'login',
        params: {}
      });
    }
  }, []);

  // 如果用户未登录或角色不匹配，显示提示
  const user = props.$w.auth.currentUser;
  const allowedTypes = ['nurse', 'staff', 'admin'];
  if (!user?.userId || user?.type && !allowedTypes.includes(user.type)) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-8">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl p-12 max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              权限验证中...
            </h2>
            <p className="text-gray-600 mb-6" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              此页面仅管理员、护工、文员可以访问
            </p>
            <Button onClick={() => {
            props.$w.utils.redirectTo({
              pageId: 'login',
              params: {}
            });
          }} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              前往登录
            </Button>
          </div>
        </Card>
      </div>;
  }
  const [pendingCounts, setPendingCounts] = useState({
    dailyReports: 0,
    leaveRequests: 0,
    billApprovals: 0
  });
  const [todayStats, setTodayStats] = useState({
    approved: 0,
    pending: 0
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

      // 计算今日统计（已审核和待审核总数）
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // 今日已审核的日报
      const todayDailyApproved = await db.collection('daily_reports').where({
        status: 'approved',
        updatedAt: _.gte(today).and(_.lt(tomorrow))
      }).count();

      // 今日已审核的请假
      const todayLeaveApproved = await db.collection('leave_requests').where({
        status: 'approved',
        updatedAt: _.gte(today).and(_.lt(tomorrow))
      }).count();

      // 今日已审核的账单
      const todayBillApproved = await db.collection('bills').where({
        status: 'approved',
        updatedAt: _.gte(today).and(_.lt(tomorrow))
      }).count();
      const totalApproved = todayDailyApproved.total + todayLeaveApproved.total + todayBillApproved.total;
      const totalPending = dailyResult.total + leaveResult.total + billResult.total;
      setTodayStats({
        approved: totalApproved,
        pending: totalPending
      });
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
      'bill': 'admin-bill'
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

        {/* 系统状态 */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            系统状态
          </h2>
          <div className="space-y-3">
            {/* 今日统计 */}
            <Card className="bg-white p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">今日统计</h3>
                    <p className="text-xs text-gray-500">今日系统操作概览</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">已审核 {todayStats.approved} 项</div>
                  <div className="text-sm text-gray-600">待审核 {todayStats.pending} 项</div>
                </div>
              </div>
            </Card>

            {/* 系统通知 */}
            <Card className="bg-white p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">系统通知</h3>
                    <p className="text-xs text-gray-500">重要系统消息提醒</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    系统正常
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AdminTabBar />
    </div>;
}