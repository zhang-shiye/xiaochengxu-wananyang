// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, useToast, Spinner } from '@/components/ui';
// @ts-ignore;
import { MessageCircle, Shield, Eye, ArrowRight, AlertCircle, WifiOff, UserX } from 'lucide-react';

import { NursingHomeBrand } from '@/components/NursingHomeBrand';

// 日志记录工具
const LoginLogger = {
  info: (message, data) => {
    console.log(`[Login] ${message}`, data || '');
  },
  error: (message, error) => {
    console.error(`[Login Error] ${message}`, error);
  },
  warn: (message, data) => {
    console.warn(`[Login Warning] ${message}`, data || '');
  }
};

// 错误类型定义
const ErrorTypes = {
  NETWORK_ERROR: 'network_error',
  PERMISSION_DENIED: 'permission_denied',
  USER_NOT_FOUND: 'user_not_found',
  UNKNOWN_ERROR: 'unknown_error',
  TIMEOUT: 'timeout'
};

// 错误处理工具
const ErrorHandler = {
  handle: (error, toast) => {
    LoginLogger.error('处理错误', error);
    let errorInfo = {
      type: ErrorTypes.UNKNOWN_ERROR,
      title: '操作失败',
      description: error.message || '请稍后重试',
      icon: AlertCircle
    };

    // 网络错误
    if (error.message?.includes('network') || error.message?.includes('timeout') || error.message?.includes('ECONNREFUSED') || !navigator.onLine) {
      errorInfo = {
        type: ErrorTypes.NETWORK_ERROR,
        title: '网络连接失败',
        description: '请检查网络连接后重试',
        icon: WifiOff
      };
    }
    // 权限错误
    else if (error.message?.includes('permission') || error.message?.includes('unauthorized') || error.message?.includes('forbidden')) {
      errorInfo = {
        type: ErrorTypes.PERMISSION_DENIED,
        title: '权限不足',
        description: '您没有访问该功能的权限',
        icon: UserX
      };
    }
    // 用户不存在
    else if (error.message?.includes('not found') || error.message?.includes('不存在')) {
      errorInfo = {
        type: ErrorTypes.USER_NOT_FOUND,
        title: '用户不存在',
        description: '请联系管理员确认账号信息',
        icon: UserX
      };
    }
    toast({
      title: errorInfo.title,
      description: errorInfo.description,
      variant: 'destructive'
    });
    return errorInfo;
  }
};
export default function Login(props) {
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [loginError, setLoginError] = useState(null);

  // 检查用户是否已绑定长者
  const checkUserBinding = async userId => {
    LoginLogger.info('检查用户绑定状态', {
      userId
    });
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'family_members',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                familyId: {
                  $eq: userId
                }
              }]
            }
          },
          getCount: true
        }
      });
      const hasBinding = result.total > 0 || result.records && result.records.length > 0;
      LoginLogger.info('绑定状态检查结果', {
        userId,
        hasBinding,
        count: result.total || result.records?.length
      });
      return hasBinding;
    } catch (error) {
      LoginLogger.error('检查绑定状态失败', error);
      throw new Error('检查绑定状态失败: ' + (error.message || '未知错误'));
    }
  };

  // 检查用户是否为员工（管理员/护工/文员）
  const checkUserIsEmployee = async userId => {
    LoginLogger.info('检查员工身份', {
      userId
    });
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'employee',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                _openid: {
                  $eq: userId
                }
              }]
            }
          },
          getCount: true
        }
      });
      const isEmployee = result.total > 0 || result.records && result.records.length > 0;
      LoginLogger.info('员工身份检查结果', {
        userId,
        isEmployee,
        count: result.total || result.records?.length
      });
      return isEmployee;
    } catch (error) {
      LoginLogger.error('检查员工身份失败', error);
      throw new Error('检查员工身份失败: ' + (error.message || '未知错误'));
    }
  };

  // 家属端登录 - 调用托管登录页
  const handleFamilyLogin = async () => {
    LoginLogger.info('家属端登录开始');
    setIsLoading(true);
    setLoadingText('正在准备登录...');
    setLoginError(null);
    try {
      // 检查网络状态
      if (!navigator.onLine) {
        throw new Error('network_error: 网络连接不可用');
      }
      const tcb = await props.$w.cloud.getCloudInstance();
      LoginLogger.info('获取云实例成功');

      // 登录成功后返回当前页，由页面自动处理后续跳转
      tcb.auth().toDefaultLoginPage({
        config_version: "env",
        redirect_uri: window.location.origin + '/pages/login',
        query: {
          s_domain: window.location.hostname,
          role: 'family'
        }
      });
      LoginLogger.info('已跳转到托管登录页');
    } catch (error) {
      LoginLogger.error('家属端登录失败', error);
      setIsLoading(false);
      setLoginError(error);
      ErrorHandler.handle(error, toast);
    }
  };

  // 管理端登录 - 调用托管登录页
  const handleAdminLogin = async () => {
    LoginLogger.info('管理端登录开始');
    setIsLoading(true);
    setLoadingText('正在准备登录...');
    setLoginError(null);
    try {
      // 检查网络状态
      if (!navigator.onLine) {
        throw new Error('network_error: 网络连接不可用');
      }
      const tcb = await props.$w.cloud.getCloudInstance();
      LoginLogger.info('获取云实例成功');
      tcb.auth().toDefaultLoginPage({
        config_version: "env",
        redirect_uri: window.location.origin + '/pages/login',
        query: {
          s_domain: window.location.hostname,
          role: 'admin'
        }
      });
      LoginLogger.info('已跳转到托管登录页');
    } catch (error) {
      LoginLogger.error('管理端登录失败', error);
      setIsLoading(false);
      setLoginError(error);
      ErrorHandler.handle(error, toast);
    }
  };

  // 页面加载时检查登录状态并自动跳转
  useEffect(() => {
    const checkLoginAndRedirect = async () => {
      LoginLogger.info('开始检查登录状态');
      setIsLoading(true);
      setLoadingText('正在检查登录状态...');
      try {
        // 检查网络状态
        if (!navigator.onLine) {
          LoginLogger.warn('网络离线，跳过自动登录检查');
          setIsLoading(false);
          return;
        }
        await props.$w.auth.getUserInfo({
          force: true
        });
        const user = props.$w.auth.currentUser;
        const role = props.$w.page.dataset.params.role;
        LoginLogger.info('获取用户信息成功', {
          userId: user?.userId,
          role
        });
        if (user?.userId && role) {
          // 已登录，根据角色跳转
          if (role === 'admin') {
            setLoadingText('正在验证管理权限...');
            // 验证是否为员工
            const isEmployee = await checkUserIsEmployee(user.userId);
            if (isEmployee) {
              LoginLogger.info('验证通过，跳转到管理后台');
              props.$w.utils.redirectTo({
                pageId: 'admin-home',
                params: {}
              });
            } else {
              setIsLoading(false);
              LoginLogger.warn('用户非员工，拒绝访问管理端', {
                userId: user.userId
              });
              toast({
                title: '权限不足',
                description: '您没有管理端访问权限，请联系管理员',
                variant: 'destructive'
              });
            }
          } else if (role === 'family') {
            setLoadingText('正在检查绑定状态...');
            // 家属端：检查是否已绑定
            const hasBinding = await checkUserBinding(user.userId);
            if (hasBinding) {
              LoginLogger.info('已绑定长者，跳转到首页');
              props.$w.utils.redirectTo({
                pageId: 'home',
                params: {}
              });
            } else {
              LoginLogger.info('未绑定长者，跳转到绑定页面');
              props.$w.utils.redirectTo({
                pageId: 'bind-senior',
                params: {}
              });
            }
          }
        } else {
          setIsLoading(false);
          LoginLogger.info('用户未登录或无需自动跳转');
        }
      } catch (error) {
        setIsLoading(false);
        LoginLogger.error('检查登录状态失败', error);
        // 只在非网络错误时显示提示
        if (navigator.onLine) {
          ErrorHandler.handle(error, toast);
        }
      }
    };
    checkLoginAndRedirect();
  }, []);

  // 演示模式 - 家属端
  const handleDemoFamily = () => {
    toast({
      title: '进入演示模式',
      description: '您正在以家属身份浏览演示数据',
      duration: 500
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
      description: '您正在以管理员身份浏览演示数据',
      duration: 500
    });
    props.$w.utils.redirectTo({
      pageId: 'admin-home',
      params: {
        demo: 'admin'
      }
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col relative overflow-hidden">
      {/* 加载遮罩 */}
      {isLoading && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Spinner className="w-10 h-10 text-amber-600" />
            <p className="text-gray-700 font-medium">{loadingText}</p>
          </div>
        </div>}

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