// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Plus, Edit, Trash2, User, Phone, MapPin, Heart, Calendar, Shield, Key } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Card, CardContent, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';

import { DemoBanner } from '@/components/DemoBanner';
export default function AdminElder(props) {
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
  const [elders, setElders] = useState([]);
  const [filteredElders, setFilteredElders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingElder, setEditingElder] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    roomNumber: '',
    careLevel: '',
    healthStatus: '',
    emergencyContact: '',
    emergencyPhone: '',
    primaryNurse: '',
    status: 'active'
  });

  // 护理等级选项
  const careLevels = ['一级护理', '二级护理', '三级护理', '特级护理'];
  const healthStatuses = ['良好', '一般', '需关注', '重点关注'];
  const statuses = [{
    value: 'active',
    label: '在院',
    color: 'bg-green-100 text-green-800'
  }, {
    value: 'inactive',
    label: '离院',
    color: 'bg-gray-100 text-gray-800'
  }];

  // 加载老人数据
  useEffect(() => {
    loadElders();
  }, []);

  // 搜索过滤
  useEffect(() => {
    if (searchTerm) {
      const filtered = elders.filter(elder => elder.name.toLowerCase().includes(searchTerm.toLowerCase()) || elder.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredElders(filtered);
    } else {
      setFilteredElders(elders);
    }
  }, [searchTerm, elders]);

  // 加载老人数据
  const loadElders = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: isDemo ? 'demo_elders' : 'elders',
        methodName: 'wedaGetRecordsV2',
        params: {
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
      if (result && result.records) {
        // 为没有验证码的老人自动生成验证码
        const eldersWithoutCode = result.records.filter(e => !e.verificationCode);
        if (eldersWithoutCode.length > 0) {
          for (const elder of eldersWithoutCode) {
            try {
              await props.$w.cloud.callDataSource({
                dataSourceName: isDemo ? 'demo_elders' : 'elders',
                methodName: 'wedaUpdateV2',
                params: {
                  filter: {
                    where: {
                      $and: [{
                        _id: {
                          $eq: elder._id
                        }
                      }]
                    }
                  },
                  data: {
                    verificationCode: generateVerificationCode(),
                    updatedAt: Date.now()
                  }
                }
              });
            } catch (e) {
              console.error('为老人生成验证码失败:', elder.name, e);
            }
          }
          // 重新加载以获取更新后的验证码
          const refreshedResult = await props.$w.cloud.callDataSource({
            dataSourceName: isDemo ? 'demo_elders' : 'elders',
            methodName: 'wedaGetRecordsV2',
            params: {
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
          setElders(refreshedResult?.records || result.records);
        } else {
          setElders(result.records);
        }
      } else {
        setElders([]);
        toast({
          title: '加载失败',
          description: '无法加载老人信息',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('加载老人数据失败:', error);
      toast({
        title: '加载失败',
        description: error.message || '网络错误，请重试',
        variant: 'destructive'
      });
    }
  };

  // 生成验证码
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // 添加老人
  const handleAddElder = async () => {
    if (!formData.name || !formData.age || !formData.roomNumber) {
      toast({
        title: '请填写完整信息',
        description: '姓名、年龄、房间号为必填项',
        variant: 'destructive'
      });
      return;
    }
    try {
      const newElder = {
        ...formData,
        age: parseInt(formData.age),
        verificationCode: generateVerificationCode(),
        admissionDate: new Date().toISOString().split('T')[0],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: isDemo ? 'demo_elders' : 'elders',
        methodName: 'wedaCreateV2',
        params: {
          data: newElder
        }
      });
      if (result) {
        toast({
          title: '添加成功',
          description: '老人信息已添加，验证码已生成'
        });
        setIsAddDialogOpen(false);
        resetForm();
        loadElders();
      } else {
        toast({
          title: '添加失败',
          description: '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '添加失败',
        description: '网络错误，请重试',
        variant: 'destructive'
      });
    }
  };

  // 编辑老人
  const handleEditElder = async () => {
    if (!formData.name || !formData.age || !formData.roomNumber) {
      toast({
        title: '请填写完整信息',
        description: '姓名、年龄、房间号为必填项',
        variant: 'destructive'
      });
      return;
    }
    try {
      const updatedElder = {
        ...formData,
        age: parseInt(formData.age),
        updatedAt: Date.now()
      };
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: isDemo ? 'demo_elders' : 'elders',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: editingElder._id
                }
              }]
            }
          },
          data: updatedElder
        }
      });
      if (result.success) {
        toast({
          title: '更新成功',
          description: '老人信息已更新'
        });
        setIsEditDialogOpen(false);
        setEditingElder(null);
        resetForm();
        loadElders();
      } else {
        toast({
          title: '更新失败',
          description: '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '更新失败',
        description: '网络错误，请重试',
        variant: 'destructive'
      });
    }
  };

  // 删除老人
  const handleDeleteElder = async elderId => {
    if (!confirm('确定要删除这位老人的信息吗？此操作不可恢复。')) {
      return;
    }
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: isDemo ? 'demo_elders' : 'elders',
        methodName: 'wedaDeleteV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: elderId
                }
              }]
            }
          }
        }
      });
      toast({
        title: '删除成功',
        description: '老人信息已删除'
      });
      loadElders();
    } catch (error) {
      toast({
        title: '删除失败',
        description: '网络错误，请重试',
        variant: 'destructive'
      });
    }
  };

  // 生成新验证码
  const handleGenerateCode = async elderId => {
    try {
      const newCode = generateVerificationCode();
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: isDemo ? 'demo_elders' : 'elders',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: elderId
                }
              }]
            }
          },
          data: {
            verificationCode: newCode,
            updatedAt: Date.now()
          }
        }
      });
      toast({
        title: '验证码已更新',
        description: `新的验证码：${newCode}`
      });
      loadElders();
    } catch (error) {
      toast({
        title: '更新失败',
        description: '网络错误，请重试',
        variant: 'destructive'
      });
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      roomNumber: '',
      careLevel: '',
      healthStatus: '',
      emergencyContact: '',
      emergencyPhone: '',
      primaryNurse: '',
      status: 'active'
    });
  };

  // 打开编辑对话框
  const openEditDialog = elder => {
    setEditingElder(elder);
    setFormData({
      name: elder.name,
      age: elder.age.toString(),
      roomNumber: elder.roomNumber,
      careLevel: elder.careLevel,
      healthStatus: elder.healthStatus,
      emergencyContact: elder.emergencyContact,
      emergencyPhone: elder.emergencyPhone,
      primaryNurse: elder.primaryNurse,
      status: elder.status
    });
    setIsEditDialogOpen(true);
  };

  // 获取状态样式
  const getStatusBadge = status => {
    const statusConfig = statuses.find(s => s.value === status);
    return statusConfig ? <Badge className={`${statusConfig.color} border-none`}>
        {statusConfig.label}
      </Badge> : null;
  };
  const handleExitDemo = () => {
    props.$w.utils.redirectTo({
      pageId: 'login',
      params: {}
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {isDemo && <DemoBanner role="admin" onBack={handleExitDemo} />}
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">老人管理</h1>
                <p className="text-sm text-gray-600">管理老人基本信息和验证码</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none">
                  <Plus className="w-4 h-4 mr-2" />
                  添加老人
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>添加新老人</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>姓名 *</Label>
                      <Input value={formData.name} onChange={e => setFormData({
                      ...formData,
                      name: e.target.value
                    })} placeholder="请输入老人姓名" />
                    </div>
                    <div>
                      <Label>年龄 *</Label>
                      <Input type="number" value={formData.age} onChange={e => setFormData({
                      ...formData,
                      age: e.target.value
                    })} placeholder="请输入年龄" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>房间号 *</Label>
                      <Input value={formData.roomNumber} onChange={e => setFormData({
                      ...formData,
                      roomNumber: e.target.value
                    })} placeholder="如：A栋 301室" />
                    </div>
                    <div>
                      <Label>护理等级</Label>
                      <Select value={formData.careLevel} onValueChange={value => setFormData({
                      ...formData,
                      careLevel: value
                    })}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择护理等级" />
                        </SelectTrigger>
                        <SelectContent>
                          {careLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>健康状态</Label>
                      <Select value={formData.healthStatus} onValueChange={value => setFormData({
                      ...formData,
                      healthStatus: value
                    })}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择健康状态" />
                        </SelectTrigger>
                        <SelectContent>
                          {healthStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>状态</Label>
                      <Select value={formData.status} onValueChange={value => setFormData({
                      ...formData,
                      status: value
                    })}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(status => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>紧急联系人</Label>
                    <Input value={formData.emergencyContact} onChange={e => setFormData({
                    ...formData,
                    emergencyContact: e.target.value
                  })} placeholder="请输入紧急联系人姓名" />
                  </div>
                  <div>
                    <Label>紧急联系电话</Label>
                    <Input value={formData.emergencyPhone} onChange={e => setFormData({
                    ...formData,
                    emergencyPhone: e.target.value
                  })} placeholder="请输入紧急联系电话" />
                  </div>
                  <div>
                    <Label>责任护士</Label>
                    <Input value={formData.primaryNurse} onChange={e => setFormData({
                    ...formData,
                    primaryNurse: e.target.value
                  })} placeholder="请输入责任护士姓名" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddElder} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none">
                    添加
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="搜索老人姓名或房间号..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            共 {filteredElders.length} 位老人
          </div>
        </div>

        {/* 老人列表 */}
        <div className="grid gap-4">
          {filteredElders.map(elder => <Card key={elder._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{elder.name}</h3>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(elder.status)}
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {elder.careLevel}
                          </Badge>
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            {elder.healthStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{elder.age}岁</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{elder.roomNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{elder.emergencyPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{elder.emergencyContact}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">责任护士：{elder.primaryNurse}</span>
                    </div>

                    {/* 验证码显示 */}
                    <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">绑定验证码</span>
                          {elder.verificationCode ? <span className="text-lg font-bold text-amber-900 tracking-widest">{elder.verificationCode}</span> : <span className="text-sm text-amber-500">未生成</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          {elder.verificationCode && <Button size="sm" variant="outline" onClick={() => {
                        navigator.clipboard.writeText(elder.verificationCode).then(() => {
                          toast({
                            title: '已复制',
                            description: `验证码 ${elder.verificationCode} 已复制到剪贴板`
                          });
                        }).catch(() => {
                          toast({
                            title: '复制失败',
                            description: '请手动复制验证码',
                            variant: 'destructive'
                          });
                        });
                      }} className="text-amber-600 border-amber-300 hover:bg-amber-100">
                              复制
                            </Button>}
                          <Button size="sm" variant="outline" onClick={() => handleGenerateCode(elder._id)} className="text-amber-600 border-amber-300 hover:bg-amber-100">
                            {elder.verificationCode ? '重新生成' : '生成验证码'}
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-amber-600 mt-1">将此验证码发给家属，家属输入后可绑定老人信息</p>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(elder)} className="text-blue-600 border-blue-300 hover:bg-blue-100">
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteElder(elder._id)} className="text-red-600 border-red-300 hover:bg-red-100">
                      <Trash2 className="w-4 h-4 mr-1" />
                      删除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {filteredElders.length === 0 && <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无老人信息</p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none">
              添加第一位老人
            </Button>
          </div>}
      </div>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑老人信息</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>姓名 *</Label>
                <Input value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} placeholder="请输入老人姓名" />
              </div>
              <div>
                <Label>年龄 *</Label>
                <Input type="number" value={formData.age} onChange={e => setFormData({
                ...formData,
                age: e.target.value
              })} placeholder="请输入年龄" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>房间号 *</Label>
                <Input value={formData.roomNumber} onChange={e => setFormData({
                ...formData,
                roomNumber: e.target.value
              })} placeholder="如：A栋 301室" />
              </div>
              <div>
                <Label>护理等级</Label>
                <Select value={formData.careLevel} onValueChange={value => setFormData({
                ...formData,
                careLevel: value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择护理等级" />
                  </SelectTrigger>
                  <SelectContent>
                    {careLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>健康状态</Label>
                <Select value={formData.healthStatus} onValueChange={value => setFormData({
                ...formData,
                healthStatus: value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择健康状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {healthStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>状态</Label>
                <Select value={formData.status} onValueChange={value => setFormData({
                ...formData,
                status: value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>紧急联系人</Label>
              <Input value={formData.emergencyContact} onChange={e => setFormData({
              ...formData,
              emergencyContact: e.target.value
            })} placeholder="请输入紧急联系人姓名" />
            </div>
            <div>
              <Label>紧急联系电话</Label>
              <Input value={formData.emergencyPhone} onChange={e => setFormData({
              ...formData,
              emergencyPhone: e.target.value
            })} placeholder="请输入紧急联系电话" />
            </div>
            <div>
              <Label>责任护士</Label>
              <Input value={formData.primaryNurse} onChange={e => setFormData({
              ...formData,
              primaryNurse: e.target.value
            })} placeholder="请输入责任护士姓名" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEditElder} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none">
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
}