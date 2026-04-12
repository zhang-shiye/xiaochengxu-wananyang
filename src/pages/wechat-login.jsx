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
  const [brandName, setBrandName] = useState('XX养老院');

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

  // 获取并保存用户信息
  const saveUserInfo = async user => {
    try {
      // 从微信登录用户信息中获取信息
      const phone = user.phone || user.phoneNumber || null;
      const openid = user.openid || user.uid || null;
      const name = user.nickname || user.name || '微信用户';
      const avatar = user.avatarUrl || user.avatar || null;
      console.log('获取用户信息:', {
        name,
        phone,
        openid,
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
              avatarUrl: avatar,
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
                avatarUrl: avatar,
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
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
      {/* 顶部区域 */}
      <div className="px-4 py-4">
        {/* 返回按钮 + 标题 + 步骤提示 */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack} className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              微信快捷登录
            </h2>
            <p className="text-sm text-amber-600 mt-1" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              1/2 完成绑定
            </p>
          </div>
          <div className="w-9"></div>
        </div>
      </div>

      {/* 中部核心操作区 */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* 微信图标 + 提示文案 */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z" />
              </svg>
            </div>
            <p className="text-gray-700 text-lg mb-2" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              授权登录即可绑定长者信息
            </p>
            <p className="text-gray-500 text-sm" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              登录{brandName}家属服务平台
            </p>
          </div>

          {/* 醒目圆角按钮 */}
          <Button onClick={handleWeChatLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full py-4 font-medium text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
            {isLoading ? <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在跳转微信授权...
              </div> : <>
                微信授权登录
              </>}
          </Button>
        </div>
      </div>
    </div>;
}