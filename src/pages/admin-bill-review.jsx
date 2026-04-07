// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Filter, Calendar, User, DollarSign, Edit3, Check, X, Image, Trash2, Plus, Save } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

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
  const [bills, setBills] = useState([{
    id: 1,
    seniorName: '张爷爷',
    month: '2026年4月',
    totalAmount: 2850,
    status: 'pending',
    submitTime: '2026-04-07 10:30',
    submitter: '王护士',
    items: [{
      name: '住宿费',
      amount: 1200,
      quantity: 1
    }, {
      name: '护理费',
      amount: 800,
      quantity: 1
    }, {
      name: '餐费',
      amount: 600,
      quantity: 1
    }, {
      name: '医疗费',
      amount: 250,
      quantity: 1
    }],
    images: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'],
    notes: '本月医疗费用包含常规体检费用'
  }, {
    id: 2,
    seniorName: '李奶奶',
    month: '2026年4月',
    totalAmount: 3200,
    status: 'pending',
    submitTime: '2026-04-07 09:15',
    submitter: '赵护士',
    items: [{
      name: '住宿费',
      amount: 1500,
      quantity: 1
    }, {
      name: '护理费',
      amount: 1000,
      quantity: 1
    }, {
      name: '餐费',
      amount: 700,
      quantity: 1
    }],
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop'],
    notes: '护理费增加，需要特殊护理服务'
  }, {
    id: 3,
    seniorName: '王爷爷',
    month: '2026年3月',
    totalAmount: 2100,
    status: 'approved',
    submitTime: '2026-04-06 16:20',
    submitter: '刘护士',
    items: [{
      name: '住宿费',
      amount: 1000,
      quantity: 1
    }, {
      name: '护理费',
      amount: 600,
      quantity: 1
    }, {
      name: '餐费',
      amount: 500,
      quantity: 1
    }],
    images: [],
    notes: '常规费用，无特殊说明'
  }, {
    id: 4,
    seniorName: '赵奶奶',
    month: '2026年4月',
    totalAmount: 3800,
    status: 'rejected',
    submitTime: '2026-04-07 08:45',
    submitter: '陈护士',
    items: [{
      name: '住宿费',
      amount: 1800,
      quantity: 1
    }, {
      name: '护理费',
      amount: 1200,
      quantity: 1
    }, {
      name: '餐费',
      amount: 800,
      quantity: 1
    }],
    images: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'],
    notes: '费用明细需要重新核对',
    rejectReason: '医疗费用明细不完整，请补充相关凭证'
  }]);
  const [editingBill, setEditingBill] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // 筛选和搜索逻辑
  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.seniorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 统计各状态数量
  const stats = {
    pending: bills.filter(b => b.status === 'pending').length,
    approved: bills.filter(b => b.status === 'approved').length,
    rejected: bills.filter(b => b.status === 'rejected').length
  };
  const handleApprove = billId => {
    setBills(prev => prev.map(bill => bill.id === billId ? {
      ...bill,
      status: 'approved'
    } : bill));
    toast({
      title: '缴费清单已确认发布',
      description: '家属端将立即收到推送通知',
      className: 'bg-green-50 border-green-200'
    });
    setIsDetailView(false);
    setSelectedBill(null);
  };
  const handleReject = billId => {
    if (!rejectReason.trim()) {
      toast({
        title: '请填写退回理由',
        description: '退回修改需要说明原因',
        variant: 'destructive'
      });
      return;
    }
    setBills(prev => prev.map(bill => bill.id === billId ? {
      ...bill,
      status: 'rejected',
      rejectReason: rejectReason
    } : bill));
    toast({
      title: '缴费清单已退回修改',
      description: '提交人将收到通知并重新提交',
      className: 'bg-orange-50 border-orange-200'
    });
    setShowRejectModal(false);
    setRejectReason('');
    setIsDetailView(false);
    setSelectedBill(null);
  };
  const handleEdit = bill => {
    setEditingBill({
      ...bill
    });
    setIsEditMode(true);
  };
  const handleSaveEdit = () => {
    setBills(prev => prev.map(bill => bill.id === editingBill.id ? editingBill : bill));
    toast({
      title: '修改已保存',
      description: '缴费清单已更新',
      className: 'bg-blue-50 border-blue-200'
    });
    setIsEditMode(false);
    setEditingBill(null);
    if (selectedBill) {
      setSelectedBill(editingBill);
    }
  };
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingBill(null);
  };
  const updateBillItem = (itemIndex, field, value) => {
    setEditingBill(prev => ({
      ...prev,
      items: prev.items.map((item, index) => index === itemIndex ? {
        ...item,
        [field]: value
      } : item)
    }));
  };
  const addBillItem = () => {
    setEditingBill(prev => ({
      ...prev,
      items: [...prev.items, {
        name: '',
        amount: 0,
        quantity: 1
      }]
    }));
  };
  const removeBillItem = itemIndex => {
    setEditingBill(prev => ({
      ...prev,
      items: prev.items.filter((_, index) => index !== itemIndex)
    }));
  };
  const removeImage = imageIndex => {
    setEditingBill(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex)
    }));
  };
  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getStatusText = status => {
    switch (status) {
      case 'pending':
        return '待审批';
      case 'approved':
        return '已发布';
      case 'rejected':
        return '已退回';
      default:
        return '未知';
    }
  };
  if (isDetailView && selectedBill) {
    const currentBill = isEditMode ? editingBill : selectedBill;
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        {/* 详情页头部 */}
        <div className="bg-white shadow-sm border-b border-orange-100">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => {
            setIsDetailView(false);
            setSelectedBill(null);
            setIsEditMode(false);
            setEditingBill(null);
          }} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
              <span className="mr-2">←</span>
              <span>返回列表</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-800 font-['Playfair_Display']">缴费清单详情</h1>
            <div className="w-16"></div>
          </div>
        </div>

        {/* 详情内容 */}
        <div className="flex-1 p-4 pb-24">
          {/* 基本信息卡片 */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 font-['Playfair_Display']">{currentBill.seniorName}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentBill.status)}`}>
                {getStatusText(currentBill.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                <span>{currentBill.month}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                <span className="font-semibold text-lg">¥{currentBill.totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <User className="w-4 h-4 mr-2 text-blue-500" />
              <span>提交人：{currentBill.submitter}</span>
            </div>
            <div className="text-gray-500 text-sm">
              提交时间：{currentBill.submitTime}
            </div>
          </div>

          {/* 费用明细 */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">费用明细</h3>
              {isEditMode && <button onClick={addBillItem} className="flex items-center px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm">
                  <Plus className="w-4 h-4 mr-1" />
                  添加项目
                </button>}
            </div>
            
            <div className="space-y-3">
              {currentBill.items.map((item, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {isEditMode ? <div className="flex-1 grid grid-cols-3 gap-2">
                      <input type="text" value={item.name} onChange={e => updateBillItem(index, 'name', e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm" placeholder="项目名称" />
                      <input type="number" value={item.amount} onChange={e => updateBillItem(index, 'amount', parseFloat(e.target.value) || 0)} className="px-2 py-1 border border-gray-300 rounded text-sm" placeholder="金额" />
                      <div className="flex items-center gap-2">
                        <input type="number" value={item.quantity} onChange={e => updateBillItem(index, 'quantity', parseInt(e.target.value) || 1)} className="px-2 py-1 border border-gray-300 rounded text-sm w-16" placeholder="数量" />
                        <button onClick={() => removeBillItem(index)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div> : <>
                      <div>
                        <span className="font-medium text-gray-800">{item.name}</span>
                        <span className="text-gray-500 text-sm ml-2">× {item.quantity}</span>
                      </div>
                      <span className="font-semibold text-gray-800">¥{item.amount}</span>
                    </>}
                </div>)}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">总计：</span>
                <span className="text-xl font-bold text-orange-600">
                  ¥{currentBill.items.reduce((sum, item) => sum + item.amount * item.quantity, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* 备注信息 */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">备注说明</h3>
            {isEditMode ? <textarea value={currentBill.notes || ''} onChange={e => setEditingBill(prev => ({
            ...prev,
            notes: e.target.value
          }))} className="w-full p-3 border border-gray-300 rounded-lg resize-none" rows={3} placeholder="请输入备注说明" /> : <p className="text-gray-600">{currentBill.notes || '暂无备注'}</p>}
          </div>

          {/* 图片附件 */}
          {currentBill.images && currentBill.images.length > 0 && <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">附件图片</h3>
              <div className="grid grid-cols-2 gap-4">
                {currentBill.images.map((image, index) => <div key={index} className="relative group">
                    <img src={image} alt={`附件${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    {isEditMode && <button onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>}
                  </div>)}
              </div>
            </div>}

          {/* 退回原因 */}
          {currentBill.status === 'rejected' && currentBill.rejectReason && <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">退回原因</h3>
              <p className="text-red-700">{currentBill.rejectReason}</p>
            </div>}
        </div>

        {/* 底部操作按钮 */}
        {currentBill.status === 'pending' && <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="flex gap-3">
              {isEditMode ? <>
                  <button onClick={handleSaveEdit} className="flex-1 flex items-center justify-center bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors">
                    <Save className="w-5 h-5 mr-2" />
                    保存修改
                  </button>
                  <button onClick={handleCancelEdit} className="flex-1 flex items-center justify-center bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors">
                    <X className="w-5 h-5 mr-2" />
                    取消
                  </button>
                </> : <>
                  <button onClick={() => handleApprove(currentBill.id)} className="flex-1 flex items-center justify-center bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors">
                    <Check className="w-5 h-5 mr-2" />
                    确认发布
                  </button>
                  <button onClick={() => setShowRejectModal(true)} className="flex-1 flex items-center justify-center bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors">
                    <X className="w-5 h-5 mr-2" />
                    退回修改
                  </button>
                  <button onClick={() => handleEdit(currentBill)} className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                    <Edit3 className="w-5 h-5" />
                  </button>
                </>}
            </div>
          </div>}

        {/* 退回理由弹窗 */}
        {showRejectModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">填写退回理由</h3>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg resize-none" rows={4} placeholder="请输入退回修改的原因..." />
              <div className="flex gap-3 mt-4">
                <button onClick={() => handleReject(currentBill.id)} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                  确认退回
                </button>
                <button onClick={() => {
              setShowRejectModal(false);
              setRejectReason('');
            }} className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                  取消
                </button>
              </div>
            </div>
          </div>}
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 font-['Playfair_Display']">缴费清单审批</h1>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* 搜索栏 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="搜索老人姓名..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent bg-white/80 backdrop-blur-sm" />
          </div>
        </div>

        {/* 状态筛选标签 */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2 overflow-x-auto">
            <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-orange-50'}`}>
              全部 ({bills.length})
            </button>
            <button onClick={() => setStatusFilter('pending')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-600 hover:bg-yellow-50'}`}>
              待审批 ({stats.pending})
            </button>
            <button onClick={() => setStatusFilter('approved')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 hover:bg-green-50'}`}>
              已发布 ({stats.approved})
            </button>
            <button onClick={() => setStatusFilter('rejected')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'rejected' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50'}`}>
              已退回 ({stats.rejected})
            </button>
          </div>
        </div>
      </div>

      {/* 缴费清单列表 */}
      <div className="flex-1 p-4 pb-20">
        <div className="space-y-4">
          {filteredBills.map(bill => <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
          setSelectedBill(bill);
          setIsDetailView(true);
        }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 font-['Playfair_Display']">{bill.seniorName}</h3>
                  <p className="text-gray-600 text-sm">{bill.month}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bill.status)}`}>
                  {getStatusText(bill.status)}
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-lg font-bold text-green-600">¥{bill.totalAmount}</span>
                </div>
                <div className="text-gray-500 text-sm">
                  {bill.items.length} 个项目
                </div>
              </div>

              <div className="space-y-1 mb-3">
                {bill.items.slice(0, 3).map((item, index) => <div key={index} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name}</span>
                    <span>¥{item.amount}</span>
                  </div>)}
                {bill.items.length > 3 && <div className="text-sm text-gray-500 text-center">
                    还有 {bill.items.length - 3} 个项目...
                  </div>}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{bill.submitter}</span>
                </div>
                <span>{bill.submitTime}</span>
              </div>

              {bill.images && bill.images.length > 0 && <div className="mt-3 flex items-center text-sm text-gray-600">
                  <Image className="w-4 h-4 mr-1" />
                  <span>{bill.images.length} 张附件</span>
                </div>}

              {bill.status === 'rejected' && bill.rejectReason && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>退回原因：</strong>{bill.rejectReason}
                  </p>
                </div>}
            </div>)}
        </div>

        {filteredBills.length === 0 && <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">暂无缴费清单</p>
            <p className="text-gray-400 text-sm mt-2">请尝试调整搜索条件或筛选状态</p>
          </div>}
      </div>

      {/* 底部导航 */}
      <AdminTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>;
}