// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Badge, useToast, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
// @ts-ignore;
import { DollarSign, Search, Filter, ArrowLeft, ArrowRight, Edit3, Receipt, Trash2, Plus } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
import DataPermissionHelper from '@/components/PermissionCheck';
import { DemoBanner } from '@/components/DemoBanner';
export default function AdminBill(props) {
  const {
    toast
  } = useToast();

  // 演示模式检测
  const demoMode = props.$w.page.dataset.params.demo;
  const isDemo = demoMode === 'admin';

  // 检查用户登录状态和角色权限（演示模式跳过）
  useEffect(() => {
    if (isDemo) return;
    const checkAuth = async () => {
      try {
        await props.$w.auth.getUserInfo({
          force: true
        });
        const user = props.$w.auth.currentUser;
        const allowedTypes = ['nurse', 'staff', 'admin'];
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
        if (user.type && !allowedTypes.includes(user.type)) {
          toast({
            title: '权限限制',
            description: '此页面仅管理员、护工、文员可以访问',
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
  const allowedTypes = ['nurse', 'staff', 'admin'];
  if (!isDemo && (!user?.userId || user?.type && !allowedTypes.includes(user.type))) {
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
              此页面仅管理员、护工、文员可以访问
            </p>
            <Button onClick={() => {
            props.$w.utils.redirectTo({
              pageId: 'login',
              params: {}
            });
          }} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              前往登录
            </Button>
          </div>
        </Card>
      </div>;
  }
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: '',
    amount: '',
    unit: ''
  });
  useEffect(() => {
    loadBills();
  }, []);
  useEffect(() => {
    filterBills();
  }, [searchTerm, statusFilter, bills]);
  const loadBills = async () => {
    try {
      const user = props.$w.auth.currentUser;

      // 数据权限检查
      if (!DataPermissionHelper.hasDataPermission(user, 'admin')) {
        toast({
          title: '权限限制',
          description: '您没有权限查看账单数据',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // 使用数据模型 API 查询账单
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: isDemo ? 'demo_bills' : 'bills',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [...(statusFilter === 'all' ? [] : [{
                status: {
                  $eq: statusFilter
                }
              }])]
            }
          },
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }],
          pageSize: 100,
          pageNumber: 1
        }
      });
      const bills = result.records || [];

      // 获取关联的老人信息
      const elderIds = bills.map(bill => bill.elderId);
      if (elderIds.length > 0) {
        const elderResult = await props.$w.cloud.callDataSource({
          dataSourceName: isDemo ? 'demo_elders' : 'elders',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  _id: {
                    $in: elderIds
                  }
                }]
              }
            },
            select: {
              $master: true
            }
          }
        });
        const elderMap = {};
        elderResult.records.forEach(elder => {
          elderMap[elder._id] = elder;
        });

        // 合并数据
        const billsWithElder = bills.map(bill => ({
          ...bill,
          elderName: elderMap[bill.elderId]?.name || '未知老人',
          elderRoom: elderMap[bill.elderId]?.room || '未知房间'
        }));
        setBills(billsWithElder);
        setFilteredBills(billsWithElder);
      } else {
        setBills([]);
        setFilteredBills([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('加载账单数据失败:', error);
      toast({
        title: '加载失败',
        description: error.message,
        variant: 'destructive'
      });
      setLoading(false);
    }
  };
  const filterBills = () => {
    let filtered = bills;
    if (searchTerm) {
      filtered = filtered.filter(bill => bill.elderName && bill.elderName.includes(searchTerm));
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bill => bill.status === statusFilter);
    }
    setFilteredBills(filtered);
  };
  const handleViewDetail = bill => {
    setSelectedBill(bill);
    setIsDetailView(true);
    setIsEditMode(false);
  };
  const handleApprove = async () => {
    if (!selectedBill) {
      toast({
        title: '操作失败',
        description: '请选择一条账单记录',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 使用数据模型 API 更新账单状态
      await props.$w.cloud.callDataSource({
        dataSourceName: isDemo ? 'demo_bills' : 'bills',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: selectedBill?._id || ''
                }
              }]
            }
          },
          data: {
            status: 'paid',
            paymentDate: new Date().toISOString().split('T')[0],
            updatedAt: Date.now()
          }
        }
      });
      toast({
        title: '确认缴费成功',
        description: '账单已标记为已缴费'
      });
      setIsDetailView(false);
      loadBills();
    } catch (error) {
      console.error('确认缴费失败:', error);
      toast({
        title: '确认缴费失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleReject = async reason => {
    try {
      // 使用数据模型 API 更新账单状态为退回
      await props.$w.cloud.callDataSource({
        dataSourceName: isDemo ? 'demo_bills' : 'bills',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: selectedBill?._id || ''
                }
              }]
            }
          },
          data: {
            status: 'unpaid',
            reviewComment: reason,
            updatedAt: Date.now()
          }
        }
      });
      toast({
        title: '已退回',
        description: '缴费账单已退回修改'
      });
      setIsDetailView(false);
      loadBills();
    } catch (error) {
      console.error('退回失败:', error);
      toast({
        title: '退回失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleSaveEdit = async () => {
    const totalAmount = selectedBill.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: isDemo ? 'demo_bills' : 'bills',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: selectedBill._id
                }
              }]
            }
          },
          data: {
            items: selectedBill.items,
            totalAmount: totalAmount,
            updatedAt: Date.now()
          }
        }
      });
      toast({
        title: '保存成功',
        description: `总金额已更新为 ¥${totalAmount.toFixed(2)}`
      });
      setIsEditMode(false);
    } catch (error) {
      console.error('保存失败:', error);
      toast({
        title: '保存失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleAddItem = () => {
    if (newItem.name && newItem.amount) {
      setSelectedBill({
        ...selectedBill,
        items: [...selectedBill.items, {
          ...newItem,
          amount: parseFloat(newItem.amount)
        }]
      });
      setNewItem({
        name: '',
        amount: '',
        unit: ''
      });
    } else {
      toast({
        title: '请填写完整',
        description: '请输入项目名称和金额',
        variant: 'destructive'
      });
    }
  };
  const handleDeleteItem = index => {
    const newItems = [...selectedBill.items];
    newItems.splice(index, 1);
    setSelectedBill({
      ...selectedBill,
      items: newItems
    });
  };
  const handleDeleteImage = index => {
    const newImages = [...selectedBill.images];
    newImages.splice(index, 1);
    setSelectedBill({
      ...selectedBill,
      images: newImages
    });
  };
  const getStatusBadge = status => {
    switch (status) {
      case 'unpaid':
        return <Badge className="bg-amber-100 text-amber-800">待缴费</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">已缴费</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">已逾期</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  const handleExitDemo = () => {
    props.$w.utils.redirectTo({
      pageId: 'login',
      params: {}
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-24">
      {isDemo && <DemoBanner role="admin" onBack={handleExitDemo} />}
      {/* 头部 */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-['Ma_Shan_Zheng'] text-gray-800">账单管理</h1>
          <Badge variant="outline" className="text-amber-600 border-amber-600">
            {filteredBills.filter(b => b.status === 'unpaid').length} 待缴费
          </Badge>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="px-4 py-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="搜索老人姓名" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-white" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="unpaid">待缴费</SelectItem>
            <SelectItem value="paid">已缴费</SelectItem>
            <SelectItem value="overdue">已逾期</SelectItem>
            <SelectItem value="unpaid">待缴费</SelectItem>
            <SelectItem value="paid">已缴费</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 缴费列表 */}
      {isDetailView ? (/* 详情视图 */
    <div className="px-4 py-4 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={() => {
          setIsDetailView(false);
          setSelectedBill(null);
        }}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
            {getStatusBadge(selectedBill?.status || 'unpaid')}
          </div>

          <Card className="bg-white p-4 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{selectedBill?.elderName || '未知老人'}</h2>
                <p className="text-sm text-gray-500">{selectedBill?.month || '未设置'}</p>
              </div>
              {!isEditMode && <Button size="sm" variant="outline" onClick={() => setIsEditMode(true)} className="text-blue-600 border-blue-600">
                  <Edit3 className="w-4 h-4 mr-1" />
                  编辑
                </Button>}
            </div>

            {/* 总金额 */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">总计金额</p>
                  <p className="text-2xl font-bold text-amber-600">
                    ¥{selectedBill.totalAmount.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            {/* 费用明细 */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">费用明细</p>
              <div className="space-y-3">
                {selectedBill.items && selectedBill.items.map((item, index) => <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    {isEditMode ? <React.Fragment>
                        <div className="flex-1 space-y-2">
                          <Input value={item.name} onChange={e => {
                    const newItems = [...selectedBill.items];
                    newItems[index] = {
                      ...newItems[index],
                      name: e.target.value
                    };
                    setSelectedBill({
                      ...selectedBill,
                      items: newItems
                    });
                  }} className="text-sm" />
                          <div className="flex gap-2">
                            <Input type="number" value={item.amount} onChange={e => {
                      const newItems = [...selectedBill.items];
                      newItems[index] = {
                        ...newItems[index],
                        amount: parseFloat(e.target.value) || 0
                      };
                      setSelectedBill({
                        ...selectedBill,
                        items: newItems
                      });
                    }} className="text-sm w-24" />
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteItem(index)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </React.Fragment> : <React.Fragment>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.unit}</p>
                        </div>
                        <p className="text-sm font-bold text-amber-600">¥{item.amount.toFixed(2)}</p>
                      </React.Fragment>}
                  </div>)}
              </div>
            </div>

            {/* 添加新费用项目 */}
            {isEditMode && <div className="mb-4 space-y-2">
                <p className="text-sm font-semibold text-gray-700">添加费用项目</p>
                <div className="flex gap-2">
                  <Input placeholder="项目名称" value={newItem.name} onChange={e => setNewItem({
              ...newItem,
              name: e.target.value
            })} className="flex-1" />
                  <Input type="number" placeholder="金额" value={newItem.amount} onChange={e => setNewItem({
              ...newItem,
              amount: e.target.value
            })} className="w-20" />
                  <Button size="sm" onClick={handleAddItem} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>}

            {/* 附件图片 */}
            {selectedBill.images && selectedBill.images.length > 0 && <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">附件图片</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedBill.images.map((image, index) => <div key={index} className="relative">
                      <img src={image} alt={`图片 ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      {isEditMode && <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => handleDeleteImage(index)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>}
                    </div>)}
                </div>
              </div>}

            {/* 备注 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">备注</p>
              <p className="text-sm text-gray-600">{selectedBill.notes || '无'}</p>
            </div>

            {/* 操作按钮 */}
            {isEditMode ? <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEdit} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  保存修改
                </Button>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  取消
                </Button>
              </div> : selectedBill.status === 'unpaid' ? <div className="flex gap-2 pt-4">
                <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Receipt className="w-4 h-4 mr-1" />
                  确认缴费
                </Button>
                <Button variant="destructive" onClick={() => {
            const reason = prompt('请输入退回理由：');
            if (reason) {
              handleReject(reason);
            }
          }} className="flex-1">
                  退回修改
                </Button>
              </div> : null}
          </Card>
        </div>) : (/* 列表视图 */
    <div className="px-4 py-4 space-y-3">
          {loading ? <div className="text-center text-gray-500 py-8">加载中...</div> : filteredBills.length === 0 ? <div className="text-center text-gray-500 py-8">暂无缴费记录</div> : filteredBills.map(bill => <Card key={bill._id} className="bg-white p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleViewDetail(bill)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{bill.elderName}</h3>
                      {getStatusBadge(bill.status)}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{bill.month}</p>
                    <p className="text-lg font-bold text-amber-600">¥{bill.totalAmount.toFixed(2)}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>)}
        </div>)}

      <AdminTabBar currentPage="admin-bill" isDemo={isDemo} $w={props.$w} />
    </div>;
}