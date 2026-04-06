// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Button, Card, useToast } from '@/components/ui';

import { useForm } from 'react-hook-form';
export default function BindSenior(props) {
  const {
    toast
  } = useToast();
  const [isBinding, setIsBinding] = useState(false);
  const form = useForm();
  const onSubmit = async data => {
    setIsBinding(true);
    try {
      // 模拟绑定验证
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 跳转到关爱首页
      props.$w.utils.navigateTo({
        pageId: 'care-home',
        params: {}
      });
    } catch (error) {
      toast({
        title: '绑定失败',
        description: '请检查姓名和验证码是否正确',
        variant: 'destructive'
      });
    } finally {
      setIsBinding(false);
    }
  };
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={handleBack} className="text-amber-700 hover:text-amber-900 hover:bg-amber-100">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </Button>
          </div>

          {/* 头部标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              绑定长者信息
            </h1>
            <p className="text-amber-700" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              请输入长者的基本信息完成绑定
            </p>
          </div>

          {/* 步骤指示器 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                1
              </div>
              <div className="w-16 h-1 bg-green-300 mx-2"></div>
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
            </div>
          </div>

          {/* 绑定表单卡片 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                  长者身份验证
                </h3>
                <p className="text-gray-600 text-sm">
                  请输入长者姓名和专属验证码完成绑定
                </p>
              </div>

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

                  <Button type="submit" disabled={isBinding} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full py-3 font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" style={{
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
                </form>
              </Form>

              <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 mb-1">如何获取验证码？</h4>
                    <p className="text-xs text-amber-700">
                      请联系养老院工作人员获取专属验证码，或查看长者入住时提供的资料。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 底部装饰 */}
          <div className="text-center mt-8">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-amber-300 rounded-full"></div>
              <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
              <div className="w-3 h-3 bg-rose-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}