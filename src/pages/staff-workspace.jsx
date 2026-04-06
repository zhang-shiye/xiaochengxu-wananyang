// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea, useToast, Avatar, AvatarImage, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';

import { useForm } from 'react-hook-form';
import TabBar from '@/components/TabBar';
export default function StaffWorkspace(props) {
  const {
    toast
  } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [eldersList, setEldersList] = useState([]);
  const [selectedElder, setSelectedElder] = useState(null);
  const [dailyReportData, setDailyReportData] = useState(null);
  useEffect(() => {
    // 模拟获取当前护工信息
    setCurrentUser({
      userId: props.$w.page.dataset.params?.userId || 'staff001',
      name: '李阿姨',
      avatar: 'https://images.unsplash.com/photo-1595113676271-4060b9e83177?w=150&h=150&fit=crop&crop=face'
    });

    // 模拟获取负责的老人列表
    setEldersList([{
      id: 1,
      name: '张爷爷',
      age: 78,
      room: 'A-101',
      status: '正常',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }, {
      id: 2,
      name: '李奶奶',
      age: 85,
      room: 'A-102',
      status: '需要关注',
      avatar: 'https://images.unsplash.com/photo-1566616390298-965a76e5b1e5?w=150&h=150&fit=crop&crop=face'
    }]);

    // 默认选择第一个老人
    setSelectedElder(eldersList[0]);

    // 模拟获取老人的护理日报数据
    setDailyReportData({
      date: '2026-04-06',
      meals: [{
        time: '早餐',
        food: '小米粥、鸡蛋、青菜',
        status: '正常进食'
      }, {
        time: '午餐',
        food: '米饭、红烧肉、青菜汤',
        status: '正常进食'
      }, {
        time: '晚餐',
        food: '面条、黄瓜、西红柿',
        status: '正常进食'
      }],
      healthStatus: '良好',
      mood: '愉快',
      activities: ['散步30分钟', '看电视2小时', '与家属通话1次'],
      notes: '今日身体状况良好，精神状态正常'
    });
  }, []);
  const form = useForm({
    defaultValues: {
      meals: '',
      healthStatus: '良好',
      mood: '愉快',
      activities: '',
      notes: ''
    }
  });
  const handleElderChange = elderId => {
    const elder = eldersList.find(e => e.id === elderId);
    setSelectedElder(elder);
    // 实际项目中应该重新获取该老人的数据
  };
  const handleSaveReport = async data => {
    try {
      // 模拟保存护理日报
      toast({
        title: '保存成功',
        description: '护理日报已自动更新'
      });
      // 实际项目中应该调用云函数保存数据
    } catch (error) {
      toast({
        title: '保存失败',
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
        {/* 护工信息头部 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800" style={{
          fontFamily: 'DM Sans, sans-serif'
        }}>
            护工工作台
          </h1>
          <p className="text-gray-600 mt-2">{currentUser.name} · {currentUser.userId}</p>
        </div>

        {/* 老人选择 */}
        <Card className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">选择老人</h2>
            <Select value={selectedElder?.id?.toString() || ''} onValueChange={handleElderChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择老人" />
              </SelectTrigger>
              <SelectContent>
                {eldersList.map(elder => <SelectItem key={elder.id} value={elder.id.toString()}>
                    {elder.name} - {elder.room}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* 老人信息卡片 */}
        {selectedElder && <Card className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16 border-4 border-blue-200">
                <AvatarImage src={selectedElder.avatar} alt={selectedElder.name} />
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedElder.name}</h2>
                <p className="text-gray-600">年龄：{selectedElder.age}岁 · 房间：{selectedElder.room}</p>
                <p className={`text-sm mt-2 ${selectedElder.status === '正常' ? 'text-green-600' : 'text-orange-600'}`}>
                  状态：{selectedElder.status}
                </p>
              </div>
            </div>
          </Card>}

        {/* 护理日报 */}
        {selectedElder && dailyReportData && <Card className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">护理日报 - {dailyReportData.date}</h2>

              {/* 饮食记录 */}
              <div className="space-y-2">
                <h3 className="text-md font-medium text-gray-700">📋 饮食记录</h3>
                {dailyReportData.meals.map(meal => <div key={meal.time} className="flex items-center justify-between">
                    <span className="text-gray-600">{meal.time}</span>
                    <span className="text-gray-800">{meal.food}</span>
                    <span className={`text-sm ${meal.status === '正常进食' ? 'text-green-600' : 'text-orange-600'}`}>
                      {meal.status}
                    </span>
                  </div>)}
              </div>

              {/* 健康状况 */}
              <div className="space-y-2">
                <h3 className="text-md font-medium text-gray-700">❤️ 健康状况</h3>
                <p className={`text-sm ${dailyReportData.healthStatus === '良好' ? 'text-green-600' : 'text-orange-600'}`}>
                  {dailyReportData.healthStatus}
                </p>
              </div>

              {/* 心情状态 */}
              <div className="space-y-2">
                <h3 className="text-md font-medium text-gray-700">😊 心情状态</h3>
                <p className="text-sm text-gray-600">{dailyReportData.mood}</p>
              </div>

              {/* 活动记录 */}
              <div className="space-y-2">
                <h3 className="text-md font-medium text-gray-700">🏃 活动记录</h3>
                <div className="space-y-1">
                  {dailyReportData.activities.map((activity, index) => <p key={index} className="text-sm text-gray-600">• {activity}</p>)}
                </div>
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                <h3 className="text-md font-medium text-gray-700">📝 备注</h3>
                <p className="text-sm text-gray-600">{dailyReportData.notes}</p>
              </div>
            </div>
          </Card>}

        {/* 更新日报表单 */}
        {selectedElder && <Card className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">更新护理日报</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSaveReport)} className="space-y-4">
                  {/* 饮食记录 */}
                  <FormField control={form.control} name="meals" render={({
                field
              }) => <FormItem>
                        <FormLabel>饮食记录</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="请填写饮食记录" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  {/* 健康状况 */}
                  <FormField control={form.control} name="healthStatus" render={({
                field
              }) => <FormItem>
                        <FormLabel>健康状况</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="请选择健康状况" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="良好">良好</SelectItem>
                              <SelectItem value="一般">一般</SelectItem>
                              <SelectItem value="需要关注">需要关注</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  {/* 心情状态 */}
                  <FormField control={form.control} name="mood" render={({
                field
              }) => <FormItem>
                        <FormLabel>心情状态</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="请选择心情状态" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="愉快">愉快</SelectItem>
                              <SelectItem value="平静">平静</SelectItem>
                              <SelectItem value="不愉快">不愉快</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  {/* 活动记录 */}
                  <FormField control={form.control} name="activities" render={({
                field
              }) => <FormItem>
                        <FormLabel>活动记录</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="请填写活动记录" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  {/* 备注 */}
                  <FormField control={form.control} name="notes" render={({
                field
              }) => <FormItem>
                        <FormLabel>备注</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="请填写备注信息" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  {/* 保存按钮 */}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    💾 自动保存并更新
                  </Button>
                </form>
              </Form>
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