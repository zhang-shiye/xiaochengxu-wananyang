// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Badge, useToast, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
// @ts-ignore;
import { DollarSign, Search, Filter, ArrowLeft, ArrowRight, Edit3, Receipt, Trash2, Plus } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
export default function AdminBill(props) {
  const {
    toast
  } = useToast();
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
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('bills').orderBy('createdAt', 'desc').get();
      setBills(result.data);
      setFilteredBills(result.data);
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
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      await db.collection('bills').doc(selectedBill._id).update({
        status: 'approved',
        updatedAt: new Date().getTime()
      });
      toast({
        title: '发布成功',
        description: '缴费账单已发布，家属端可见'
      });
      setIsDetailView(false);
      loadBills();
    } catch (error) {
      console.error('发布失败:', error);
      toast({
        title: '发布失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleReject = async reason => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      await db.collection('bills').doc(selectedBill._id).update({
        status: 'rejected',
        reviewComment: reason,
        updatedAt: new Date().getTime()
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
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      await db.collection('bills').doc(selectedBill._id).update({
        items: selectedBill.items,
        totalAmount: totalAmount,
        updatedAt: new Date().getTime()
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
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">待审核</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">已发布</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">已退回</Badge>;
      case 'unpaid':
        return <Badge className="bg-blue-100 text-blue-800">待缴费</Badge>;
      case 'paid':
        return <Badge className="bg-gray-100 text-gray-800">已缴费</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-24">
      {/* 头部 */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-['Ma_Shan_Zheng'] text-gray-800">缴费审核</h1>
          <Badge variant="outline" className="text-amber-600 border-amber-600">
            {filteredBills.filter(b => b.status === 'pending').length} 待审核
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
            <SelectItem value="pending">待审核</SelectItem>
            <SelectItem value="approved">已发布</SelectItem>
            <SelectItem value="rejected">已退回</SelectItem>
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
            {getStatusBadge(selectedBill.status)}
          </div>

          <Card className="bg-white p-4 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{selectedBill.elderName}</h2>
                <p className="text-sm text-gray-500">{selectedBill.month}</p>
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
                    {isEditMode ? <>
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
                      </> : <>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.unit}</p>
                        </div>
                        <p className="text-sm font-bold text-amber-600">¥{item.amount.toFixed(2)}</p>
                      </>}
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

            {/* 审核按钮 */}
            {isEditMode ? <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEdit} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  保存修改
                </Button>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  取消
                </Button>
              </div> : selectedBill.status === 'pending' ? <div className="flex gap-2 pt-4">
                <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Receipt className="w-4 h-4 mr-1" />
                  确认发布
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

      <AdminTabBar />
    </div>;
}