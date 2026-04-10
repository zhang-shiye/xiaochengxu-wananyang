// @ts-ignore;
import React, { useEffect } from 'react';
// @ts-ignore;
import { Card, useToast } from '@/components/ui';

export default function Login(props) {
  const {
    toast
  } = useToast();

  // 3秒后自动跳转到微信登录页
  useEffect(() => {
    const timer = setTimeout(() => {
      // 跳转到微信登录页面
      props.$w.utils.navigateTo({
        pageId: 'wechat-login',
        params: {}
      });
    }, 3000);

    // 清理定时器
    return () => clearTimeout(timer);
  }, []);
  const handleSkipLogin = () => {
    // 开发模式下允许跳过登录
    props.$w.utils.navigateTo({
      pageId: 'home',
      params: {}
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

          {/* 欢迎插画区域 */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <div className="w-40 h-40 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-20 h-20 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              正在为您准备登录...
            </h2>
            <p className="text-gray-600" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              即将跳转到微信登录页面
            </p>
          </div>

          {/* 加载动画 */}
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{
              animationDelay: '0.1s'
            }}></div>
              <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{
              animationDelay: '0.2s'
            }}></div>
            </div>
          </div>

          {/* 开发模式跳过按钮 */}
          <div className="text-center">
            <button onClick={handleSkipLogin} className="text-gray-500 hover:text-gray-700 text-sm underline">
              开发模式 - 跳过登录
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