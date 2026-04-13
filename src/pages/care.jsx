// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Avatar, AvatarImage, Button, useToast } from '@/components/ui';

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
  const [selectedDate, setSelectedDate] = useState('2026-04-13');
  useEffect(() => {
    // 从home页面获取老人信息，保持一致性
    const elderInfo = window.currentElderInfo || {
      name: '王奶奶',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face'
    };
    setCurrentUser(elderInfo);

    // 模拟日报数据
    setDailyReports([{
      id: 1,
      date: '2026-04-13',
      dayOfWeek: '周一',
      meals: [{
        time: '早餐',
        food: '小米粥、鸡蛋、凉拌黄瓜'
      }, {
        time: '午餐',
        food: '红烧排骨、米饭、冬瓜汤、清炒白菜'
      }, {
        time: '晚餐',
        food: '面条、卤蛋、青菜豆腐汤'
      }],
      medications: [{
        name: '降压药',
        time: '8:00',
        status: '已服用'
      }, {
        name: '维生素C',
        time: '9:00',
        status: '已服用'
      }, {
        name: '钙片',
        time: '20:00',
        status: '已服用'
      }],
      activities: [{
        name: '晨练太极',
        time: '7:00'
      }, {
        name: '书法练习',
        time: '14:00',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop'
      }, {
        name: '听音乐放松',
        time: '16:00'
      }],
      mood: '愉快',
      health: '良好'
    }, {
      id: 2,
      date: '2026-04-12',
      dayOfWeek: '周日',
      meals: [{
        time: '早餐',
        food: '豆浆、包子、咸鸭蛋'
      }, {
        time: '午餐',
        food: '清蒸鲈鱼、米饭、紫菜蛋花汤、清炒西兰花'
      }, {
        time: '晚餐',
        food: '小米粥、馒头、拌土豆丝'
      }],
      medications: [{
        name: '降压药',
        time: '8:00',
        status: '已服用'
      }, {
        name: '维生素C',
        time: '9:00',
        status: '已服用'
      }, {
        name: '钙片',
        time: '20:00',
        status: '已服用'
      }],
      activities: [{
        name: '园艺活动',
        time: '10:00',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop'
      }, {
        name: '与朋友聊天',
        time: '15:00'
      }],
      mood: '平静',
      health: '良好'
    }, {
      id: 3,
      date: '2026-04-11',
      dayOfWeek: '周六',
      meals: [{
        time: '早餐',
        food: '牛奶、面包、鸡蛋'
      }, {
        time: '午餐',
        food: '糖醋排骨、米饭、青菜豆腐汤、凉拌黄瓜'
      }, {
        time: '晚餐',
        food: '饺子、凉拌黄瓜、小米粥'
      }],
      medications: [{
        name: '降压药',
        time: '8:00',
        status: '已服用'
      }, {
        name: '维生素C',
        time: '9:00',
        status: '已服用'
      }, {
        name: '钙片',
        time: '20:00',
        status: '已服用'
      }],
      activities: [{
        name: '散步',
        time: '9:00'
      }, {
        name: '阅读报纸',
        time: '14:00',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop'
      }],
      mood: '愉快',
      health: '良好'
    }]);
  }, []);

  // 根据选择的日期过滤日报
  const getFilteredReports = () => {
    if (!selectedDate) return dailyReports;
    return dailyReports.filter(report => report.date === selectedDate);
  };
  const handleDateChange = e => {
    setSelectedDate(e.target.value);
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
              <div className="relative">
                <input type="date" value={selectedDate} onChange={handleDateChange} className="px-3 py-2 border border-amber-200 rounded-lg text-amber-900 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 font-medium" />
              </div>
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