// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Filter, Plus, Edit, Trash2, User, Phone, MapPin, Calendar, ChevronLeft, ChevronRight, Eye, Menu } from 'lucide-react';
// @ts-ignore;
import { Card, Button, Input, Badge, Select, useToast } from '@/components/ui';

import AdminSidebar from '@/components/AdminSidebar';
export default function AdminResidents(props) {
  const {
    $w
  } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [residents, setResidents] = useState([{
    id: 1,
    name: '张爷爷',
    age: 78,
    gender: '男',
    room: '3楼301',
    phone: '138-0000-1234',
    careLevel: '二级护理',
    status: 'active',
    admissionDate: '2025-03-15',
    emergencyContact: '张先生（儿子）',
    emergencyPhone: '139-0000-5678',
    healthStatus: '良好',
    monthlyFee: 3500
  }, {
    id: 2,
    name: '李奶奶',
    age: 82,
    gender: '女',
    room: '2楼205',
    phone: '136-0000-5678',
    careLevel: '一级护理',
    status: 'active',
    admissionDate: '2025-01-20',
    emergencyContact: '李女士（女儿）',
    emergencyPhone: '137-0000-1234',
    healthStatus: '稳定',
    monthlyFee: 2800
  }, {
    id: 3,
    name: '王爷爷',
    age: 75,
    gender: '男',
    room: '4楼402',
    phone: '135-0000-9999',
    careLevel: '三级护理',
    status: 'leave',
    admissionDate: '2024-12-10',
    emergencyContact: '王女士（女儿）',
    emergencyPhone: '138-0000-7777',
    healthStatus: '需关注',
    monthlyFee: 4200
  }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const {
    toast
  } = useToast();
  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) || resident.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || resident.careLevel === filterLevel;
    const matchesStatus = filterStatus === 'all' || resident.status === filterStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });
  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResidents = filteredResidents.slice(startIndex, startIndex + itemsPerPage);
  const getStatusBadge = status => {
    const statusMap = {
      active: {
        label: '在院',
        color: 'bg-green-100 text-green-800'
      },
      leave: {
        label: '请假',
        color: 'bg-amber-100 text-amber-800'
      },
      inactive: {
        label: '离院',
        color: 'bg-gray-100 text-gray-800'
      }
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
  };
  const getCareLevelBadge = level => {
    const levelMap = {
      '一级护理': {
        color: 'bg-blue-100 text-blue-800'
      },
      '二级护理': {
        color: 'bg-amber-100 text-amber-800'
      },
      '三级护理': {
        color: 'bg-red-100 text-red-800'
      }
    };
    const levelInfo = levelMap[level] || levelMap['一级护理'];
    return <Badge className={levelInfo.color}>{level}</Badge>;
  };
  const handleViewDetails = residentId => {
    $w.utils.navigateTo({
      pageId: 'admin-resident-detail',
      params: {
        id: residentId
      }
    });
  };
  const handleEdit = residentId => {
    toast({
      title: '编辑住户',
      description: '正在打开编辑页面...'
    });
  };
  const handleDelete = residentId => {
    toast({
      title: '删除确认',
      description: '确定要删除该住户信息吗？',
      variant: 'destructive'
    });
  };
  return <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentPage="residents" $w={$w} />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800" style={{
              fontFamily: 'Space Mono, monospace'
            }}>
                住户管理
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type="text" placeholder="搜索住户姓名或房间号..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-64 border-gray-300 focus:border-amber-500 focus:ring-amber-500" />
              </div>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                新增住户
              </Button>
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <main className="flex-1 p-6">
          {/* 筛选栏 */}
          <Card className="bg-white p-4 mb-6 border-0 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">筛选：</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">护理等级：</label>
                <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:border-amber-500 focus:ring-amber-500">
                  <option value="all">全部</option>
                  <option value="一级护理">一级护理</option>
                  <option value="二级护理">二级护理</option>
                  <option value="三级护理">三级护理</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">状态：</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:border-amber-500 focus:ring-amber-500">
                  <option value="all">全部</option>
                  <option value="active">在院</option>
                  <option value="leave">请假</option>
                  <option value="inactive">离院</option>
                </select>
              </div>

              <div className="ml-auto text-sm text-gray-600">
                共 {filteredResidents.length} 位住户
              </div>
            </div>
          </Card>

          {/* 住户列表 */}
          <Card className="bg-white border-0 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      住户信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      房间号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      护理等级
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      联系电话
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      入住日期
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      月费用
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentResidents.map(resident => <tr key={resident.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                            <div className="text-sm text-gray-500">{resident.age}岁 · {resident.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{resident.room}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCareLevelBadge(resident.careLevel)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(resident.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{resident.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{resident.admissionDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">¥{resident.monthlyFee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleViewDetails(resident.id)} className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(resident.id)} className="text-amber-600 hover:text-amber-800">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(resident.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {totalPages > 1 && <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t">
                <div className="text-sm text-gray-700">
                  显示 {startIndex + 1} 到 {Math.min(startIndex + itemsPerPage, filteredResidents.length)} 条，共 {filteredResidents.length} 条
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="border-gray-300">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({
                  length: totalPages
                }, (_, i) => i + 1).map(page => <Button key={page} size="sm" variant={currentPage === page ? "default" : "outline"} onClick={() => setCurrentPage(page)} className={currentPage === page ? "bg-amber-600 hover:bg-amber-700" : "border-gray-300 hover:border-amber-300"}>
                        {page}
                      </Button>)}
                  </div>

                  <Button size="sm" variant="outline" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="border-gray-300">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>}
          </Card>
        </main>
      </div>
    </div>;
}