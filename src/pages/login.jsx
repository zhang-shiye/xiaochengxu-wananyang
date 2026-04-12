// @ts-ignore;
import React, { useEffect, useState } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';

import { NursingHomeBrand } from '@/components/NursingHomeBrand';
export default function Login(props) {
  const {
    toast
  } = useToast();
  const [countdown, setCountdown] = useState(1);

  // 1秒后自动跳转到微信登录页
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          props.$w.utils.navigateTo({
            pageId: 'wechat-login',
            params: {}
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{
      animationDelay: '1s'
    }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{
      animationDelay: '2s'
    }}></div>

      {/* 主内容区 */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-12 w-full max-w-lg mx-auto">
        
        {/* 顶部品牌信息 */}
        <div className="mb-12 w-full">
          <NursingHomeBrand showLogo={true} showSlogan={true} size="large" $w={props.$w} />
        </div>

        {/* 中部欢迎标语 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6 leading-tight" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
            欢迎使用<br />养老院家属服务平台
          </h1>
          <div className="flex items-center justify-center space-x-2 text-amber-700">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-400"></div>
            <span className="text-sm md:text-base" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              用心陪伴 · 安心养老
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
        </div>

        {/* 底部跳转提示和加载动画 */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center space-y-4">
          {/* 加载动画 */}
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{
            animationDelay: '0s'
          }}></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{
            animationDelay: '0.2s'
          }}></div>
            <div className="w-3 h-3 bg-orange-600 rounded-full animate-bounce" style={{
            animationDelay: '0.4s'
          }}></div>
          </div>
          
          {/* 跳转提示 */}
          <div className="text-center">
            <p className="text-gray-600 text-sm md:text-base mb-1" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              正在跳转至微信登录...
            </p>
            <p className="text-amber-700 font-semibold text-xs md:text-sm" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              {countdown}s 后自动跳转
            </p>
          </div>
        </div>
      </div>
    </div>;
}