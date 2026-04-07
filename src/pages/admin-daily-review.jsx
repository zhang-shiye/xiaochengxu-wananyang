// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, Button, Input, Textarea, Avatar, AvatarImage, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, Filter, Calendar, User, FileText, Image, Check, X, Clock, ArrowLeft, Edit3, Save, Trash2 } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
export default function AdminDailyReview(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('daily-review');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取日报数据
  const fetchReports = async () => {
    try {
      setLoading(true);
      const result = await props.$w.cloud.callFunction({
        name: 'getDailyReports',
        data: {
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchTerm
        }
      });
      if (result.result.success) {
        setReports(result.result.data);
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
    fetchReports();
  }, [statusFilter, searchTerm]);

  // 审批日报
  const handleReview = async (reportId, status, comment = '') => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'reviewDailyReport',
        data: {
          reportId,
          status,
          comment,
          reviewerId: props.$w.auth.currentUser?.userId || 'admin_001'
        }
      });
      if (result.result.success) {
        toast({
          title: status === 'approved' ? '审批通过' : '已驳回',
          description: status === 'approved' ? '日报已发布给家属' : '日报已退回修改'
        });
        fetchReports();
        if (selectedReport) {
          setSelectedReport(prev => ({
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

  // 编辑日报
  const handleEdit = async updatedData => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'updateDailyReport',
        data: {
          reportId: selectedReport._id,
          ...updatedData,
          reviewerId: props.$w.auth.currentUser?.userId || 'admin_001'
        }
      });
      if (result.result.success) {
        toast({
          title: '修改成功',
          description: '日报内容已更新'
        });
        fetchReports();
        setSelectedReport(prev => ({
          ...prev,
          ...updatedData
        }));
        setIsEditMode(false);
      } else {
        toast({
          title: '修改失败',
          description: result.result.error || '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '网络错误',
        description: '修改失败，请检查网络连接',
        variant: 'destructive'
      });
    }
  };

  // 删除图片
  const handleDeleteImage = async imageIndex => {
    try {
      const newImages = selectedReport.images.filter((_, index) => index !== imageIndex);
      await handleEdit({
        images: newImages
      });
    } catch (error) {
      toast({
        title: '删除失败',
        description: '图片删除失败，请重试',
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
        label: '已驳回',
        variant: 'destructive'
      }
    };
    return statusMap[status] || {
      label: '未知',
      variant: 'secondary'
    };
  };
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.elderName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const statusCounts = {
    all: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    approved: reports.filter(r => r.status === 'approved').length,
    rejected: reports.filter(r => r.status === 'rejected').length
  };
  if (isDetailView && selectedReport) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="p-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => {
            setIsDetailView(false);
            setSelectedReport(null);
            setIsEditMode(false);
          }} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">日报详情</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face`} />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedReport.elderName}</h3>
                  <p className="text-sm text-gray-500">提交时间: {new Date(selectedReport.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <Badge variant={getStatusBadge(selectedReport.status).variant}>
                {getStatusBadge(selectedReport.status).label}
              </Badge>
            </div>

            {isEditMode ? <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">日报内容</label>
                  <Textarea value={selectedReport.content || ''} onChange={e => setSelectedReport(prev => ({
                ...prev,
                content: e.target.value
              }))} rows={6} className="w-full" />
                </div>

                {selectedReport.images && selectedReport.images.length > 0 && <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">图片附件</label>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedReport.images.map((image, index) => <div key={index} className="relative group">
                          <img src={image} alt={`图片 ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <Button size="sm" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteImage(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>)}
                    </div>
                  </div>}

                <div className="flex space-x-3">
                  <Button onClick={() => handleEdit({
                content: selectedReport.content,
                images: selectedReport.images
              })}>
                    <Save className="w-4 h-4 mr-2" />
                    保存修改
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditMode(false)}>
                    取消
                  </Button>
                </div>
              </div> : <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">日报内容</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedReport.content}</p>
                </div>

                {selectedReport.images && selectedReport.images.length > 0 && <div>
                    <h4 className="font-medium text-gray-800 mb-2">图片附件</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedReport.images.map((image, index) => <img key={index} src={image} alt={`图片 ${index + 1}`} className="w-full h-32 object-cover rounded-lg cursor-pointer" onClick={() => window.open(image, '_blank')} />)}
                    </div>
                  </div>}

                {selectedReport.reviewerId && <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>审批人：</strong>{selectedReport.reviewerId}
                    </p>
                    {selectedReport.reviewComment && <p className="text-sm text-gray-600 mt-1">
                        <strong>审批意见：</strong>{selectedReport.reviewComment}
                      </p>}
                    {selectedReport.updatedAt && <p className="text-sm text-gray-600 mt-1">
                        <strong>审批时间：</strong>{new Date(selectedReport.updatedAt).toLocaleString()}
                      </p>}
                  </div>}
              </div>}
          </div>

          {selectedReport.status === 'pending' && <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
              <div className="flex space-x-3">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleReview(selectedReport._id, 'approved')}>
                  <Check className="w-4 h-4 mr-2" />
                  通过
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => {
              const reason = prompt('请输入驳回原因：');
              if (reason !== null) {
                handleReview(selectedReport._id, 'rejected', reason);
              }
            }}>
                  <X className="w-4 h-4 mr-2" />
                  驳回
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsEditMode(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  编辑
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
          <h1 className="text-xl font-bold text-gray-800">日报审批</h1>
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
          label: '已驳回',
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
            <Input placeholder="搜索老人姓名..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* 日报列表 */}
        {loading ? <div className="text-center py-8">
            <div className="text-gray-500">加载中...</div>
          </div> : filteredReports.length === 0 ? <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无日报数据</p>
          </div> : <div className="space-y-4 mb-20">
            {filteredReports.map(report => <Card key={report._id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
          setSelectedReport(report);
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
                          <h3 className="font-semibold text-gray-800">{report.elderName}</h3>
                          <Badge variant={getStatusBadge(report.status).variant} className="text-xs">
                            {getStatusBadge(report.status).label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {report.content?.substring(0, 100)}{report.content?.length > 100 ? '...' : ''}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(report.createdAt).toLocaleString()}
                          </span>
                          {report.images && report.images.length > 0 && <span className="flex items-center">
                              <Image className="w-3 h-3 mr-1" />
                              {report.images.length}张图片
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