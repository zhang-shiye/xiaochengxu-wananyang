// @ts-ignore;
import React, { useEffect } from 'react';
// @ts-ignore;
import { Card, Button, useToast } from '@/components/ui';

export default function Login(props) {
  const {
    toast
  } = useToast();

  // 处理普通微信登录（家属角色）
  const handleFamilyWeChatLogin = async () => {
    try {
      // 模拟普通微信登录流程
      toast({
        title: '正在跳转普通微信登录...',
        description: '识别为家属角色'
      });

      // 在实际应用中，这里会调用微信登录API
      // 根据用户数据模型，普通微信登录识别为家属角色
      setTimeout(() => {
        // 跳转到家属端绑定页面
        props.$w.utils.redirectTo({
          pageId: 'bind-senior',
          params: {
            role: 'family'
          }
        });
      }, 1500);
    } catch (error) {
      toast({
        title: '登录失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // 处理企业微信登录（管理角色）
  const handleAdminWeChatLogin = async () => {
    try {
      toast({
        title: '正在跳转企业微信登录...',
        description: '识别为管理角色'
      });

      // 模拟企业微信登录流程
      // 根据用户数据模型，企业微信登录识别为管理角色
      setTimeout(() => {
        // 跳转到管理端首页
        props.$w.utils.redirectTo({
          pageId: 'admin-home',
          params: {
            role: 'admin'
          }
        });
      }, 1500);
    } catch (error) {
      toast({
        title: '登录失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  // 开发模式跳过登录（家属端）
  const handleSkipFamilyLogin = () => {
    props.$w.utils.redirectTo({
      pageId: 'bind-senior',
      params: {
        role: 'family'
      }
    });
  };

  // 开发模式跳过登录（管理端）
  const handleSkipAdminLogin = () => {
    props.$w.utils.redirectTo({
      pageId: 'admin-home',
      params: {
        role: 'admin'
      }
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* 头部标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-amber-900 mb-3" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              皖安养
            </h1>
            <p className="text-amber-700 text-lg" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              用心陪伴，安心养老
            </p>
          </div>

          {/* 登录方式选择 */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              选择登录方式
            </h2>
            <p className="text-gray-600" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              根据您的身份选择对应的登录渠道
            </p>
          </div>

          {/* 家属登录卡片 */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl mb-6">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">家属登录</h3>
                <p className="text-gray-600 text-sm">普通微信登录，查看老人日常动态</p>
              </div>
              
              <Button onClick={handleFamilyWeChatLogin} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                普通微信登录
              </Button>
            </div>
          </Card>

          {/* 管理登录卡片 */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl mb-6">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">管理登录</h3>
                <p className="text-gray-600 text-sm">企业微信登录，进行日常管理操作</p>
              </div>
              
              <Button onClick={handleAdminWeChatLogin} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                企业微信登录
              </Button>
            </div>
          </Card>

          {/* 开发模式跳过按钮 */}
          <div className="text-center space-y-3">
            <button onClick={handleSkipFamilyLogin} className="text-gray-500 hover:text-gray-700 text-sm underline block w-full">
              开发模式 - 跳过登录（家属端）
            </button>
            <button onClick={handleSkipAdminLogin} className="text-gray-500 hover:text-gray-700 text-sm underline block w-full">
              开发模式 - 跳过登录（管理端）
            </button>
          </div>

          {/* 底部装饰 */}
          <div className="text-center mt-12">
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