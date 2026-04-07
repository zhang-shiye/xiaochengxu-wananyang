// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Badge, Checkbox, Calendar, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Textarea, useToast } from '@/components/ui';
// @ts-ignore;
import { Calendar as CalendarIcon, FileText, User, Clock, MapPin, CheckCircle, XCircle, Filter, Eye } from 'lucide-react';

import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
export default function LeaveApproval(props) {
  const {
    toast
  } = useToast();
  const [leaveApplications, setLeaveApplications] = useState([{
    id: 1,
    applicantName: '张护士',
    seniorName: '王爷爷',
    startDate: '2026-04-08',
    endDate: '2026-04-10',
    reason: '家庭聚会，需要陪同家人参加重要活动',
    hasAttachment: true,
    status: 'pending',
    submitTime: '2026-04-07 09:30',
    submitterAvatar: '/api/placeholder/40/40'
  }, {
    id: 2,
    applicantName: '李护工',
    seniorName: '张奶奶',
    startDate: '2026-04-09',
    endDate: '2026-04-09',
    reason: '医院复查，需要陪同老人进行定期体检',
    hasAttachment: false,
    status: 'pending',
    submitTime: '2026-04-07 14:20',
    submitterAvatar: '/api/placeholder/40/40'
  }, {
    id: 3,
    applicantName: '王护理',
    seniorName: '刘爷爷',
    startDate: '2026-04-10',
    endDate: '2026-04-12',
    reason: '家属临时有事，需要请假处理家庭事务',
    hasAttachment: true,
    status: 'approved',
    submitTime: '2026-04-06 16:45',
    submitterAvatar: '/api/placeholder/40/40',
    approvalTime: '2026-04-07 10:15'
  }, {
    id: 4,
    applicantName: '赵护工',
    seniorName: '陈奶奶',
    startDate: '2026-04-11',
    endDate: '2026-04-11',
    reason: '参加培训，提升护理专业技能',
    hasAttachment: false,
    status: 'rejected',
    submitTime: '2026-04-06 11:30',
    submitterAvatar: '/api/placeholder/40/40',
    rejectionReason: '时间冲突，建议调整培训时间',
    rejectionTime: '2026-04-06 15:20'
  }]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailModal, setDetailModal] = useState({
    open: false,
    data: null
  });
  const [rejectModal, setRejectModal] = useState({
    open: false,
    ids: [],
    reason: ''
  });

  // 筛选逻辑
  useEffect(() => {
    let filtered = leaveApplications;

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // 日期范围筛选
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(app => {
        const appStartDate = new Date(app.startDate);
        const appEndDate = new Date(app.endDate);
        const filterStart = new Date(dateRange.start);
        const filterEnd = new Date(dateRange.end);
        return appStartDate >= filterStart && appStartDate <= filterEnd || appEndDate >= filterStart && appEndDate <= filterEnd;
      });
    }
    setFilteredApplications(filtered);
  }, [leaveApplications, statusFilter, dateRange]);

  // 获取状态标签样式
  const getStatusBadge = status => {
    switch (status) {
      case 'pending':
        return {
          text: '待审批',
          variant: 'secondary',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'approved':
        return {
          text: '已通过',
          variant: 'default',
          color: 'bg-green-100 text-green-800'
        };
      case 'rejected':
        return {
          text: '已驳回',
          variant: 'destructive',
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          text: '未知',
          variant: 'outline',
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  // 处理选择/取消选择
  const handleSelect = id => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]);
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedIds.length === filteredApplications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplications.map(app => app.id));
    }
  };

  // 批量通过
  const handleBatchApprove = () => {
    if (selectedIds.length === 0) {
      toast({
        title: '提示',
        description: '请先选择要审批的申请',
        variant: 'destructive'
      });
      return;
    }
    setLeaveApplications(prev => prev.map(app => selectedIds.includes(app.id) && app.status === 'pending' ? {
      ...app,
      status: 'approved',
      approvalTime: new Date().toLocaleString('zh-CN')
    } : app));
    setSelectedIds([]);
    toast({
      title: '成功',
      description: `已批量通过 ${selectedIds.length} 条请假申请`
    });
  };

  // 批量驳回
  const handleBatchReject = () => {
    if (selectedIds.length === 0) {
      toast({
        title: '提示',
        description: '请先选择要驳回的申请',
        variant: 'destructive'
      });
      return;
    }
    setRejectModal({
      open: true,
      ids: selectedIds,
      reason: ''
    });
  };

  // 确认驳回
  const handleConfirmReject = () => {
    if (!rejectModal.reason.trim()) {
      toast({
        title: '提示',
        description: '请填写驳回原因',
        variant: 'destructive'
      });
      return;
    }
    setLeaveApplications(prev => prev.map(app => rejectModal.ids.includes(app.id) && app.status === 'pending' ? {
      ...app,
      status: 'rejected',
      rejectionReason: rejectModal.reason,
      rejectionTime: new Date().toLocaleString('zh-CN')
    } : app));
    setSelectedIds([]);
    setRejectModal({
      open: false,
      ids: [],
      reason: ''
    });
    toast({
      title: '成功',
      description: `已批量驳回 ${rejectModal.ids.length} 条请假申请`
    });
  };

  // 单条通过
  const handleSingleApprove = id => {
    setLeaveApplications(prev => prev.map(app => app.id === id && app.status === 'pending' ? {
      ...app,
      status: 'approved',
      approvalTime: new Date().toLocaleString('zh-CN')
    } : app));
    toast({
      title: '成功',
      description: '请假申请已通过'
    });
  };

  // 单条驳回
  const handleSingleReject = id => {
    setRejectModal({
      open: true,
      ids: [id],
      reason: ''
    });
  };

  // 查看详情
  const handleViewDetail = application => {
    setDetailModal({
      open: true,
      data: application
    });
  };

  // 统计信息
  const stats = {
    pending: leaveApplications.filter(app => app.status === 'pending').length,
    approved: leaveApplications.filter(app => app.status === 'approved').length,
    rejected: leaveApplications.filter(app => app.status === 'rejected').length
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* 页面标题 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-amber-900" style={{
          fontFamily: 'Playfair Display, serif'
        }}>
            请假审批
          </h1>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">待审批</div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-gray-600">已通过</div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-gray-600">已驳回</div>
            </div>
          </Card>
        </div>

        {/* 筛选区域 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl mb-6 p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">筛选条件</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 状态筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">审批状态</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white border-amber-200 focus:border-amber-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待审批</SelectItem>
                    <SelectItem value="approved">已通过</SelectItem>
                    <SelectItem value="rejected">已驳回</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 开始日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-white border-amber-200">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.start ? format(dateRange.start, 'yyyy-MM-dd', {
                      locale: zhCN
                    }) : '选择开始日期'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateRange.start} onSelect={date => setDateRange(prev => ({
                    ...prev,
                    start: date
                  }))} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 结束日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-white border-amber-200">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.end ? format(dateRange.end, 'yyyy-MM-dd', {
                      locale: zhCN
                    }) : '选择结束日期'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateRange.end} onSelect={date => setDateRange(prev => ({
                    ...prev,
                    end: date
                  }))} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </Card>

        {/* 批量操作区域 */}
        {selectedIds.length > 0 && <Card className="bg-amber-50 border-amber-200 mb-6 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-amber-800">
                已选择 {selectedIds.length} 条申请
              </span>
              <div className="flex space-x-2">
                <Button onClick={handleBatchApprove} className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  批量通过
                </Button>
                <Button onClick={handleBatchReject} className="bg-red-600 hover:bg-red-700 text-white" size="sm">
                  <XCircle className="w-4 h-4 mr-1" />
                  批量驳回
                </Button>
              </div>
            </div>
          </Card>}

        {/* 请假申请列表 */}
        <div className="space-y-4">
          {filteredApplications.map(application => {
          const statusBadge = getStatusBadge(application.status);
          const isSelected = selectedIds.includes(application.id);
          return <Card key={application.id} className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl transition-all duration-200 ${isSelected ? 'ring-2 ring-amber-500' : ''}`}>
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* 选择框 */}
                    {application.status === 'pending' && <Checkbox checked={isSelected} onCheckedChange={() => handleSelect(application.id)} className="mt-1" />}
                    
                    {/* 申请人头像 */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                    
                    {/* 申请信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {application.applicantName}
                          </h3>
                          <span className="text-gray-500">·</span>
                          <span className="text-sm text-gray-600">
                            照顾 {application.seniorName}
                          </span>
                        </div>
                        <Badge className={statusBadge.color}>
                          {statusBadge.text}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {/* 时间信息 */}
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-amber-500" />
                          <span>{application.startDate} 至 {application.endDate}</span>
                          <span className="mx-2">·</span>
                          <span>提交于 {application.submitTime}</span>
                        </div>
                        
                        {/* 请假事由 */}
                        <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                          {application.reason}
                        </div>
                        
                        {/* 附件信息 */}
                        {application.hasAttachment && <div className="flex items-center text-sm text-blue-600">
                            <FileText className="w-4 h-4 mr-1" />
                            <span>包含附件</span>
                          </div>}
                        
                        {/* 驳回原因 */}
                        {application.rejectionReason && <div className="text-sm text-red-600 bg-red-50 rounded-lg p-2">
                            <strong>驳回原因：</strong>{application.rejectionReason}
                            {application.rejectionTime && <div className="text-xs text-red-500 mt-1">
                                驳回时间：{application.rejectionTime}
                              </div>}
                          </div>}
                      </div>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetail(application)} className="text-amber-600 hover:text-amber-700">
                      <Eye className="w-4 h-4 mr-1" />
                      查看详情
                    </Button>
                    
                    {application.status === 'pending' && <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleSingleApprove(application.id)} className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          通过
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSingleReject(application.id)} className="border-red-300 text-red-600 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-1" />
                          驳回
                        </Button>
                      </div>}
                  </div>
                </div>
              </Card>;
        })}
        </div>

        {/* 空状态 */}
        {filteredApplications.length === 0 && <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl p-8 text-center">
            <div className="text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">暂无请假申请</p>
              <p className="text-sm">当前筛选条件下没有找到相关申请</p>
            </div>
          </Card>}
      </div>

      {/* 详情查看弹窗 */}
      <Dialog open={detailModal.open} onOpenChange={open => setDetailModal({
      open,
      data: null
    })}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>请假申请详情</DialogTitle>
          </DialogHeader>
          {detailModal.data && <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">申请人</label>
                  <p className="text-gray-900">{detailModal.data.applicantName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">照顾老人</label>
                  <p className="text-gray-900">{detailModal.data.seniorName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">开始时间</label>
                  <p className="text-gray-900">{detailModal.data.startDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">结束时间</label>
                  <p className="text-gray-900">{detailModal.data.endDate}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">请假事由</label>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{detailModal.data.reason}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">提交时间</label>
                <p className="text-gray-900">{detailModal.data.submitTime}</p>
              </div>
              
              {detailModal.data.hasAttachment && <div className="flex items-center text-blue-600">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>包含附件材料</span>
                </div>}
              
              {detailModal.data.rejectionReason && <div className="bg-red-50 rounded-lg p-3">
                  <label className="text-sm font-medium text-red-700">驳回原因</label>
                  <p className="text-red-900">{detailModal.data.rejectionReason}</p>
                  {detailModal.data.rejectionTime && <p className="text-xs text-red-500 mt-1">
                      驳回时间：{detailModal.data.rejectionTime}
                    </p>}
                </div>}
            </div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailModal({
            open: false,
            data: null
          })}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 驳回原因弹窗 */}
      <Dialog open={rejectModal.open} onOpenChange={open => setRejectModal({
      open,
      ids: [],
      reason: ''
    })}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>填写驳回原因</DialogTitle>
            <DialogDescription>
              请详细说明驳回原因，申请人将收到通知
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea placeholder="请输入驳回原因..." value={rejectModal.reason} onChange={e => setRejectModal(prev => ({
            ...prev,
            reason: e.target.value
          }))} rows={4} className="border-amber-200 focus:border-amber-500 focus:ring-amber-500" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModal({
            open: false,
            ids: [],
            reason: ''
          })}>
              取消
            </Button>
            <Button onClick={handleConfirmReject} className="bg-red-600 hover:bg-red-700">
              确认驳回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}