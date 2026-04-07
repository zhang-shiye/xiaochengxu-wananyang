// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, Button, Input, Textarea, Avatar, AvatarImage, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, Calendar, User, FileText, Image, Check, X, Clock, ArrowLeft } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
const mockLeaveData = [{
  id: 1,
  seniorName: '张爷爷',
  applicant: '张小明（儿子）',
  startDate: '2026-04-08',
  endDate: '2026-04-10',
  reason: '家庭聚会，需要接老人回家团聚',
  status: 'pending',
  submitTime: '2026-04-07 09:30',
  attachments: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop'],
  urgency: 'normal'
}, {
  id: 2,
  seniorName: '李奶奶',
  applicant: '李小红（女儿）',
  startDate: '2026-04-09',
  endDate: '2026-04-09',
  reason: '医院复查，需要家属陪同',
  status: 'pending',
  submitTime: '2026-04-07 10:15',
  attachments: ['https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'],
  urgency: 'urgent'
}, {
  id: 3,
  seniorName: '王爷爷',
  applicant: '王小华（孙子）',
  startDate: '2026-04-12',
  endDate: '2026-04-15',
  reason: '清明节扫墓，需要请假外出',
  status: 'pending',
  submitTime: '2026-04-07 11:45',
  attachments: [],
  urgency: 'normal'
}, {
  id: 4,
  seniorName: '赵奶奶',
  applicant: '赵小强（儿子）',
  startDate: '2026-04-08',
  endDate: '2026-04-08',
  reason: '临时有事，需要接老人回家',
  status: 'approved',
  submitTime: '2026-04-07 08:20',
  attachments: [],
  urgency: 'urgent'
}];
export default function AdminLeaveReview(props) {
  const {
    toast
  } = useToast();
  const [leaveData, setLeaveData] = useState(mockLeaveData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const filteredData = leaveData.filter(leave => {
    const matchesSearch = leave.seniorName.toLowerCase().includes(searchTerm.toLowerCase()) || leave.applicant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || leave.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const pendingCount = leaveData.filter(leave => leave.status === 'pending').length;
  const approvedCount = leaveData.filter(leave => leave.status === 'approved').length;
  const rejectedCount = leaveData.filter(leave => leave.status === 'rejected').length;
  const handleApprove = leaveId => {
    setLeaveData(prev => prev.map(leave => leave.id === leaveId ? {
      ...leave,
      status: 'approved'
    } : leave));
    setSelectedLeave(null);
    toast({
      title: '请假已批准',
      description: '请假申请已通过，已同步更新家属端状态',
      className: 'bg-green-50 border-green-200'
    });
  };
  const handleReject = leaveId => {
    if (!rejectReason.trim()) {
      toast({
        title: '请输入拒绝理由',
        description: '拒绝请假申请需要填写理由',
        variant: 'destructive'
      });
      return;
    }
    setLeaveData(prev => prev.map(leave => leave.id === leaveId ? {
      ...leave,
      status: 'rejected',
      rejectReason
    } : leave));
    setSelectedLeave(null);
    setShowRejectModal(false);
    setRejectReason('');
    toast({
      title: '请假已拒绝',
      description: '请假申请已拒绝，理由已通知申请人',
      className: 'bg-orange-50 border-orange-200'
    });
  };
  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };
  if (selectedLeave) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="container mx-auto px-4 py-6">
          {/* 详情页头部 */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={() => setSelectedLeave(null)} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
            <h1 className="text-xl font-bold text-amber-900" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              请假详情
            </h1>
            <div className="w-20"></div>
          </div>

          {/* 请假详情卡片 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
            <CardContent className="p-6">
              {/* 老人信息 */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-12 h-12 border-2 border-amber-200">
                  <AvatarImage src={`https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop&crop=face`} alt={selectedLeave.seniorName} />
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{selectedLeave.seniorName}</h3>
                  <p className="text-sm text-gray-600">申请人：{selectedLeave.applicant}</p>
                </div>
                {selectedLeave.urgency === 'urgent' && <Badge className="bg-red-100 text-red-700 border-0 ml-auto">
                    <Clock className="w-3 h-3 mr-1" />
                    紧急
                  </Badge>}
              </div>

              {/* 请假时间 */}
              <div className="bg-amber-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-800">请假时间</span>
                </div>
                <div className="text-sm text-gray-700">
                  <p>开始时间：{formatDate(selectedLeave.startDate)}</p>
                  <p>结束时间：{formatDate(selectedLeave.endDate)}</p>
                  <p className="font-medium text-amber-700 mt-1">
                    共计 {calculateDays(selectedLeave.startDate, selectedLeave.endDate)} 天
                  </p>
                </div>
              </div>

              {/* 请假事由 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-800">请假事由</span>
                </div>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
                  {selectedLeave.reason}
                </p>
              </div>

              {/* 附件图片 */}
              {selectedLeave.attachments && selectedLeave.attachments.length > 0 && <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Image className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-amber-800">附件图片</span>
                    <span className="text-sm text-gray-500">({selectedLeave.attachments.length}张)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedLeave.attachments.map((img, index) => <div key={index} className="relative group">
                        <img src={img} alt={`附件${index + 1}`} className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(img, '_blank')} />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                          <span className="text-white text-sm opacity-0 group-hover:opacity-100">
                            点击查看大图
                          </span>
                        </div>
                      </div>)}
                  </div>
                </div>}

              {/* 提交信息 */}
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>提交时间：{selectedLeave.submitTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 底部操作按钮 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="container mx-auto flex gap-3">
            <Button variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50" onClick={() => setShowRejectModal(true)}>
              <X className="w-4 h-4 mr-2" />
              拒绝
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" onClick={() => handleApprove(selectedLeave.id)}>
              <Check className="w-4 h-4 mr-2" />
              同意
            </Button>
          </div>
        </div>

        {/* 拒绝理由弹窗 */}
        {showRejectModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="bg-white w-full max-w-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">拒绝请假申请</h3>
                <Textarea placeholder="请输入拒绝理由（必填）" value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="mb-4 min-h-[100px]" rows={4} />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => {
                setShowRejectModal(false);
                setRejectReason('');
              }}>
                    取消
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" onClick={() => handleReject(selectedLeave.id)}>
                    确认拒绝
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>}

        {/* 底部导航占位 */}
        <div className="h-20"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* 页面标题 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-900" style={{
          fontFamily: 'Playfair Display, serif'
        }}>
            请假审批
          </h1>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
              <div className="text-sm text-gray-600">待审批</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              <div className="text-sm text-gray-600">已同意</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              <div className="text-sm text-gray-600">已拒绝</div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="搜索老人姓名或申请人" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="pending">待审批</option>
            <option value="approved">已同意</option>
            <option value="rejected">已拒绝</option>
            <option value="all">全部</option>
          </select>
        </div>

        {/* 请假列表 */}
        <div className="space-y-4">
          {filteredData.map(leave => <Card key={leave.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedLeave(leave)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-amber-200">
                      <AvatarImage src={`https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop&crop=face`} alt={leave.seniorName} />
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-gray-800">{leave.seniorName}</h3>
                      <p className="text-sm text-gray-600">{leave.applicant}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {leave.urgency === 'urgent' && <Badge className="bg-red-100 text-red-700 border-0">
                        <Clock className="w-3 h-3 mr-1" />
                        紧急
                      </Badge>}
                    <Badge className={`border-0 ${leave.status === 'pending' ? 'bg-orange-100 text-orange-700' : leave.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {leave.status === 'pending' ? '待审批' : leave.status === 'approved' ? '已同意' : '已拒绝'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">开始时间</p>
                    <p className="font-medium text-gray-800">{formatDate(leave.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">结束时间</p>
                    <p className="font-medium text-gray-800">{formatDate(leave.endDate)}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">请假事由</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{leave.reason}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>提交时间：{leave.submitTime}</span>
                  {leave.attachments.length > 0 && <span className="flex items-center gap-1">
                      <Image className="w-3 h-3" />
                      {leave.attachments.length}张附件
                    </span>}
                </div>
              </CardContent>
            </Card>)}
        </div>

        {filteredData.length === 0 && <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无请假申请</p>
          </div>}
      </div>

      <AdminTabBar />
    </div>;
}