// @ts-ignore;
import React, { useState, useMemo } from 'react';
// @ts-ignore;
import { Card, Button, Badge, Input, Label, Textarea, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { Calendar, Search, User, Clock, CheckCircle, XCircle, Clock3 } from 'lucide-react';

export default function DailyApproval(props) {
  const {
    toast
  } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedDaily, setSelectedDaily] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // 模拟待审批日报数据
  const [dailyReports, setDailyReports] = useState([{
    id: 1,
    seniorName: '张爷爷',
    date: '2026-04-07',
    submitTime: '2026-04-07 14:30',
    caregiverName: '李护工',
    status: 'pending',
    content: '今日精神状态良好，食欲正常，按时服药，无异常情况。'
  }, {
    id: 2,
    seniorName: '王奶奶',
    date: '2026-04-07',
    submitTime: '2026-04-07 15:15',
    caregiverName: '张护工',
    status: 'pending',
    content: '今日血压偏高，已提醒医生关注，其他情况正常。'
  }, {
    id: 3,
    seniorName: '刘爷爷',
    date: '2026-04-06',
    submitTime: '2026-04-06 16:20',
    caregiverName: '王护工',
    status: 'approved',
    content: '今日康复训练完成良好，情绪稳定。'
  }, {
    id: 4,
    seniorName: '陈奶奶',
    date: '2026-04-06',
    submitTime: '2026-04-06 13:45',
    caregiverName: '赵护工',
    status: 'rejected',
    content: '今日饮食记录不完整，需要补充详细信息。',
    rejectReason: '饮食记录缺失具体食物名称和用量'
  }, {
    id: 5,
    seniorName: '李爷爷',
    date: '2026-04-05',
    submitTime: '2026-04-05 14:00',
    caregiverName: '孙护工',
    status: 'pending',
    content: '今日睡眠质量一般，建议调整晚间活动安排。'
  }]);

  // 筛选逻辑
  const filteredReports = useMemo(() => {
    return dailyReports.filter(report => {
      const matchesSearch = report.seniorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !selectedDate || report.date === selectedDate;
      return matchesSearch && matchesDate;
    });
  }, [dailyReports, searchTerm, selectedDate]);

  // 状态标签样式
  const getStatusBadge = status => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock3 className="w-3 h-3 mr-1" />
          待审批
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          已通过
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          已驳回
        </Badge>;
      default:
        return null;
    }
  };

  // 处理通过操作
  const handleApprove = id => {
    setDailyReports(prev => prev.map(report => report.id === id ? {
      ...report,
      status: 'approved'
    } : report));
    toast({
      title: '审批通过',
      description: '日报已通过审批',
      className: 'bg-green-50 border-green-200'
    });
  };

  // 处理驳回操作
  const handleReject = daily => {
    setSelectedDaily(daily);
    setRejectDialogOpen(true);
  };

  // 确认驳回
  const confirmReject = () => {
    if (!rejectReason.trim()) {
      toast({
        title: '请输入驳回原因',
        variant: 'destructive'
      });
      return;
    }
    setDailyReports(prev => prev.map(report => report.id === selectedDaily.id ? {
      ...report,
      status: 'rejected',
      rejectReason
    } : report));
    setRejectDialogOpen(false);
    setRejectReason('');
    setSelectedDaily(null);
    toast({
      title: '审批驳回',
      description: '日报已驳回并通知护工',
      className: 'bg-orange-50 border-orange-200'
    });
  };

  // 取消驳回
  const cancelReject = () => {
    setRejectDialogOpen(false);
    setRejectReason('');
    setSelectedDaily(null);
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-amber-900" style={{
          fontFamily: 'Playfair Display, serif'
        }}>
            日报审批
          </h1>
          <p className="text-gray-600 mt-2">审核护工提交的日报内容</p>
        </div>

        {/* 筛选区域 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-filter" className="text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  选择日期
                </Label>
                <Input id="date-filter" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="border-amber-200 focus:border-amber-400 focus:ring-amber-400" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="search-filter" className="text-sm font-medium text-gray-700">
                  <Search className="w-4 h-4 inline mr-2" />
                  搜索老人姓名
                </Label>
                <Input id="search-filter" type="text" placeholder="输入老人姓名..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="border-amber-200 focus:border-amber-400 focus:ring-amber-400" />
              </div>
            </div>
          </div>
        </Card>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {dailyReports.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">待审批</div>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {dailyReports.filter(r => r.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">已通过</div>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {dailyReports.filter(r => r.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">已驳回</div>
          </Card>
        </div>

        {/* 日报列表 */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <div className="p-8 text-center text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>暂无符合条件的日报</p>
              </div>
            </Card> : filteredReports.map(report => <Card key={report.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{report.seniorName}</h3>
                        <p className="text-sm text-gray-600">{report.date}</p>
                      </div>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      提交时间：{report.submitTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <User className="w-4 h-4 mr-2" />
                      护工：{report.caregiverName}
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      {report.content}
                    </p>
                    {report.rejectReason && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">
                          <strong>驳回原因：</strong>{report.rejectReason}
                        </p>
                      </div>}
                  </div>

                  {/* 操作按钮 */}
                  {report.status === 'pending' && <div className="flex space-x-3">
                      <Button onClick={() => handleApprove(report.id)} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        通过
                      </Button>
                      <Button onClick={() => handleReject(report)} variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                        <XCircle className="w-4 h-4 mr-2" />
                        驳回
                      </Button>
                    </div>}
                </div>
              </Card>)}
        </div>
      </div>

      {/* 驳回原因对话框 */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-amber-900" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              填写驳回原因
            </DialogTitle>
            <DialogDescription>
              请详细说明驳回原因，护工将根据您的反馈进行修改
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">驳回原因 *</Label>
              <Textarea id="reject-reason" placeholder="请输入具体的驳回原因..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={4} className="border-amber-200 focus:border-amber-400 focus:ring-amber-400" />
            </div>
          </div>
          <DialogFooter className="space-x-3">
            <Button variant="outline" onClick={cancelReject} className="border-gray-300 text-gray-600 hover:bg-gray-50">
              取消
            </Button>
            <Button onClick={confirmReject} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
              确认驳回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}