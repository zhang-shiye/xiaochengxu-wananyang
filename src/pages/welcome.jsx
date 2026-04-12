// @ts-ignore;
import React, { useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Avatar, AvatarImage, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Heart, Star, Phone, MapPin, ArrowRight, Users, Shield, Calendar } from 'lucide-react';

import TabBar from '@/components/TabBar';
import NursingHomeBrand from '@/components/NursingHomeBrand';
export default function Welcome(props) {
  const {
    toast
  } = useToast();
  const handleQuickAction = action => {
    const pageMap = {
      'daily': 'home',
      'leave': 'leave',
      'bill': 'bill'
    };
    const pageId = pageMap[action];
    if (pageId) {
      props.$w.utils.navigateTo({
        pageId: pageId,
        params: {}
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-24">
      {/* 顶部品牌区 */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 text-white pt-12 pb-8 px-6">
        <div className="container mx-auto max-w-4xl">
          <NursingHomeBrand render={({
          name,
          slogan,
          logoUrl
        }) => <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 shadow-2xl">
                  {logoUrl ? <img src={logoUrl} alt={name} className="w-16 h-16 object-cover rounded-full" /> : <Heart className="w-12 h-12 text-white" />}
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-3" style={{
            fontFamily: 'Nunito Sans, sans-serif',
            fontWeight: 800
          }}>
                {name || '皖安养'}
              </h1>
              <p className="text-xl opacity-90" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
                {slogan || '用心守护每一位长者'}
              </p>
            </div>} />
        </div>
      </div>

      {/* 核心服务卡片 */}
      <div className="container mx-auto max-w-4xl px-4 -mt-6">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800" style={{
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
                <span className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-amber-600" />
                  核心服务
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Button onClick={() => handleQuickAction('daily')} className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-700 border-2 border-amber-200 rounded-2xl h-auto">
                <Heart className="w-8 h-8" />
                <span className="text-sm font-medium">护理日报</span>
              </Button>
              
              <Button onClick={() => handleQuickAction('leave')} className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-700 border-2 border-blue-200 rounded-2xl h-auto">
                <Calendar className="w-8 h-8" />
                <span className="text-sm font-medium">请假申请</span>
              </Button>
              
              <Button onClick={() => handleQuickAction('bill')} className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-700 border-2 border-emerald-200 rounded-2xl h-auto">
                <Phone className="w-8 h-8" />
                <span className="text-sm font-medium">缴费账单</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* 特色亮点 */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                  专业团队
                </h3>
                <p className="text-xs text-gray-500">24小时贴心照护</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                  品质保障
                </h3>
                <p className="text-xs text-gray-500">标准化服务流程</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                  安全守护
                </h3>
                <p className="text-xs text-gray-500">全方位安全保障</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                  暖心关怀
                </h3>
                <p className="text-xs text-gray-500">家人般的爱护</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 联系信息 */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
            联系我们
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
              <Phone className="w-5 h-5 text-amber-600" />
              <span className="text-gray-700 font-medium">服务热线：400-123-4567</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">地址：安徽省合肥市蜀山区</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 底部导航 */}
      <TabBar currentPage="welcome" />
    </div>;
}