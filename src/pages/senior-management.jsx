// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, Plus, Edit, User, Heart, AlertTriangle, Phone, MapPin } from 'lucide-react';

export default function SeniorManagement(props) {
  const [seniors, setSeniors] = useState([{
    id: 1,
    name: '张爷爷',
    age: 78,
    room: '201',
    healthStatus: '良好',
    emergencyContact: '张院长',
    phone: '0551-8888-6666',
    specialNeeds: '高血压，需定时服药',
    lastCheck: '2026-04-06 08:30'
  }, {
    id: 2,
    name: '李奶奶',
    age: 82,
    room: '305',
    healthStatus: '一般',
    emergencyContact: '张院长',
    phone: '0551-8888-6666',
    specialNeeds: '糖尿病，饮食控制',
    lastCheck: '2026-04-06 09:15'
  }, {
    id: 3,
    name: '王爷爷',
    age: 75,
    room: '102',
    healthStatus: '良好',
    emergencyContact: '张院长',
    phone: '0551-8888-6666',
    specialNeeds: '康复训练中',
    lastCheck: '2026-04-06 10:00'
  }, {
    id: 4,
    name: '赵奶奶',
    age: 79,
    room: '208',
    healthStatus: '需关注',
    emergencyContact: '张院长',
    phone: '0551-8888-6666',
    specialNeeds: '记忆力减退，需特别关照',
    lastCheck: '2026-04-06 07:45'
  }]);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    toast
  } = useToast();
  const filteredSeniors = seniors.filter(senior => senior.name.includes(searchTerm) || senior.room.includes(searchTerm) || senior.healthStatus.includes(searchTerm));
  const getHealthStatusColor = status => {
    switch (status) {
      case '良好':
        return 'bg-green-100 text-green-800';
      case '一般':
        return 'bg-amber-100 text-amber-800';
      case '需关注':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleEmergencyCall = senior => {
    toast({
      title: '紧急联系',
      description: `正在联系 ${senior.emergencyContact} (${senior.phone})`
    });
  };
  return <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{
          fontFamily: 'Noto Sans SC, sans-serif'
        }}>
            老人信息管理
          </h1>
          <p className="text-gray-600">管理在院老人信息，实时关注健康状况</p>
        </div>

        {/* 搜索栏 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input placeholder="搜索老人姓名、房间号或健康状况..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <Plus className="w-4 h-4 mr-2" />
                添加老人
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 text-center">
              <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{seniors.length}</p>
              <p className="text-sm text-blue-600">在院老人</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">
                {seniors.filter(s => s.healthStatus === '良好').length}
              </p>
              <p className="text-sm text-green-600">健康状况良好</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-900">
                {seniors.filter(s => s.healthStatus === '需关注').length}
              </p>
              <p className="text-sm text-amber-600">需特别关注</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {new Set(seniors.map(s => s.room.split('-')[0])).size}
              </p>
              <p className="text-sm text-gray-600">已使用楼层</p>
            </CardContent>
          </Card>
        </div>

        {/* 老人列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeniors.map(senior => <Card key={senior.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{senior.name}</h3>
                    <p className="text-sm text-gray-500">{senior.age}岁 • 房间 {senior.room}</p>
                  </div>
                  <Badge className={getHealthStatusColor(senior.healthStatus)}>
                    {senior.healthStatus}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Heart className="w-4 h-4 mr-2" />
                    <span>特殊需求：{senior.specialNeeds}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>紧急联系人：{senior.emergencyContact}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{senior.phone}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    最后检查：{senior.lastCheck}
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEmergencyCall(senior)}>
                    <Phone className="w-4 h-4 mr-1" />
                    紧急联系
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {filteredSeniors.length === 0 && <Card>
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">未找到符合条件的老人信息</p>
            </CardContent>
          </Card>}
      </div>
    </div>;
}