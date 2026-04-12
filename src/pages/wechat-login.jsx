// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, useToast } from '@/components/ui';
// @ts-ignore;
import { MessageCircle, ArrowLeft } from 'lucide-react';

// @ts-ignore;
import { NursingHomeBrand } from '@/components/NursingHomeBrand.jsx';
// @ts-ignore;

export default function WechatLogin(props) {
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // 检查登录状态 - 重置为仅检查，不自动跳转
  useEffect(() => {
    checkLoginStatus();
  }, []);
  const checkLoginStatus = async () => {
    setLoading(true);
    try {
      const user = props.$w.auth.currentUser;
      if (user?.userId) {
        setUserInfo(user);
        // 仅显示已登录状态，不自动跳转，让用户看到页面内容
        toast({
          title: '已登录',
          description: '您已登录，可点击授权按钮继续',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('检查登录状态失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 微信授权登录
  const handleWeChatLogin = async () => {
    setIsLoading(true);
    try {
      const tcb = await props.$w.cloud.getCloudInstance();

      // 跳转到托管登录页面（包含微信授权登录）
      tcb.auth().toDefaultLoginPage({
        config_version: "env",
        redirect_uri: window.location.href,
        // 登录后返回当前页
        query: {
          s_domain: window.location.hostname
        }
      });
    } catch (error) {
      console.error('微信授权登录失败:', error);
      toast({
        title: '登录失败',
        description: error.message || '微信授权登录失败，请重试',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  // 获取并保存用户手机号
  const saveUserInfo = async user => {
    try {
      // 从微信登录用户信息中获取手机号（如果有的话）
      const phone = user.phone || user.phoneNumber || null;
      const openid = user.openid || user.uid || user.userId || null;
      const name = user.nickname || user.name || user.nickName || '微信用户';
      const avatar = user.avatarUrl || user.avatar || null;
      console.log('保存用户信息:', {
        openid,
        name,
        phone,
        avatar
      });

      // 保存或更新用户信息到 employee 数据模型
      if (openid) {
        const result = await props.$w.cloud.callDataSource({
          dataSourceName: 'employee',
          methodName: 'wedaUpdateV2',
          params: {
            where: {
              openid: openid
            },
            data: {
              openid: openid,
              name: name,
              phone: phone,
              avatar: avatar,
              role: '家属',
              status: '在职',
              updatedAt: new Date().toISOString()
            }
          }
        });

        // 如果更新失败，说明用户不存在，则新增
        if (!result || result.total === 0) {
          await props.$w.cloud.callDataSource({
            dataSourceName: 'employee',
            methodName: 'wedaCreateV2',
            params: {
              data: {
                openid: openid,
                name: name,
                phone: phone,
                avatar: avatar,
                role: '家属',
                status: '在职',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            }
          });
        }
        toast({
          title: '登录成功',
          description: phone ? `已自动获取手机号：${phone}` : '登录成功'
        });
      }
    } catch (error) {
      console.error('保存用户信息失败:', error);
      // 即使保存失败，也不影响登录流程
    }
  };
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };

  // 如果已经登录且正在跳转，显示加载状态
  if (userInfo || loading) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{
            animationDelay: '0.1s'
          }}></div>
            <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{
            animationDelay: '0.2s'
          }}></div>
          </div>
          <p className="text-amber-700 font-medium">正在跳转至绑定长者页面...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute -bottom-32 right-1/4 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
      </div>

      <div className="relative z-10">
        {/* 返回按钮 */}
        <div className="absolute top-4 left-4 z-20">
          <Button variant="ghost" size="sm" onClick={handleBack} className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </div>

        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
          {/* 顶部品牌信息 */}
          <div className="mb-12 text-center">
            <NursingHomeBrand showLogo={true} showSlogan={true} size="large" $w={props.$w} />
          </div>

          {/* 中部微信图标和提示文案 */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle className="w-12 h-12 text-green-600" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-amber-900 mb-3" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              微信授权登录
            </h2>
            <p className="text-amber-700 text-lg mb-2">
              授权登录即可绑定长者信息
            </p>
            <p className="text-sm text-gray-600">
              安全快捷，一键完成身份验证
            </p>
          </div>

          {/* 底部授权按钮 */}
          <div className="w-full max-w-xs">
            <Button onClick={handleWeChatLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-3xl py-5 font-semibold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              {isLoading ? <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  正在跳转微信授权...
                </div> : <>
                  <svg className="w-6 h-6 mr-3 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z" />
                  </svg>
                  微信授权登录
                </>}
            </Button>

            {/* 提示文字 */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                点击授权即表示同意《用户服务协议》和《隐私政策》
              </p>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="text-center mt-16">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-amber-300 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-orange-300 rounded-full animate-bounce" style={{
              animationDelay: '0.1s'
            }}></div>
              <div className="w-3 h-3 bg-rose-300 rounded-full animate-bounce" style={{
              animationDelay: '0.2s'
            }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}