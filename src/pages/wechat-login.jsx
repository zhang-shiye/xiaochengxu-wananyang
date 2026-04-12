// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, useToast } from '@/components/ui';

export default function WechatLogin(props) {
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 检查登录状态
  useEffect(() => {
    checkLoginStatus();
  }, []);
  const checkLoginStatus = async () => {
    const user = props.$w.auth.currentUser;
    if (user?.userId) {
      setUserInfo(user);
      // 已经登录，跳转到绑定长者页面
      setTimeout(() => {
        props.$w.utils.navigateTo({
          pageId: 'bind-senior',
          params: {}
        });
      }, 500);
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
      const openid = user.openid || user.uid || null;
      const name = user.nickname || user.name || '微信用户';

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
  if (userInfo) {
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
          <p className="text-amber-700 font-medium">正在跳转...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={handleBack} className="text-amber-700 hover:text-amber-900 hover:bg-amber-100">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </Button>
          </div>

          {/* 步骤指示器 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                1
              </div>
              <div className="w-16 h-1 bg-amber-300 mx-2"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
            </div>
          </div>

          {/* 微信登录卡片 */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
            <div className="p-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .167.054.25.25 0 0 0 .25-.25c0-.073-.029-.144-.043-.216l-.27-1.027a.582.582 0 0 1 .023-.261 8.67 8.67 0 0 0 1.122-4.135c0-4.162-3.465-7.531-7.74-7.531zM11.89 13.06c-.642 0-1.162-.529-1.162-1.18a1.17 1.17 0 0 1 1.162-1.178c.642 0 1.162.529 1.162 1.178 0 .651-.52 1.18-1.162 1.18zm5.34 0c-.642 0-1.162-.529-1.162-1.18a1.17 1.17 0 0 1 1.162-1.178c.642 0 1.162.529 1.162 1.178 0 .651-.52 1.18-1.162 1.18z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                  微信授权登录
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  使用微信账号快速登录，开始关爱之旅
                </p>
                <p className="text-xs text-gray-500">
                  将自动获取您的手机号用于身份验证
                </p>
              </div>
              
              <Button onClick={handleWeChatLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full py-4 font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" style={{
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
            </div>
          </Card>

          {/* 底部装饰 */}
          <div className="text-center mt-8">
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