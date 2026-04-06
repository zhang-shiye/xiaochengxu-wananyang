// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Avatar, AvatarImage, Button, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Heart, Calendar, User, Phone, MapPin, Clock, ChevronRight, Bell, FileText, DollarSign } from 'lucide-react';

import TabBar from '@/components/TabBar';
export default function CareHome(props) {
  const {
    toast
  } = useToast();
  const [elderInfo, setElderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latestInfo, setLatestInfo] = useState({
    dailyReport: null,
    leaveRequest: null,
    bill: null
  });
  const handleNavigateToDaily = () => {
    props.$w.utils.navigateTo({
      pageId: 'home',
      params: {}
    });
  };
  const handleNavigateToLeave = () => {
    props.$w.utils.navigateTo({
      pageId: 'leave',
      params: {}
    });
  };
  const handleNavigateToBill = () => {
    props.$w.utils.navigateTo({
      pageId: 'bill',
      params: {}
    });
  };
  const handleCallNurse = () => {
    if (!elderInfo) return;
    toast({
      title: '正在拨号',
      description: `正在联系 ${elderInfo.primaryNurse}`
    });
  };
  const handleEmergencyCall = () => {
    if (!elderInfo) return;
    toast({
      title: '紧急联系',
      description: `正在联系 ${elderInfo.emergencyContact}`
    });
  };

  // 获取老人信息
  const fetchElderInfo = async () => {
    try {
      setLoading(true);
      // 查询老人信息
      const result = await props.$w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          dataSourceName: 'elders',
          methodName: 'query',
          params: {
            filter: {
              status: 'active'
            },
            limit: 1
          }
        }
      });
      if (result.result && result.result.data && result.result.data.length > 0) {
        const elder = result.result.data[0];
        setElderInfo({
          name: elder.name,
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
          age: elder.age,
          admissionDate: elder.admissionDate,
          roomNumber: elder.roomNumber,
          careLevel: elder.careLevel,
          primaryNurse: elder.primaryNurse,
          emergencyContact: elder.emergencyContact,
          emergencyPhone: elder.emergencyPhone,
          healthStatus: elder.healthStatus,
          moodStatus: '愉快',
          lastUpdate: new Date().toLocaleString('zh-CN')
        });

        // 获取最新护理日报
        await fetchLatestDailyReport(elder._id);
        // 获取最新请假申请
        await fetchLatestLeaveRequest(elder._id);
        // 获取最新账单
        await fetchLatestBill(elder._id);
      }
    } catch (error) {
      toast({
        title: '获取数据失败',
        description: '请检查网络连接后重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取最新护理日报
  const fetchLatestDailyReport = async elderId => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          dataSourceName: 'daily_reports',
          methodName: 'query',
          params: {
            filter: {
              elderId: elderId
            },
            sort: {
              date: -1
            },
            limit: 1
          }
        }
      });
      if (result.result && result.result.data && result.result.data.length > 0) {
        const report = result.result.data[0];
        setLatestInfo(prev => ({
          ...prev,
          dailyReport: {
            date: report.date,
            meal: `午餐：${report.lunch}`,
            mood: report.mood,
            time: '12:00'
          }
        }));
      }
    } catch (error) {
      console.error('获取护理日报失败:', error);
    }
  };

  // 获取最新请假申请
  const fetchLatestLeaveRequest = async elderId => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          dataSourceName: 'leave_requests',
          methodName: 'query',
          params: {
            filter: {
              elderId: elderId
            },
            sort: {
              submitTime: -1
            },
            limit: 1
          }
        }
      });
      if (result.result && result.result.data && result.result.data.length > 0) {
        const request = result.result.data[0];
        setLatestInfo(prev => ({
          ...prev,
          leaveRequest: {
            status: request.status === 'approved' ? '已批准' : request.status === 'rejected' ? '已拒绝' : '待审批',
            type: request.reason,
            date: request.startDate,
            time: new Date(request.submitTime).toLocaleTimeString('zh-CN')
          }
        }));
      }
    } catch (error) {
      console.error('获取请假申请失败:', error);
    }
  };

  // 获取最新账单
  const fetchLatestBill = async elderId => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          dataSourceName: 'bills',
          methodName: 'query',
          params: {
            filter: {
              elderId: elderId
            },
            sort: {
              month: -1
            },
            limit: 1
          }
        }
      });
      if (result.result && result.result.data && result.result.data.length > 0) {
        const bill = result.result.data[0];
        setLatestInfo(prev => ({
          ...prev,
          bill: {
            month: bill.month,
            amount: `¥${bill.totalAmount}`,
            status: bill.status === 'paid' ? '已缴费' : '待缴费',
            dueDate: bill.dueDate
          }
        }));
      }
    } catch (error) {
      console.error('获取账单失败:', error);
    }
  };

  // 计算入院天数
  const getAdmissionDays = () => {
    if (!elderInfo) return 0;
    const admission = new Date(elderInfo.admissionDate);
    const today = new Date();
    const diffTime = Math.abs(today - admission);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  useEffect(() => {
    fetchElderInfo();
  }, []);

  // 加载状态
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-amber-900 mb-2" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              皖安养
            </h1>
            <p className="text-amber-700" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              用心陪伴，安心养老
            </p>
          </div>
          
          {/* 骨架屏加载 */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
                  <div className="h-8 bg-gray-300 rounded mt-2"></div>
                </div>)}
            </div>
          </div>
        </div>
      </div>;
  }

  // 空数据状态
  if (!elderInfo) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">未找到老人信息</h3>
          <p className="text-gray-600 mb-4">请检查网络连接或联系管理员</p>
          <Button onClick={fetchElderInfo} className="bg-amber-500 hover:bg-amber-600">
            重新加载
          </Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* 头部标题 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-amber-900 mb-2" style={{
          fontFamily: 'Playfair Display, serif'
        }}>

            皖安养
          </h1>
          <p className="text-amber-700" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>

            用心陪伴，安心养老
          </p>
        </div>

        {/* 老人基本信息卡片 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl mb-6">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Avatar className="w-16 h-16 mr-4">
                <AvatarImage src={elderInfo?.avatar || '/default-avatar.png'} alt={elderInfo?.name || '老人'} />
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800" style={{
                fontFamily: 'Playfair Display, serif'
              }}>

                  {elderInfo.name}
                </h2>
                <p className="text-gray-600" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>

                  {elderInfo.age}岁 · {elderInfo.careLevel}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <Heart className="w-4 h-4 mr-1" />
                {elderInfo.healthStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-amber-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">入院时间</p>
                  <p className="font-medium">{elderInfo.admissionDate}</p>
                  <p className="text-xs text-gray-400">已入住 {getAdmissionDays()} 天</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-amber-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">房间号</p>
                  <p className="font-medium">{elderInfo.roomNumber}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-amber-600 mr-2" />
                  <span className="text-gray-700">责任护工</span>
                </div>
                <Button size="sm" variant="outline" onClick={handleCallNurse} className="border-amber-200 text-amber-700 hover:bg-amber-50">
                  <Phone className="w-4 h-4 mr-1" />
                  联系
                </Button>
              </div>
              <p className="text-lg font-medium text-gray-800">{elderInfo.primaryNurse}</p>
              <p className="text-sm text-gray-500">{elderInfo.nursePhone}</p>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-rose-600 mr-2" />
                  <span className="text-gray-700">紧急联系</span>
                </div>
                <Button size="sm" variant="outline" onClick={handleEmergencyCall} className="border-rose-200 text-rose-700 hover:bg-rose-50">
                  <Phone className="w-4 h-4 mr-1" />
                  拨打
                </Button>
              </div>
              <p className="font-medium text-gray-800 text-[1.125rem]">{elderInfo.emergencyContact}</p>
              <p className="text-sm text-gray-500">{elderInfo.emergencyPhone}</p>
            </div>

            <div className="border-t pt-4 mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">最后更新: {elderInfo.lastUpdate}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 最新信息区域 */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-bold text-gray-800" style={{
          fontFamily: 'Playfair Display, serif'
        }}>

            最新动态
          </h3>

          {/* 今日护理日报 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-gray-800">今日护理</span>
                </div>
                <Badge className="bg-green-100 text-green-800">最新</Badge>
              </div>
              <p className="text-gray-600 mb-2">{latestInfo.dailyReport.meal}</p>
              <p className="text-sm text-gray-500 mb-3">心情: {latestInfo.dailyReport.mood} · {latestInfo.dailyReport.time}</p>
              <Button size="sm" onClick={handleNavigateToDaily} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full">
                查看详细日报
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>

          {/* 请假申请状态 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-800">请假申请</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">{latestInfo.leaveRequest.status}</Badge>
              </div>
              <p className="text-gray-600 mb-1">{latestInfo.leaveRequest.type}</p>
              <p className="text-sm text-gray-500 mb-3">{latestInfo.leaveRequest.date} {latestInfo.leaveRequest.time}</p>
              <Button size="sm" onClick={handleNavigateToLeave} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full">
                查看申请进度
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>

          {/* 缴费账单 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="font-medium text-gray-800">缴费账单</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">{latestInfo.bill.status}</Badge>
              </div>
              <p className="text-gray-600 mb-1">{latestInfo.bill.month}</p>
              <p className="text-lg font-bold text-orange-600 mb-3">{latestInfo.bill.amount}</p>
              <p className="text-sm text-gray-500 mb-3">截止日期: {latestInfo.bill.dueDate}</p>
              <Button size="sm" onClick={handleNavigateToBill} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full">
                查看账单详情
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        </div>

      </div>
      
      {/* 底部导航 */}
      <TabBar currentPage="care-home" />
    </div>;
}