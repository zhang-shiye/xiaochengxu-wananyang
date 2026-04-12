// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Button, Card, useToast, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import DataPermissionHelper from '@/components/PermissionCheck';
import { useForm } from 'react-hook-form';
export default function BindSenior(props) {
  const {
    toast
  } = useToast();
  const [isBinding, setIsBinding] = useState(false);
  const [elders, setElders] = useState([]);
  const [brandName, setBrandName] = useState('XX养老院');
  const form = useForm();

  // 加载品牌配置
  useEffect(() => {
    const loadBrandConfig = async () => {
      try {
        const result = await props.$w.cloud.callDataSource({
          dataSourceName: 'branding',
          methodName: 'wedaGetV2',
          params: {}
        });
        if (result && result.data && result.data.length > 0) {
          setBrandName(result.data[0].name || 'XX养老院');
        }
      } catch (error) {
        console.error('加载品牌配置失败:', error);
      }
    };
    loadBrandConfig();
  }, []);

  // 加载长者列表
  useEffect(() => {
    const loadElders = async () => {
      try {
        const result = await props.$w.cloud.callDataSource({
          dataSourceName: 'elders',
          methodName: 'wedaGetV2',
          params: {}
        });
        if (result && result.data) {
          setElders(result.data);
        }
      } catch (error) {
        console.error('加载长者列表失败:', error);
      }
    };
    loadElders();
  }, []);

  // 检查用户角色权限
  useEffect(() => {
    const user = props.$w.auth.currentUser;
    if (user?.type && user.type !== 'family') {
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
  }, []);
  const onSubmit = async data => {
    setIsBinding(true);
    try {
      // 验证长者信息
      const elderInfo = elders.find(e => e.name === data.elderName && e.verificationCode === data.verificationCode);
      if (!elderInfo) {
        toast({
          title: '绑定失败',
          description: '长者姓名或验证码不正确',
          variant: 'destructive'
        });
        return;
      }

      // 获取当前用户信息
      const user = props.$w.auth.currentUser;
      if (!user?.userId) {
        toast({
          title: '绑定失败',
          description: '用户信息不完整，请重新登录',
          variant: 'destructive'
        });
        return;
      }

      // 查询用户是否已存在于 employee 数据模型
      let employeeInfo = null;
      try {
        const empResult = await props.$w.cloud.callDataSource({
          dataSourceName: 'employee',
          methodName: 'wedaGetV2',
          params: {
            where: {
              openid: user.userId
            }
          }
        });
        if (empResult && empResult.data && empResult.data.length > 0) {
          employeeInfo = empResult.data[0];
        }
      } catch (error) {
        console.error('查询员工信息失败:', error);
      }

      // 创建家属-长者关联记录
      try {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'family_members',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              elderId: elderInfo._id,
              elderName: elderInfo.name,
              familyMemberId: employeeInfo?._id || user.userId,
              familyMemberName: employeeInfo?.name || user.nickName || '家属',
              relationship: data.relationship,
              status: '已绑定',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        });
      } catch (error) {
        console.error('创建关联记录失败:', error);
        toast({
          title: '绑定失败',
          description: '创建关联记录失败，请重试',
          variant: 'destructive'
        });
        return;
      }

      // 绑定成功弹窗
      toast({
        title: '绑定成功',
        description: `已成功绑定长者 ${elderInfo.name}`,
        variant: 'success'
      });

      // 跳转到关爱首页
      setTimeout(() => {
        props.$w.utils.navigateTo({
          pageId: 'home',
          params: {}
        });
      }, 1500);
    } catch (error) {
      console.error('绑定失败:', error);
      toast({
        title: '绑定失败',
        description: error.message || '绑定过程中发生错误',
        variant: 'destructive'
      });
    } finally {
      setIsBinding(false);
    }
  };
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };

  // 如果用户未登录或角色不匹配，显示提示
  const user = props.$w.auth.currentUser;
  if (!user?.userId || user?.type && user.type !== 'family') {
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
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
      {/* 顶部区域 */}
      <div className="px-4 py-4">
        {/* 返回按钮 + 标题 + 步骤提示 */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack} className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              绑定长者信息
            </h2>
            <p className="text-sm text-amber-600 mt-1" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              2/2 完成绑定
            </p>
          </div>
          <div className="w-9"></div>
        </div>
      </div>

      {/* 中部表单区域 */}
      <div className="flex-1 px-4">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl max-w-md mx-auto">
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="elderName" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-gray-700 font-medium">长者姓名</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入长者姓名" {...field} className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" style={{
                    fontFamily: 'Nunito Sans, sans-serif'
                  }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="verificationCode" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-gray-700 font-medium">专属验证码</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入专属验证码" {...field} className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" style={{
                    fontFamily: 'Nunito Sans, sans-serif'
                  }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="relationship" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-gray-700 font-medium">与长者关系</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl">
                            <SelectValue placeholder="请选择与长者关系" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="子女">子女</SelectItem>
                          <SelectItem value="配偶">配偶</SelectItem>
                          <SelectItem value="其他亲属">其他亲属</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

                {/* 提示信息 */}
                <div className="p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-amber-800 mb-1">如何获取验证码？</h4>
                      <p className="text-xs text-amber-700">
                        请联系{brandName}工作人员获取专属验证码，或查看长者入住时提供的资料。
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </div>

      {/* 底部固定悬浮按钮 */}
      <div className="px-4 py-4">
        <Button type="submit" disabled={isBinding} onClick={form.handleSubmit(onSubmit)} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full py-4 font-medium text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" style={{
        fontFamily: 'Nunito Sans, sans-serif'
      }}>
          {isBinding ? <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              绑定中...
            </div> : '完成绑定'}
        </Button>
      </div>
    </div>;
}