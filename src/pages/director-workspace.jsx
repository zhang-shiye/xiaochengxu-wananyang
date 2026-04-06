// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea, useToast, Avatar, AvatarImage, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';

import { useForm } from 'react-hook-form';
export default function DirectorWorkspace(props) {
  const {
    toast
  } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [bills, setBills] = useState([]);
  const [elderStats, setElderStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  useEffect(() => {
    // 模拟获取院长信息
    setCurrentUser({
      userId: props.$w.page.dataset.params?.userId || 'director',
      name: '张院长',
      avatar: 'https://images.unsplash.com/photo-1566616390298-965a76e5b1e5?w=150&h=150&fit=crop&crop=face'
    });

    // 模拟获取护工列表
    setStaffList([{
      id: 1,
      userId: 'staff001',
      name: '李阿姨',
      avatar: 'https://images.unsplash.com/photo-1595113676271-4060b9e83177?w=150&h=150&fit=crop&crop=face',
      status: '在职',
      eldersCount: 2,
      reportsCount: 15
    }, {
      id: 2,
      userId: 'staff002',
      name: '王阿姨',
      avatar: 'https://images.unsplash.com/photo-1566616390298-965a76e5b1e5?w=150&h=150&fit=crop&crop=face',
      status: '在职',
      eldersCount: 3,
      reportsCount: 20
    }]);

    // 模拟获取请假申请列表
    setLeaveRequests([{
      id: 1,
      elderName: '张爷爷',
      reason: '探亲访友',
      startDate: '2026-04-10',
      endDate: '2026-04-12',
      status: 'pending',
      submitTime: '2026-04-08 14:30'
    }, {
      id: 2,
      elderName: '李奶奶',
      reason: '外出就医',
      startDate: '2026-04-15',
      endDate: '2026-04-15',
      status: 'approved',
      approvalTime: '2026-04-08 16:45',
      submitTime: '2026-04-05 10:20'
    }]);

    // 模拟获取缴费账单列表
    setBills([{
      id: 1,
      elderName: '张爷爷',
      period: '2026-04',
      amount: 3500,
      status: 'pending',
      dueDate: '2026-04-15'
    }, {
      id: 2,
      elderName: '李奶奶',
      period: '2026-04',
      amount: 3800,
      status: 'paid',
      payTime: '2026-04-05 10:30'
    }]);

    // 模拟获取老人统计数据
    setElderStats({
      total: 25,
      normal: 20,
      attention: 3,
      emergency: 2,
      staffCount: 5,
      todayReports: 15
    });
  }, []);
  const handleLeaveApproval = async (requestId, action) => {
    try {
      // 模拟审批操作
      toast({
        title: action === 'approve' ? '审批通过' : '审批拒绝',
        description: '请假申请已处理'
      });
      // 更新状态
      setLeaveRequests(prevRequests => prevRequests.map(req => req.id === requestId ? {
        ...req,
        status: action === 'approve' ? 'approved' : 'rejected',
        approvalTime: new Date().toISOString().substring(0, 19).replace('T', ' ')
      } : req));
      // 实际项目中应该调用云函数处理审批
    } catch (error) {
      toast({
        title: '操作失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleBillPayment = async billId => {
    try {
      // 模拟缴费操作
      toast({
        title: '缴费成功',
        description: '账单已自动标记为已支付'
      });
      // 更新状态
      setBills(prevBills => prevBills.map(bill => bill.id === billId ? {
        ...bill,
        status: 'paid',
        payTime: new Date().toISOString().substring(0, 19).replace('T', ' ')
      } : bill));
      // 实际项目中应该调用云函数处理缴费
    } catch (error) {
      toast({
        title: '缴费失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  if (!currentUser) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p>正在加载...</p>
    </div>;
  }
  return <div className="min-h-screen bg-gray-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* 院长信息头部 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800" style={{
          fontFamily: 'DM Sans, sans-serif'
        }}>
            院长管理台
          </h1>
          <p className="text-gray-600 mt-2">{currentUser.name} · {currentUser.userId}</p>
        </div>

        {/* 统计概览 */}
        <Card className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">📊 今日概览</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{elderStats?.total || 0}</p>
                <p className="text-sm text-gray-600">老人总数</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{elderStats?.normal || 0}</p>
                <p className="text-sm text-gray-600">状态正常</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{elderStats?.attention || 0}</p>
                <p className="text-sm text-gray-600">需要关注</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{elderStats?.emergency || 0}</p>
                <p className="text-sm text-gray-600">紧急情况</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{elderStats?.staffCount || 0}</p>
                <p className="text-sm text-gray-600">护工总数</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-teal-600">{elderStats?.todayReports || 0}</p>
                <p className="text-sm text-gray-600">今日日报</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 功能切换标签 */}
        <div className="flex space-x-2 mb-6">
          <Button className={activeTab === 'overview' ? 'bg-blue-600' : 'bg-gray-600'} onClick={() => setActiveTab('overview')}>
            📈 综合管理
          </Button>
          <Button className={activeTab === 'leave' ? 'bg-blue-600' : 'bg-gray-600'} onClick={() => setActiveTab('leave')}>
            📝 请假审批
          </Button>
          <Button className={activeTab === 'bill' ? 'bg-blue-600' : 'bg-gray-600'} onClick={() => setActiveTab('bill')}>
            💰 缴费管理
          </Button>
        </div>

        {/* 综合管理模块 */}
        {activeTab === 'overview' && <Card className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">👥 护工管理</h2>
              <div className="space-y-4">
                {staffList.map(staff => <div key={staff.id} className="flex items-center space-x-4 border-b pb-4">
                    <Avatar className="w-12 h-12 border-2 border-blue-200">
                      <AvatarImage src={staff.avatar} alt={staff.name} />
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{staff.name}</p>
                      <p className="text-sm text-gray-600">ID：{staff.userId} · 负责 {staff.eldersCount} 位老人</p>
                      <p className="text-sm text-gray-600">已提交 {staff.reportsCount} 份日报</p>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full ${staff.status === '在职' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {staff.status}
                    </span>
                  </div>)}
              </div>
            </div>
          </Card>}

        {/* 请假审批模块 */}
        {activeTab === 'leave' && <Card className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">📝 请假申请审批</h2>
              <div className="space-y-4">
                {leaveRequests.map(request => <div key={request.id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{request.elderName}</p>
                      <span className={`text-sm px-3 py-1 rounded-full ${request.status === 'pending' ? 'bg-orange-100 text-orange-600' : request.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {request.status === 'pending' ? '待审批' : request.status === 'approved' ? '已批准' : '已拒绝'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">事由：{request.reason}</p>
                      <p className="text-sm text-gray-600">时间：{request.startDate} 至 {request.endDate}</p>
                      <p className="text-sm text-gray-600">提交时间：{request.submitTime}</p>
                      {request.approvalTime && <p className="text-sm text-gray-600">审批时间：{request.approvalTime}</p>}
                    </div>
                    {request.status === 'pending' && <div className="flex space-x-2 mt-4">
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleLeaveApproval(request.id, 'approve')}>
                          ✅ 批准
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleLeaveApproval(request.id, 'reject')}>
                          ❌ 拒绝
                        </Button>
                      </div>}
                  </div>)}
              </div>
            </div>
          </Card>}

        {/* 缴费管理模块 */}
        {activeTab === 'bill' && <Card className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">💰 缴费账单管理</h2>
              <div className="space-y-4">
                {bills.map(bill => <div key={bill.id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{bill.elderName}</p>
                      <span className={`text-sm px-3 py-1 rounded-full ${bill.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {bill.status === 'pending' ? '待支付' : '已支付'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">账单周期：{bill.period}</p>
                      <p className="text-lg font-bold text-gray-800">金额：￥{bill.amount}</p>
                      <p className="text-sm text-gray-600">到期日期：{bill.dueDate}</p>
                      {bill.payTime && <p className="text-sm text-gray-600">支付时间：{bill.payTime}</p>}
                    </div>
                    {bill.status === 'pending' && <Button className="bg-green-600 hover:bg-green-700 mt-4" onClick={() => handleBillPayment(bill.id)}>
                        💰 标记为已支付
                      </Button>}
                  </div>)}
              </div>
            </div>
          </Card>}

        {/* 底部操作按钮 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button className="bg-gray-600 hover:bg-gray-700" onClick={() => {
          props.$w.utils.navigateTo({
            pageId: 'backend-login',
            params: {}
          });
        }}>
            🔄 切换账号
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
          toast({
            title: '数据已同步',
            description: '最新数据已自动更新到系统'
          });
        }}>
            📡 数据同步
          </Button>
        </div>
      </div>
    </div>;
}