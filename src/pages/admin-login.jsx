// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Eye, EyeOff, Shield, Users, Activity, DollarSign } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Card, useToast } from '@/components/ui';

export default function AdminLogin(props) {
  const {
    $w
  } = props;
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    showPassword: false
  });
  const {
    toast
  } = useToast();
  const handleLogin = async e => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({
        title: '提示',
        description: '请输入用户名和密码',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 模拟管理员登录
      if (formData.username === 'admin' && formData.password === 'admin123') {
        toast({
          title: '登录成功',
          description: '欢迎进入皖安养后台管理系统'
        });

        // 跳转到后台首页
        $w.utils.navigateTo({
          pageId: 'admin-dashboard',
          params: {}
        });
      } else {
        toast({
          title: '登录失败',
          description: '用户名或密码错误',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '登录失败',
        description: '系统错误，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* 左侧品牌信息 */}
        <div className="text-white space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold" style={{
            fontFamily: 'Space Mono, monospace'
          }}>
              皖安养
            </h1>
            <h2 className="text-2xl font-semibold text-amber-400">
              后台管理系统
            </h2>
          </div>
          
          <p className="text-gray-300 text-lg leading-relaxed">
            专业的养老院管理平台，提供住户管理、护理服务、财务统计等全方位管理功能。
          </p>

          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center">
              <div className="bg-amber-500/20 rounded-lg p-4 mb-2">
                <Users className="w-8 h-8 text-amber-400 mx-auto" />
              </div>
              <p className="text-sm text-gray-300">住户管理</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-500/20 rounded-lg p-4 mb-2">
                <Activity className="w-8 h-8 text-amber-400 mx-auto" />
              </div>
              <p className="text-sm text-gray-300">护理服务</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-500/20 rounded-lg p-4 mb-2">
                <DollarSign className="w-8 h-8 text-amber-400 mx-auto" />
              </div>
              <p className="text-sm text-gray-300">财务管理</p>
            </div>
          </div>
        </div>

        {/* 右侧登录表单 */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">管理员登录</h3>
              <p className="text-gray-600">请输入您的登录凭据</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">用户名</label>
                <Input type="text" placeholder="请输入用户名" value={formData.username} onChange={e => setFormData(prev => ({
                ...prev,
                username: e.target.value
              }))} className="border-gray-300 focus:border-amber-500 focus:ring-amber-500" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">密码</label>
                <div className="relative">
                  <Input type={formData.showPassword ? 'text' : 'password'} placeholder="请输入密码" value={formData.password} onChange={e => setFormData(prev => ({
                  ...prev,
                  password: e.target.value
                }))} className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-10" />
                  <button type="button" onClick={() => setFormData(prev => ({
                  ...prev,
                  showPassword: !prev.showPassword
                }))} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {formData.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                登录系统
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                默认账号：admin 密码：admin123
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>;
}