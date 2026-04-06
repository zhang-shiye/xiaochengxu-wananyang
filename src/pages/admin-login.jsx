// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, useToast } from '@/components/ui';

export default function AdminLogin(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('caregiver');
  const {
    toast
  } = useToast();
  const handleLogin = () => {
    if (!username || !password) {
      toast({
        title: '请输入完整信息',
        description: '请填写用户名和密码',
        variant: 'destructive'
      });
      return;
    }

    // 模拟登录逻辑
    if (username === 'admin' && password === '123456') {
      props.$w.utils.redirectTo({
        pageId: 'admin-dashboard',
        params: {
          role: 'admin'
        }
      });
    } else if (username === 'caregiver' && password === '123456') {
      props.$w.utils.redirectTo({
        pageId: 'admin-dashboard',
        params: {
          role: 'caregiver'
        }
      });
    } else {
      toast({
        title: '登录失败',
        description: '用户名或密码错误',
        variant: 'destructive'
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold" style={{
            fontFamily: 'Noto Sans SC, sans-serif'
          }}>皖</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900" style={{
            fontFamily: 'Noto Sans SC, sans-serif'
          }}>
              皖安养后台管理
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              护工/院长登录系统
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">选择角色</Label>
              <div className="flex space-x-2">
                <Button type="button" variant={role === 'caregiver' ? 'default' : 'outline'} className="flex-1" onClick={() => setRole('caregiver')}>
                  护工
                </Button>
                <Button type="button" variant={role === 'admin' ? 'default' : 'outline'} className="flex-1" onClick={() => setRole('admin')}>
                  院长
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">用户名</Label>
              <Input id="username" type="text" placeholder="请输入用户名" value={username} onChange={e => setUsername(e.target.value)} className="border-gray-300 focus:border-blue-500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">密码</Label>
              <Input id="password" type="password" placeholder="请输入密码" value={password} onChange={e => setPassword(e.target.value)} className="border-gray-300 focus:border-blue-500" />
            </div>
          </div>

          <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-3">
            登录系统
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>测试账号：</p>
            <p>护工 - caregiver / 123456</p>
            <p>院长 - admin / 123456</p>
          </div>
        </CardContent>
      </Card>
    </div>;
}