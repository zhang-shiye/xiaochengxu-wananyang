// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Avatar, AvatarImage, Button, useToast } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function Home(props) {
  const {
    toast
  } = useToast();
  const [dailyReports, setDailyReports] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 获取老人信息
  const fetchElderInfo = async () => {
    try {
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
        setCurrentUser({
          name: elder.name,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        });

        // 获取护理日报数据
        await fetchDailyReports(elder._id);
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

  // 获取护理日报数据
  const fetchDailyReports = async elderId => {
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
            limit: 7
          }
        }
      });
      if (result.result && result.result.data) {
        const reports = result.result.data.map(report => ({
          id: report._id,
          date: report.date,
          dayOfWeek: getDayOfWeek(report.date),
          meals: [{
            time: '早餐',
            food: report.breakfast || '未记录',
            image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=200&fit=crop'
          }, {
            time: '午餐',
            food: report.lunch || '未记录',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop'
          }, {
            time: '晚餐',
            food: report.dinner || '未记录',
            image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba42d?w=300&h=200&fit=crop'
          }],
          medications: report.medications ? [{
            name: '用药记录',
            time: '全天',
            status: report.medications
          }] : [],
          activities: report.activities ? [{
            name: '活动记录',
            time: '全天',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop'
          }] : [],
          mood: report.mood || '良好',
          health: report.healthStatus || '良好'
        }));
        setDailyReports(reports);
      }
    } catch (error) {
      console.error('获取护理日报失败:', error);
    }
  };

  // 获取星期几
  const getDayOfWeek = dateString => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };
  useEffect(() => {
    fetchElderInfo();
  }, []);
  const getMoodEmoji = mood => {
    const moodMap = {
      '愉快': '😊',
      '平静': '😌',
      '一般': '😐',
      '不适': '😔'
    };
    return moodMap[mood] || '😊';
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      {/* 头部 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12 border-2 border-amber-300">
                <AvatarImage src={currentUser?.avatar} />
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-amber-900" style={{
                fontFamily: 'Playfair Display, serif'
              }}>
                  护理日报
                </h1>
                <p className="text-sm text-amber-700" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                  每日生活记录
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-600">
                {new Date().getDate()}
              </p>
              <p className="text-sm text-amber-700">
                {new Date().toLocaleDateString('zh-CN', {
                month: 'short'
              })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 时间轴 */}
      <div className="container mx-auto px-4 py-6">
        {dailyReports.map((report, index) => <div key={report.id} className="relative">
            {/* 时间轴线 */}
            {index !== dailyReports.length - 1 && <div className="absolute left-6 top-20 w-0.5 h-full bg-gradient-to-b from-amber-300 to-transparent"></div>}
            
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
                  <div className="grid grid-cols-3 gap-3">
                    {report.meals.map((meal, idx) => <div key={idx} className="text-center">
                        <div className="relative mb-2">
                          <img src={meal.image} alt={meal.time} className="w-full h-20 object-cover rounded-xl" />
                          <div className="absolute top-1 left-1 bg-white/90 px-2 py-1 rounded-lg text-xs font-medium">
                            {meal.time}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{meal.food}</p>
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

                {/* 活动记录 */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    今日活动
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {report.activities.map((activity, idx) => <div key={idx} className="relative">
                        <img src={activity.image} alt={activity.name} className="w-full h-24 object-cover rounded-xl" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-xl">
                          <p className="text-white text-sm font-medium">{activity.name}</p>
                          <p className="text-white/80 text-xs">{activity.time}</p>
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            </Card>
          </div>)}
      </div>

      {/* 底部导航 */}
      <TabBar currentPage="home" />
    </div>;
}