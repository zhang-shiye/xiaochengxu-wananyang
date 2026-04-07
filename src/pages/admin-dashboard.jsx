// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { FileText, UserCheck, DollarSign, Clock, CheckCircle, AlertCircle, ArrowRight, Bell, Settings, User, MessageSquare } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
export default function AdminDashboard(props) {
  const {
    toast
  } = useToast();
  const [pendingCounts, setPendingCounts] = useState({
    dailyReports: 12,
    leaveRequests: 8,
    billApprovals: 5
  });
  const [recentActivities, setRecentActivities] = useState([{
    id: 1,
    type: 'daily_report',
    title: '王奶奶护理日报待审批',
    time: '2026-04-07 14:30',
    priority: 'normal'
  }, {
    id: 2,
    type: 'leave_request',
    title: '李爷爷外出请假申请',
    time: '2026-04-07 13:45',
    priority: 'high'
  }, {
    id: 3,
    type: 'bill_approval',
    title: '4月护理费用待审核',
    time: '2026-04-07 10:20',
    priority: 'normal'
  }]);
  const [verificationCodes, setVerificationCodes] = useState([{
    id: 1,
    phone: '138****1234',
    code: '123456',
    time: '2026-04-07 15:20',
    status: 'pending'
  }, {
    id: 2,
    phone: '139****5678',
    code: '789012',
    time: '2026-04-07 15:18',
    status: 'pending'
  }]);
  const handleQuickAction = action => {
    toast({
      title: '操作成功',
      description: `正在跳转到${action}页面`,
      duration: 2000
    });
    const pageMap = {
      'daily': 'admin-daily-review',
      'leave': 'admin-leave-review',
      'bill': 'admin-bill-review',
      'verification': 'admin-verification-code',
      'import': 'admin-data-import'
    };
    props.$w.utils.navigateTo({
      pageId: pageMap[action],
      params: {}
    });
  };
  const handleForwardCode = async code => {
    try {
      const shareText = `【专属验证码】\n\n验证码：${code.code}\n有效期：今日有效\n\n请在微信小程序中输入此验证码完成绑定。如有疑问请联系护理院工作人员。`;
      if (navigator.share) {
        await navigator.share({
          title: '老人专属验证码',
          text: shareText
        });
      } else {
        // 降级方案：复制到剪贴板
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareText);
          toast({
            title: '验证码已复制',
            description: '分享内容已复制到剪贴板'
          });
        }
      }
      setVerificationCodes(prev => prev.map(c => c.id === codeId ? {
        ...c,
        status: 'forwarded'
      } : c));
    } catch (error) {
      toast({
        title: '分享失败',
        description: '请手动复制验证码发送',
        variant: 'destructive'
      });
    }
  };
  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'normal':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };
  const getActivityIcon = type => {
    switch (type) {
      case 'daily_report':
        return <FileText className="w-4 h-4" />;
      case 'leave_request':
        return <UserCheck className="w-4 h-4" />;
      case 'bill_approval':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      {/* 顶部标题栏 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-900" style={{
          fontFamily: 'Playfair Display, serif'
        }}>
            皖安养-管理端
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* 待办事项统计卡片 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
              待办事项
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <div className="text-2xl font-bold text-amber-600">{pendingCounts.dailyReports}</div>
                <div className="text-sm text-gray-600">日报待审</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <div className="text-2xl font-bold text-amber-600">{pendingCounts.leaveRequests}</div>
                <div className="text-sm text-gray-600">请假待审</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <div className="text-2xl font-bold text-amber-600">{pendingCounts.billApprovals}</div>
                <div className="text-sm text-gray-600">缴费待审</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 快捷操作按钮 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-amber-600 mr-2" />
              快捷操作
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <Button className="justify-between bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl" onClick={() => handleQuickAction('daily')}>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-3" />
                  <span>日报审批</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary" className="mr-2">{pendingCounts.dailyReports}</Badge>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
              
              <Button className="justify-between bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl" onClick={() => handleQuickAction('leave')}>
                <div className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-3" />
                  <span>请假审批</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary" className="mr-2">{pendingCounts.leaveRequests}</Badge>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
              
              <Button className="justify-between bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl" onClick={() => handleQuickAction('bill')}>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-3" />
                  <span>缴费审批</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary" className="mr-2">{pendingCounts.billApprovals}</Badge>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
            </div>
          </div>
        </Card>

        {/* 验证码转发 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 text-amber-600 mr-2" />
              验证码转发
            </h2>
            <div className="space-y-3">
              {verificationCodes.map(code => <div key={code.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">{code.phone}</div>
                      <div className="text-xs text-gray-600">{code.code} · {code.time}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50" onClick={() => handleForwardCode(code.id)} disabled={code.status === 'forwarded'}>
                    {code.status === 'forwarded' ? '已转发' : '转发'}
                  </Button>
                </div>)}
            </div>
          </div>
        </Card>

        {/* 最近活动 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 text-amber-600 mr-2" />
              最近活动
            </h2>
            <div className="space-y-3">
              {recentActivities.map(activity => <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${getPriorityColor(activity.priority)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{activity.title}</div>
                    <div className="text-xs text-gray-600">{activity.time}</div>
                  </div>
                  <Badge variant="outline" className={getPriorityColor(activity.priority)}>
                    {activity.priority === 'high' ? '紧急' : '一般'}
                  </Badge>
                </div>)}
            </div>
          </div>
        </Card>
      </div>

      {/* 底部导航 */}
      <AdminTabBar currentPage="admin-dashboard" />
    </div>;
}