// @ts-ignore;
import React, { useState, useRef } from 'react';
// @ts-ignore;
import { Card, Button, useToast, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Badge } from '@/components/ui';
// @ts-ignore;
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminUpload(props) {
  const {
    toast
  } = useToast();
  const fileInputRef = useRef(null);
  const [uploadState, setUploadState] = useState({
    dataType: 'elders',
    file: null,
    fileName: '',
    fileContent: '',
    previewData: [],
    isUploading: false,
    uploadResult: null
  });

  // 支持的数据类型映射
  const dataTypes = [{
    value: 'elders',
    label: '老人信息',
    fields: ['name', 'age', 'roomNumber', 'careLevel', 'primaryNurse']
  }, {
    value: 'nurses',
    label: '护工信息',
    fields: ['name', 'phone', 'position', 'assignedElders']
  }, {
    value: 'daily_reports',
    label: '护理日报',
    fields: ['elderName', 'date', 'breakfast', 'lunch', 'dinner', 'medications']
  }, {
    value: 'leave_requests',
    label: '请假记录',
    fields: ['elderName', 'reason', 'startDate', 'endDate', 'status']
  }, {
    value: 'bills',
    label: '账单记录',
    fields: ['elderName', 'month', 'totalAmount', 'status']
  }];

  // 处理文件选择
  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (!file) return;
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      toast({
        title: '文件格式错误',
        description: '请选择CSV或Excel格式的文件',
        variant: 'destructive'
      });
      return;
    }
    setUploadState(prev => ({
      ...prev,
      file,
      fileName,
      fileContent: '',
      previewData: [],
      uploadResult: null
    }));

    // 读取文件内容
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target.result;
      setUploadState(prev => ({
        ...prev,
        fileContent: content,
        previewData: parseFileContent(content, fileExtension)
      }));
    };
    reader.readAsText(file);
  };

  // 解析文件内容
  const parseFileContent = (content, fileType) => {
    try {
      if (fileType === 'csv') {
        const lines = content.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });
        return data.slice(0, 5); // 只预览前5行
      } else {
        // 简单模拟Excel解析
        return [{
          姓名: '张三',
          年龄: '75',
          房间号: '101'
        }, {
          姓名: '李四',
          年龄: '82',
          房间号: '102'
        }];
      }
    } catch (error) {
      console.error('文件解析错误:', error);
      toast({
        title: '文件解析失败',
        description: '请检查文件格式是否正确',
        variant: 'destructive'
      });
      return [];
    }
  };

  // 执行数据导入
  const handleImport = async () => {
    if (!uploadState.file) {
      toast({
        title: '请选择文件',
        description: '请先选择要导入的文件',
        variant: 'destructive'
      });
      return;
    }
    setUploadState(prev => ({
      ...prev,
      isUploading: true
    }));
    try {
      // 模拟数据导入过程
      const selectedDataType = dataTypes.find(dt => dt.value === uploadState.dataType);
      const mockData = uploadState.previewData.map((row, index) => ({
        id: `mock_${Date.now()}_${index}`,
        ...row
      }));

      // 这里应该调用实际的API
      const result = await mockDataImport(uploadState.dataType, mockData);
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        uploadResult: {
          success: true,
          importedCount: mockData.length,
          errors: []
        }
      }));
      toast({
        title: '导入成功',
        description: `成功导入 ${mockData.length} 条数据`,
        variant: 'default'
      });
    } catch (error) {
      console.error('导入失败:', error);
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        uploadResult: {
          success: false,
          importedCount: 0,
          errors: [error.message]
        }
      }));
      toast({
        title: '导入失败',
        description: error.message || '数据导入过程中发生错误',
        variant: 'destructive'
      });
    }
  };

  // 模拟数据导入API调用
  const mockDataImport = async (dataType, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          // 90%成功率模拟
          resolve({
            success: true,
            count: data.length
          });
        } else {
          reject(new Error('模拟导入失败，请重试'));
        }
      }, 2000);
    });
  };

  // 重置表单
  const resetForm = () => {
    setUploadState({
      dataType: 'elders',
      file: null,
      fileName: '',
      fileContent: '',
      previewData: [],
      isUploading: false,
      uploadResult: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 返回管理仪表盘
  const handleBack = () => {
    props.$w.utils.redirectTo({
      pageId: 'admin-dashboard',
      params: {}
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" onClick={handleBack} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回管理
            </Button>
            <h1 className="text-3xl font-bold text-slate-900" style={{
            fontFamily: 'Space Mono, monospace'
          }}>
              数据导入
            </h1>
            <p className="text-slate-600 mt-1">支持Excel/CSV格式数据批量导入</p>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：上传配置 */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">导入配置</h3>
                
                {/* 数据类型选择 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    数据类型
                  </label>
                  <Select value={uploadState.dataType} onValueChange={value => setUploadState(prev => ({
                  ...prev,
                  dataType: value
                }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择数据类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypes.map(type => <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* 文件上传 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    选择文件
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">
                      {uploadState.fileName ? uploadState.fileName : '点击选择文件或拖拽到此处'}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      支持 CSV、Excel 格式
                    </p>
                    <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} className="hidden" />
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleImport} disabled={!uploadState.file || uploadState.isUploading}>
                    {uploadState.isUploading ? <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        导入中...
                      </> : <>
                        <Upload className="w-4 h-4 mr-2" />
                        开始导入
                      </>}
                  </Button>
                  
                  <Button variant="outline" className="w-full" onClick={resetForm}>
                    重置
                  </Button>
                </div>
              </div>
            </Card>

            {/* 字段说明 */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">字段说明</h3>
                <div className="space-y-2">
                  {dataTypes.find(dt => dt.value === uploadState.dataType)?.fields.map((field, index) => <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-600 text-sm">{field}</span>
                      <Badge variant="secondary" className="text-xs">必填</Badge>
                    </div>)}
                </div>
              </div>
            </Card>
          </div>

          {/* 右侧：预览和结果 */}
          <div className="lg:col-span-2">
            {/* 数据预览 */}
            {uploadState.previewData.length > 0 && <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    数据预览 <span className="text-slate-400 text-sm">(前{uploadState.previewData.length}行)</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                      <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                          {Object.keys(uploadState.previewData[0] || {}).map((header, index) => <th key={index} className="px-4 py-2">{header}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {uploadState.previewData.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-slate-200">
                            {Object.values(row).map((value, colIndex) => <td key={colIndex} className="px-4 py-2">{value}</td>)}
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>}

            {/* 导入结果 */}
            {uploadState.uploadResult && <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">导入结果</h3>
                  
                  {uploadState.uploadResult.success ? <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-800 font-medium">导入成功</span>
                      </div>
                      <p className="text-green-700 mt-2">
                        成功导入 {uploadState.uploadResult.importedCount} 条数据
                      </p>
                    </div> : <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-800 font-medium">导入失败</span>
                      </div>
                      <p className="text-red-700 mt-2">
                        {uploadState.uploadResult.errors.join(', ')}
                      </p>
                    </div>}
                </div>
              </Card>}

            {/* 使用说明 */}
            {!uploadState.file && <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">使用说明</h3>
                  <div className="space-y-3 text-slate-600">
                    <div className="flex items-start">
                      <FileText className="w-4 h-4 text-blue-500 mt-1 mr-2" />
                      <div>
                        <p className="font-medium">文件格式要求</p>
                        <p className="text-sm">支持 CSV、Excel 格式，第一行为表头</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-1 mr-2" />
                      <div>
                        <p className="font-medium">数据验证</p>
                        <p className="text-sm">系统会自动验证数据格式和必填字段</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2" />
                      <div>
                        <p className="font-medium">批量操作</p>
                        <p className="text-sm">单次最多支持导入 200 条记录</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>}
          </div>
        </div>
      </div>
    </div>;
}