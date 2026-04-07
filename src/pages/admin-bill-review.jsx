// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Filter, Calendar, User, DollarSign, Edit3, Check, X, Image, Trash2, Plus, Save, ArrowLeft, Badge } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Avatar, AvatarImage, Input, Textarea, Card, CardContent } from '@/components/ui';

import AdminTabBar from '@/components/AdminTabBar';
export default function AdminBillReview(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('bill-review');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBill, setSelectedBill] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取缴费清单数据
  const fetchBills = async () => {
    try {
      setLoading(true);
      const result = await props.$w.cloud.callFunction({
        name: 'getBillsForReview',
        data: {
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchTerm
        }
      });
      if (result.result.success) {
        setBills(result.result.data);
      } else {
        toast({
          title: '获取数据失败',
          description: result.result.error || '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '网络错误',
        description: '获取数据失败，请检查网络连接',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBills();
  }, [statusFilter, searchTerm]);

  // 审批缴费清单
  const handleReview = async (billId, status, comment = '') => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'reviewBill',
        data: {
          billId,
          status,
          comment,
          reviewerId: props.$w.auth.currentUser?.userId || 'admin_001'
        }
      });
      if (result.result.success) {
        toast({
          title: status === 'approved' ? '发布成功' : '已退回',
          description: status === 'approved' ? '缴费清单已发布给家属' : '缴费清单已退回修改'
        });
        fetchBills();
        if (selectedBill) {
          setSelectedBill(prev => ({
            ...prev,
            status
          }));
        }
      } else {
        toast({
          title: '操作失败',
          description: result.result.error || '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '网络错误',
        description: '操作失败，请检查网络连接',
        variant: 'destructive'
      });
    }
  };

  // 编辑缴费清单
  const handleEdit = async updatedData => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'updateBill',
        data: {
          billId: selectedBill._id,
          ...updatedData,
          reviewerId: props.$w.auth.currentUser?.userId || 'admin_001'
        }
      });
      if (result.result.success) {
        toast({
          title: '修改成功',
          description: '缴费清单已更新'
        });
        fetchBills();
        setSelectedBill(prev => ({
          ...prev,
          ...updatedData
        }));
        setIsEditMode(false);
      } else {
        toast({
          title: '修改失败',
          description: result.result.error || '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '网络错误',
        description: '修改失败，请检查网络连接',
        variant: 'destructive'
      });
    }
  };

  // 删除图片
  const handleDeleteImage = async imageIndex => {
    try {
      const newImages = selectedBill.images.filter((_, index) => index !== imageIndex);
      await handleEdit({
        images: newImages
      });
    } catch (error) {
      toast({
        title: '删除失败',
        description: '图片删除失败，请重试',
        variant: 'destructive'
      });
    }
  };

  // 添加费用项目
  const handleAddItem = () => {
    const newItem = {
      name: '新项目',
      amount: 0,
      quantity: 1
    };
    const updatedItems = [...selectedBill.items, newItem];
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.amount * item.quantity, 0);
    setSelectedBill(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: updatedTotal
    }));
  };

  // 删除费用项目
  const handleDeleteItem = index => {
    const updatedItems = selectedBill.items.filter((_, i) => i !== index);
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.amount * item.quantity, 0);
    setSelectedBill(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: updatedTotal
    }));
  };

  // 更新费用项目
  const handleUpdateItem = (index, field, value) => {
    const updatedItems = selectedBill.items.map((item, i) => i === index ? {
      ...item,
      [field]: field === 'name' ? value : parseFloat(value) || 0
    } : item);
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.amount * item.quantity, 0);
    setSelectedBill(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: updatedTotal
    }));
  };
  const getStatusBadge = status => {
    const statusMap = {
      pending: {
        label: '待审批',
        variant: 'secondary'
      },
      approved: {
        label: '已发布',
        variant: 'default'
      },
      rejected: {
        label: '已退回',
        variant: 'destructive'
      }
    };
    return statusMap[status] || {
      label: '未知',
      variant: 'secondary'
    };
  };
  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.elderName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const statusCounts = {
    all: bills.length,
    pending: bills.filter(b => b.status === 'pending').length,
    approved: bills.filter(b => b.status === 'approved').length,
    rejected: bills.filter(b => b.status === 'rejected').length
  };
  if (isDetailView && selectedBill) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="p-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => {
            setIsDetailView(false);
            setSelectedBill(null);
            setIsEditMode(false);
          }} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">缴费清单详情</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face`} />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedBill.elderName}</h3>
                  <p className="text-sm text-gray-500">{selectedBill.month}</p>
                </div>
              </div>
              <Badge variant={getStatusBadge(selectedBill.status).variant}>
                {getStatusBadge(selectedBill.status).label}
              </Badge>
            </div>

            {isEditMode ? <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">费用明细</label>
                  <div className="space-y-2">
                    {selectedBill.items.map((item, index) => <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                        <Input value={item.name} onChange={e => handleUpdateItem(index, 'name', e.target.value)} placeholder="项目名称" className="flex-1" />
                        <Input type="number" value={item.amount} onChange={e => handleUpdateItem(index, 'amount', e.target.value)} placeholder="金额" className="w-24" />
                        <Input type="number" value={item.quantity} onChange={e => handleUpdateItem(index, 'quantity', e.target.value)} placeholder="数量" className="w-16" />
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteItem(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>)}
                    <Button variant="outline" size="sm" onClick={handleAddItem} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      添加项目
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">总金额</label>
                  <Input type="number" value={selectedBill.totalAmount} readOnly className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">备注说明</label>
                  <Textarea value={selectedBill.notes || ''} onChange={e => setSelectedBill(prev => ({
                ...prev,
                notes: e.target.value
              }))} rows={3} placeholder="请输入备注说明" />
                </div>

                {selectedBill.images && selectedBill.images.length > 0 && <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">附件图片</label>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedBill.images.map((image, index) => <div key={index} className="relative group">
                          <img src={image} alt={`附件 ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <Button size="sm" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteImage(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>)}
                    </div>
                  </div>}

                <div className="flex space-x-3">
                  <Button onClick={() => handleEdit({
                items: selectedBill.items,
                totalAmount: selectedBill.totalAmount,
                notes: selectedBill.notes
              })}>
                    <Save className="w-4 h-4 mr-2" />
                    保存修改
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditMode(false)}>
                    取消
                  </Button>
                </div>
              </div> : <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">费用明细</h4>
                  <div className="space-y-2">
                    {selectedBill.items.map((item, index) => <div key={index} className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-900 font-medium">
                          ¥{item.amount.toFixed(2)} × {item.quantity}
                        </span>
                      </div>)}
                    <div className="flex justify-between items-center py-2 border-t font-semibold">
                      <span className="text-gray-800">总计</span>
                      <span className="text-gray-900">¥{selectedBill.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {selectedBill.notes && <div>
                    <h4 className="font-medium text-gray-800 mb-2">备注说明</h4>
                    <p className="text-gray-600">{selectedBill.notes}</p>
                  </div>}

                {selectedBill.images && selectedBill.images.length > 0 && <div>
                    <h4 className="font-medium text-gray-800 mb-2">附件图片</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedBill.images.map((image, index) => <img key={index} src={image} alt={`附件 ${index + 1}`} className="w-full h-32 object-cover rounded-lg cursor-pointer" onClick={() => window.open(image, '_blank')} />)}
                    </div>
                  </div>}

                {selectedBill.reviewerId && <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>审批人：</strong>{selectedBill.reviewerId}
                    </p>
                    {selectedBill.reviewComment && <p className="text-sm text-gray-600 mt-1">
                        <strong>审批意见：</strong>{selectedBill.reviewComment}
                      </p>}
                    {selectedBill.updatedAt && <p className="text-sm text-gray-600 mt-1">
                        <strong>审批时间：</strong>{new Date(selectedBill.updatedAt).toLocaleString()}
                      </p>}
                  </div>}
              </div>}
          </div>

          {selectedBill.status === 'pending' && <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
              <div className="flex space-x-3">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleReview(selectedBill._id, 'approved')}>
                  <Check className="w-4 h-4 mr-2" />
                  确认发布
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => {
              const reason = prompt('请输入退回修改原因：');
              if (reason !== null) {
                handleReview(selectedBill._id, 'rejected', reason);
              }
            }}>
                  <X className="w-4 h-4 mr-2" />
                  退回修改
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsEditMode(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  编辑
                </Button>
              </div>
            </div>}
        </div>
        <AdminTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">缴费清单审批</h1>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[{
          key: 'all',
          label: '全部',
          count: statusCounts.all,
          color: 'bg-blue-100 text-blue-800'
        }, {
          key: 'pending',
          label: '待审批',
          count: statusCounts.pending,
          color: 'bg-yellow-100 text-yellow-800'
        }, {
          key: 'approved',
          label: '已发布',
          count: statusCounts.approved,
          color: 'bg-green-100 text-green-800'
        }, {
          key: 'rejected',
          label: '已退回',
          count: statusCounts.rejected,
          color: 'bg-red-100 text-red-800'
        }].map(item => <div key={item.key} className={`p-3 rounded-lg cursor-pointer transition-all ${statusFilter === item.key ? item.color : 'bg-white hover:bg-gray-50'}`} onClick={() => setStatusFilter(item.key)}>
              <div className="text-center">
                <div className="text-2xl font-bold">{item.count}</div>
                <div className="text-sm">{item.label}</div>
              </div>
            </div>)}
        </div>

        {/* 搜索和筛选 */}
        <div className="flex space-x-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="搜索老人姓名..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* 缴费清单列表 */}
        {loading ? <div className="text-center py-8">
            <div className="text-gray-500">加载中...</div>
          </div> : filteredBills.length === 0 ? <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无缴费清单</p>
          </div> : <div className="space-y-4 mb-20">
            {filteredBills.map(bill => <Card key={bill._id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
          setSelectedBill(bill);
          setIsDetailView(true);
        }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face`} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{bill.elderName}</h3>
                          <Badge variant={getStatusBadge(bill.status).variant} className="text-xs">
                            {getStatusBadge(bill.status).label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{bill.month}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              ¥{bill.totalAmount?.toFixed(2)}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {bill.items?.length || 0}个项目
                            </span>
                            {bill.images && bill.images.length > 0 && <span className="flex items-center">
                                <Image className="w-3 h-3 mr-1" />
                                {bill.images.length}张
                              </span>}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(bill.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>}
      </div>
      <AdminTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>;
}