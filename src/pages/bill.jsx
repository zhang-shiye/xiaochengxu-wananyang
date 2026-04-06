// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, useToast } from '@/components/ui';

import TabBar from '@/components/TabBar';
import ErrorBoundary from '@/components/ErrorBoundary';
import DataGuard from '@/components/DataGuard';
import { safeGet, isEmptyData, formatData } from '@/lib/dataUtils';
export default function Bill(props) {
  const {
    toast
  } = useToast();
  const [bills, setBills] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('2026-04');
  const [currentElder, setCurrentElder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 获取老人信息和账单数据
  const fetchElderInfoAndBills = async () => {
    try {
      setLoading(true);
      // 获取老人信息
      const elderResult = await props.$w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          dataSourceName: 'elders',
          methodName: 'query',
          params: {
            filter: {
              status: 'active'
            },
            limit: 1
          }
        }
      });

      // 安全访问数据
      const elderData = safeGet(elderResult, 'result.data[0]');
      if (elderData) {
        setCurrentElder(elderData);

        // 获取账单数据
        await fetchBills(safeGet(elderData, '_id'));
      } else {
        toast({
          title: '未找到老人信息',
          description: '请检查老人是否已绑定',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('获取老人信息失败:', error);
      toast({
        title: '获取数据失败',
        description: '请检查网络连接后重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取账单数据
  const fetchBills = async elderId => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          dataSourceName: 'bills',
          methodName: 'query',
          params: {
            filter: {
              elderId: elderId
            },
            sort: {
              month: -1
            },
            limit: 12
          }
        }
      });
      if (result.result && result.result.data) {
        const billsData = result.result.data.map(bill => ({
          id: bill._id,
          month: bill.month,
          totalAmount: bill.totalAmount,
          status: bill.status,
          dueDate: bill.dueDate,
          paymentDate: bill.paymentDate,
          items: bill.items || [{
            name: '基础床位费',
            amount: 1800,
            unit: '月'
          }, {
            name: '护理费',
            amount: 1200,
            unit: '月'
          }, {
            name: '餐费',
            amount: 800,
            unit: '月'
          }]
        }));
        setBills(billsData);
      }
    } catch (error) {
      console.error('获取账单数据失败:', error);
    }
  };
  useEffect(() => {
    fetchElderInfoAndBills();
  }, []);
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
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700">加载中...</p>
        </div>
      </div>;
  }
  if (!currentElder) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-700">未找到老人信息</p>
          <Button className="mt-4" onClick={fetchElderInfoAndBills}>
            重新加载
          </Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
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
                        <span className="font-medium">皖安养老院</span>
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
      <TabBar currentPage="bill" />
    </div>;
}