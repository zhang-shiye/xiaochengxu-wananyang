// @ts-ignore;
import React, { useEffect, useState } from 'react';

import { NursingHomeBrand } from '@/components/NursingHomeBrand';
export default function Login(props) {
  const [brandName, setBrandName] = useState('XX养老院');
  const [countdown, setCountdown] = useState(1);

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

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // 1秒后跳转到微信登录页
      props.$w.utils.navigateTo({
        pageId: 'wechat-login',
        params: {}
      });
    }
  }, [countdown]);
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col items-center justify-center px-4">
      {/* 顶部品牌区域 */}
      <div className="mb-auto pt-16">
        <NursingHomeBrand showLogo={true} showSlogan={true} size="large" $w={props.$w} />
      </div>

      {/* 中部欢迎标语 */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-3xl font-semibold text-gray-800 text-center leading-relaxed" style={{
        fontFamily: 'Nunito Sans, sans-serif'
      }}>
          欢迎使用 {brandName} 家属服务平台
        </h1>
      </div>

      {/* 底部加载提示 */}
      <div className="mb-16 text-center">
        <p className="text-gray-600 mb-4" style={{
        fontFamily: 'Nunito Sans, sans-serif'
      }}>
          正在跳转至微信登录...{countdown}s
        </p>
        {/* 加载动画 */}
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
    </div>;
}