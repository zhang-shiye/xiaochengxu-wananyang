// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Avatar, AvatarImage, Badge } from '@/components/ui';
// @ts-ignore;
import { User, FileText, CheckCircle, Clock, Settings, Plus, Sparkles, BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';

export default function Admin(props) {
  const [currentRole, setCurrentRole] = useState('护工'); // 护工 | 院长
  const [dailyReports, setDailyReports] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 获取当前用户信息
  useEffect(() => {
    if (props.$w?.auth?.currentUser) {
      setCurrentUser(props.$w.auth.currentUser);
    }
  }, [props.$w?.auth?.currentUser]);

  // 加载日报数据
  const loadDailyReports = async () => {
    try {
      if (currentRole === '护工') {
        // 护工查看自己的日报
        const result = await props.$w.cloud.callDataSource({
          dataSourceName: 'daily_report',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  reporterId: {
                    $eq: currentUser?.userId || 'worker_001'
                  }
                }]
              }
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            select: {
              $master: true
            },
            pageSize: 20,
            pageNumber: 1
          }
        });
        setDailyReports(result.records || []);
      } else {
        // 院长查看待审批的日报
        const result = await props.$w.cloud.callDataSource({
          dataSourceName: 'daily_report',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  status: {
                    $eq: '待审核'
                  }
                }]
              }
            },
            orderBy: [{
              priority: 'desc'
            }, {
              createdAt: 'asc'
            }],
            select: {
              $master: true
            },
            pageSize: 20,
            pageNumber: 1
          }
        });
        setPendingApprovals(result.records || []);
      }
    } catch (error) {
      console.error('加载日报数据失败:', error);
      // 使用 toast 通知用户
      if (props.$w?.utils?.showToast) {
        props.$w.utils.showToast({
          title: '加载失败',
          content: '日报数据加载失败，请稍后重试',
          icon: 'error'
        });
      }
    }
  };
  useEffect(() => {
    loadDailyReports();
  }, [currentRole, currentUser]);
  const handleRoleChange = role => {
    setCurrentRole(role);
  };

  // AI 一键录入
  const handleAIInput = async () => {
    setIsLoading(true);
    try {
      // 调用云函数生成 AI 日报内容
      const aiResult = await props.$w.cloud.callFunction({
        name: 'generateDailyReport',
        data: {
          reporterId: currentUser?.userId || 'worker_001',
          reporterName: currentUser?.name || '李护工',
          date: new Date().toISOString().split('T')[0]
        }
      });
      if (aiResult.result && aiResult.result.content) {
        // 保存 AI 生成的日报到数据库
        const saveResult = await props.$w.cloud.callDataSource({
          dataSourceName: 'daily_report',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              reporterRole: '护工',
              reporterId: currentUser?.userId || 'worker_001',
              reporterName: currentUser?.name || '李护工',
              date: new Date().toISOString().split('T')[0],
              content: aiResult.result.content,
              aiGenerated: true,
              status: '待审核',
              priority: '正常',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        });
        if (saveResult.id) {
          // 重新加载日报列表
          await loadDailyReports();
          // 显示成功提示
          if (props.$w?.utils?.showToast) {
            props.$w.utils.showToast({
              title: 'AI录入成功',
              content: '日报已成功生成并保存',
              icon: 'success'
            });
          }
        }
      }
    } catch (error) {
      console.error('AI录入失败:', error);
      if (props.$w?.utils?.showToast) {
        props.$w.utils.showToast({
          title: 'AI录入失败',
          content: '请稍后重试',
          icon: 'error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 审批日报
  const handleApprove = async (reportId, action) => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'daily_report',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: action === 'approve' ? '已审核' : '已驳回',
            auditBy: currentUser?.userId || 'director_001',
            auditAt: new Date().toISOString(),
            auditNote: action === 'approve' ? '审核通过' : '审核驳回',
            updatedAt: new Date().toISOString()
          },
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: reportId
                }
              }]
            }
          }
        }
      });
      if (result.count > 0) {
        // 重新加载待审批列表
        await loadDailyReports();
        // 显示成功提示
        if (props.$w?.utils?.showToast) {
          props.$w.utils.showToast({
            title: action === 'approve' ? '审批通过' : '已驳回',
            content: `日报${action === 'approve' ? '已通过审核' : '已被驳回'}`,
            icon: 'success'
          });
        }
      }
    } catch (error) {
      console.error('审批失败:', error);
      if (props.$w?.utils?.showToast) {
        props.$w.utils.showToast({
          title: '审批失败',
          content: '请稍后重试',
          icon: 'error'
        });
      }
    }
  };
  const getStatusBadge = status => {
    const statusMap = {
      '已审核': {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-3 h-3" />
      },
      '待审核': {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-3 h-3" />
      },
      '已驳回': {
        color: 'bg-red-100 text-red-800',
        icon: <Clock className="w-3 h-3" />
      }
    };
    return statusMap[status] || {
      color: 'bg-gray-100 text-gray-800',
      icon: null
    };
  };
  const getPriorityBadge = priority => {
    if (priority === '紧急') {
      return {
        color: 'bg-red-100 text-red-800',
        text: '紧急'
      };
    }
    return {
      color: 'bg-gray-100 text-gray-800',
      text: '正常'
    };
  };

  // 格式化日期
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-');
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="container mx-auto px-4 py-6">
        {/* 头部区域 - 角色切换 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12 border-3 border-amber-200">
                  <AvatarImage src="/api/placeholder/48/48" alt="管理员" />
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-amber-900" style={{
                  fontFamily: 'Playfair Display, serif'
                }}>
                    皖安养管理后台
                  </h1>
                  <p className="text-gray-600 text-sm">智慧养老管理系统</p>
                </div>
              </div>
              
              {/* 角色切换器 */}
              <div className="flex bg-amber-100 rounded-full p-1">
                <button onClick={() => handleRoleChange('护工')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentRole === '护工' ? 'bg-amber-500 text-white shadow-md' : 'text-amber-700 hover:bg-amber-200'}`}>
                  <User className="w-4 h-4 inline mr-1" />
                  护工端
                </button>
                <button onClick={() => handleRoleChange('院长')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentRole === '院长' ? 'bg-amber-500 text-white shadow-md' : 'text-amber-700 hover:bg-amber-200'}`}>
                  <Settings className="w-4 h-4 inline mr-1" />
                  院长端
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 护工端界面 */}
        {currentRole === '护工' && <div className="space-y-6">
            {/* 快速操作区域 */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-amber-600" />
                  日报录入
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleAIInput} disabled={isLoading} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
                    <Sparkles className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'AI生成中...' : 'AI一键录入'}
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
                    <Plus className="w-5 h-5 mr-2" />
                    手动录入
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 日报列表 */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-amber-600" />
                  我的日报记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyReports.map(report => <div key={report._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{report.reporterName}的日报</h3>
                            <p className="text-sm text-gray-600">{report.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {report.aiGenerated && <Badge className="bg-purple-100 text-purple-800 text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI生成
                            </Badge>}
                          <Badge className={getStatusBadge(report.status).color}>
                            {getStatusBadge(report.status).icon}
                            <span className="ml-1">{report.status}</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700 leading-relaxed">{report.content}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>提交时间：{formatDate(report.createdAt)}</span>
                        {report.auditAt && <span>审核时间：{formatDate(report.auditAt)}</span>}
                      </div>
                    </div>)}
                  {dailyReports.length === 0 && <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">暂无日报记录</p>
                      <p className="text-sm text-gray-400 mt-1">点击上方按钮开始录入日报</p>
                    </div>}
                </div>
              </CardContent>
            </Card>
          </div>}

        {/* 院长端界面 */}
        {currentRole === '院长' && <div className="space-y-6">
            {/* 统计概览 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">今日日报</p>
                      <p className="text-2xl font-bold text-gray-800">{dailyReports.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">待审批</p>
                      <p className="text-2xl font-bold text-gray-800">{pendingApprovals.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">护工人数</p>
                      <p className="text-2xl font-bold text-gray-800">3</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 待审批日报 */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                  待审批日报 ({pendingApprovals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map(report => <div key={report._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{report.reporterName}</h3>
                            <p className="text-sm text-gray-600">{report.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityBadge(report.priority).color}>
                            {getPriorityBadge(report.priority).text}
                          </Badge>
                          {report.aiGenerated && <Badge className="bg-purple-100 text-purple-800 text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI生成
                            </Badge>}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700 leading-relaxed">{report.content}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">提交时间：{formatDate(report.createdAt)}</span>
                        <div className="flex space-x-2">
                          <Button onClick={() => handleApprove(report._id, 'reject')} variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                            驳回
                          </Button>
                          <Button onClick={() => handleApprove(report._id, 'approve')} size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                            通过
                          </Button>
                        </div>
                      </div>
                    </div>)}
                  {pendingApprovals.length === 0 && <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">暂无待审批日报</p>
                      <p className="text-sm text-gray-400 mt-1">所有日报都已处理完成</p>
                    </div>}
                </div>
              </CardContent>
            </Card>

            {/* 系统设置入口 */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-amber-600" />
                  系统管理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    数据统计
                  </Button>
                  <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                    <Users className="w-4 h-4 mr-2" />
                    护工管理
                  </Button>
                  <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                    <Calendar className="w-4 h-4 mr-2" />
                    排班管理
                  </Button>
                  <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    报表导出
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>}
      </div>
    </div>;
}