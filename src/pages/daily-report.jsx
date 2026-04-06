// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, Calendar, Clock, User, Heart, Utensils, Activity, MessageSquare } from 'lucide-react';

import TabBar from '@/components/TabBar';
export default function DailyReport(props) {
  const {
    toast
  } = useToast();
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 从页面参数获取日期
  const selectedDate = props.$w.page.dataset.params?.date || new Date().toISOString().split('T')[0];

  // 模拟护理记录数据
  const mockDailyData = {
    date: selectedDate,
    nurse: '张护士',
    summary: '老人今日状态良好，各项护理工作顺利完成',
    details: {
      vitalSigns: {
        bloodPressure: '125/80 mmHg',
        heartRate: '72 bpm',
        temperature: '36.5°C',
        oxygenSaturation: '98%'
      },
      meals: {
        breakfast: '小米粥、鸡蛋、牛奶',
        lunch: '米饭、青菜炒肉、豆腐汤',
        dinner: '面条、蔬菜汤、水果',
        snacks: '下午茶：饼干、果汁'
      },
      activities: {
        morning: '晨间散步、阅读报纸',
        afternoon: '午休、看电视、手工活动',
        evening: '晚间聊天、听音乐'
      },
      mood: '愉快',
      sleep: '夜间睡眠良好，约7小时',
      medication: '按时服用降压药和维生素',
      specialNotes: '无特殊不适，情绪稳定'
    },
    records: [{
      time: '08:00',
      type: '生命体征',
      content: '测量血压、心率、体温',
      nurse: '张护士'
    }, {
      time: '08:30',
      type: '早餐',
      content: '小米粥、鸡蛋、牛奶',
      nurse: '李护工'
    }, {
      time: '10:00',
      type: '活动',
      content: '晨间散步30分钟',
      nurse: '张护士'
    }, {
      time: '12:00',
      type: '午餐',
      content: '米饭、青菜炒肉、豆腐汤',
      nurse: '王护工'
    }, {
      time: '14:00',
      type: '午休',
      content: '午休1.5小时',
      nurse: '张护士'
    }, {
      time: '15:30',
      type: '活动',
      content: '看电视、手工活动',
      nurse: '李护工'
    }, {
      time: '18:00',
      type: '晚餐',
      content: '面条、蔬菜汤、水果',
      nurse: '王护工'
    }, {
      time: '20:00',
      type: '晚间护理',
      content: '洗漱、服药',
      nurse: '张护士'
    }, {
      time: '21:30',
      type: '就寝',
      content: '准备就寝，情绪稳定',
      nurse: '夜班护士'
    }]
  };
  useEffect(() => {
    // 模拟数据加载
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setDailyData(mockDailyData);
      } catch (error) {
        toast({
          title: '数据加载失败',
          description: '请检查网络连接后重试',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedDate, toast]);
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="animate-pulse bg-gray-200 rounded h-6 w-48"></div>
          </div>
          <div className="space-y-4 animate-pulse">
            <div className="bg-gray-200 rounded h-32"></div>
            <div className="bg-gray-200 rounded h-64"></div>
          </div>
        </div>
        <TabBar />
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* 头部 */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800" style={{
          fontFamily: 'Playfair Display, serif'
        }}>
            护理记录详情
          </h1>
        </div>

        {/* 日期信息 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-amber-600 mr-2" />
                <span className="text-lg font-medium">{formatDate(dailyData.date)}</span>
              </div>
              <Badge className="bg-green-100 text-green-800">已完成</Badge>
            </div>
            <div className="flex items-center text-gray-600">
              <User className="w-4 h-4 mr-1" />
              <span>责任护士：{dailyData.nurse}</span>
            </div>
          </div>
        </Card>

        {/* 护理总结 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium">护理总结</span>
            </div>
            <p className="text-gray-600">{dailyData.summary}</p>
          </div>
        </Card>

        {/* 生命体征 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <Heart className="w-5 h-5 text-red-600 mr-2" />
              <span className="font-medium">生命体征</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">血压：</span>
                <span className="font-medium">{dailyData.details.vitalSigns.bloodPressure}</span>
              </div>
              <div>
                <span className="text-gray-500">心率：</span>
                <span className="font-medium">{dailyData.details.vitalSigns.heartRate}</span>
              </div>
              <div>
                <span className="text-gray-500">体温：</span>
                <span className="font-medium">{dailyData.details.vitalSigns.temperature}</span>
              </div>
              <div>
                <span className="text-gray-500">血氧：</span>
                <span className="font-medium">{dailyData.details.vitalSigns.oxygenSaturation}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 饮食记录 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <Utensils className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">饮食记录</span>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">早餐：</span>{dailyData.details.meals.breakfast}</div>
              <div><span className="text-gray-500">午餐：</span>{dailyData.details.meals.lunch}</div>
              <div><span className="text-gray-500">晚餐：</span>{dailyData.details.meals.dinner}</div>
              <div><span className="text-gray-500">加餐：</span>{dailyData.details.meals.snacks}</div>
            </div>
          </div>
        </Card>

        {/* 活动记录 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <Activity className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium">活动记录</span>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">上午：</span>{dailyData.details.activities.morning}</div>
              <div><span className="text-gray-500">下午：</span>{dailyData.details.activities.afternoon}</div>
              <div><span className="text-gray-500">晚上：</span>{dailyData.details.activities.evening}</div>
            </div>
          </div>
        </Card>

        {/* 详细时间线 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <Clock className="w-5 h-5 text-amber-600 mr-2" />
              <span className="font-medium">详细时间线</span>
            </div>
            <div className="space-y-3">
              {dailyData.records.map((record, index) => <div key={index} className="flex items-start border-l-2 border-amber-200 pl-4 py-1">
                  <div className="w-16 text-sm text-gray-500 font-medium">{record.time}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{record.type}</span>
                      <span className="text-xs text-gray-400">{record.nurse}</span>
                    </div>
                    <p className="text-sm text-gray-600">{record.content}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </Card>
      </div>
      <TabBar />
    </div>;
}