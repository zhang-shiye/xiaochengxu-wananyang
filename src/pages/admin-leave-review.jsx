// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, Button, Input, Textarea, Avatar, AvatarImage, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, Calendar, User, FileText, Image, Check, X, Clock, ArrowLeft } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
export default function AdminLeaveReview(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('leave-review');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取请假数据
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const result = await props.$w.cloud.callFunction({
        name: 'getLeaveRequests',
        data: {
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchTerm
        }
      });
      if (result.result.success) {
        setLeaves(result.result.data);
      } else {
        toast({
          title: '获取数据失败',
          description: result.result.error || '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '网络错误',
        description: '获取数据失败，请检查网络连接',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLeaves();
  }, [statusFilter, searchTerm]);

  // 审批请假
  const handleReview = async (leaveId, status, comment = '') => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'reviewLeaveRequest',
        data: {
          leaveId,
          status,
          comment,
          reviewerId: props.$w.auth.currentUser?.userId || 'admin_001'
        }
      });
      if (result.result.success) {
        toast({
          title: status === 'approved' ? '审批通过' : '已拒绝',
          description: status === 'approved' ? '请假申请已通过' : '请假申请已拒绝'
        });
        fetchLeaves();
        if (selectedLeave) {
          setSelectedLeave(prev => ({
            ...prev,
            status
          }));
        }
      } else {
        toast({
          title: '操作失败',
          description: result.result.error || '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '网络错误',
        description: '操作失败，请检查网络连接',
        variant: 'destructive'
      });
    }
  };
  const getStatusBadge = status => {
    const statusMap = {
      pending: {
        label: '待审批',
        variant: 'secondary'
      },
      approved: {
        label: '已通过',
        variant: 'default'
      },
      rejected: {
        label: '已拒绝',
        variant: 'destructive'
      }
    };
    return statusMap[status] || {
      label: '未知',
      variant: 'secondary'
    };
  };
  const getUrgencyBadge = urgency => {
    if (urgency === 'urgent') {
      return {
        label: '紧急',
        variant: 'destructive'
      };
    }
    return null;
  };
  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.elderName?.toLowerCase().includes(searchTerm.toLowerCase()) || leave.applicantName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const statusCounts = {
    all: leaves.length,
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length
  };

  // 计算请假天数
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };
  if (isDetailView && selectedLeave) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="p-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => {
            setIsDetailView(false);
            setSelectedLeave(null);
          }} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">请假详情</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face`} />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedLeave.elderName}</h3>
                  <p className="text-sm text-gray-500">申请人: {selectedLeave.applicantName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getUrgencyBadge(selectedLeave.urgency) && <Badge variant={getUrgencyBadge(selectedLeave.urgency).variant}>
                    {getUrgencyBadge(selectedLeave.urgency).label}
                  </Badge>}
                <Badge variant={getStatusBadge(selectedLeave.status).variant}>
                  {getStatusBadge(selectedLeave.status).label}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                <p className="text-gray-900">{new Date(selectedLeave.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                <p className="text-gray-900">{new Date(selectedLeave.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">请假天数</label>
              <p className="text-gray-900">{calculateDays(selectedLeave.startDate, selectedLeave.endDate)} 天</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">请假事由</label>
              <p className="text-gray-900">{selectedLeave.reason}</p>
            </div>

            {selectedLeave.attachments && selectedLeave.attachments.length > 0 && <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">附件图片</label>
                <div className="grid grid-cols-2 gap-4">
                  {selectedLeave.attachments.map((image, index) => <img key={index} src={image} alt={`附件 ${index + 1}`} className="w-full h-32 object-cover rounded-lg cursor-pointer" onClick={() => window.open(image, '_blank')} />)}
                </div>
              </div>}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">提交时间</label>
              <p className="text-gray-900">{new Date(selectedLeave.createdAt).toLocaleString()}</p>
            </div>

            {selectedLeave.reviewerId && <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>审批人：</strong>{selectedLeave.reviewerId}
                </p>
                {selectedLeave.reviewComment && <p className="text-sm text-gray-600 mt-1">
                    <strong>审批意见：</strong>{selectedLeave.reviewComment}
                  </p>}
                {selectedLeave.updatedAt && <p className="text-sm text-gray-600 mt-1">
                    <strong>审批时间：</strong>{new Date(selectedLeave.updatedAt).toLocaleString()}
                  </p>}
              </div>}
          </div>

          {selectedLeave.status === 'pending' && <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
              <div className="flex space-x-3">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleReview(selectedLeave._id, 'approved')}>
                  <Check className="w-4 h-4 mr-2" />
                  同意
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => {
              const reason = prompt('请输入拒绝理由：');
              if (reason !== null) {
                handleReview(selectedLeave._id, 'rejected', reason);
              }
            }}>
                  <X className="w-4 h-4 mr-2" />
                  拒绝
                </Button>
              </div>
            </div>}
        </div>
        <AdminTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">请假审批</h1>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[{
          key: 'all',
          label: '全部',
          count: statusCounts.all,
          color: 'bg-blue-100 text-blue-800'
        }, {
          key: 'pending',
          label: '待审批',
          count: statusCounts.pending,
          color: 'bg-yellow-100 text-yellow-800'
        }, {
          key: 'approved',
          label: '已通过',
          count: statusCounts.approved,
          color: 'bg-green-100 text-green-800'
        }, {
          key: 'rejected',
          label: '已拒绝',
          count: statusCounts.rejected,
          color: 'bg-red-100 text-red-800'
        }].map(item => <div key={item.key} className={`p-3 rounded-lg cursor-pointer transition-all ${statusFilter === item.key ? item.color : 'bg-white hover:bg-gray-50'}`} onClick={() => setStatusFilter(item.key)}>
              <div className="text-center">
                <div className="text-2xl font-bold">{item.count}</div>
                <div className="text-sm">{item.label}</div>
              </div>
            </div>)}
        </div>

        {/* 搜索和筛选 */}
        <div className="flex space-x-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="搜索老人姓名或申请人..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* 请假列表 */}
        {loading ? <div className="text-center py-8">
            <div className="text-gray-500">加载中...</div>
          </div> : filteredLeaves.length === 0 ? <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无请假申请</p>
          </div> : <div className="space-y-4 mb-20">
            {filteredLeaves.map(leave => <Card key={leave._id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
          setSelectedLeave(leave);
          setIsDetailView(true);
        }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face`} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{leave.elderName}</h3>
                          {getUrgencyBadge(leave.urgency) && <Badge variant={getUrgencyBadge(leave.urgency).variant} className="text-xs">
                              {getUrgencyBadge(leave.urgency).label}
                            </Badge>}
                          <Badge variant={getStatusBadge(leave.status).variant} className="text-xs">
                            {getStatusBadge(leave.status).label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{leave.reason}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {leave.applicantName}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(leave.createdAt).toLocaleString()}
                          </span>
                          {leave.attachments && leave.attachments.length > 0 && <span className="flex items-center">
                              <Image className="w-3 h-3 mr-1" />
                              {leave.attachments.length}张
                            </span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>}
      </div>
      <AdminTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>;
}