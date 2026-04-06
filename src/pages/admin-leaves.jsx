// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, useToast, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui';
// @ts-ignore;
import { Search, Check, X, Filter, Calendar, User, Clock } from 'lucide-react';

export default function AdminLeaves(props) {
  const {
    toast
  } = useToast();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 模拟请假申请数据
  useEffect(() => {
    setLeaveRequests([{
      id: 1,
      elderName: '王奶奶',
      reason: '家庭聚餐',
      startDate: '2026-04-10',
      endDate: '2026-04-10',
      submitTime: '2026-04-08 14:30',
      status: 'pending',
      contactPerson: '王先生',
      contactPhone: '138-0000-1234'
    }, {
      id: 2,
      elderName: '李爷爷',
      reason: '外出就医',
      startDate: '2026-04-12',
      endDate: '2026-04-12',
      submitTime: '2026-04-09 10:20',
      status: 'approved',
      approvalTime: '2026-04-09 11:30',
      contactPerson: '李女士',
      contactPhone: '139-0000-5678'
    }, {
      id: 3,
      elderName: '陈奶奶',
      reason: '探亲访友',
      startDate: '2026-04-15',
      endDate: '2026-04-16',
      submitTime: '2026-04-10 09:15',
      status: 'rejected',
      approvalTime: '2026-04-10 10:45',
      rejectReason: '近期身体状况不稳定，建议暂缓外出',
      contactPerson: '陈先生',
      contactPhone: '136-0000-9876'
    }]);
  }, []);
  const filteredRequests = leaveRequests.filter(request => request.elderName.toLowerCase().includes(searchTerm.toLowerCase()) && (statusFilter === 'all' || request.status === statusFilter));
  const handleApprove = request => {
    setLeaveRequests(leaveRequests.map(req => req.id === request.id ? {
      ...req,
      status: 'approved',
      approvalTime: new Date().toLocaleString('zh-CN')
    } : req));
    toast({
      title: '审批通过',
      description: `已批准${request.elderName}的请假申请`
    });
  };
  const handleReject = request => {
    setLeaveRequests(leaveRequests.map(req => req.id === request.id ? {
      ...req,
      status: 'rejected',
      approvalTime: new Date().toLocaleString('zh-CN'),
      rejectReason: '审批未通过，请与管理处联系'
    } : req));
    toast({
      title: '审批拒绝',
      description: `已拒绝${request.elderName}的请假申请`
    });
  };
  const handleBatchApprove = () => {
    const pendingRequests = leaveRequests.filter(req => req.status === 'pending');
    if (pendingRequests.length === 0) {
      toast({
        title: '操作完成',
        description: '没有待审批的请假申请'
      });
      return;
    }
    setLeaveRequests(leaveRequests.map(req => req.status === 'pending' ? {
      ...req,
      status: 'approved',
      approvalTime: new Date().toLocaleString('zh-CN')
    } : req));
    toast({
      title: '批量审批通过',
      description: `已批准${pendingRequests.length}份请假申请`
    });
  };
  const getStatusBadge = status => {
    const variants = {
      pending: {
        label: '待审批',
        color: 'bg-yellow-100 text-yellow-800'
      },
      approved: {
        label: '已批准',
        color: 'bg-green-100 text-green-800'
      },
      rejected: {
        label: '已拒绝',
        color: 'bg-red-100 text-red-800'
      }
    };
    return variants[status] || variants.pending;
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2" style={{
          fontFamily: 'Space Mono, monospace'
        }}>
            请假审批管理
          </h1>
          <p className="text-blue-600 text-lg" style={{
          fontFamily: 'IBM Plex Sans, sans-serif'
        }}>
            审批老人外出请假申请
          </p>
        </div>

        {/* 操作栏 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="搜索老人姓名..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-full md:w-64" />
              </div>
              
              <div className="flex-1 md:flex-none">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full md:w-32 border rounded-md px-3 py-2 text-sm">
                  <option value="all">全部状态</option>
                  <option value="pending">待审批</option>
                  <option value="approved">已批准</option>
                  <option value="rejected">已拒绝</option>
                </select>
              </div>
              
              <Button variant="outline" className="hidden md:flex">
                <Filter className="w-4 h-4 mr-2" />
                更多筛选
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleBatchApprove} className="bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                批量批准
              </Button>
            </div>
          </div>
        </Card>

        {/* 请假申请列表 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>老人姓名</TableHead>
                <TableHead>请假事由</TableHead>
                <TableHead>请假时间</TableHead>
                <TableHead>申请时间</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map(request => <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{request.elderName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <span className="text-sm">{request.startDate}</span>
                      {request.startDate !== request.endDate && <>
                          <span>至</span>
                          <span className="text-sm">{request.endDate}</span>
                        </>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-sm">{request.submitTime}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{request.contactPerson}</div>
                      <div className="text-xs text-gray-500">{request.contactPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(request.status).color}>
                      {getStatusBadge(request.status).label}
                    </Badge>
                    {request.approvalTime && <div className="text-xs text-gray-500 mt-1">
                        {request.approvalTime}
                      </div>}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {request.status === 'pending' && <>
                          <Button variant="outline" size="sm" onClick={() => handleApprove(request)} className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleReject(request)} className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                            <X className="w-3 h-3" />
                          </Button>
                        </>}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            详情
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>请假申请详情</DialogTitle>
                            <DialogDescription>
                              {request.elderName}的请假申请信息
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">老人姓名</label>
                                <p className="text-lg">{request.elderName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">请假事由</label>
                                <p className="text-lg">{request.reason}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">开始时间</label>
                                <p className="text-lg">{request.startDate}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">结束时间</label>
                                <p className="text-lg">{request.endDate}</p>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-700">联系人信息</label>
                              <p className="text-lg">{request.contactPerson} - {request.contactPhone}</p>
                            </div>
                            
                            {request.rejectReason && <div>
                                <label className="text-sm font-medium text-gray-700">拒绝原因</label>
                                <p className="text-lg text-red-600">{request.rejectReason}</p>
                              </div>}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">申请时间</label>
                                <p className="text-sm">{request.submitTime}</p>
                              </div>
                              {request.approvalTime && <div>
                                  <label className="text-sm font-medium text-gray-700">审批时间</label>
                                  <p className="text-sm">{request.approvalTime}</p>
                                </div>}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
          
          {filteredRequests.length === 0 && <div className="text-center py-8 text-gray-500">
              暂无请假申请数据
            </div>}
        </Card>
      </div>
    </div>;
}