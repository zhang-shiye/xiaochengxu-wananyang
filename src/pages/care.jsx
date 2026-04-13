// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Avatar, AvatarImage, Button, useToast, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import DataPermissionHelper from '@/components/PermissionCheck';
import TabBar from '@/components/TabBar';
export default function Home(props) {
  const {
    toast
  } = useToast();

  // 检查用户角色权限
  useEffect(() => {
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

  // 如果用户未登录或角色不匹配，显示提示
  const user = props.$w.auth.currentUser;
  if (!user?.userId || user?.type && user.type !== 'family') {
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
  useEffect(() => {
    // 从home页面获取老人信息，保持一致性
    const elderInfo = window.currentElderInfo || {
      name: '王奶奶',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face'
    };
    setCurrentUser(elderInfo);

    // 生成最近15天的日报数据
    const today = new Date('2026-04-13'); // 当前日期
    const reports = [];
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = weekDays[date.getDay()];
      const dayNum = date.getDate();

      // 根据天数生成不同的数据，增加多样性
      const mealOptions = [{
        breakfast: ['小米粥、鸡蛋、青菜', '豆浆、包子、咸菜', '馒头、稀饭、鸡蛋', '牛奶、面包、水果', '面条、鸡蛋、青菜'],
        lunch: ['红烧鱼、米饭、冬瓜汤', '鸡肉、米饭、紫菜汤', '排骨、米饭、青菜汤', '牛肉、面条、萝卜汤', '虾仁、米饭、蛋花汤'],
        dinner: ['面条、青菜、豆腐', '粥、馒头、青菜', '饺子、拌黄瓜', '粥、咸菜、鸡蛋', '面条、西红柿、鸡蛋']
      }, {
        breakfast: ['稀饭、馒头、咸菜', '牛奶、三明治、水果', '豆浆、油条、咸菜', '小米粥、包子、鸡蛋', '燕麦粥、面包、牛奶'],
        lunch: ['鱼香肉丝、米饭、青菜汤', '宫保鸡丁、米饭、蛋花汤', '红烧茄子、面条、黄瓜汤', '糖醋排骨、米饭、紫菜汤', '麻婆豆腐、米饭、冬瓜汤'],
        dinner: ['饺子、拌黄瓜', '粥、馒头、咸菜', '面条、西红柿、鸡蛋', '粥、咸菜、鸡蛋', '馒头、粥、咸菜']
      }, {
        breakfast: ['八宝粥、鸡蛋、水果', '牛奶、面包、香蕉', '豆浆、包子、鸡蛋', '小米粥、馒头、咸菜', '燕麦片、牛奶、水果'],
        lunch: ['清蒸鱼、米饭、青菜', '糖醋里脊、面条、萝卜汤', '红烧鸡翅、米饭、紫菜汤', '青椒肉丝、米饭、蛋花汤', '番茄鸡蛋、米饭、冬瓜汤'],
        dinner: ['粥、馒头、咸菜', '饺子、凉拌菜', '面条、青菜、豆腐', '馒头、稀饭、咸菜', '粥、鸡蛋、咸菜']
      }];
      const activityOptions = [[{
        name: '晨练太极',
        time: '7:00',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop'
      }, {
        name: '书法练习',
        time: '14:00',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop'
      }], [{
        name: '园艺活动',
        time: '10:00',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop'
      }], [{
        name: '散步休息',
        time: '15:00'
      }], [{
        name: '唱歌活动',
        time: '14:00',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=200&fit=crop'
      }], [{
        name: '太极拳',
        time: '7:00'
      }, {
        name: '手工制作',
        time: '10:00',
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=200&fit=crop'
      }]];
      const mealOption = mealOptions[i % 3];
      const activityOption = activityOptions[i % 5];
      const moodOptions = ['愉快', '平静', '愉快', '愉快', '平静', '一般', '愉快', '愉快', '平静', '愉快', '愉快', '愉快', '平静', '愉快', '愉快'];
      reports.push({
        id: i + 1,
        date: dateStr,
        dayOfWeek: dayOfWeek,
        meals: [{
          time: '早餐',
          food: mealOption.breakfast[i % 5]
        }, {
          time: '午餐',
          food: mealOption.lunch[i % 5]
        }, {
          time: '晚餐',
          food: mealOption.dinner[i % 5]
        }],
        medications: [{
          name: '降压药',
          time: '8:00',
          status: '已服用'
        }, {
          name: '维生素',
          time: '12:00',
          status: '已服用'
        }],
        activities: activityOption,
        mood: moodOptions[i],
        health: '良好'
      });
    }
    setDailyReports(reports);

    // 设置默认日期：如果当天有数据就显示当天，否则显示最新一天
    const todayStr = today.toISOString().split('T')[0];
    const hasTodayData = reports.some(report => report.date === todayStr);
    setSelectedDate(hasTodayData ? todayStr : reports[0].date);
  }, []);

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
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
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
      <TabBar currentPage="care" />
    </div>;
}