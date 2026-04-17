// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { Receipt } from 'lucide-react';

import TabBar from '@/components/TabBar';
import { DemoBanner } from '@/components/DemoBanner';
export default function Bill(props) {
  const {
    toast
  } = useToast();
  const [brandName, setBrandName] = useState('皖安养老院');

  // 演示模式检测
  const demoMode = props.$w.page.dataset.params.demo;
  const isDemo = demoMode === 'family';

  // 加载品牌配置
  useEffect(() => {
    const loadBrandConfig = async () => {
      try {
        const result = await props.$w.cloud.callDataSource({
          dataSourceName: 'branding',
          methodName: 'wedaGetRecordsV2',
          params: {
            select: {
              $master: true
            },
            pageSize: 1,
            pageNumber: 1
          }
        });
        if (result && result.records && result.records.length > 0) {
          setBrandName(result.records[0].name || '皖安养老院');
        }
      } catch (error) {
        console.error('加载品牌配置失败:', error);
      }
    };
    loadBrandConfig();
  }, []);

  // 检查用户登录状态和角色权限（演示模式跳过）
  useEffect(() => {
    if (isDemo) return;
    const checkAuth = async () => {
      try {
        await props.$w.auth.getUserInfo({
          force: true
        });
        const user = props.$w.auth.currentUser;
        // 未登录跳转到登录页
        if (!user?.userId) {
          toast({
            title: '请先登录',
            description: '需要登录后才能访问',
            variant: 'destructive'
          });
          props.$w.utils.redirectTo({
            pageId: 'login',
            params: {}
          });
          return;
        }
        // 检查角色权限
        if (user.type && user.type !== 'family') {
          toast({
            title: '权限限制',
            description: '此页面仅家属用户可以访问',
            variant: 'destructive'
          });
          props.$w.utils.redirectTo({
            pageId: 'login',
            params: {}
          });
        }
      } catch (error) {
        console.error('权限检查失败:', error);
        props.$w.utils.redirectTo({
          pageId: 'login',
          params: {}
        });
      }
    };
    checkAuth();
  }, []);

  // 如果非演示模式且用户未登录或角色不匹配，显示提示
  const user = props.$w.auth.currentUser;
  if (!isDemo && (!user?.userId || user?.type && user.type !== 'family')) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-8">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl p-12 max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              权限验证中...
            </h2>
            <p className="text-gray-600 mb-6" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
              此页面仅家属用户可以访问
            </p>
            <Button onClick={() => {
            props.$w.utils.redirectTo({
              pageId: 'login',
              params: {}
            });
          }} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              前往登录
            </Button>
          </div>
        </Card>
      </div>;
  }
  const [bills, setBills] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('2026-04');
  const [loading, setLoading] = useState(true);

  // 加载账单数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. 获取当前用户绑定的老人
        const user = props.$w.auth.currentUser;
        const familyId = isDemo ? 'family_001' : user?.userId || 'demo_user';

        // 查询绑定关系
        const bindingResult = await props.$w.cloud.callDataSource({
          dataSourceName: 'family_members',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  familyId: {
                    $eq: familyId
                  }
                }, {
                  status: {
                    $eq: 'active'
                  }
                }]
              }
            },
            select: {
              $master: true
            },
            pageSize: 10,
            pageNumber: 1
          }
        });
        const bindings = bindingResult?.records || [];
        if (bindings.length === 0) {
          setLoading(false);
          return;
        }
        const binding = bindings[0];
        const elderId = binding.elderId;

        // 2. 获取该老人的账单
        const billResult = await props.$w.cloud.callDataSource({
          dataSourceName: 'bills',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  elderId: {
                    $eq: elderId
                  }
                }]
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 12,
            pageNumber: 1
          }
        });
        const billData = billResult?.records || [];
        const formattedBills = billData.map(bill => ({
          id: bill._id,
          month: bill.month,
          totalAmount: bill.totalAmount,
          status: bill.status,
          dueDate: bill.dueDate,
          paymentDate: bill.paymentDate || null,
          items: bill.items || []
        }));
        setBills(formattedBills);

        // 设置当前月份
        if (formattedBills.length > 0) {
          setCurrentMonth(formattedBills[0].month);
        }
      } catch (error) {
        console.error('加载账单失败:', error);
        toast({
          title: '加载失败',
          description: '获取账单时出错',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isDemo]);
  const currentBill = bills.find(bill => bill.month === currentMonth);
  const paymentMethodsRef = React.useRef(null);
  const handlePayment = () => {
    // 滚动到缴费方式部分
    if (paymentMethodsRef.current) {
      paymentMethodsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  const getStatusInfo = status => {
    const statusMap = {
      unpaid: {
        text: '待缴费',
        color: 'bg-orange-100 text-orange-800',
        icon: '💰'
      },
      paid: {
        text: '已缴费',
        color: 'bg-green-100 text-green-800',
        icon: '✅'
      }
    };
    return statusMap[status] || statusMap.unpaid;
  };
  const handleExitDemo = () => {
    props.$w.utils.redirectTo({
      pageId: 'login',
      params: {}
    });
  };

  // 加载中显示
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">加载账单...</p>
      </div>
    </div>;
  }

  // 没有账单数据时显示
  if (bills.length === 0) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      {isDemo && <DemoBanner role="family" onBack={handleExitDemo} />}
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">暂无账单</h2>
            <p className="text-gray-600">当前没有待缴账单</p>
          </div>
        </Card>
      </div>
      <TabBar currentPage="bill" isDemo={isDemo} $w={props.$w} />
    </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      {isDemo && <DemoBanner role="family" onBack={handleExitDemo} />}
      {/* 头部 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-amber-900 text-center" style={{
          fontFamily: 'Playfair Display, serif'
        }}>
            缴费账单
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* 当前月份选择 */}
        <div className="flex justify-center mb-6">
          <select value={currentMonth} onChange={e => setCurrentMonth(e.target.value)} className="bg-white border border-amber-200 rounded-xl px-4 py-2 text-amber-800 font-medium" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
            <option value="2026-04">2026年4月</option>
            <option value="2026-03">2026年3月</option>
            <option value="2026-02">2026年2月</option>
          </select>
        </div>

        {currentBill && <>
            {/* 账单汇总 */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                    {currentBill.month}月账单
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(currentBill.status).color}`}>
                    <span className="mr-1">{getStatusInfo(currentBill.status).icon}</span>
                    {getStatusInfo(currentBill.status).text}
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-amber-600 mb-2">
                    ¥{currentBill.totalAmount.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">
                    截止日期：{new Date(currentBill.dueDate).toLocaleDateString('zh-CN')}
                  </p>
                  {currentBill.status === 'paid' && currentBill.paymentDate && <p className="text-sm text-green-600 mt-1">
                      缴费日期：{new Date(currentBill.paymentDate).toLocaleDateString('zh-CN')}
                    </p>}
                </div>

                {currentBill.status === 'unpaid' && <Button onClick={handlePayment} className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-full py-3 font-medium" style={{
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
                    查看缴费方式
                  </Button>}
              </div>
            </Card>

            {/* 费用明细 */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
                  费用明细
                </h3>
                <div className="space-y-3">
                  {currentBill.items.map((item, index) => <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <span className="font-medium text-gray-800">{item.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({item.unit})</span>
                      </div>
                      <span className="font-semibold text-gray-800">¥{item.amount.toLocaleString()}</span>
                    </div>)}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">总计</span>
                    <span className="font-bold text-xl text-amber-600">¥{currentBill.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 缴费方式 */}
            <Card ref={paymentMethodsRef} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
                  缴费方式
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-medium text-gray-800 mb-2">微信收款码</h4>
                    <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-4xl text-gray-400">📱</span>
                    </div>
                    <p className="text-sm text-gray-600 text-center">扫码支付</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-medium text-gray-800 mb-2">银行转账</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">开户行：</span>
                        <span className="font-medium">中国工商银行合肥分行</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">户名：</span>
                        <span className="font-medium">{brandName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">账号：</span>
                        <span className="font-medium text-amber-600">6222 0000 0000 0000 000</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">温馨提示：</span>
                    请在缴费时备注长者姓名和房间号，缴费后请保留凭证并及时联系院方确认。
                  </p>
                </div>
              </div>
            </Card>
          </>}
      </div>

      {/* 底部导航 */}
      <TabBar currentPage="bill" isDemo={isDemo} $w={props.$w} />
    </div>;
}