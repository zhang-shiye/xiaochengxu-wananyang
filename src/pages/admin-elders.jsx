// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, useToast, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui';
// @ts-ignore;
import { Plus, Search, Edit, Trash2, Upload, Download, Filter } from 'lucide-react';

import { useForm } from 'react-hook-form';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminNavBar from '@/components/AdminNavBar';
export default function AdminElders(props) {
  const {
    toast
  } = useToast();
  const [elders, setElders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingElder, setEditingElder] = useState(null);
  const form = useForm({
    defaultValues: {
      name: '',
      age: '',
      roomNumber: '',
      careLevel: '',
      primaryNurse: '',
      emergencyContact: '',
      emergencyPhone: ''
    }
  });

  // 模拟老人数据
  useEffect(() => {
    setElders([{
      id: 1,
      name: '王奶奶',
      age: 78,
      roomNumber: 'A栋 301室',
      careLevel: '二级护理',
      primaryNurse: '张护士',
      emergencyContact: '张院长',
      emergencyPhone: '0551-8888-6666',
      status: 'active'
    }, {
      id: 2,
      name: '李爷爷',
      age: 82,
      roomNumber: 'B栋 205室',
      careLevel: '一级护理',
      primaryNurse: '王护士',
      emergencyContact: '李女士',
      emergencyPhone: '138-0000-1234',
      status: 'active'
    }, {
      id: 3,
      name: '陈奶奶',
      age: 75,
      roomNumber: 'C栋 102室',
      careLevel: '三级护理',
      primaryNurse: '刘护士',
      emergencyContact: '陈先生',
      emergencyPhone: '139-0000-5678',
      status: 'inactive'
    }]);
  }, []);
  const filteredElders = elders.filter(elder => elder.name.toLowerCase().includes(searchTerm.toLowerCase()) || elder.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()));
  const onSubmit = data => {
    if (editingElder) {
      // 编辑老人
      setElders(elders.map(elder => elder.id === editingElder.id ? {
        ...elder,
        ...data
      } : elder));
      toast({
        title: '更新成功',
        description: `已更新${data.name}的信息`
      });
    } else {
      // 添加老人
      const newElder = {
        id: elders.length + 1,
        ...data,
        status: 'active'
      };
      setElders([...elders, newElder]);
      toast({
        title: '添加成功',
        description: `已添加${data.name}到系统`
      });
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingElder(null);
  };
  const handleEdit = elder => {
    setEditingElder(elder);
    form.reset(elder);
    setIsDialogOpen(true);
  };
  const handleDelete = elder => {
    setElders(elders.filter(e => e.id !== elder.id));
    toast({
      title: '删除成功',
      description: `已删除${elder.name}的信息`
    });
  };
  const handleBatchUpload = () => {
    toast({
      title: '批量上传',
      description: '请使用数据导入功能批量上传老人信息'
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2" style={{
          fontFamily: 'Space Mono, monospace'
        }}>
            老人信息管理
          </h1>
          <p className="text-blue-600 text-lg" style={{
          fontFamily: 'IBM Plex Sans, sans-serif'
        }}>
            管理在院老人档案信息
          </p>
        </div>

        {/* 操作栏 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="搜索老人姓名或房间号..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-full md:w-64" />
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    添加老人
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingElder ? '编辑老人信息' : '添加新老人'}
                    </DialogTitle>
                    <DialogDescription>
                      请填写老人的基本信息
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField control={form.control} name="name" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>姓名</FormLabel>
                            <FormControl>
                              <Input placeholder="请输入老人姓名" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="age" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>年龄</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="年龄" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        
                        <FormField control={form.control} name="roomNumber" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>房间号</FormLabel>
                              <FormControl>
                                <Input placeholder="A栋 301室" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                      
                      <FormField control={form.control} name="careLevel" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>护理等级</FormLabel>
                            <FormControl>
                              <Input placeholder="一级护理" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="primaryNurse" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>责任护工</FormLabel>
                            <FormControl>
                              <Input placeholder="张护士" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="emergencyContact" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>紧急联系人</FormLabel>
                              <FormControl>
                                <Input placeholder="联系人姓名" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        
                        <FormField control={form.control} name="emergencyPhone" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>紧急联系电话</FormLabel>
                              <FormControl>
                                <Input placeholder="联系电话" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          取消
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          {editingElder ? '更新信息' : '添加老人'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* 老人列表 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>年龄</TableHead>
                <TableHead>房间号</TableHead>
                <TableHead>护理等级</TableHead>
                <TableHead>责任护工</TableHead>
                <TableHead>紧急联系人</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredElders.map(elder => <TableRow key={elder.id}>
                  <TableCell className="font-medium">{elder.name}</TableCell>
                  <TableCell>{elder.age}岁</TableCell>
                  <TableCell>{elder.roomNumber}</TableCell>
                  <TableCell>{elder.careLevel}</TableCell>
                  <TableCell>{elder.primaryNurse}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{elder.emergencyContact}</div>
                      <div className="text-sm text-gray-500">{elder.emergencyPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={elder.status === 'active' ? 'default' : 'secondary'}>
                      {elder.status === 'active' ? '在院' : '已出院'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(elder)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(elder)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
          
          {filteredElders.length === 0 && <div className="text-center py-8 text-gray-500">
              暂无老人数据
            </div>}
        </Card>
      </div>
    </div>
  );
}