// @ts-ignore;
import React, { useState, useMemo } from 'react';
// @ts-ignore;
import { Card, Button, Badge, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogHeader, DialogTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { Calendar, Search, DollarSign, User, Clock, FileText, Eye, Check, X } from 'lucide-react';

export default function BillApproval(props) {
  const {
    toast
  } = useToast();
  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [searchName, setSearchName] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 模拟缴费单数据
  const [bills, setBills] = useState([{
    id: 1,
    elderName: '张爷爷',
    billingPeriod: '2026年4月',
    amount: 3800,
    creator: '李会计',
    status: 'pending',
    createTime: '2026-04-07 09:30',
    items: [{
      name: '住宿费',
      amount: 2000,
      description: '标准双人间住宿费用'
    }, {
      name: '护理费',
      amount: 1200,
      description: '一级护理服务费用'
    }, {
      name: '餐费',
      amount: 600,
      description: '三餐营养配餐费用'
    }]
  }, {
    id: 2,
    elderName: '王奶奶',
    billingPeriod: '2026年4月',
    amount: 4200,
    creator: '李会计',
    status: 'pending',
    createTime: '2026-04-07 10:15',
    items: [{
      name: '住宿费',
      amount: 2200,
      description: '豪华单人间住宿费用'
    }, {
      name: '护理费',
      amount: 1500,
      description: '特级护理服务费用'
    }, {
      name: '餐费',
      amount: 500,
      description: '三餐营养配餐费用'
    }]
  }, {
    id: 3,
    elderName: '刘爷爷',
    billingPeriod: '2026年4月',
    amount: 3500,
    creator: '张会计',
    status: 'published',
    createTime: '2026-04-06 14:20',
    publishTime: '2026-04-06 16:30',
    items: [{
      name: '住宿费',
      amount: 1800,
      description: '标准单人间住宿费用'
    }, {
      name: '护理费',
      amount: 1100,
      description: '二级护理服务费用'
    }, {
      name: '餐费',
      amount: 600,
      description: '三餐营养配餐费用'
    }]
  }, {
    id: 4,
    elderName: '陈奶奶',
    billingPeriod: '2026年4月',
    amount: 4500,
    creator: '李会计',
    status: 'rejected',
    createTime: '2026-04-05 11:45',
    rejectTime: '2026-04-05 15:20',
    rejectReason: '费用项目计算有误，请重新核算',
    items: [{
      name: '住宿费',
      amount: 2500,
      description: '豪华套房住宿费用'
    }, {
      name: '护理费',
      amount: 1500,
      description: '特级护理服务费用'
    }, {
      name: '餐费',
      amount: 500,
      description: '三餐营养配餐费用'
    }]
  }, {
    id: 5,
    elderName: '赵爷爷',
    billingPeriod: '2026年3月',
    amount: 3200,
    creator: '张会计',
    status: 'pending',
    createTime: '2026-04-07 08:30',
    items: [{
      name: '住宿费',
      amount: 1600,
      description: '标准双人间住宿费用'
    }, {
      name: '护理费',
      amount: 1000,
      description: '一级护理服务费用'
    }, {
      name: '餐费',
      amount: 600,
      description: '三餐营养配餐费用'
    }]
  }]);

  // 筛选逻辑
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const monthMatch = bill.billingPeriod.includes(selectedMonth.replace('-', '年'));
      const nameMatch = bill.elderName.toLowerCase().includes(searchName.toLowerCase());
      return monthMatch && nameMatch;
    });
  }, [bills, selectedMonth, searchName]);

  // 统计数据
  const stats = useMemo(() => {
    const pending = filteredBills.filter(bill => bill.status === 'pending').length;
    const published = filteredBills.filter(bill => bill.status === 'published').length;
    const totalAmount = filteredBills.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0);
    return {
      pending,
      published,
      totalAmount
    };
  }, [filteredBills]);

  // 状态标签样式
  const getStatusBadge = status => {
    const styles = {
      pending: {
        bg: 'bg-yellow-100 text-yellow-800',
        text: '待发布'
      },
      published: {
        bg: 'bg-green-100 text-green-800',
        text: '已发布'
      },
      rejected: {
        bg: 'bg-red-100 text-red-800',
        text: '已驳回'
      }
    };
    return styles[status] || styles.pending;
  };

  // 审批操作
  const handleApprove = billId => {
    setBills(prev => prev.map(bill => bill.id === billId ? {
      ...bill,
      status: 'published',
      publishTime: new Date().toLocaleString('zh-CN')
    } : bill));
    toast({
      title: '发布成功',
      description: '缴费单已成功发布给家属',
      duration: 2000
    });
  };
  const handleReject = billId => {
    const reason = prompt('请输入驳回原因：');
    if (reason && reason.trim()) {
      setBills(prev => prev.map(bill => bill.id === billId ? {
        ...bill,
        status: 'rejected',
        rejectTime: new Date().toLocaleString('zh-CN'),
        rejectReason: reason.trim()
      } : bill));
      toast({
        title: '驳回成功',
        description: '缴费单已驳回，原因已记录',
        duration: 2000
      });
    }
  };

  // 查看明细
  const handleViewDetail = bill => {
    setSelectedBill(bill);
    setShowDetailModal(true);
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* 页面标题 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-amber-900" style={{
          fontFamily: 'Playfair Display, serif'
        }}>
            缴费审批
          </h1>
          <p className="text-gray-600 mt-2">审核并发布缴费清单</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">待发布</div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <div className="text-sm text-gray-600">已发布</div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">¥{stats.totalAmount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">待发布金额</div>
            </div>
          </Card>
        </div>

        {/* 筛选区域 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6 p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-amber-600" />
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="选择月份" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026-01">2026年1月</SelectItem>
                  <SelectItem value="2026-02">2026年2月</SelectItem>
                  <SelectItem value="2026-03">2026年3月</SelectItem>
                  <SelectItem value="2026-04">2026年4月</SelectItem>
                  <SelectItem value="2026-05">2026年5月</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3">
              <Search className="w-5 h-5 text-amber-600" />
              <Input placeholder="搜索老人姓名" value={searchName} onChange={e => setSearchName(e.target.value)} className="flex-1" />
            </div>
          </div>
        </Card>

        {/* 缴费单列表 */}
        <div className="space-y-4">
          {filteredBills.length === 0 ? <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-8">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>暂无符合条件的缴费单</p>
              </div>
            </Card> : filteredBills.map(bill => <Card key={bill.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                <div className="p-4">
                  {/* 头部信息 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{bill.elderName}</h3>
                        <p className="text-sm text-gray-600">{bill.billingPeriod}</p>
                      </div>
                    </div>
                    <Badge className={getStatusBadge(bill.status).bg}>
                      {getStatusBadge(bill.status).text}
                    </Badge>
                  </div>

                  {/* 金额和创建信息 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">¥{bill.amount.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      创建人：{bill.creator}
                    </div>
                  </div>

                  {/* 时间信息 */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>创建：{bill.createTime}</span>
                    </div>
                    {bill.publishTime && <div className="flex items-center space-x-1">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>发布：{bill.publishTime}</span>
                      </div>}
                    {bill.rejectTime && <div className="flex items-center space-x-1">
                        <X className="w-4 h-4 text-red-600" />
                        <span>驳回：{bill.rejectTime}</span>
                      </div>}
                  </div>

                  {/* 驳回原因 */}
                  {bill.rejectReason && <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <div className="text-sm text-red-700">
                        <strong>驳回原因：</strong>{bill.rejectReason}
                      </div>
                    </div>}

                  {/* 操作按钮 */}
                  {bill.status === 'pending' && <div className="flex space-x-3">
                      <Button onClick={() => handleViewDetail(bill)} variant="outline" className="flex-1 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100">
                        <Eye className="w-4 h-4 mr-2" />
                        查看明细
                      </Button>
                      <Button onClick={() => handleApprove(bill.id)} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                        <Check className="w-4 h-4 mr-2" />
                        发布
                      </Button>
                      <Button onClick={() => handleReject(bill.id)} variant="outline" className="flex-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
                        <X className="w-4 h-4 mr-2" />
                        驳回
                      </Button>
                    </div>}

                  {bill.status !== 'pending' && <div className="flex space-x-3">
                      <Button onClick={() => handleViewDetail(bill)} variant="outline" className="flex-1 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100">
                        <Eye className="w-4 h-4 mr-2" />
                        查看明细
                      </Button>
                      <div className="flex-1" />
                    </div>}
                </div>
              </Card>)}
        </div>
      </div>

      {/* 明细查看弹窗 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-md mx-auto bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-amber-900" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              缴费明细
            </DialogTitle>
          </DialogHeader>
          {selectedBill && <div className="space-y-4">
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{selectedBill.elderName}</span>
                  <span className="text-lg font-bold text-green-600">¥{selectedBill.amount.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-600">{selectedBill.billingPeriod}</div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">费用明细</h4>
                {selectedBill.items.map((item, index) => <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                    </div>
                    <div className="font-semibold text-green-600">¥{item.amount}</div>
                  </div>)}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">总计</span>
                  <span className="text-xl font-bold text-green-600">¥{selectedBill.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
}