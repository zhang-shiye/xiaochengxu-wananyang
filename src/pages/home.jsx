// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Avatar, AvatarImage, Button, useToast, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function Home(props) {
  const {
    toast
  } = useToast();
  const [dailyReports, setDailyReports] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 生成最近7天的日期选项
  const generateDateOptions = () => {
    const options = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const displayStr = date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      });
      options.push({
        value: dateStr,
        label: displayStr
      });
    }
    return options;
  };
  const dateOptions = generateDateOptions();
  useEffect(() => {
    // 模拟获取当前用户和日报数据
    setCurrentUser({
      name: '张爷爷',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    });

    // 模拟日报数据
    setDailyReports([{
      id: 1,
      date: '2026-04-05',
      dayOfWeek: '周日',
      meals: [{
        time: '早餐',
        food: '小米粥、鸡蛋、青菜',
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=200&fit=crop'
      }, {
        time: '午餐',
        food: '红烧鱼、米饭、冬瓜汤',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop'
      }, {
        time: '晚餐',
        food: '面条、青菜、豆腐',
        image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba42d?w=300&h=200&fit=crop'
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
      activities: [{
        name: '晨练太极',
        time: '7:00',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop'
      }, {
        name: '书法练习',
        time: '14:00',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop'
      }],
      mood: '愉快',
      health: '良好'
    }, {
      id: 2,
      date: '2026-04-04',
      dayOfWeek: '周六',
      meals: [{
        time: '早餐',
        food: '豆浆、包子、咸菜',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop'
      }, {
        time: '午餐',
        food: '鸡肉、米饭、紫菜汤',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop'
      }, {
        time: '晚餐',
        food: '粥、馒头、青菜',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop'
      }],
      medications: [{
        name: '降压药',
        time: '8:00',
        status: '已服用'
      }],
      activities: [{
        name: '园艺活动',
        time: '10:00',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop'
      }],
      mood: '平静',
      health: '良好'
    }]);
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
                  张爷爷的护理日报
                </h1>
                <p className="text-sm text-amber-700" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                  每日生活记录
                </p>
              </div>
            </div>
            <div className="text-right">
              <Select value={selectedDate} onValueChange={value => {
              setSelectedDate(value);
              // 跳转到护理日报页面，传递日期参数
              props.$w.utils.navigateTo({
                pageId: 'care-home',
                params: {
                  date: value
                }
              });
            }}>
                <SelectTrigger className="w-32 border-amber-200 focus:border-amber-400">
                  <SelectValue placeholder="选择日期" />
                </SelectTrigger>
                <SelectContent>
                  {dateOptions.map(option => <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
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