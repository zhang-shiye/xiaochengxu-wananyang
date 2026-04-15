// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Card, useToast } from '@/components/ui';
// @ts-ignore;
import { MessageCircle, Shield, Eye, ArrowRight } from 'lucide-react';

import { NursingHomeBrand } from '@/components/NursingHomeBrand';
export default function Login(props) {
  const {
    toast
  } = useToast();
  const [selectedRole, setSelectedRole] = useState(null);

  // 家属端登录 - 跳转微信授权
  const handleFamilyLogin = () => {
    props.$w.utils.navigateTo({
      pageId: 'wechat-login',
      params: {}
    });
  };

  // 管理端登录 - 跳转微信授权（管理端角色）
  const handleAdminLogin = () => {
    props.$w.utils.navigateTo({
      pageId: 'wechat-login',
      params: {
        role: 'admin'
      }
    });
  };

  // 演示模式 - 家属端
  const handleDemoFamily = () => {
    toast({
      title: '进入演示模式',
      description: '您正在以家属身份浏览演示数据'
    });
    props.$w.utils.redirectTo({
      pageId: 'home',
      params: {
        demo: 'family'
      }
    });
  };

  // 演示模式 - 管理端
  const handleDemoAdmin = () => {
    toast({
      title: '进入演示模式',
      description: '您正在以管理员身份浏览演示数据'
    });
    props.$w.utils.redirectTo({
      pageId: 'admin-home',
      params: {
        demo: 'admin'
      }
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{
      animationDelay: '1s'
    }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{
      animationDelay: '2s'
    }}></div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-12">
        {/* 顶部品牌信息 */}
        <div className="mb-8 w-full">
          <NursingHomeBrand showLogo={true} showSlogan={true} size="large" $w={props.$w} />
        </div>

        {/* 欢迎标语 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4 leading-tight" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
            欢迎使用
            <br />
            养老院服务平台
          </h1>
          <div className="flex items-center justify-center space-x-2 text-amber-700">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-400"></div>
            <span className="text-sm" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              用心陪伴 · 安心养老
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
        </div>

        {/* 角色选择区域 */}
        <div className="w-full max-w-sm space-y-4">
          {/* 家属端入口 */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300" onClick={handleFamilyLogin}>
            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800" style={{
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>
                    家属端
                  </h3>
                  <p className="text-sm text-gray-500">查看护理日报、请假申请、缴费账单</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Card>

          {/* 管理端入口 */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300" onClick={handleAdminLogin}>
            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800" style={{
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>
                    管理端
                  </h3>
                  <p className="text-sm text-gray-500">审核日报、请假、账单，管理老人信息</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* 演示模式入口 */}
        <div className="mt-8 w-full max-w-sm">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 text-amber-600 flex items-center gap-1">
                <Eye className="w-4 h-4" />
                演示模式
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleDemoFamily} className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 rounded-xl py-5 flex flex-col items-center gap-1 h-auto">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">家属演示</span>
            </Button>
            <Button variant="outline" onClick={handleDemoAdmin} className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-xl py-5 flex flex-col items-center gap-1 h-auto">
              <Shield className="w-5 h-5" />
              <span className="text-xs">管理演示</span>
            </Button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            演示模式无需登录，可直接浏览各页面功能
          </p>
        </div>
      </div>
    </div>;
}