// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Button, Card, Textarea, useToast, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';

import { useForm } from 'react-hook-form';
import TabBar from '@/components/TabBar';
export default function Leave(props) {
  const {
    toast
  } = useToast();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentElder, setCurrentElder] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // 获取老人信息和请假记录
  const fetchElderInfoAndRequests = async () => {
    try {
      setLoading(true);
      // 获取老人信息
      const elderResult = await props.$w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          dataSourceName: 'elders',
          methodName: 'query',
          params: {
            filter: {
              status: 'active'
            },
            limit: 1
          }
        }
      });
      if (elderResult.result && elderResult.result.data && elderResult.result.data.length > 0) {
        const elder = elderResult.result.data[0];
        setCurrentElder(elder);

        // 获取请假记录
        await fetchLeaveRequests(elder._id);
      }
    } catch (error) {
      toast({
        title: '获取数据失败',
        description: '请检查网络连接后重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取请假记录
  const fetchLeaveRequests = async elderId => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          dataSourceName: 'leave_requests',
          methodName: 'query',
          params: {
            filter: {
              elderId: elderId
            },
            sort: {
              submitTime: -1
            },
            limit: 10
          }
        }
      });
      if (result.result && result.result.data) {
        const requests = result.result.data.map(request => ({
          id: request._id,
          reason: request.reason,
          startDate: request.startDate,
          endDate: request.endDate,
          status: request.status,
          submitTime: new Date(request.submitTime).toLocaleString('zh-CN'),
          approvalTime: request.approvalTime ? new Date(request.approvalTime).toLocaleString('zh-CN') : null
        }));
        setLeaveRequests(requests);
      }
    } catch (error) {
      console.error('获取请假记录失败:', error);
    }
  };
  useEffect(() => {
    fetchElderInfoAndRequests();
  }, []);
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
      // 提交请假申请到数据库
      if (!currentElder) return;
      const submitResult = await props.$w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          dataSourceName: 'leave_requests',
          methodName: 'create',
          params: {
            elderId: currentElder._id,
            elderName: currentElder.name,
            reason: reasonText,
            startDate: data.startDate,
            endDate: data.endDate,
            status: 'pending',
            submitTime: new Date().toISOString(),
            approvalTime: null
          }
        }
      });
      if (submitResult.result && submitResult.result.success) {
        // 重新获取请假记录
        await fetchLeaveRequests(currentElder._id);
        toast({
          title: '提交成功',
          description: '请假申请已提交，请等待院长审批'
        });
      }
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
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
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
      <TabBar currentPage="leave" />
    </div>;
}