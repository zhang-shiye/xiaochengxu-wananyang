// @ts-ignore;
import React, { useState, useRef } from 'react';
// @ts-ignore;
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download, Eye, Database } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Alert, AlertDescription, Badge, Separator, useToast } from '@/components/ui';

export default function BatchUpdate(props) {
  const {
    toast
  } = useToast();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [updateResult, setUpdateResult] = useState(null);
  const fileInputRef = useRef(null);

  // 模拟文件上传处理
  const handleFileUpload = async file => {
    setIsUploading(true);
    try {
      // 模拟文件解析
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟解析后的数据预览
      const mockPreviewData = {
        columns: ['老人姓名', '身份证号', '房间号', '护理等级', '费用类型', '金额', '生效日期'],
        rows: [['张大爷', '110101194001011234', 'A101', '一级护理', '住宿费', '2800', '2024-01-01'], ['李奶奶', '110101194503022345', 'A102', '二级护理', '护理费', '1500', '2024-01-01'], ['王爷爷', '110101193812013456', 'B201', '三级护理', '餐费', '800', '2024-01-01'], ['赵奶奶', '110101194208024567', 'B202', '一级护理', '医疗费', '600', '2024-01-01'], ['刘大爷', '110101194011015678', 'C301', '特级护理', '特殊护理费', '2000', '2024-01-01']],
        totalRows: 156,
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(2) + ' KB'
      };
      setPreviewData(mockPreviewData);
      setUploadedFile(file);
      toast({
        title: '文件解析成功',
        description: `成功解析 ${file.name}，共 ${mockPreviewData.totalRows} 行数据`,
        className: 'bg-green-50 border-green-200'
      });
    } catch (error) {
      toast({
        title: '文件解析失败',
        description: '请检查文件格式是否正确',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 处理文件拖拽
  const handleDrop = e => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    if (validFiles.length > 0) {
      handleFileUpload(validFiles[0]);
    } else {
      toast({
        title: '文件格式不支持',
        description: '请上传 Excel 或 CSV 格式的文件',
        variant: 'destructive'
      });
    }
  };

  // 处理文件选择
  const handleFileSelect = e => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // 确认批量更新
  const handleConfirmUpdate = async () => {
    setIsProcessing(true);
    try {
      // 模拟批量更新过程
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 模拟更新结果
      const mockResult = {
        total: previewData.totalRows,
        success: 142,
        failed: 14,
        failedDetails: [{
          row: 23,
          reason: '身份证号格式错误'
        }, {
          row: 45,
          reason: '房间号不存在'
        }, {
          row: 67,
          reason: '护理等级不匹配'
        }, {
          row: 89,
          reason: '金额格式错误'
        }, {
          row: 112,
          reason: '生效日期格式错误'
        }, {
          row: 134,
          reason: '老人姓名重复'
        }, {
          row: 145,
          reason: '费用类型不存在'
        }]
      };
      setUpdateResult(mockResult);
      toast({
        title: '批量更新完成',
        description: `成功更新 ${mockResult.success} 条数据，失败 ${mockResult.failed} 条`,
        className: 'bg-green-50 border-green-200'
      });
    } catch (error) {
      toast({
        title: '批量更新失败',
        description: '更新过程中发生错误，请重试',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 下载模板
  const handleDownloadTemplate = () => {
    toast({
      title: '模板下载',
      description: '数据模板文件已开始下载',
      className: 'bg-blue-50 border-blue-200'
    });
  };

  // 重置上传
  const handleReset = () => {
    setUploadedFile(null);
    setPreviewData(null);
    setUpdateResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200/50 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900" style={{
                fontFamily: 'Playfair Display, serif'
              }}>
                  数据批量更新
                </h1>
                <p className="text-sm text-gray-600">Excel/CSV 文件批量导入</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="border-amber-200 text-amber-700 hover:bg-amber-50">
              <Download className="w-4 h-4 mr-2" />
              模板
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 上传区域 */}
        {!previewData && !updateResult && <Card className="border-amber-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-amber-900" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
                文件上传
              </CardTitle>
              <CardDescription className="text-amber-700">
                支持 Excel (.xlsx, .xls) 和 CSV 格式文件
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${isUploading ? 'border-amber-300 bg-amber-50/50' : 'border-amber-200 hover:border-amber-300 hover:bg-amber-50/30'}`} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
                <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} className="hidden" disabled={isUploading} />
                
                {isUploading ? <div className="space-y-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Upload className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-amber-900 font-medium">正在解析文件...</p>
                      <div className="w-32 h-2 bg-amber-100 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse" style={{
                    width: '60%'
                  }}></div>
                      </div>
                    </div>
                  </div> : <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8 text-amber-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-amber-900 font-medium text-lg">
                        拖拽文件到此处或
                        <span className="text-amber-600 underline cursor-pointer hover:text-amber-700 ml-1" onClick={() => fileInputRef.current?.click()}>
                          点击选择
                        </span>
                      </p>
                      <p className="text-amber-600 text-sm">
                        支持 Excel 和 CSV 格式，文件大小不超过 10MB
                      </p>
                    </div>
                  </div>}
              </div>
            </CardContent>
          </Card>}

        {/* 数据预览 */}
        {previewData && !updateResult && <div className="space-y-4">
            <Card className="border-amber-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-amber-900" style={{
                  fontFamily: 'Playfair Display, serif'
                }}>
                      数据预览
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                      文件：{previewData.fileName} ({previewData.fileSize}) • 共 {previewData.totalRows} 行数据
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    <Eye className="w-3 h-3 mr-1" />
                    预览模式
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200">
                        {previewData.columns.map((column, index) => <th key={index} className="text-left py-3 px-2 font-medium text-amber-900">
                            {column}
                          </th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-amber-100 hover:bg-amber-50/30">
                          {row.map((cell, cellIndex) => <td key={cellIndex} className="py-3 px-2 text-gray-700">
                              {cell}
                            </td>)}
                        </tr>)}
                    </tbody>
                  </table>
                </div>
                <Alert className="mt-4 bg-amber-50 border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <AlertDescription className="text-amber-700">
                    以上为前 {previewData.rows.length} 行数据预览，实际更新将处理全部 {previewData.totalRows} 行数据
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleReset} className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50" disabled={isProcessing}>
                重新选择
              </Button>
              <Button onClick={handleConfirmUpdate} disabled={isProcessing} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                {isProcessing ? <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>更新中...</span>
                  </div> : '确认更新'}
              </Button>
            </div>
          </div>}

        {/* 更新结果 */}
        {updateResult && <div className="space-y-4">
            <Card className="border-amber-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-amber-900" style={{
              fontFamily: 'Playfair Display, serif'
            }}>
                  更新结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-900">{updateResult.total}</div>
                    <div className="text-sm text-amber-600">总记录数</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">{updateResult.success}</div>
                    <div className="text-sm text-green-600">成功更新</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-900">{updateResult.failed}</div>
                    <div className="text-sm text-red-600">更新失败</div>
                  </div>
                </div>

                {updateResult.failed > 0 && <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">失败详情</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {updateResult.failedDetails.map((failure, index) => <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-red-900">
                              第 {failure.row} 行：{failure.reason}
                            </p>
                          </div>
                        </div>)}
                    </div>
                  </div>}

                <Alert className={`mt-4 ${updateResult.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                  {updateResult.failed === 0 ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                  <AlertDescription className={updateResult.failed === 0 ? 'text-green-700' : 'text-amber-700'}>
                    {updateResult.failed === 0 ? '所有数据更新成功！' : '部分数据更新失败，请检查失败原因并修正后重新上传'}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* 后续操作 */}
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleReset} className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50">
                继续更新
              </Button>
              <Button onClick={() => {
            // 返回首页或其他页面
            props.$w.utils.navigateTo({
              pageId: 'admin-dashboard',
              params: {}
            });
          }} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                返回首页
              </Button>
            </div>
          </div>}
      </div>
    </div>;
}