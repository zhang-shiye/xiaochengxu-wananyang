// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, useToast, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Textarea } from '@/components/ui';
// @ts-ignore;
import { Plus, Search, Edit, Trash2, Upload, Download, Calendar, Filter } from 'lucide-react';

import { useForm } from 'react-hook-form';
export default function AdminReports(props) {
  const {
    toast
  } = useToast();
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const form = useForm({
    defaultValues: {
      elderName: '',
      date: new Date().toISOString().split('T')[0],
      breakfast: '',
      lunch: '',
      dinner: '',
      medications: '',
      activities: '',
      mood: '良好',
      notes: ''
    }
  });

  // 模拟护理日报数据
  useEffect(() => {
    setReports([{
      id: 1,
      elderName: '王奶奶',
      date: '2026-04-05',
      breakfast: '小米粥、鸡蛋、青菜',
      lunch: '红烧鱼、米饭、冬瓜汤',
      dinner: '面条、青菜、豆腐',
      medications: '降压药(8:00)、维生素(12:00)',
      activities: '晨练太极、午休、看电视',
      mood: '愉快',
      notes: '食欲良好，精神状态不错',
      status: 'completed'
    }, {
      id: 2,
      elderName: '李爷爷',
      date: '2026-04-05',
      breakfast: '豆浆、油条、小菜',
      lunch: '红烧肉、米饭、青菜',
      dinner: '粥、包子、咸菜',
      medications: '降糖药(7:00)、降压药(19:00)',
      activities: '散步、下棋、听音乐',
      mood: '平静',
      notes: '血糖稳定，按时服药',
      status: 'completed'
    }, {
      id: 3,
      elderName: '陈奶奶',
      date: '2026-04-05',
      breakfast: '',
      lunch: '',
      dinner: '',
      medications: '',
      activities: '',
      mood: '',
      notes: '',
      status: 'pending'
    }]);
  }, []);
  const filteredReports = reports.filter(report => report.elderName.toLowerCase().includes(searchTerm.toLowerCase()) && report.date.includes(selectedDate));
  const onSubmit = data => {
    if (editingReport) {
      // 编辑日报
      setReports(reports.map(report => report.id === editingReport.id ? {
        ...report,
        ...data
      } : report));
      toast({
        title: '更新成功',
        description: `已更新${data.elderName}的日报`
      });
    } else {
      // 添加日报
      const newReport = {
        id: reports.length + 1,
        ...data,
        status: 'completed'
      };
      setReports([...reports, newReport]);
      toast({
        title: '添加成功',
        description: `已为${data.elderName}添加日报`
      });
    }
    setIsDialogOpen(false);
    form.reset({
      elderName: '',
      date: new Date().toISOString().split('T')[0],
      breakfast: '',
      lunch: '',
      dinner: '',
      medications: '',
      activities: '',
      mood: '良好',
      notes: ''
    });
    setEditingReport(null);
  };
  const handleEdit = report => {
    setEditingReport(report);
    form.reset(report);
    setIsDialogOpen(true);
  };
  const handleDelete = report => {
    setReports(reports.filter(r => r.id !== report.id));
    toast({
      title: '删除成功',
      description: `已删除${report.elderName}的日报`
    });
  };
  const handleBatchUpload = () => {
    toast({
      title: '批量上传',
      description: '请使用数据导入功能批量上传护理日报'
    });
  };
  const handleBatchComplete = () => {
    const pendingReports = reports.filter(r => r.status === 'pending');
    if (pendingReports.length === 0) {
      toast({
        title: '操作完成',
        description: '没有待完成的日报'
      });
      return;
    }
    setReports(reports.map(report => report.status === 'pending' ? {
      ...report,
      status: 'completed'
    } : report));
    toast({
      title: '批量完成',
      description: `已标记${pendingReports.length}份日报为已完成`
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2" style={{
          fontFamily: 'Space Mono, monospace'
        }}>
            护理日报管理
          </h1>
          <p className="text-blue-600 text-lg" style={{
          fontFamily: 'IBM Plex Sans, sans-serif'
        }}>
            管理老人日常护理记录
          </p>
        </div>

        {/* 操作栏 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="搜索老人姓名..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-full md:w-64" />
              </div>
              
              <div className="relative flex-1 md:flex-none">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="pl-10 w-full md:w-48" />
              </div>
              
              <Button variant="outline" className="hidden md:flex">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleBatchUpload}>
                <Upload className="w-4 h-4 mr-2" />
                批量导入
              </Button>
              <Button variant="outline" onClick={handleBatchComplete}>
                <Calendar className="w-4 h-4 mr-2" />
                批量完成
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    添加日报
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingReport ? '编辑护理日报' : '添加护理日报'}
                    </DialogTitle>
                    <DialogDescription>
                      请填写老人的日常护理记录
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="elderName" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>老人姓名</FormLabel>
                              <FormControl>
                                <Input placeholder="请输入老人姓名" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        
                        <FormField control={form.control} name="date" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>日期</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                      
                      <FormField control={form.control} name="breakfast" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>早餐</FormLabel>
                            <FormControl>
                              <Input placeholder="早餐内容" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="lunch" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>午餐</FormLabel>
                            <FormControl>
                              <Input placeholder="午餐内容" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="dinner" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>晚餐</FormLabel>
                            <FormControl>
                              <Input placeholder="晚餐内容" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="medications" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>用药记录</FormLabel>
                            <FormControl>
                              <Textarea placeholder="用药名称、时间、剂量" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="activities" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>活动记录</FormLabel>
                            <FormControl>
                              <Textarea placeholder="日常活动内容" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="mood" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>心情状态</FormLabel>
                            <FormControl>
                              <Input placeholder="心情状态" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="notes" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>备注</FormLabel>
                            <FormControl>
                              <Textarea placeholder="其他需要记录的事项" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          取消
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          {editingReport ? '更新日报' : '添加日报'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* 日报列表 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>老人姓名</TableHead>
                <TableHead>日期</TableHead>
                <TableHead>饮食记录</TableHead>
                <TableHead>用药记录</TableHead>
                <TableHead>活动记录</TableHead>
                <TableHead>心情状态</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map(report => <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.elderName}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm"><strong>早:</strong> {report.breakfast || '-'}</div>
                      <div className="text-sm"><strong>午:</strong> {report.lunch || '-'}</div>
                      <div className="text-sm"><strong>晚:</strong> {report.dinner || '-'}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm">{report.medications || '-'}</div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm">{report.activities || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.mood || '-'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                      {report.status === 'completed' ? '已完成' : '待完成'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(report)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(report)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
          
          {filteredReports.length === 0 && <div className="text-center py-8 text-gray-500">
              暂无护理日报数据
            </div>}
        </Card>
      </div>
    </div>;
}