// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, useToast, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui';
// @ts-ignore;
import { Plus, Search, Edit, Trash2, Upload, Download, Filter, DollarSign, Calendar } from 'lucide-react';

import { useForm } from 'react-hook-form';
export default function AdminBills(props) {
  const {
    toast } =
  useToast();
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('2026-04');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const form = useForm({
    defaultValues: {
      elderName: '',
      month: '2026-04',
      bedFee: '',
      careFee: '',
      mealFee: '',
      otherFee: '',
      dueDate: '' } });



  // 模拟账单数据
  useEffect(() => {
    setBills([{
      id: 1,
      elderName: '王奶奶',
      month: '2026-04',
      totalAmount: 4200,
      status: 'unpaid',
      dueDate: '2026-04-15',
      items: [{
        name: '基础床位费',
        amount: 1800,
        unit: '月' },
      {
        name: '护理费（二级）',
        amount: 1200,
        unit: '月' },
      {
        name: '餐费',
        amount: 800,
        unit: '月' },
      {
        name: '代办买药费',
        amount: 350,
        unit: '次' },
      {
        name: '洗衣费',
        amount: 50,
        unit: '月' }] },

    {
      id: 2,
      elderName: '李爷爷',
      month: '2026-04',
      totalAmount: 3850,
      status: 'paid',
      dueDate: '2026-04-15',
      paymentDate: '2026-04-10',
      items: [{
        name: '基础床位费',
        amount: 1800,
        unit: '月' },
      {
        name: '护理费（一级）',
        amount: 1000,
        unit: '月' },
      {
        name: '餐费',
        amount: 800,
        unit: '月' },
      {
        name: '特殊护理费',
        amount: 250,
        unit: '月' }] },

    {
      id: 3,
      elderName: '陈奶奶',
      month: '2026-04',
      totalAmount: 3950,
      status: 'unpaid',
      dueDate: '2026-04-15',
      items: [{
        name: '基础床位费',
        amount: 1800,
        unit: '月' },
      {
        name: '护理费（三级）',
        amount: 1400,
        unit: '月' },
      {
        name: '餐费',
        amount: 800,
        unit: '月' },
      {
        name: '康复理疗费',
        amount: 350,
        unit: '月' }] }]);


  }, []);
  const filteredBills = bills.filter((bill) => bill.elderName.toLowerCase().includes(searchTerm.toLowerCase()) && bill.month.includes(monthFilter));
  const onSubmit = (data) => {
    const totalAmount = parseInt(data.bedFee || 0) + parseInt(data.careFee || 0) + parseInt(data.mealFee || 0) + parseInt(data.otherFee || 0);
    if (editingBill) {
      // 编辑账单
      setBills(bills.map((bill) => bill.id === editingBill.id ? {
        ...bill,
        ...data,
        totalAmount,
        items: [{
          name: '基础床位费',
          amount: parseInt(data.bedFee || 0),
          unit: '月' },
        {
          name: '护理费',
          amount: parseInt(data.careFee || 0),
          unit: '月' },
        {
          name: '餐费',
          amount: parseInt(data.mealFee || 0),
          unit: '月' },
        {
          name: '其他费用',
          amount: parseInt(data.otherFee || 0),
          unit: '月' }] } :

      bill));
      toast({
        title: '更新成功',
        description: `已更新${data.elderName}的账单` });

    } else {
      // 添加账单
      const newBill = {
        id: bills.length + 1,
        ...data,
        totalAmount,
        status: 'unpaid',
        items: [{
          name: '基础床位费',
          amount: parseInt(data.bedFee || 0),
          unit: '月' },
        {
          name: '护理费',
          amount: parseInt(data.careFee || 0),
          unit: '月' },
        {
          name: '餐费',
          amount: parseInt(data.mealFee || 0),
          unit: '月' },
        {
          name: '其他费用',
          amount: parseInt(data.otherFee || 0),
          unit: '月' }] };


      setBills([...bills, newBill]);
      toast({
        title: '添加成功',
        description: `已为${data.elderName}生成账单` });

    }
    setIsDialogOpen(false);
    form.reset({
      elderName: '',
      month: '2026-04',
      bedFee: '',
      careFee: '',
      mealFee: '',
      otherFee: '',
      dueDate: '' });

    setEditingBill(null);
  };
  const handleEdit = (bill) => {
    setEditingBill(bill);
    form.reset({
      elderName: bill.elderName,
      month: bill.month,
      bedFee: bill.items.find((item) => item.name.includes('床位'))?.amount.toString() || '',
      careFee: bill.items.find((item) => item.name.includes('护理'))?.amount.toString() || '',
      mealFee: bill.items.find((item) => item.name.includes('餐费'))?.amount.toString() || '',
      otherFee: bill.items.find((item) => item.name.includes('其他'))?.amount.toString() || '',
      dueDate: bill.dueDate });

    setIsDialogOpen(true);
  };
  const handleDelete = (bill) => {
    setBills(bills.filter((b) => b.id !== bill.id));
    toast({
      title: '删除成功',
      description: `已删除${bill.elderName}的账单` });

  };
  const handleBatchGenerate = () => {
    toast({
      title: '批量生成',
      description: '请使用数据导入功能批量生成账单' });

  };
  const handleMarkAsPaid = (bill) => {
    setBills(bills.map((b) => b.id === bill.id ? {
      ...b,
      status: 'paid',
      paymentDate: new Date().toISOString().split('T')[0] } :
    b));
    toast({
      title: '标记成功',
      description: `已将${bill.elderName}的账单标记为已缴费` });

  };
  const getStatusBadge = (status) => {
    const variants = {
      unpaid: {
        label: '未缴费',
        color: 'bg-red-100 text-red-800' },

      paid: {
        label: '已缴费',
        color: 'bg-green-100 text-green-800' } };


    return variants[status] || variants.unpaid;
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2" style={{
          fontFamily: 'Space Mono, monospace' }}>

            账单管理
          </h1>
          <p className="text-blue-600 text-lg" style={{
          fontFamily: 'IBM Plex Sans, sans-serif' }}>

            管理老人月度缴费账单
          </p>
        </div>

        {/* 操作栏 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="搜索老人姓名..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full md:w-64" />
              </div>
              
              <div className="relative flex-1 md:flex-none">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="pl-10 w-full md:w-48" />
              </div>
              
              <Button variant="outline" className="hidden md:flex">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleBatchGenerate}>
                <Upload className="w-4 h-4 mr-2" />
                批量生成
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    生成账单
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBill ? '编辑账单' : '生成新账单'}
                    </DialogTitle>
                    <DialogDescription>
                      请填写账单信息
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="elderName" render={({
                        field }) =>
                      <FormItem>
                              <FormLabel>老人姓名</FormLabel>
                              <FormControl>
                                <Input placeholder="请输入老人姓名" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        
                        <FormField control={form.control} name="month" render={({
                        field }) =>
                      <FormItem>
                              <FormLabel>账单月份</FormLabel>
                              <FormControl>
                                <Input type="month" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="bedFee" render={({
                        field }) =>
                      <FormItem>
                              <FormLabel>床位费</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="金额" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        
                        <FormField control={form.control} name="careFee" render={({
                        field }) =>
                      <FormItem>
                              <FormLabel>护理费</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="金额" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="mealFee" render={({
                        field }) =>
                      <FormItem>
                              <FormLabel>餐费</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="金额" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        
                        <FormField control={form.control} name="otherFee" render={({
                        field }) =>
                      <FormItem>
                              <FormLabel>其他费用</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="金额" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                      
                      <FormField control={form.control} name="dueDate" render={({
                      field }) =>
                    <FormItem>
                            <FormLabel>缴费截止日期</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          取消
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          {editingBill ? '更新账单' : '生成账单'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* 账单列表 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>老人姓名</TableHead>
                <TableHead>账单月份</TableHead>
                <TableHead>费用明细</TableHead>
                <TableHead>总金额</TableHead>
                <TableHead>缴费截止</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.elderName}</TableCell>
                  <TableCell>{bill.month}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {bill.items.map((item, index) => <div key={index} className="text-sm">
                          {item.name}: ¥{item.amount}
                        </div>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      
                      <span className="font-bold text-lg">¥{bill.totalAmount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <span className="text-sm">{bill.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(bill.status).color}>
                      {getStatusBadge(bill.status).label}
                    </Badge>
                    {bill.paymentDate && <div className="text-xs text-gray-500 mt-1">
                        缴费时间: {bill.paymentDate}
                      </div>}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(bill)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      {bill.status === 'unpaid' && <Button variant="outline" size="sm" onClick={() => handleMarkAsPaid(bill)} className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                          标记缴费
                        </Button>}
                      <Button variant="outline" size="sm" onClick={() => handleDelete(bill)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
          
          {filteredBills.length === 0 && <div className="text-center py-8 text-gray-500">
              暂无账单数据
            </div>}
        </Card>
      </div>
    </div>;
}