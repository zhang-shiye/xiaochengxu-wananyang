// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Badge, useToast, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Textarea } from '@/components/ui';
// @ts-ignore;
import { Clock, Check, X, Search, Filter, ArrowLeft, ArrowRight, Calendar, AlertCircle, User } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
export default function AdminLeave(props) {
  const {
    toast
  } = useToast();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  useEffect(() => {
    // 角色检查
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      // 未登录，跳转到登录页
      props.$w.utils.navigateTo({
        pageId: 'login',
        params: {}
      });
      return;
    }
    if (userRole === 'family') {
      // 是家属角色，跳转到家属端
      props.$w.utils.navigateTo({
        pageId: 'care-home',
        params: {}
      });
      return;
    }
    loadLeaveRequests();
  }, []);
  useEffect(() => {
    filterRequests();
  }, [searchTerm, statusFilter, leaveRequests]);
  const loadLeaveRequests = async () => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('leave_requests').orderBy('createdAt', 'desc').get();
      setLeaveRequests(result.data);
      setFilteredRequests(result.data);
      setLoading(false);
    } catch (error) {
      console.error('加载请假数据失败:', error);
      toast({
        title: '加载失败',
        description: error.message,
        variant: 'destructive'
      });
      setLoading(false);
    }
  };
  const filterRequests = () => {
    let filtered = leaveRequests;
    if (searchTerm) {
      filtered = filtered.filter(request => request.elderName && request.elderName.includes(searchTerm) || request.applicantName && request.applicantName.includes(searchTerm));
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    setFilteredRequests(filtered);
  };
  const handleViewDetail = request => {
    setSelectedRequest(request);
    setIsDetailView(true);
    setRejectReason('');
  };
  const handleApprove = async () => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      await db.collection('leave_requests').doc(selectedRequest._id).update({
        status: 'approved',
        updatedAt: new Date().getTime()
      });
      toast({
        title: '审核通过',
        description: '请假申请已批准'
      });
      setIsDetailView(false);
      loadLeaveRequests();
    } catch (error) {
      console.error('审核失败:', error);
      toast({
        title: '审核失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: '请填写驳回理由',
        description: '驳回理由不能为空',
        variant: 'destructive'
      });
      return;
    }
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      await db.collection('leave_requests').doc(selectedRequest._id).update({
        status: 'rejected',
        reviewComment: rejectReason,
        updatedAt: new Date().getTime()
      });
      toast({
        title: '已驳回',
        description: '请假申请已驳回'
      });
      setIsDetailView(false);
      setRejectReason('');
      loadLeaveRequests();
    } catch (error) {
      console.error('驳回失败:', error);
      toast({
        title: '驳回失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };
  const getStatusBadge = status => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">待审核</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">已批准</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">已驳回</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  const getUrgencyBadge = urgency => {
    switch (urgency) {
      case 'urgent':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">紧急</Badge>;
      case 'normal':
        return <Badge className="bg-blue-100 text-blue-800">普通</Badge>;
      default:
        return <Badge variant="secondary">{urgency}</Badge>;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-24">
      {/* 头部 */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-['Ma_Shan_Zheng'] text-gray-800">请假审核</h1>
          <Badge variant="outline" className="text-green-600 border-green-600">
            {filteredRequests.filter(r => r.status === 'pending').length} 待审核
          </Badge>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="px-4 py-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="搜索老人姓名或申请人" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-white" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="pending">待审核</SelectItem>
            <SelectItem value="approved">已批准</SelectItem>
            <SelectItem value="rejected">已驳回</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 请假列表 */}
      {isDetailView ? (/* 详情视图 */
    <div className="px-4 py-4 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={() => {
          setIsDetailView(false);
          setSelectedRequest(null);
        }}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
            {getStatusBadge(selectedRequest.status)}
          </div>

          <Card className="bg-white p-4 shadow-md">
            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selectedRequest.elderName}</h2>
                  <p className="text-sm text-gray-500">申请人: {selectedRequest.applicantName}</p>
                </div>
                {selectedRequest.urgency && getUrgencyBadge(selectedRequest.urgency)}
              </div>

              {/* 时间信息 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span>{selectedRequest.startDate} 至 {selectedRequest.endDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>共 {calculateDays(selectedRequest.startDate, selectedRequest.endDate)} 天</span>
                </div>
              </div>

              {/* 请假事由 */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">请假事由</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  {selectedRequest.reason}
                </p>
              </div>

              {/* 附件图片 */}
              {selectedRequest.attachments && selectedRequest.attachments.length > 0 && <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">附件图片</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRequest.attachments.map((image, index) => <img key={index} src={image} alt={`附件 ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />)}
                  </div>
                </div>}

              {/* 审核状态 */}
              {selectedRequest.reviewComment && <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">审核意见</p>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {selectedRequest.reviewComment}
                  </p>
                </div>}

              {/* 审核按钮 */}
              {selectedRequest.status === 'pending' ? <div className="space-y-3 pt-4">
                  <Button onClick={handleApprove} className="w-full bg-green-600 hover:bg-green-700">
                    <Check className="w-4 h-4 mr-2" />
                    批准请假
                  </Button>
                  
                  <div className="space-y-2">
                    <Textarea placeholder="请输入驳回理由..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="min-h-[80px]" />
                    <Button variant="destructive" onClick={handleReject} className="w-full">
                      <X className="w-4 h-4 mr-2" />
                      驳回申请
                    </Button>
                  </div>
                </div> : null}
            </div>
          </Card>
        </div>) : (/* 列表视图 */
    <div className="px-4 py-4 space-y-3">
          {loading ? <div className="text-center text-gray-500 py-8">加载中...</div> : filteredRequests.length === 0 ? <div className="text-center text-gray-500 py-8">暂无请假记录</div> : filteredRequests.map(request => <Card key={request._id} className="bg-white p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleViewDetail(request)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <h3 className="font-semibold text-gray-800">{request.elderName}</h3>
                      {request.urgency === 'urgent' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {request.startDate} ~ {request.endDate}
                      </p>
                      <span className="text-xs text-gray-400">
                        ({calculateDays(request.startDate, request.endDate)}天)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs text-gray-500">
                        申请人: {request.applicantName}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      事由: {request.reason}
                    </p>
                    <div className="mt-2">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>)}
        </div>)}

      <AdminTabBar />
    </div>;
}