// @ts-ignore;
import React, { useState, useRef } from 'react';
// @ts-ignore;
import { useToast, Button, Card, Input, Label, Textarea, Badge, Progress } from '@/components/ui';
// @ts-ignore;
import { Upload, Download, FileSpreadsheet, Eye, CheckCircle, XCircle, Clock, FileText, Trash2, RefreshCw } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
export default function AdminDataImport(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('data-import');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importTasks, setImportTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const dragRef = useRef(null);

  // 加载导入任务历史
  const loadImportTasks = async () => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'getImportTasks',
        data: {
          limit: 10,
          offset: 0
        }
      });
      if (result.success) {
        setImportTasks(result.data || []);
      }
    } catch (error) {
      console.error('加载导入任务失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 文件上传处理
  const handleFileUpload = async file => {
    if (!file) return;
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // .xlsx
    'application/vnd.ms-excel',
    // .xls
    'text/csv' // .csv
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: '文件格式错误',
        description: '请上传 Excel (.xlsx, .xls) 或 CSV (.csv) 文件',
        variant: 'destructive'
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB 限制
      toast({
        title: '文件过大',
        description: '文件大小不能超过 10MB',
        variant: 'destructive'
      });
      return;
    }
    setIsUploading(true);
    setUploadedFile(file);
    try {
      // 上传到云存储
      const cloudInstance = await props.$w.cloud.getCloudInstance();
      const uploadResult = await cloudInstance.uploadFile({
        cloudPath: `import-files/${Date.now()}_${file.name}`,
        filePath: file
      });

      // 调用解析接口
      const parseResult = await props.$w.cloud.callFunction({
        name: 'parseImportFile',
        data: {
          fileId: uploadResult.fileID,
          fileName: file.name,
          fileType: file.type
        }
      });
      if (parseResult.success) {
        setPreviewData(parseResult.data.preview || []);
        setIsPreviewMode(true);
        toast({
          title: '文件解析成功',
          description: `成功解析 ${parseResult.data.totalRows} 行数据，预览前5行`
        });
      } else {
        throw new Error(parseResult.error || '文件解析失败');
      }
    } catch (error) {
      console.error('文件处理失败:', error);
      toast({
        title: '文件处理失败',
        description: error.message || '请检查文件格式和内容',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 拖拽上传处理
  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    if (dragRef.current) {
      dragRef.current.classList.add('border-amber-400', 'bg-amber-50');
    }
  };
  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    if (dragRef.current) {
      dragRef.current.classList.remove('border-amber-400', 'bg-amber-50');
    }
  };
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    if (dragRef.current) {
      dragRef.current.classList.remove('border-amber-400', 'bg-amber-50');
    }
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // 文件选择处理
  const handleFileSelect = e => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // 下载模板
  const downloadTemplate = async () => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'getImportTemplate'
      });
      if (result.success && result.data.url) {
        // 下载模板文件
        const link = document.createElement('a');
        link.href = result.data.url;
        link.download = '数据导入模板.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: '模板下载成功',
          description: '请按照模板格式准备数据文件'
        });
      }
    } catch (error) {
      console.error('下载模板失败:', error);
      toast({
        title: '下载失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    }
  };

  // 确认导入
  const handleImport = async () => {
    if (!uploadedFile) return;
    setIsImporting(true);
    setImportProgress(0);
    try {
      // 创建导入任务
      const createResult = await props.$w.cloud.callFunction({
        name: 'createImportTask',
        data: {
          fileName: uploadedFile.name,
          fileType: uploadedFile.type,
          totalRows: previewData.length
        }
      });
      if (createResult.success) {
        const taskId = createResult.data.taskId;

        // 执行导入
        const importResult = await props.$w.cloud.callFunction({
          name: 'executeImport',
          data: {
            taskId: taskId,
            previewData: previewData
          }
        });
        if (importResult.success) {
          setImportProgress(100);
          toast({
            title: '导入成功',
            description: `成功导入 ${importResult.data.importedCount} 条数据`
          });

          // 重置状态
          setTimeout(() => {
            setUploadedFile(null);
            setPreviewData([]);
            setIsPreviewMode(false);
            setIsImporting(false);
            setImportProgress(0);
            loadImportTasks(); // 刷新任务列表
          }, 2000);
        } else {
          throw new Error(importResult.error || '导入失败');
        }
      }
    } catch (error) {
      console.error('导入失败:', error);
      toast({
        title: '导入失败',
        description: error.message || '请检查数据格式后重试',
        variant: 'destructive'
      });
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  // 清除上传
  const clearUpload = () => {
    setUploadedFile(null);
    setPreviewData([]);
    setIsPreviewMode(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 获取状态图标
  const getStatusIcon = status => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // 获取状态文本
  const getStatusText = status => {
    switch (status) {
      case 'completed':
        return '导入成功';
      case 'failed':
        return '导入失败';
      case 'processing':
        return '导入中';
      default:
        return '待处理';
    }
  };

  // 初始化加载
  useState(() => {
    loadImportTasks();
  }, []);
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">数据导入</h1>
          <p className="text-gray-600 mt-1">批量导入老人信息、费用项目、日报等数据</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 操作区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 上传区域 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">上传数据文件</h2>
              <Button variant="outline" size="sm" onClick={downloadTemplate} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                下载模板
              </Button>
            </div>

            {/* 拖拽上传区域 */}
            <div ref={dragRef} className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isUploading ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {isUploading ? '正在上传和解析文件...' : '拖拽文件到此处或'}
              </p>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="mb-2">
                选择文件
              </Button>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" />
              <p className="text-xs text-gray-500">
                支持 Excel (.xlsx, .xls) 和 CSV (.csv) 格式，最大 10MB
              </p>
            </div>

            {/* 已上传文件信息 */}
            {uploadedFile && <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-900">{uploadedFile.name}</span>
                    <Badge variant="secondary">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearUpload} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>}
          </Card>

          {/* 导入历史 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">导入历史</h2>
            {loading ? <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 text-amber-600 animate-spin" />
              </div> : importTasks.length === 0 ? <p className="text-gray-500 text-center py-4">暂无导入记录</p> : <div className="space-y-3">
                {importTasks.map(task => <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.fileName}</p>
                        <p className="text-xs text-gray-500">{getStatusText(task.status)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {task.status === 'completed' && task.result && <Badge variant="outline" className="text-green-600">
                          {task.result.importedCount} 条
                        </Badge>}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(task.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>)}
              </div>}
          </Card>
        </div>

        {/* 数据预览 */}
        {isPreviewMode && previewData.length > 0 && <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">数据预览</h2>
              <Badge variant="secondary">预览前5行，共 {previewData.length} 行数据</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {Object.keys(previewData[0] || {}).map(key => <th key={key} className="text-left p-2 font-medium text-gray-900">
                        {key}
                      </th>)}
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 5).map((row, index) => <tr key={index} className="border-b hover:bg-gray-50">
                      {Object.values(row).map((value, cellIndex) => <td key={cellIndex} className="p-2 text-gray-700">
                          {String(value)}
                        </td>)}
                    </tr>)}
                </tbody>
              </table>
            </div>

            {/* 导入进度 */}
            {isImporting && <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">正在导入数据...</span>
                  <span className="text-sm text-gray-600">{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="h-2" />
              </div>}

            {/* 操作按钮 */}
            <div className="flex gap-3 mt-4">
              <Button onClick={handleImport} disabled={isImporting} className="flex-1 bg-amber-600 hover:bg-amber-700">
                {isImporting ? <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    导入中...
                  </> : <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    确认导入
                  </>}
              </Button>
              <Button variant="outline" onClick={clearUpload} disabled={isImporting}>
                重新选择
              </Button>
            </div>
          </Card>}

        {/* 操作说明 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">操作说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">支持的数据类型</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 老人基本信息（姓名、身份证号、联系电话、房间号、护理等级）</li>
                <li>• 费用项目（住宿费、护理费、餐费、医疗费等各类费用）</li>
                <li>• 日报内容（日常活动记录、健康状况、饮食情况）</li>
                <li>• 联系人信息（紧急联系人姓名、关系、联系方式）</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">注意事项</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 请使用下载的模板文件，确保数据格式正确</li>
                <li>• 文件大小不能超过 10MB</li>
                <li>• 导入前请仔细预览数据，确认无误后再导入</li>
                <li>• 导入过程可能需要几分钟，请耐心等待</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* 底部导航 */}
      <AdminTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>;
}