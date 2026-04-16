// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Avatar, AvatarImage, Button, useToast, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { FileText } from 'lucide-react';

import DataPermissionHelper from '@/components/PermissionCheck';
import TabBar from '@/components/TabBar';
import { DemoBanner } from '@/components/DemoBanner';
export default function Home(props) {
  const {
    toast
  } = useToast();

  // 演示模式检测
  const demoMode = props.$w.page.dataset.params.demo;
  const isDemo = demoMode === 'family';

  // 检查用户角色权限（演示模式跳过权限检查）
  useEffect(() => {
    if (isDemo) return;
    const user = props.$w.auth.currentUser;
    if (user?.type && user.type !== 'family') {
      toast({
        title: '权限限制',
        description: '此页面仅家属用户可以访问',
        variant: 'destructive'
      });
      // 跳转到登录页面
      props.$w.utils.redirectTo({
        pageId: 'login',
        params: {}
      });
    }
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
  const [dailyReports, setDailyReports] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  // 加载护理日报数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. 获取当前用户绑定的老人
        const user = props.$w.auth.currentUser;
        const familyId = isDemo ? 'family_001' : user?.userId || 'demo_user';

        // 查询绑定关系
        const bindingResult = await props.$w.cloud.callDataSource({
          dataSourceName: 'elder_family_bindings',
          methodName: 'wedaGetRecordsV2',
          params: {
            where: [{
              key: 'familyId',
              val: familyId
            }, {
              key: 'status',
              val: 'active'
            }],
            select: {
              $master: true
            },
            pageSize: 10,
            pageNumber: 1
          }
        });
        const bindings = bindingResult?.data || [];
        if (bindings.length === 0) {
          setLoading(false);
          return;
        }
        const binding = bindings[0];
        const elderId = binding.elderId;
        const elderName = binding.elderName;

        // 设置当前老人信息
        setCurrentUser({
          name: elderName,
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face'
        });

        // 2. 获取该老人的所有护理日报
        const dailyResult = await props.$w.cloud.callDataSource({
          dataSourceName: 'daily_reports',
          methodName: 'wedaGetRecordsV2',
          params: {
            where: [{
              key: 'elderId',
              val: elderId
            }],
            select: {
              $master: true
            },
            orderBy: [{
              field: 'date',
              order: 'desc'
            }],
            pageSize: 30,
            pageNumber: 1
          }
        });
        const reports = dailyResult?.data || [];
        const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

        // 转换数据格式
        const formattedReports = reports.map((report, index) => {
          const date = new Date(report.date);
          return {
            id: report._id || index + 1,
            date: report.date,
            dayOfWeek: weekDays[date.getDay()],
            meals: [{
              time: '早餐',
              food: report.breakfast || '暂无记录'
            }, {
              time: '午餐',
              food: report.lunch || '暂无记录'
            }, {
              time: '晚餐',
              food: report.dinner || '暂无记录'
            }],
            medications: report.medications ? report.medications.split(',').map((med, i) => ({
              name: med.trim(),
              time: '按医嘱',
              status: '已服用'
            })) : [],
            activities: report.activities ? report.activities.split('、').map((act, i) => ({
              name: act.trim(),
              time: '全天'
            })) : [],
            mood: report.mood || '未知',
            health: report.healthStatus || '未知',
            notes: report.notes || ''
          };
        });
        setDailyReports(formattedReports);

        // 设置默认日期
        if (formattedReports.length > 0) {
          setSelectedDate(formattedReports[0].date);
        }
      } catch (error) {
        console.error('加载护理日报失败:', error);
        toast({
          title: '加载失败',
          description: '获取护理日报时出错',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isDemo]);

  // 根据选择的日期过滤日报
  const getFilteredReports = () => {
    if (!selectedDate) return dailyReports;
    return dailyReports.filter(report => report.date === selectedDate);
  };
  const handleDateChange = value => {
    setSelectedDate(value);
  };
  const getMoodEmoji = mood => {
    const moodMap = {
      '愉快': '😊',
      '平静': '😌',
      '一般': '😐',
      '不适': '😔'
    };
    return moodMap[mood] || '😊';
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
        <p className="text-gray-600">加载护理日报...</p>
      </div>
    </div>;
  }

  // 没有数据时显示
  if (!currentUser || dailyReports.length === 0) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      {isDemo && <DemoBanner role="family" onBack={handleExitDemo} />}
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">暂无护理日报</h2>
            <p className="text-gray-600">当前没有护理日报记录</p>
          </div>
        </Card>
      </div>
      <TabBar currentPage="care" isDemo={isDemo} $w={props.$w} />
    </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      {isDemo && <DemoBanner role="family" onBack={handleExitDemo} />}
      {/* 头部 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12 border-2 border-amber-300">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-amber-900" style={{
                fontFamily: 'Playfair Display, serif'
              }}>
                  {currentUser?.name || '护理日报'}
                </h1>
                <p className="text-sm text-amber-700" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                  每日生活记录
                </p>
              </div>
            </div>
            <div className="text-right">
              <Select value={selectedDate} onValueChange={handleDateChange}>
                <SelectTrigger className="w-[140px] bg-amber-50 border-amber-200 text-amber-900">
                  <SelectValue placeholder="选择日期" />
                </SelectTrigger>
                <SelectContent>
                  {dailyReports.map(report => <SelectItem key={report.date} value={report.date}>
                      {new Date(report.date).toLocaleDateString('zh-CN', {
                    month: 'short',
                    day: 'numeric'
                  })} ({report.dayOfWeek})
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* 时间轴 */}
      <div className="container mx-auto px-4 py-6">
        {getFilteredReports().length === 0 && <div className="text-center py-12">
            <p className="text-gray-500">该日期暂无日报记录</p>
          </div>}
        {getFilteredReports().map((report, index) => <div key={report.id} className="relative">
            {/* 时间轴线 */}
            {index !== getFilteredReports().length - 1 && <div className="absolute left-6 top-20 w-0.5 h-full bg-gradient-to-b from-amber-300 to-transparent"></div>}
            
            {/* 日期节点 */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center border-3 border-amber-300 shadow-lg">
                <span className="text-amber-700 font-bold text-sm">
                  {new Date(report.date).getDate()}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-amber-900" style={{
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
                  {report.dayOfWeek}
                </h3>
                <p className="text-sm text-amber-700">
                  {new Date(report.date).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>

            {/* 日报卡片 */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6 ml-8">
              <div className="p-6">
                {/* 心情和健康状况 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getMoodEmoji(report.mood)}</span>
                    <span className="text-sm font-medium text-gray-700">
                      心情：{report.mood}
                    </span>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    健康：{report.health}
                  </div>
                </div>

                {/* 饮食记录 */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                    今日饮食
                  </h4>
                  <div className="space-y-3">
                    {report.meals.map((meal, idx) => <div key={idx} className="bg-orange-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
                            {meal.time}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-2">{meal.food}</p>
                      </div>)}
                  </div>
                </div>

                {/* 用药记录 */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    用药情况
                  </h4>
                  <div className="space-y-2">
                    {report.medications.map((med, idx) => <div key={idx} className="flex items-center justify-between bg-blue-50 p-3 rounded-xl">
                        <div>
                          <span className="font-medium text-gray-800">{med.name}</span>
                          <span className="text-sm text-gray-600 ml-2">{med.time}</span>
                        </div>
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {med.status}
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* 状态记录 */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    今日状态
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {report.activities.map((activity, idx) => {
                  if (activity.image) {
                    // 有图片的显示图片卡片
                    return <div key={idx} className="relative">
                          <img src={activity.image} alt={activity.name} className="w-full h-24 object-cover rounded-xl" />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-xl">
                            <p className="text-white text-sm font-medium">{activity.name}</p>
                            <p className="text-white/80 text-xs">{activity.time}</p>
                          </div>
                        </div>;
                  } else {
                    // 没有图片的只显示文字
                    return <div key={idx} className="bg-green-50 p-4 rounded-xl">
                          <p className="font-medium text-gray-800">{activity.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.time}</p>
                        </div>;
                  }
                })}
                  </div>
                </div>
              </div>
            </Card>
          </div>)}
      </div>

      {/* 底部导航 */}
      <TabBar currentPage="care" isDemo={isDemo} $w={props.$w} />
    </div>;
}