// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, User, Phone, MapPin, Calendar, Shield, RefreshCw, Plus, Edit, Trash2 } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

export default function AdminElder(props) {
  const {
    toast
  } = useToast();
  const [elders, setElders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedElder, setSelectedElder] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    roomNumber: '',
    careLevel: '',
    healthStatus: '',
    emergencyContact: '',
    emergencyPhone: '',
    primaryNurse: ''
  });
  useEffect(() => {
    // 角色检查
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      // 未登录，跳转到登录页
      props.$w.utils.navigateTo({
        pageId: 'login',
        params: {}
      });
      return;
    }
    if (userRole === 'family') {
      // 是家属角色，跳转到家属端
      props.$w.utils.navigateTo({
        pageId: 'care-home',
        params: {}
      });
      return;
    }
    fetchElders();
  }, []);

  // 获取老人列表
  const fetchElders = async () => {
    try {
      setLoading(true);
      const result = await props.$w.cloud.callFunction({
        name: 'getElders',
        data: {}
      });
      if (result.success) {
        setElders(result.data);
      } else {
        toast({
          title: '获取数据失败',
          description: result.error || '请稍后重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('获取老人列表失败:', error);
      toast({
        title: '获取数据失败',
        description: '网络连接异常',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 生成验证码
  const generateVerificationCode = async elderId => {
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const result = await props.$w.cloud.callFunction({
        name: 'updateElderVerificationCode',
        data: {
          elderId,
          verificationCode: code
        }
      });
      if (result.success) {
        toast({
          title: '验证码生成成功',
          description: `新验证码：${code}`
        });
        fetchElders();
      } else {
        toast({
          title: '生成失败',
          description: result.error || '请稍后重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('生成验证码失败:', error);
      toast({
        title: '生成失败',
        description: '网络连接异常',
        variant: 'destructive'
      });
    }
  };

  // 添加老人
  const handleAddElder = async () => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'addElder',
        data: {
          ...formData,
          admissionDate: new Date().toISOString().split('T')[0],
          status: 'active'
        }
      });
      if (result.success) {
        toast({
          title: '添加成功',
          description: '老人信息已添加'
        });
        setShowAddForm(false);
        resetForm();
        fetchElders();
      } else {
        toast({
          title: '添加失败',
          description: result.error || '请检查输入信息',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('添加老人失败:', error);
      toast({
        title: '添加失败',
        description: '网络连接异常',
        variant: 'destructive'
      });
    }
  };

  // 编辑老人
  const handleEditElder = async () => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'updateElder',
        data: {
          elderId: selectedElder._id,
          ...formData
        }
      });
      if (result.success) {
        toast({
          title: '更新成功',
          description: '老人信息已更新'
        });
        setShowEditForm(false);
        setSelectedElder(null);
        resetForm();
        fetchElders();
      } else {
        toast({
          title: '更新失败',
          description: result.error || '请检查输入信息',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('更新老人失败:', error);
      toast({
        title: '更新失败',
        description: '网络连接异常',
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
      primaryNurse: ''
    });
  };

  // 打开编辑表单
  const openEditForm = elder => {
    setSelectedElder(elder);
    setFormData({
      name: elder.name,
      age: elder.age.toString(),
      roomNumber: elder.roomNumber,
      careLevel: elder.careLevel,
      healthStatus: elder.healthStatus,
      emergencyContact: elder.emergencyContact,
      emergencyPhone: elder.emergencyPhone,
      primaryNurse: elder.primaryNurse
    });
    setShowEditForm(true);
  };

  // 筛选老人
  const filteredElders = elders.filter(elder => elder.name.toLowerCase().includes(searchTerm.toLowerCase()) || elder.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()));
  useEffect(() => {
    fetchElders();
  }, []);
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">老人管理</h1>
            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              添加老人
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 搜索栏 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="搜索老人姓名或房间号..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>

        {/* 老人列表 */}
        {loading ? <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div> : <div className="grid gap-4">
            {filteredElders.map(elder => <div key={elder._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{elder.name}</h3>
                        <p className="text-sm text-gray-500">{elder.age}岁 · {elder.careLevel}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${elder.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {elder.status === 'active' ? '在院' : '离院'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span>{elder.roomNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-500" />
                        <span>{elder.emergencyPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span>入住：{elder.admissionDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-500" />
                        <span>护理：{elder.primaryNurse}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">今日验证码</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-mono font-bold text-orange-600">{elder.verificationCode || '未生成'}</span>
                          <button onClick={() => generateVerificationCode(elder._id)} className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors">
                            <RefreshCw className="w-3 h-3" />
                            生成
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => openEditForm(elder)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">
                      <Edit className="w-3 h-3" />
                      编辑
                    </button>
                    <button onClick={() => generateVerificationCode(elder._id)} className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors">
                      <RefreshCw className="w-3 h-3" />
                      验证码
                    </button>
                  </div>
                </div>
              </div>)}
          </div>}

        {filteredElders.length === 0 && !loading && <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无老人信息</p>
          </div>}
      </div>

      {/* 添加老人表单 */}
      {showAddForm && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">添加老人信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="请输入老人姓名" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({
                ...formData,
                age: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="请输入年龄" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">房间号</label>
                  <input type="text" value={formData.roomNumber} onChange={e => setFormData({
                ...formData,
                roomNumber: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="如：A栋 301室" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">护理等级</label>
                  <select value={formData.careLevel} onChange={e => setFormData({
                ...formData,
                careLevel: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">请选择护理等级</option>
                    <option value="一级护理">一级护理</option>
                    <option value="二级护理">二级护理</option>
                    <option value="三级护理">三级护理</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">健康状况</label>
                  <input type="text" value={formData.healthStatus} onChange={e => setFormData({
                ...formData,
                healthStatus: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="如：良好、一般等" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">紧急联系人</label>
                  <input type="text" value={formData.emergencyContact} onChange={e => setFormData({
                ...formData,
                emergencyContact: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="请输入紧急联系人姓名" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">紧急联系电话</label>
                  <input type="text" value={formData.emergencyPhone} onChange={e => setFormData({
                ...formData,
                emergencyPhone: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="请输入联系电话" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">责任护士</label>
                  <input type="text" value={formData.primaryNurse} onChange={e => setFormData({
                ...formData,
                primaryNurse: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="请输入责任护士姓名" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => {
              setShowAddForm(false);
              resetForm();
            }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  取消
                </button>
                <button onClick={handleAddElder} className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>}

      {/* 编辑老人表单 */}
      {showEditForm && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">编辑老人信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({
                ...formData,
                age: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">房间号</label>
                  <input type="text" value={formData.roomNumber} onChange={e => setFormData({
                ...formData,
                roomNumber: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">护理等级</label>
                  <select value={formData.careLevel} onChange={e => setFormData({
                ...formData,
                careLevel: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">请选择护理等级</option>
                    <option value="一级护理">一级护理</option>
                    <option value="二级护理">二级护理</option>
                    <option value="三级护理">三级护理</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">健康状况</label>
                  <input type="text" value={formData.healthStatus} onChange={e => setFormData({
                ...formData,
                healthStatus: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">紧急联系人</label>
                  <input type="text" value={formData.emergencyContact} onChange={e => setFormData({
                ...formData,
                emergencyContact: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">紧急联系电话</label>
                  <input type="text" value={formData.emergencyPhone} onChange={e => setFormData({
                ...formData,
                emergencyPhone: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">责任护士</label>
                  <input type="text" value={formData.primaryNurse} onChange={e => setFormData({
                ...formData,
                primaryNurse: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => {
              setShowEditForm(false);
              setSelectedElder(null);
              resetForm();
            }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  取消
                </button>
                <button onClick={handleEditElder} className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                  更新
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
}