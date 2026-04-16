// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Badge, useToast, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
// @ts-ignore;
import { Calendar, Eye, Check, X, Search, Filter, ArrowLeft, ArrowRight, Image as ImageIcon, Edit3, Clock } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
import DataPermissionHelper from '@/components/PermissionCheck';
import { DemoBanner } from '@/components/DemoBanner';
export default function AdminDaily(props) {
  const {
    toast
  } = useToast();

  // 演示模式检测
  const demoMode = props.$w.page.dataset.params.demo;
  const isDemo = demoMode === 'admin';

  // 检查用户角色权限（演示模式跳过权限检查）
  useEffect(() => {
    if (isDemo) return;
    const user = props.$w.auth.currentUser;
    const allowedTypes = ['nurse', 'staff', 'admin'];
    if (user?.type && !allowedTypes.includes(user.type)) {
      toast({
        title: '权限限制',
        description: '此页面仅管理员、护工、文员可以访问',
        variant: 'destructive'
      });
      props.$w.utils.redirectTo({
        pageId: 'login',
        params: {}
      });
    }
  }, []);

  // 如果非演示模式且用户未登录或角色不匹配，显示提示
  const user = props.$w.auth.currentUser;
  const allowedTypes = ['nurse', 'staff', 'admin'];
  if (!isDemo && (!user?.userId || user?.type && !allowedTypes.includes(user.type))) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-8">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl p-12 max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              权限验证中...
            </h2>
            <p className="text-gray-600 mb-6" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              此页面仅管理员、护工、文员可以访问
            </p>
            <Button onClick={() => {
            props.$w.utils.redirectTo({
              pageId: 'login',
              params: {}
            });
          }} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              前往登录
            </Button>
          </div>
        </Card>
      </div>;
  }
  const [dailyReports, setDailyReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadDailyReports();
  }, []);
  useEffect(() => {
    filterReports();
  }, [searchTerm, statusFilter, dailyReports]);
  const loadDailyReports = async () => {
    try {
      const user = props.$w.auth.currentUser;

      // 数据权限检查
      if (!DataPermissionHelper.hasDataPermission(user, 'admin')) {
        toast({
          title: '权限限制',
          description: '您没有权限查看日报数据',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // 使用数据模型 API 查询日报
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'daily_reports',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [...(statusFilter === 'all' ? [] : [{
                status: {
                  $eq: statusFilter
                }
              }])]
            }
          },
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }],
          pageSize: 100,
          pageNumber: 1
        }
      });
      const dailyReports = result.records || [];

      // 获取关联的老人信息
      const elderIds = dailyReports.map(report => report.elderId);
      if (elderIds.length > 0) {
        const elderResult = await props.$w.cloud.callDataSource({
          dataSourceName: 'elders',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  _id: {
                    $in: elderIds
                  }
                }]
              }
            },
            select: {
              $master: true
            }
          }
        });
        const elderMap = {};
        elderResult.records.forEach(elder => {
          elderMap[elder._id] = elder;
        });

        // 合并数据
        const reportsWithElder = dailyReports.map(report => ({
          ...report,
          elderName: elderMap[report.elderId]?.name || '未知老人',
          elderRoom: elderMap[report.elderId]?.room || '未知房间'
        }));
        setDailyReports(reportsWithElder);
        setFilteredReports(reportsWithElder);
      } else {
        setDailyReports([]);
        setFilteredReports([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('加载日报数据失败:', error);
      toast({
        title: '加载失败',
        description: error.message,
        variant: 'destructive'
      });
      setLoading(false);
    }
  };
  const filterReports = () => {
    let filtered = dailyReports;
    if (searchTerm) {
      filtered = filtered.filter(report => report.elderName && report.elderName.includes(searchTerm));
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    setFilteredReports(filtered);
  };
  const handleViewDetail = report => {
    setSelectedReport(report);
    setIsDetailView(true);
    setIsEditMode(false);
  };
  const handleApprove = async () => {
    if (!selectedReport) {
      toast({
        title: '操作失败',
        description: '请选择一条日报记录',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 使用数据模型 API 更新日报状态
      await props.$w.cloud.callDataSource({
        dataSourceName: 'daily_reports',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: selectedReport._id
                }
              }]
            }
          },
          data: {
            status: 'completed',
            updatedAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: '审核通过',
        description: '日报已发布，家属端可见'
      });
      setIsDetailView(false);
      loadDailyReports();
    } catch (error) {
      console.error('审核失败:', error);
      toast({
        title: '审核失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleReject = async reason => {
    try {
      // 使用数据模型 API 更新日报状态为驳回
      await props.$w.cloud.callDataSource({
        dataSourceName: 'daily_reports',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: selectedReport._id
                }
              }]
            }
          },
          data: {
            status: 'rejected',
            reviewComment: reason,
            updatedAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: '已驳回',
        description: '日报已驳回，请重新提交'
      });
      setIsDetailView(false);
      loadDailyReports();
    } catch (error) {
      console.error('驳回失败:', error);
      toast({
        title: '驳回失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleSaveEdit = async () => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      await db.collection('daily_reports').doc(selectedReport._id).update({
        breakfast: selectedReport.breakfast,
        lunch: selectedReport.lunch,
        dinner: selectedReport.dinner,
        activities: selectedReport.activities,
        notes: selectedReport.notes,
        images: selectedReport.images,
        updatedAt: new Date().getTime()
      });
      toast({
        title: '保存成功',
        description: '日报内容已更新'
      });
      setIsEditMode(false);
    } catch (error) {
      console.error('保存失败:', error);
      toast({
        title: '保存失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleDeleteImage = index => {
    if (!selectedReport || !selectedReport.images) {
      return;
    }
    const newImages = [...(selectedReport.images || [])];
    newImages.splice(index, 1);
    setSelectedReport({
      ...selectedReport,
      images: newImages
    });
  };
  const getStatusBadge = status => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">待审核</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">已发布</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">已驳回</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  const handleExitDemo = () => {
    props.$w.utils.redirectTo({
      pageId: 'login',
      params: {}
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-24">
      {isDemo && <DemoBanner role="admin" onBack={handleExitDemo} />}
      {/* 头部 */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-['Ma_Shan_Zheng'] text-gray-800">日报审核</h1>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            {filteredReports.filter(r => r.status === 'pending').length} 待审核
          </Badge>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="px-4 py-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="搜索老人姓名" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-white" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="pending">待审核</SelectItem>
            <SelectItem value="completed">已发布</SelectItem>
            <SelectItem value="rejected">已驳回</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 日报列表 */}
      {isDetailView ? (/* 详情视图 */
    <div className="px-4 py-4 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={() => {
          setIsDetailView(false);
          setSelectedReport(null);
        }}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
            {getStatusBadge(selectedReport.status)}
          </div>

          <Card className="bg-white p-4 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{selectedReport.elderName}</h2>
                <p className="text-sm text-gray-500">{selectedReport.date}</p>
              </div>
              {!isEditMode && <Button size="sm" variant="outline" onClick={() => setIsEditMode(true)} className="text-blue-600 border-blue-600">
                  <Edit3 className="w-4 h-4 mr-1" />
                  编辑
                </Button>}
            </div>

            {/* 图片展示 */}
            {selectedReport.images && selectedReport.images.length > 0 && <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">今日图片</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedReport.images.map((image, index) => <div key={index} className="relative">
                      <img src={image} alt={`图片 ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      {isEditMode && <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => handleDeleteImage(index)}>
                          <X className="w-3 h-3" />
                        </Button>}
                    </div>)}
                </div>
              </div>}

            {/* 餐饮记录 */}
            <div className="space-y-3">
              {isEditMode ? <>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">早餐</p>
                    <textarea className="w-full p-2 border rounded-lg text-sm" value={selectedReport.breakfast || ''} onChange={e => setSelectedReport({
                ...selectedReport,
                breakfast: e.target.value
              })} rows={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">午餐</p>
                    <textarea className="w-full p-2 border rounded-lg text-sm" value={selectedReport.lunch || ''} onChange={e => setSelectedReport({
                ...selectedReport,
                lunch: e.target.value
              })} rows={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">晚餐</p>
                    <textarea className="w-full p-2 border rounded-lg text-sm" value={selectedReport.dinner || ''} onChange={e => setSelectedReport({
                ...selectedReport,
                dinner: e.target.value
              })} rows={2} />
                  </div>
                </> : <>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">早餐</p>
                    <p className="text-sm text-gray-600">{selectedReport?.breakfast || '未记录'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">午餐</p>
                    <p className="text-sm text-gray-600">{selectedReport?.lunch || '未记录'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">晚餐</p>
                    <p className="text-sm text-gray-600">{selectedReport?.dinner || '未记录'}</p>
                  </div>
                </>}

              {/* 活动 */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">今日活动</p>
                {isEditMode ? <textarea className="w-full p-2 border rounded-lg text-sm" value={selectedReport?.activities || ''} onChange={e => setSelectedReport({
              ...selectedReport,
              activities: e.target.value
            })} rows={2} /> : <p className="text-sm text-gray-600">{selectedReport?.activities || '无'}</p>}
              </div>

              {/* 备注 */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">备注</p>
                {isEditMode ? <textarea className="w-full p-2 border rounded-lg text-sm" value={selectedReport?.notes || ''} onChange={e => setSelectedReport({
              ...selectedReport,
              notes: e.target.value
            })} rows={2} /> : <p className="text-sm text-gray-600">{selectedReport?.notes || '无'}</p>}
              </div>

              {/* 健康状况 */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">健康状况</p>
                <p className="text-sm text-gray-600">{selectedReport?.healthStatus || '良好'}</p>
              </div>
            </div>

            {/* 审核按钮 */}
            {isEditMode ? <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEdit} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  保存修改
                </Button>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  取消
                </Button>
              </div> : selectedReport.status === 'pending' ? <div className="flex gap-2 pt-4">
                <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-1" />
                  通过
                </Button>
                <Button variant="destructive" onClick={() => {
            const reason = prompt('请输入驳回理由：');
            if (reason) {
              handleReject(reason);
            }
          }} className="flex-1">
                  <X className="w-4 h-4 mr-1" />
                  驳回
                </Button>
              </div> : null}
          </Card>
        </div>) : (/* 列表视图 */
    <div className="px-4 py-4 space-y-3">
          {loading ? <div className="text-center text-gray-500 py-8">加载中...</div> : filteredReports.length === 0 ? <div className="text-center text-gray-500 py-8">暂无日报记录</div> : filteredReports.map(report => <Card key={report._id} className="bg-white p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleViewDetail(report)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{report.elderName}</h3>
                      {getStatusBadge(report.status)}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{report.date}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {report.breakfast && report.breakfast.substring(0, 50)}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>)}
        </div>)}

      <AdminTabBar currentPage="admin-daily" isDemo={isDemo} $w={props.$w} />
    </div>;
}