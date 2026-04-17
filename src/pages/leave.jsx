// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Button, Card, Textarea, useToast, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
// @ts-ignore;
import { Calendar } from 'lucide-react';

import { useForm } from 'react-hook-form';
import TabBar from '@/components/TabBar';
import { DemoBanner } from '@/components/DemoBanner';
export default function Leave(props) {
  const {
    toast
  } = useToast();

  // 演示模式检测
  const demoMode = props.$w.page.dataset.params.demo;
  const isDemo = demoMode === 'family';

  // 检查用户登录状态和角色权限（演示模式跳过）
  useEffect(() => {
    if (isDemo) return;
    const checkAuth = async () => {
      try {
        await props.$w.auth.getUserInfo({
          force: true
        });
        const user = props.$w.auth.currentUser;
        // 未登录跳转到登录页
        if (!user?.userId) {
          toast({
            title: '请先登录',
            description: '需要登录后才能访问',
            variant: 'destructive'
          });
          props.$w.utils.redirectTo({
            pageId: 'login',
            params: {}
          });
          return;
        }
        // 检查角色权限
        if (user.type && user.type !== 'family') {
          toast({
            title: '权限限制',
            description: '此页面仅家属用户可以访问',
            variant: 'destructive'
          });
          props.$w.utils.redirectTo({
            pageId: 'login',
            params: {}
          });
        }
      } catch (error) {
        console.error('权限检查失败:', error);
        props.$w.utils.redirectTo({
          pageId: 'login',
          params: {}
        });
      }
    };
    checkAuth();
  }, []);

  // 如果非演示模式且用户未登录或角色不匹配，显示提示
  const user = props.$w.auth.currentUser;
  if (!isDemo && (!user?.userId || user?.type && user.type !== 'family')) {
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
              此页面仅家属用户可以访问
            </p>
            <Button onClick={() => {
            props.$w.utils.redirectTo({
              pageId: 'login',
              params: {}
            });
          }} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              前往登录
            </Button>
          </div>
        </Card>
      </div>;
  }
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [elderInfo, setElderInfo] = useState(null);

  // 常用请假事由选项
  const reasonOptions = [{
    value: 'family_visit',
    label: '探亲访友'
  }, {
    value: 'medical_treatment',
    label: '外出就医'
  }, {
    value: 'personal_affairs',
    label: '处理个人事务'
  }, {
    value: 'holiday_travel',
    label: '节假日外出'
  }, {
    value: 'family_emergency',
    label: '家庭紧急情况'
  }, {
    value: 'other',
    label: '其他事由'
  }];
  const form = useForm({
    defaultValues: {
      reason: '',
      startDate: '',
      endDate: '',
      customReason: ''
    }
  });

  // 监听请假事由选择变化
  const selectedReason = form.watch('reason');

  // 加载请假记录
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. 获取当前用户绑定的老人
        const user = props.$w.auth.currentUser;
        const familyId = isDemo ? 'family_001' : user?.userId || 'demo_user';

        // 查询绑定关系
        const bindingResult = await props.$w.cloud.callDataSource({
          dataSourceName: isDemo ? 'demo_family_members' : 'family_members',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  familyId: {
                    $eq: familyId
                  }
                }, {
                  status: {
                    $eq: 'active'
                  }
                }]
              }
            },
            select: {
              $master: true
            },
            pageSize: 10,
            pageNumber: 1
          }
        });
        const bindings = bindingResult?.records || [];
        if (bindings.length === 0) {
          setLoading(false);
          return;
        }
        const binding = bindings[0];
        const elderId = binding.elderId;
        const elderName = binding.elderName;
        setElderInfo({
          elderId,
          elderName
        });

        // 2. 获取该老人的请假记录（演示模式使用demo数据源）
        const leaveResult = await props.$w.cloud.callDataSource({
          dataSourceName: isDemo ? 'demo_leave_records' : 'leave_requests',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  elderId: {
                    $eq: elderId
                  }
                }]
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 20,
            pageNumber: 1
          }
        });
        const requests = leaveResult?.records || [];
        const formattedRequests = requests.map(req => ({
          id: req._id,
          reason: req.reason,
          startDate: req.startDate,
          endDate: req.endDate,
          status: req.status,
          submitTime: new Date(req.createdAt).toLocaleString('zh-CN'),
          approvalTime: req.approvedAt ? new Date(req.approvedAt).toLocaleString('zh-CN') : null,
          approvedBy: req.approvedBy || ''
        }));
        setLeaveRequests(formattedRequests);
      } catch (error) {
        console.error('加载请假记录失败:', error);
        toast({
          title: '加载失败',
          description: '获取请假记录时出错',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isDemo]);
  const onSubmit = async data => {
    // 表单验证
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: '表单验证失败',
        description: '请检查并完善表单信息',
        variant: 'destructive'
      });
      return;
    }

    // 处理请假事由显示文本
    let reasonText = '';
    if (data.reason === 'other' && data.customReason) {
      reasonText = data.customReason;
    } else {
      const selectedOption = reasonOptions.find(option => option.value === data.reason);
      reasonText = selectedOption ? selectedOption.label : data.reason;
    }
    setIsSubmitting(true);
    try {
      // 获取用户信息
      const user = props.$w.auth.currentUser;
      const familyId = isDemo ? 'family_001' : user?.userId || 'demo_user';
      const familyName = isDemo ? '演示用户' : user?.name || '家属';

      // 提交请假申请到数据库
      await props.$w.cloud.callDataSource({
        dataSourceName: 'leave_requests',
        methodName: 'wedaAddV2',
        params: {
          data: {
            elderId: elderInfo?.elderId,
            elderName: elderInfo?.elderName,
            familyId: familyId,
            familyName: familyName,
            reason: reasonText,
            startDate: data.startDate,
            endDate: data.endDate,
            status: 'pending',
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        }
      });

      // 重新加载请假记录（演示模式使用demo数据源）
      const leaveResult = await props.$w.cloud.callDataSource({
        dataSourceName: isDemo ? 'demo_leave_records' : 'leave_requests',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                elderId: {
                  $eq: elderInfo?.elderId
                }
              }]
            }
          },
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }],
          pageSize: 20,
          pageNumber: 1
        }
      });
      const requests = leaveResult?.records || [];
      const formattedRequests = requests.map(req => ({
        id: req._id,
        reason: req.reason,
        startDate: req.startDate,
        endDate: req.endDate,
        status: req.status,
        submitTime: new Date(req.createdAt).toLocaleString('zh-CN'),
        approvalTime: req.approvedAt ? new Date(req.approvedAt).toLocaleString('zh-CN') : null,
        approvedBy: req.approvedBy || ''
      }));
      setLeaveRequests(formattedRequests);
      toast({
        title: '提交成功',
        description: '请假申请已提交，请等待院长审批'
      });
      form.reset();
    } catch (error) {
      toast({
        title: '提交失败',
        description: '请检查网络连接后重试',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const getStatusInfo = status => {
    const statusMap = {
      pending: {
        text: '待审批',
        color: 'bg-yellow-100 text-yellow-800',
        icon: '⏳'
      },
      approved: {
        text: '已通过',
        color: 'bg-green-100 text-green-800',
        icon: '✅'
      },
      rejected: {
        text: '已拒绝',
        color: 'bg-red-100 text-red-800',
        icon: '❌'
      }
    };
    return statusMap[status] || statusMap.pending;
  };
  const handleExitDemo = () => {
    props.$w.utils.redirectTo({
      pageId: 'login',
      params: {}
    });
  };

  // 加载中显示
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">加载请假记录...</p>
      </div>
    </div>;
  }

  // 没有绑定老人时显示
  if (!elderInfo) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      {isDemo && <DemoBanner role="family" onBack={handleExitDemo} />}
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">尚未绑定老人</h2>
            <p className="text-gray-600 mb-6">请先绑定老人信息，以便提交请假申请</p>
            <Button onClick={() => props.$w.utils.navigateTo({
              pageId: 'bind-senior',
              params: isDemo ? {
                demo: 'family'
              } : {}
            })} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-6 py-2">
              立即绑定
            </Button>
          </div>
        </Card>
      </div>
      <TabBar currentPage="leave" isDemo={isDemo} $w={props.$w} />
    </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      {isDemo && <DemoBanner role="family" onBack={handleExitDemo} />}
      {/* 头部 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-amber-900 text-center" style={{
          fontFamily: 'Playfair Display, serif'
        }}>
            请假申请
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* 请假申请表单 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              发起请假申请
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="reason" rules={{
                required: '请选择请假事由'
              }} render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-gray-700" style={{
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>
                        请假事由 *
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="border-amber-200 focus:border-amber-400 rounded-xl">
                            <SelectValue placeholder="请选择请假事由" />
                          </SelectTrigger>
                          <SelectContent>
                            {reasonOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                {/* 自定义事由输入框 - 仅在选择"其他事由"时显示 */}
                {selectedReason === 'other' && <FormField control={form.control} name="customReason" rules={{
                required: '请填写具体事由',
                minLength: {
                  value: 5,
                  message: '具体事由至少需要5个字符'
                }
              }} render={({
                field
              }) => <FormItem>
                          <FormLabel className="text-gray-700" style={{
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>
                            具体事由说明 *
                          </FormLabel>
                          <FormControl>
                            <Textarea placeholder="请详细说明具体请假原因..." {...field} className="border-amber-200 focus:border-amber-400 rounded-xl resize-none" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />}

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="startDate" rules={{
                  required: '请选择预计离院时间',
                  validate: value => {
                    if (value) {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (selectedDate < today) {
                        return '离院时间不能早于今天';
                      }
                    }
                    return true;
                  }
                }} render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-gray-700" style={{
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}>
                          预计离院时间 *
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="border-amber-200 focus:border-amber-400 rounded-xl" min={new Date().toISOString().split('T')[0]} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="endDate" rules={{
                  required: '请选择预计返院时间',
                  validate: (value, formValues) => {
                    if (value && formValues.startDate) {
                      const startDate = new Date(formValues.startDate);
                      const endDate = new Date(value);
                      if (endDate < startDate) {
                        return '返院时间不能早于离院时间';
                      }
                    }
                    return true;
                  }
                }} render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-gray-700" style={{
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}>
                          预计返院时间 *
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="border-amber-200 focus:border-amber-400 rounded-xl" min={form.watch('startDate') || new Date().toISOString().split('T')[0]} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-full py-3 font-medium" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                  {isSubmitting ? '提交中...' : '提交申请'}
                </Button>
              </form>
            </Form>
          </div>
        </Card>

        {/* 审批进度 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              申请记录
            </h2>
            
            {leaveRequests.length === 0 ? <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-gray-600">暂无请假记录</p>
              </div> : <div className="space-y-4">
                {leaveRequests.map(request => {
              const statusInfo = getStatusInfo(request.status);
              return <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-1">
                            {request.reason}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {request.startDate} 至 {request.endDate}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          <span className="mr-1">{statusInfo.icon}</span>
                          {statusInfo.text}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>提交时间：{request.submitTime}</p>
                        {request.approvalTime && <p>审批时间：{request.approvalTime}</p>}
                      </div>

                      {/* 审批流程 */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${request.status !== 'pending' ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                            <span className="text-sm text-gray-600 ml-2">家属申请</span>
                          </div>
                          <div className="flex-1 h-0.5 bg-gray-200 rounded"></div>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${request.status === 'approved' ? 'bg-green-400' : request.status === 'rejected' ? 'bg-red-400' : 'bg-gray-300'}`}></div>
                            <span className="text-sm text-gray-600 ml-2">院长审批</span>
                          </div>
                        </div>
                      </div>
                    </div>;
            })}
              </div>}
          </div>
        </Card>
      </div>

      {/* 底部导航 */}
      <TabBar currentPage="leave" isDemo={isDemo} $w={props.$w} />
    </div>;
}