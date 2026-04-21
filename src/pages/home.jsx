// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Avatar, AvatarImage, Button, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Heart, Calendar, User, Phone, MapPin, Clock, ChevronRight, Bell, FileText, DollarSign } from 'lucide-react';

import TabBar from '@/components/TabBar';
import { NursingHomeBrand } from '@/components/NursingHomeBrand';
import { DemoBanner } from '@/components/DemoBanner';
export default function CareHome(props) {
  const {
    toast
  } = useToast();

  // 演示模式检测
  const demoMode = props.$w.page.dataset.params.demo;
  const isDemo = demoMode === 'family';

  // 检查用户登录状态和角色权限（演示模式跳过）
  useEffect(() => {
    if (isDemo) return;
    const checkAuth = async () => {
      try {
        await props.$w.auth.getUserInfo({
          force: true
        });
        const user = props.$w.auth.currentUser;
        // 未登录跳转到登录页
        if (!user?.userId) {
          toast({
            title: '请先登录',
            description: '需要登录后才能访问',
            variant: 'destructive'
          });
          props.$w.utils.redirectTo({
            pageId: 'login',
            params: {}
          });
          return;
        }
        // 检查角色权限
        if (user.type && user.type !== 'family') {
          toast({
            title: '权限限制',
            description: '此页面仅家属用户可以访问',
            variant: 'destructive'
          });
          props.$w.utils.redirectTo({
            pageId: 'login',
            params: {}
          });
        }
      } catch (error) {
        console.error('权限检查失败:', error);
        props.$w.utils.redirectTo({
          pageId: 'login',
          params: {}
        });
      }
    };
    checkAuth();
  }, []);

  // 拦截返回事件，防止返回到登录/绑定页面
  useEffect(() => {
    // 添加历史记录，确保首页是历史栈的起点
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      // 用户点击返回时，再次压入当前页，保持在首页
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 如果非演示模式且用户未登录或角色不匹配，显示提示
  const user = props.$w.auth.currentUser;
  if (!isDemo && (!user?.userId || user?.type && user.type !== 'family')) {
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
              此页面仅家属用户可以访问
            </p>
            <Button onClick={() => {
            props.$w.utils.redirectTo({
              pageId: 'login',
              params: {}
            });
          }} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              前往登录
            </Button>
          </div>
        </Card>
      </div>;
  }
  // 状态管理
  const [elderInfo, setElderInfo] = useState(null);
  const [latestInfo, setLatestInfo] = useState({
    dailyReport: null,
    leaveRequest: null,
    bill: null
  });
  const [loading, setLoading] = useState(true);

  // 加载绑定老人和最新数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. 获取当前用户绑定的老人
        const user = props.$w.auth.currentUser;
        const familyId = isDemo ? 'family_001' : user?.userId || 'demo_user';

        // 查询绑定关系（演示模式使用demo数据源）
        const bindingResult = await props.$w.cloud.callDataSource({
          dataSourceName: isDemo ? 'demo_family_members' : 'family_members',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  familyId: {
                    $eq: familyId
                  }
                }, {
                  status: {
                    $eq: 'active'
                  }
                }]
              }
            },
            select: {
              $master: true
            },
            pageSize: 10,
            pageNumber: 1
          }
        });
        const bindings = bindingResult?.records || [];
        if (bindings.length === 0) {
          setLoading(false);
          return;
        }
        const binding = bindings[0];
        const elderId = binding.elderId;

        // 2. 获取老人详细信息（演示模式使用demo数据源）
        const elderResult = await props.$w.cloud.callDataSource({
          dataSourceName: isDemo ? 'demo_elders' : 'elders',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  _id: {
                    $eq: elderId
                  }
                }]
              }
            },
            select: {
              $master: true
            },
            pageSize: 1,
            pageNumber: 1
          }
        });
        const elder = elderResult?.records?.[0];
        if (elder) {
          setElderInfo({
            name: elder.name,
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
            age: elder.age,
            admissionDate: elder.admissionDate,
            roomNumber: elder.roomNumber,
            careLevel: elder.careLevel,
            primaryNurse: elder.primaryNurse,
            nursePhone: elder.emergencyPhone,
            emergencyContact: elder.emergencyContact,
            emergencyPhone: elder.emergencyPhone,
            healthStatus: elder.healthStatus,
            moodStatus: '愉快',
            lastUpdate: new Date().toLocaleString('zh-CN')
          });
        }

        // 3. 获取最新护理日报
        const dailyResult = await props.$w.cloud.callDataSource({
          dataSourceName: isDemo ? 'demo_care_records' : 'daily_reports',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  elderId: {
                    $eq: elderId
                  }
                }]
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              date: 'desc'
            }],
            pageSize: 1,
            pageNumber: 1
          }
        });
        const dailyReport = dailyResult?.records?.[0];

        // 4. 获取最新请假申请
        const leaveResult = await props.$w.cloud.callDataSource({
          dataSourceName: isDemo ? 'demo_leave_records' : 'leave_requests',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  elderId: {
                    $eq: elderId
                  }
                }]
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 1,
            pageNumber: 1
          }
        });
        const leaveRequest = leaveResult?.records?.[0];

        // 5. 获取最新账单
        const billResult = await props.$w.cloud.callDataSource({
          dataSourceName: isDemo ? 'demo_bills' : 'bills',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  elderId: {
                    $eq: elderId
                  }
                }]
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 1,
            pageNumber: 1
          }
        });
        const bill = billResult?.records?.[0];
        setLatestInfo({
          dailyReport: dailyReport ? {
            date: dailyReport.date,
            meal: `午餐：${dailyReport.lunch}`,
            mood: dailyReport.mood,
            time: '12:00'
          } : null,
          leaveRequest: leaveRequest ? {
            status: leaveRequest.status === 'pending' ? '待审批' : leaveRequest.status === 'approved' ? '已批准' : '已拒绝',
            type: '外出请假',
            date: leaveRequest.startDate,
            time: new Date(leaveRequest.createdAt).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit'
            })
          } : null,
          bill: bill ? {
            month: bill.month,
            amount: `¥${bill.totalAmount}`,
            status: bill.status === 'unpaid' ? '待缴费' : '已缴费',
            dueDate: bill.dueDate
          } : null
        });
      } catch (error) {
        console.error('加载数据失败:', error);
        toast({
          title: '加载失败',
          description: '获取数据时出错，请稍后重试',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isDemo]);

  // 将老人信息存储到全局，供其他页面使用
  useEffect(() => {
    if (elderInfo) {
      window.currentElderInfo = elderInfo;
    }
  }, [elderInfo]);
  const handleNavigateToDaily = () => {
    props.$w.utils.navigateTo({
      pageId: 'care',
      params: isDemo ? {
        demo: 'family'
      } : {}
    });
  };
  const handleNavigateToLeave = () => {
    props.$w.utils.navigateTo({
      pageId: 'leave',
      params: isDemo ? {
        demo: 'family'
      } : {}
    });
  };
  const handleNavigateToBill = () => {
    props.$w.utils.navigateTo({
      pageId: 'bill',
      params: isDemo ? {
        demo: 'family'
      } : {}
    });
  };
  const handleCallNurse = () => {
    toast({
      title: '正在拨号',
      description: `正在联系 ${elderInfo.primaryNurse}`
    });
  };
  const handleEmergencyCall = () => {
    toast({
      title: '紧急联系',
      description: `正在联系 ${elderInfo.emergencyContact}`
    });
  };

  // 计算入院天数
  // 计算入院天数
  const getAdmissionDays = () => {
    const admission = new Date(elderInfo.admissionDate);
    const today = new Date();
    const diffTime = Math.abs(today - admission);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const handleExitDemo = () => {
    props.$w.utils.redirectTo({
      pageId: 'login',
      params: {}
    });
  };

  // 加载中显示
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">加载中...</p>
      </div>
    </div>;
  }

  // 没有绑定老人时显示
  if (!elderInfo) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      {isDemo && <DemoBanner role="family" onBack={handleExitDemo} />}
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">尚未绑定老人</h2>
            <p className="text-gray-600 mb-6">请先绑定老人信息，以便查看护理日报、请假记录和账单</p>
            <Button onClick={() => props.$w.utils.navigateTo({
              pageId: 'bind-senior',
              params: isDemo ? {
                demo: 'family'
              } : {}
            })} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-6 py-2">
              立即绑定
            </Button>
          </div>
        </Card>
      </div>
      <TabBar currentPage="home" isDemo={isDemo} $w={props.$w} />
    </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      {isDemo && <DemoBanner role="family" onBack={handleExitDemo} />}
      <div className="container mx-auto px-4 py-6">
        {/* 头部标题 */}
        <div className="mb-6">
          <NursingHomeBrand showLogo={false} showSlogan={true} size="normal" $w={props.$w} />
        </div>

        {/* 老人基本信息卡片 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl mb-6">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Avatar className="w-16 h-16 mr-4">
                <AvatarImage src={elderInfo.avatar} alt={elderInfo.name} />
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
              {latestInfo.dailyReport ? <React.Fragment>
                <p className="text-gray-600 mb-2">{latestInfo.dailyReport.meal}</p>
                <p className="text-sm text-gray-500 mb-3">心情: {latestInfo.dailyReport.mood} · {latestInfo.dailyReport.time}</p>
              </React.Fragment> : <p className="text-gray-400 mb-3">暂无护理日报数据</p>}
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
                <Badge className="bg-yellow-100 text-yellow-800">{latestInfo.leaveRequest ? latestInfo.leaveRequest.status : '暂无'}</Badge>
              </div>
              {latestInfo.leaveRequest ? <React.Fragment>
                <p className="text-gray-600 mb-1">{latestInfo.leaveRequest.type}</p>
                <p className="text-sm text-gray-500 mb-3">{latestInfo.leaveRequest.date} {latestInfo.leaveRequest.time}</p>
              </React.Fragment> : <p className="text-gray-400 mb-3">暂无请假申请</p>}
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
                <Badge className="bg-orange-100 text-orange-800">{latestInfo.bill ? latestInfo.bill.status : '暂无'}</Badge>
              </div>
              {latestInfo.bill ? <React.Fragment>
                <p className="text-gray-600 mb-1">{latestInfo.bill.month}</p>
                <p className="text-lg font-bold text-orange-600 mb-3">{latestInfo.bill.amount}</p>
                <p className="text-sm text-gray-500 mb-3">截止日期: {latestInfo.bill.dueDate}</p>
              </React.Fragment> : <p className="text-gray-400 mb-3">暂无账单数据</p>}
              <Button size="sm" onClick={handleNavigateToBill} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full">
                查看账单详情
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        </div>

      </div>
      
      {/* 底部导航 */}
      <TabBar currentPage="home" isDemo={isDemo} $w={props.$w} />
    </div>;
}