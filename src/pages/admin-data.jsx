// @ts-ignore;
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Badge, useToast, Progress } from '@/components/ui';
// @ts-ignore;
import { Upload, Download, FileText, Database, AlertCircle, CheckCircle, Clock, FileSpreadsheet, Plus, Trash2, User, DollarSign, BookOpen, FileCheck } from 'lucide-react';

import { DemoBanner } from '@/components/DemoBanner';
export default function AdminDataImport(props) {
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
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('elder');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [importHistory, setImportHistory] = useState([{
    id: 1,
    type: 'elder',
    fileName: '老人信息模板.xlsx',
    status: 'completed',
    totalRecords: 50,
    successCount: 48,
    errorCount: 2,
    createdAt: '2026-04-10 14:30',
    duration: '2分15秒'
  }, {
    id: 2,
    type: 'bill',
    fileName: '4月缴费清单.xlsx',
    status: 'completed',
    totalRecords: 45,
    successCount: 45,
    errorCount: 0,
    createdAt: '2026-04-10 10:15',
    duration: '1分30秒'
  }]);

  // 导入类型配置
  const importTypes = {
    elder: {
      name: '老人信息',
      icon: User,
      description: '批量导入老人基本信息',
      templateFields: ['姓名', '年龄', '房间号', '护理等级', '健康状态', '紧急联系人', '紧急电话', '责任护士'],
      exampleData: [['王奶奶', '78', '101', '二级护理', '良好', '王大明', '13800138000', '张护士'], ['李爷爷', '82', '102', '一级护理', '一般', '李小明', '13900139000', '李护士']]
    },
    bill: {
      name: '缴费清单',
      icon: DollarSign,
      description: '批量导入月度缴费账单',
      templateFields: ['老人姓名', '老人ID', '月份', '缴费项目', '金额', '缴费期限', '状态'],
      exampleData: [['王奶奶', 'elder_001', '2026-04', '基础床位费', '1800', '2026-04-15', '未缴费'], ['王奶奶', 'elder_001', '2026-04', '护理费', '1200', '2026-04-15', '未缴费']]
    },
    daily: {
      name: '日报数据',
      icon: BookOpen,
      description: '批量导入日常护理日报',
      templateFields: ['老人姓名', '老人ID', '日期', '健康状态', '早餐', '午餐', '晚餐', '活动', '用药', '心情', '备注'],
      exampleData: [['王奶奶', 'elder_001', '2026-04-10', '良好', '小米粥、鸡蛋', '米饭、青菜、鱼肉', '面条、蔬菜', '晨练太极、看电视', '降压药', '愉快', '食欲良好'], ['李爷爷', 'elder_002', '2026-04-10', '一般', '豆浆、包子', '面条、鸡蛋', '稀饭、咸菜', '散步、休息', '维生素', '平静', '需要多休息']]
    },
    leave: {
      name: '请假记录',
      icon: FileCheck,
      description: '批量导入请假申请记录',
      templateFields: ['老人姓名', '老人ID', '申请日期', '开始时间', '结束时间', '请假原因', '申请人', '状态'],
      exampleData: [['王奶奶', 'elder_001', '2026-04-10', '2026-04-15 09:00', '2026-04-15 18:00', '家属探望', '王大明', '待审核'], ['李爷爷', 'elder_002', '2026-04-10', '2026-04-16 14:00', '2026-04-16 17:00', '医院检查', '李小明', '已批准']]
    }
  };

  // 处理文件拖拽
  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  // 处理文件上传
  const handleFileUpload = files => {
    const file = files[0];
    if (!file) return;

    // 验证文件类型
    const validTypes = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validTypes.includes(fileExtension)) {
      toast({
        title: '文件格式错误',
        description: '请上传 Excel (.xlsx, .xls) 或 CSV (.csv) 格式的文件',
        variant: 'destructive'
      });
      return;
    }

    // 验证文件大小（最大10MB）
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: '文件过大',
        description: '文件大小不能超过10MB',
        variant: 'destructive'
      });
      return;
    }

    // 开始上传
    startUpload(file);
  };

  // 开始上传处理
  const startUpload = file => {
    setIsUploading(true);
    setUploadProgress(0);

    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            completeUpload(file);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // 完成上传处理
  const completeUpload = async file => {
    setIsUploading(false);
    try {
      // 模拟Excel数据解析（实际项目中需要使用xlsx等库解析）
      const mockData = generateMockData(activeTab);
      const totalRecords = mockData.length;
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      // 根据不同类型导入到相应数据模型
      if (activeTab === 'elder') {
        // 导入老人数据
        for (const record of mockData) {
          try {
            await props.$w.cloud.callDataSource({
              dataSourceName: 'elders',
              methodName: 'wedaCreateV2',
              params: {
                data: {
                  name: record.name,
                  age: record.age,
                  gender: record.gender,
                  roomNumber: record.roomNumber,
                  careLevel: record.careLevel,
                  healthStatus: record.healthStatus,
                  admissionDate: record.admissionDate,
                  emergencyContact: record.emergencyContact,
                  emergencyPhone: record.emergencyPhone,
                  primaryNurse: record.primaryNurse,
                  verificationCode: String(Math.floor(100000 + Math.random() * 900000)),
                  status: 'active',
                  createdAt: Date.now(),
                  updatedAt: Date.now()
                }
              }
            });
            successCount++;
          } catch (error) {
            errorCount++;
            errors.push({
              record,
              error: error.message
            });
          }
        }
      } else if (activeTab === 'bill') {
        // 导入账单数据
        for (const record of mockData) {
          try {
            // 根据老人姓名查找老人ID
            const elderResult = await props.$w.cloud.callDataSource({
              dataSourceName: 'elders',
              methodName: 'wedaGetRecordsV2',
              params: {
                filter: {
                  where: {
                    $and: [{
                      name: {
                        $eq: record.name
                      }
                    }]
                  }
                },
                select: {
                  $master: true
                },
                pageSize: 1
              }
            });
            const elderId = elderResult.records && elderResult.records.length > 0 ? elderResult.records[0]._id : null;
            if (!elderId) {
              throw new Error('找不到对应的老人');
            }
            await props.$w.cloud.callDataSource({
              dataSourceName: 'bills',
              methodName: 'wedaCreateV2',
              params: {
                data: {
                  elderId: elderId,
                  elderName: record.name,
                  month: record.billDate ? record.billDate.substring(0, 7) : new Date().toISOString().substring(0, 7),
                  items: [{
                    name: record.type || '基础费用',
                    amount: parseFloat(record.amount),
                    unit: '月'
                  }],
                  totalAmount: parseFloat(record.amount),
                  dueDate: record.dueDate || '',
                  status: record.status || 'unpaid',
                  createdAt: Date.now(),
                  updatedAt: Date.now()
                }
              }
            });
            successCount++;
          } catch (error) {
            errorCount++;
            errors.push({
              record,
              error: error.message
            });
          }
        }
      } else if (activeTab === 'daily') {
        // 导入日报数据
        for (const record of mockData) {
          try {
            // 根据老人姓名查找老人ID
            const elderResult = await props.$w.cloud.callDataSource({
              dataSourceName: 'elders',
              methodName: 'wedaGetRecordsV2',
              params: {
                filter: {
                  where: {
                    $and: [{
                      name: {
                        $eq: record.name
                      }
                    }]
                  }
                },
                select: {
                  $master: true
                },
                pageSize: 1
              }
            });
            const elderId = elderResult.records && elderResult.records.length > 0 ? elderResult.records[0]._id : null;
            if (!elderId) {
              throw new Error('找不到对应的老人');
            }
            await props.$w.cloud.callDataSource({
              dataSourceName: 'daily_reports',
              methodName: 'wedaCreateV2',
              params: {
                data: {
                  elderId: elderId,
                  elderName: record.name,
                  date: record.date,
                  healthStatus: record.healthStatus,
                  breakfast: record.breakfast,
                  lunch: record.lunch,
                  dinner: record.dinner,
                  activities: record.activities,
                  medications: record.medications,
                  mood: record.mood,
                  notes: record.notes || '',
                  status: 'pending',
                  createdAt: Date.now(),
                  updatedAt: Date.now()
                }
              }
            });
            successCount++;
          } catch (error) {
            errorCount++;
            errors.push({
              record,
              error: error.message
            });
          }
        }
      } else if (activeTab === 'leave') {
        // 导入请假记录
        for (const record of mockData) {
          try {
            // 根据老人姓名查找老人ID
            const elderResult = await props.$w.cloud.callDataSource({
              dataSourceName: 'elders',
              methodName: 'wedaGetRecordsV2',
              params: {
                filter: {
                  where: {
                    $and: [{
                      name: {
                        $eq: record.name
                      }
                    }]
                  }
                },
                select: {
                  $master: true
                },
                pageSize: 1
              }
            });
            const elderId = elderResult.records && elderResult.records.length > 0 ? elderResult.records[0]._id : null;
            if (!elderId) {
              throw new Error('找不到对应的老人');
            }
            await props.$w.cloud.callDataSource({
              dataSourceName: 'leave_requests',
              methodName: 'wedaCreateV2',
              params: {
                data: {
                  elderId: elderId,
                  elderName: record.name,
                  familyId: record.applicant || '',
                  familyName: record.applicant || '',
                  startDate: record.startDate,
                  endDate: record.endDate,
                  reason: record.reason,
                  status: record.status || 'pending',
                  createdAt: Date.now(),
                  updatedAt: Date.now()
                }
              }
            });
            successCount++;
          } catch (error) {
            errorCount++;
            errors.push({
              record,
              error: error.message
            });
          }
        }
      }

      // 创建新的导入记录
      const newImport = {
        id: Date.now(),
        type: activeTab,
        fileName: file.name,
        status: errorCount > 0 ? 'partial' : 'completed',
        totalRecords,
        successCount,
        errorCount,
        errors: errorCount > 0 ? errors : undefined,
        createdAt: new Date().toLocaleString('zh-CN'),
        duration: `${Math.floor(Math.random() * 3) + 1}分${Math.floor(Math.random() * 60)}秒`
      };
      setImportHistory(prev => [newImport, ...prev]);

      // 显示导入结果
      if (errorCount === 0) {
        toast({
          title: '导入成功',
          description: `成功导入 ${successCount} 条${importTypes[activeTab].name}记录`
        });
      } else {
        toast({
          title: '导入完成',
          description: `成功导入 ${successCount} 条，失败 ${errorCount} 条${importTypes[activeTab].name}记录`,
          variant: 'default'
        });
      }
      setUploadProgress(0);
    } catch (error) {
      console.error('导入失败:', error);
      toast({
        title: '导入失败',
        description: error.message,
        variant: 'destructive'
      });
      setUploadProgress(0);
    }
  };

  // 生成模拟数据（实际项目中需要解析Excel文件）
  const generateMockData = type => {
    const elderNames = ['王奶奶', '李爷爷', '张奶奶', '刘爷爷', '赵奶奶', '陈爷爷', '周奶奶', '吴爷爷'];
    const randomName = () => elderNames[Math.floor(Math.random() * elderNames.length)];
    const randomId = () => `elder_${Math.floor(Math.random() * 1000)}`;
    const today = new Date();
    const formatDate = date => date.toISOString().split('T')[0];
    const formatDateTime = date => date.toISOString().slice(0, 16).replace('T', ' ');
    if (type === 'elder') {
      return [{
        name: randomName(),
        age: Math.floor(Math.random() * 20) + 70,
        gender: '女',
        roomNumber: `A栋 ${Math.floor(Math.random() * 9) + 1}0${Math.floor(Math.random() * 9) + 1}室`,
        careLevel: ['一级护理', '二级护理', '三级护理'][Math.floor(Math.random() * 3)],
        healthStatus: ['良好', '一般', '需关注'][Math.floor(Math.random() * 3)],
        admissionDate: formatDate(new Date(today.getFullYear() - Math.floor(Math.random() * 2), today.getMonth(), today.getDate())),
        emergencyContact: '张院长',
        emergencyPhone: '0551-8888-6666',
        primaryNurse: '张护士'
      }];
    } else if (type === 'bill') {
      return [{
        name: randomName(),
        type: '基础床位费',
        amount: (Math.floor(Math.random() * 5) + 2) * 600,
        billDate: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
        dueDate: formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 15)),
        status: '未缴费'
      }];
    } else if (type === 'daily') {
      return [{
        name: randomName(),
        date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - Math.floor(Math.random() * 5))),
        healthStatus: '良好',
        breakfast: '小米粥、鸡蛋',
        lunch: '米饭、青菜、鱼肉',
        dinner: '面条、蔬菜',
        activities: '晨练太极、看电视',
        medications: '降压药',
        mood: '愉快',
        notes: '食欲良好'
      }];
    } else if (type === 'leave') {
      return [{
        name: randomName(),
        applicationDate: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - Math.floor(Math.random() * 3))),
        startDate: formatDateTime(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 0)),
        endDate: formatDateTime(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 18, 0)),
        reason: '家属探望',
        applicant: '家属',
        status: '待审核'
      }];
    }
    return [];
  };

  // 下载模板
  const downloadTemplate = () => {
    const currentType = importTypes[activeTab];

    // 创建CSV内容
    let csvContent = '\uFEFF' + currentType.templateFields.join(',') + '\n';
    currentType.exampleData.forEach(row => {
      csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });

    // 创建下载链接
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${currentType.name}导入模板.csv`;
    link.click();
    toast({
      title: '模板下载成功',
      description: `${currentType.name}导入模板已下载`
    });
  };

  // 获取状态颜色
  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'partial':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // 获取状态文本
  const getStatusText = status => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'partial':
        return '部分完成';
      case 'failed':
        return '失败';
      case 'processing':
        return '处理中';
      default:
        return '未知';
    }
  };

  // 获取类型图标
  const getTypeIcon = type => {
    const IconComponent = importTypes[type]?.icon || FileText;
    return <IconComponent className="w-4 h-4" />;
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
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-amber-600" />
              <h1 className="text-xl font-bold text-gray-800" style={{
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
                数据导入管理
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => props.$w.utils.navigateBack()} className="text-gray-600 hover:text-gray-800">
              返回
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 导入类型选择 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              选择导入类型
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(importTypes).map(([key, type]) => {
              const IconComponent = type.icon;
              return <div key={key} onClick={() => setActiveTab(key)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${activeTab === key ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
                    <IconComponent className={`w-8 h-8 mb-3 ${activeTab === key ? 'text-amber-600' : 'text-gray-500'}`} />
                    <h3 className="font-semibold text-gray-800 mb-1">{type.name}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>;
            })}
            </div>
          </div>
        </Card>

        {/* 当前选中类型的导入区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：导入区域 */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  {getTypeIcon(activeTab)}
                  {importTypes[activeTab].name}导入
                </h2>
                <Button variant="outline" size="sm" onClick={downloadTemplate} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  下载模板
                </Button>
              </div>

              {/* 文件上传区域 */}
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-gray-400'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  拖拽文件到此处上传
                </h3>
                <p className="text-gray-600 mb-4">
                  支持 Excel (.xlsx, .xls) 和 CSV (.csv) 格式
                </p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="mb-4">
                  选择文件
                </Button>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={e => handleFileUpload(Array.from(e.target.files))} className="hidden" />
                <p className="text-sm text-gray-500">
                  文件大小不超过 10MB
                </p>
              </div>

              {/* 上传进度 */}
              {isUploading && <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">上传进度</span>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>}

              {/* 模板字段说明 */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">模板字段说明</h4>
                <div className="space-y-2">
                  {importTypes[activeTab].templateFields.map((field, index) => <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <span>{field}</span>
                    </div>)}
                </div>
              </div>
            </div>
          </Card>

          {/* 右侧：导入历史 */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                导入历史
              </h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {importHistory.length === 0 ? <div className="text-center py-8">
                    <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">暂无导入记录</p>
                  </div> : importHistory.map(item => <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(item.type)}
                          <div>
                            <h4 className="font-semibold text-gray-800">{item.fileName}</h4>
                            <p className="text-sm text-gray-600">{item.createdAt}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-gray-800">{item.totalRecords}</p>
                          <p className="text-xs text-gray-600">总记录</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-green-600">{item.successCount}</p>
                          <p className="text-xs text-gray-600">成功</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-red-600">{item.errorCount}</p>
                          <p className="text-xs text-gray-600">失败</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">耗时: {item.duration}</span>
                        {item.errorCount > 0 && <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            查看错误
                          </Button>}
                      </div>
                    </div>)}
              </div>
            </div>
          </Card>
        </div>

        {/* 导入统计 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl mt-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-600" />
              导入统计
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">156</h3>
                <p className="text-sm text-gray-600">总导入次数</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">4,892</h3>
                <p className="text-sm text-gray-600">成功记录</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">23</h3>
                <p className="text-sm text-gray-600">失败记录</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">98.5%</h3>
                <p className="text-sm text-gray-600">成功率</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>;
}