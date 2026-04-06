// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useToast } from '@/components/ui';

import { useForm } from 'react-hook-form';
export default function BackendLogin(props) {
  const {
    toast
  } = useToast();
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      role: 'staff'
    }
  });
  const onSubmit = async data => {
    // 模拟登录验证
    // 实际项目中应该调用云函数进行身份验证
    try {
      if (data.role === 'staff') {
        // 护工登录
        if (data.username === 'staff001' && data.password === '123456') {
          toast({
            title: '登录成功',
            description: '护工登录成功'
          });
          props.$w.utils.navigateTo({
            pageId: 'staff-workspace',
            params: {
              role: 'staff',
              userId: data.username
            }
          });
        } else {
          toast({
            title: '登录失败',
            description: '用户名或密码错误',
            variant: 'destructive'
          });
        }
      } else if (data.role === 'director') {
        // 院长登录
        if (data.username === 'director' && data.password === '888888') {
          toast({
            title: '登录成功',
            description: '院长登录成功'
          });
          props.$w.utils.navigateTo({
            pageId: 'director-workspace',
            params: {
              role: 'director',
              userId: data.username
            }
          });
        } else {
          toast({
            title: '登录失败',
            description: '用户名或密码错误',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      toast({
        title: '登录失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800" style={{
            fontFamily: 'DM Sans, sans-serif'
          }}>
              皖安养管理系统
            </h1>
            <p className="text-gray-600 mt-2">后台登录</p>
          </div>

          {/* 登录卡片 */}
          <Card className="bg-white shadow-md rounded-lg p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* 角色选择 */}
                <FormField control={form.control} name="role" render={({
                field
              }) => <FormItem>
                      <FormLabel>角色类型</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} placeholder="请输入角色(staff/director)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                {/* 用户名 */}
                <FormField control={form.control} name="username" render={({
                field
              }) => <FormItem>
                      <FormLabel>用户名</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} placeholder="请输入用户名" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                {/* 密码 */}
                <FormField control={form.control} name="password" render={({
                field
              }) => <FormItem>
                      <FormLabel>密码</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} placeholder="请输入密码" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                {/* 登录按钮 */}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  登录
                </Button>

                {/* 登录提示 */}
                <div className="text-sm text-gray-600 space-y-2">
                  <p>💡 测试账号：</p>
                  <p className="ml-4">• 护工：staff001 / 123456</p>
                  <p className="ml-4">• 院长：director / 888888</p>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>;
}