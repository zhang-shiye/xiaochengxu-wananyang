// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Avatar, AvatarImage, Button, Badge, useToast, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
// @ts-ignore;
import { Heart, Calendar, User, Phone, MapPin, Clock, ChevronRight, Bell, FileText, DollarSign, CalendarDays } from 'lucide-react';

import TabBar from '@/components/TabBar';
export default function CareHome(props) {
  const {
    toast
  } = useToast();
  const [elderInfo, setElderInfo] = useState({
    name: '王奶奶',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    age: 78,
    admissionDate: '2023-03-15',
    roomNumber: 'A栋 301室',
    careLevel: '二级护理',
    primaryNurse: '张护士',
    nursePhone: '138-0000-1234',
    emergencyContact: '王先生（儿子）',
    emergencyPhone: '139-0000-5678',
    healthStatus: '良好',
    moodStatus: '愉快',
    lastUpdate: '2024-04-05 14:30'
  });
  const [latestInfo, setLatestInfo] = useState({
    dailyReport: {
      date: '2024-04-05',
      meal: '午餐：米饭、清蒸鱼、炒时蔬',
      mood: '愉快',
      time: '12:00'
    },
    leaveRequest: {
      status: '待审批',
      type: '外出请假',
      date: '2024-04-08',
      time: '14:30'
    },
    bill: {
      month: '2024年4月',
      amount: '¥3,580',
      status: '待缴费',
      dueDate: '2024-04-10'
    }
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

  // 生成30天内的日期选项
  const generateDateOptions = () => {
    const options = [];
    const today = new Date('2026-04-06'); // 当前时间

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const displayStr = date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
      });
      options.push({
        value: dateStr,
        label: displayStr
      });
    }
    return options;
  };
  const dateOptions = generateDateOptions();
  const [selectedDate, setSelectedDate] = useState(dateOptions[0].value);

  // 处理日期选择变化
  const handleDateChange = dateValue => {
    setSelectedDate(dateValue);
    // 跳转到对应日期的护理记录页面
    props.$w.utils.navigateTo({
      pageId: 'daily-report',
      params: {
        date: dateValue
      }
    });
  };

  // 计算入院天数
  const getAdmissionDays = () => {
    const admission = new Date(elderInfo.admissionDate);
    const today = new Date();
    const diffTime = Math.abs(today - admission);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
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
                  <span className="text-gray-700">责任护士</span>
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
              <p className="font-medium text-gray-800">{elderInfo.emergencyContact}</p>
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

        {/* 日期选择区域 */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              护理记录
            </h3>
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-amber-600" />
              <Select value={selectedDate} onValueChange={handleDateChange}>
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