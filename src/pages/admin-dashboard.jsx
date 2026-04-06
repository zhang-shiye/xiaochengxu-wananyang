// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, useToast, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Badge } from '@/components/ui';
// @ts-ignore;
import { Upload, Download, Users, FileText, Calendar, Settings, Plus, Search, Filter } from 'lucide-react';

import AdminNavBar from '@/components/AdminNavBar';
export default function AdminDashboard(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadData, setUploadData] = useState('');
  const [uploadType, setUploadType] = useState('daily_report');

  // 模拟统计数据
  const [stats, setStats] = useState({
    totalElders: 42,
    todayReports: 38,
    pendingLeaves: 5,
    unpaidBills: 12
  });

  // 快速操作功能
  const quickActions = [{
    id: 'upload',
    label: '数据导入',
    icon: Upload,
    color: 'bg-blue-500',
    page: 'admin-upload'
  }, {
    id: 'add_elder',
    label: '添加老人',
    icon: Plus,
    color: 'bg-green-500',
    page: 'admin-elders'
  }, {
    id: 'generate_bill',
    label: '生成账单',
    icon: FileText,
    color: 'bg-purple-500',
    page: 'admin-bills'
  }, {
    id: 'batch_approve',
    label: '批量审批',
    icon: Calendar,
    color: 'bg-orange-500',
    page: 'admin-leaves'
  }];

  // 处理快速操作跳转
  const handleQuickAction = pageId => {
    if (props.$w && props.$w.utils) {
      props.$w.utils.redirectTo({
        pageId: pageId,
        params: {}
      });
    }
  };
  const handleUpload = () => {
    if (!uploadData.trim()) {
      toast({
        title: '上传失败',
        description: '请先输入或粘贴数据',
        variant: 'destructive'
      });
      return;
    }

    // 模拟上传处理
    toast({
      title: '上传成功',
      description: `已成功导入${uploadType === 'daily_report' ? '护理日报' : '老人信息'}数据`
    });
    setUploadData('');
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* 管理端导航栏 */}
      <AdminNavBar $w={props.$w} currentPage="dashboard" />
      
      <div className="container mx-auto px-4 py-6">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2" style={{
          fontFamily: 'Space Mono, monospace'
        }}>
            皖安养管理系统
          </h1>
          <p className="text-blue-600 text-lg" style={{
          fontFamily: 'IBM Plex Sans, sans-serif'
        }}>
            简化管理流程，一键更新数据
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">在院老人</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalElders}</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">今日日报</p>
                <p className="text-2xl font-bold text-green-900">{stats.todayReports}</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">待审批请假</p>
                <p className="text-2xl font-bold text-orange-900">{stats.pendingLeaves}</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">未缴费账单</p>
                <p className="text-2xl font-bold text-red-900">{stats.unpaidBills}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 快速操作 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4" style={{
          fontFamily: 'Space Mono, monospace'
        }}>
            快速操作
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map(action => <Button key={action.id} className={`${action.color} hover:${action.color.replace('500', '600')} text-white h-16`} onClick={() => handleQuickAction(action.page)}>
                <action.icon className="w-5 h-5 mr-2" />
                {action.label}
              </Button>)}
          </div>
        </Card>

        {/* 数据上传区域 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4" style={{
          fontFamily: 'Space Mono, monospace'
        }}>
            批量数据导入
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Select value={uploadType} onValueChange={setUploadType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="选择数据类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily_report">护理日报数据</SelectItem>
                  <SelectItem value="elder_info">老人信息数据</SelectItem>
                  <SelectItem value="leave_request">请假申请数据</SelectItem>
                  <SelectItem value="bill_data">账单数据</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                上传数据
              </Button>
            </div>
            
            <Textarea value={uploadData} onChange={e => setUploadData(e.target.value)} placeholder={`请粘贴${uploadType === 'daily_report' ? '护理日报' : uploadType === 'elder_info' ? '老人信息' : uploadType === 'leave_request' ? '请假申请' : '账单'}数据（支持CSV、JSON格式）`} className="min-h-32 font-mono text-sm" style={{
            fontFamily: 'IBM Plex Mono, monospace'
          }} />
            
            <div className="text-sm text-gray-600">
              <Badge variant="secondary" className="mr-2">支持格式</Badge>
              CSV, JSON, Excel
              <Badge variant="secondary" className="ml-4 mr-2">数据示例</Badge>
              {uploadType === 'daily_report' && '日期,老人姓名,早餐,午餐,晚餐,用药记录,活动记录'}
              {uploadType === 'elder_info' && '姓名,年龄,房间号,护理等级,责任护工,紧急联系人'}
              {uploadType === 'leave_request' && '老人姓名,请假类型,开始时间,结束时间,事由'}
              {uploadType === 'bill_data' && '月份,老人姓名,床位费,护理费,餐费,其他费用'}
            </div>
          </div>
        </Card>
      </div>
    </div>;
}