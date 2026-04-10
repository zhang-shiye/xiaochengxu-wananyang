// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Upload, Download, FileText, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

export default function AdminData(props) {
  const {
    toast
  } = useToast();
  const [importTasks, setImportTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importType, setImportType] = useState('elders');

  // 获取导入任务列表
  const fetchImportTasks = async () => {
    try {
      setLoading(true);
      const result = await props.$w.cloud.callFunction({
        name: 'getImportTasks',
        data: {}
      });
      if (result.success) {
        setImportTasks(result.data || []);
      } else {
        toast({
          title: '获取数据失败',
          description: result.error || '请稍后重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('获取导入任务失败:', error);
      toast({
        title: '获取数据失败',
        description: '网络连接异常',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理文件选择
  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        toast({
          title: '文件格式错误',
          description: '请选择CSV格式的文件',
          variant: 'destructive'
        });
        event.target.value = '';
      }
    }
  };

  // 上传文件
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: '请选择文件',
        description: '请先选择要上传的CSV文件',
        variant: 'destructive'
      });
      return;
    }
    try {
      setUploading(true);

      // 读取文件内容
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      // 调用导入函数
      const result = await props.$w.cloud.callFunction({
        name: 'importData',
        data: {
          type: importType,
          data: data,
          filename: selectedFile.name,
          totalRows: data.length
        }
      });
      if (result.success) {
        toast({
          title: '导入任务已创建',
          description: `成功创建导入任务，共${data.length}条数据`
        });
        setShowUploadModal(false);
        setSelectedFile(null);
        fetchImportTasks();
      } else {
        toast({
          title: '导入失败',
          description: result.error || '请检查文件格式',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('文件上传失败:', error);
      toast({
        title: '上传失败',
        description: '文件读取或网络连接异常',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  // 下载模板
  const downloadTemplate = type => {
    let template = '';
    let filename = '';
    if (type === 'elders') {
      filename = '老人信息模板.csv';
      template = '姓名,年龄,房间号,护理等级,健康状况,紧急联系人,紧急联系电话,责任护士\n' + '王奶奶,78,A栋 301室,二级护理,良好,张院长,0551-8888-6666,张护士\n' + '李爷爷,82,B栋 205室,一级护理,良好,李女士,138-0000-1234,王护士';
    } else if (type === 'daily_reports') {
      filename = '日报模板.csv';
      template = '老人ID,日期,早餐,午餐,晚餐,活动,健康状况,心情,用药,备注\n' + 'elder_001,2026-04-05,小米粥、鸡蛋,红烧鱼、米饭,面条、青菜,晨练太极、午休,良好,愉快,降压药(8:00),食欲良好';
    } else if (type === 'bills') {
      filename = '缴费模板.csv';
      template = '老人ID,月份,项目名称1,金额1,项目名称2,金额2,项目名称3,金额3\n' + 'elder_001,2026-04,基础床位费,1800,护理费（二级）,1200,餐费,800';
    }
    const blob = new Blob([template], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 获取状态图标
  const getStatusIcon = status => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  // 获取状态文本
  const getStatusText = status => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'failed':
        return '失败';
      case 'processing':
        return '处理中';
      default:
        return '待处理';
    }
  };
  useEffect(() => {
    fetchImportTasks();
  }, []);
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">数据导入管理</h1>
            <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              导入数据
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 导入说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">导入说明：</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>请使用CSV格式文件，文件大小不超过10MB</li>
                <li>建议先下载模板文件，按照模板格式填写数据</li>
                <li>导入过程中请勿关闭页面，导入完成后会收到通知</li>
                <li>如导入失败，请检查数据格式是否正确</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 模板下载 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">模板下载</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => downloadTemplate('elders')} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <div className="font-medium text-gray-800">老人信息模板</div>
                <div className="text-sm text-gray-500">CSV格式</div>
              </div>
            </button>
            <button onClick={() => downloadTemplate('daily_reports')} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-green-500" />
              <div className="text-left">
                <div className="font-medium text-gray-800">日报模板</div>
                <div className="text-sm text-gray-500">CSV格式</div>
              </div>
            </button>
            <button onClick={() => downloadTemplate('bills')} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-orange-500" />
              <div className="text-left">
                <div className="font-medium text-gray-800">缴费模板</div>
                <div className="text-sm text-gray-500">CSV格式</div>
              </div>
            </button>
          </div>
        </div>

        {/* 导入历史 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">导入历史</h2>
          </div>
          
          {loading ? <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div> : <div className="divide-y divide-gray-200">
              {importTasks.length === 0 ? <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">暂无导入记录</p>
                </div> : importTasks.map(task => <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-800">{task.filename}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === 'completed' ? 'bg-green-100 text-green-800' : task.status === 'failed' ? 'bg-red-100 text-red-800' : task.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                              {getStatusText(task.status)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>导入类型：{task.type === 'elders' ? '老人信息' : task.type === 'daily_reports' ? '日报' : '缴费'}</p>
                            <p>数据条数：{task.totalRows}条</p>
                            <p>导入时间：{new Date(task.createdAt).toLocaleString()}</p>
                            {task.successCount && <p className="text-green-600">成功：{task.successCount}条</p>}
                            {task.failedCount && <p className="text-red-600">失败：{task.failedCount}条</p>}
                            {task.errorMessage && <p className="text-red-600 text-xs mt-1">错误：{task.errorMessage}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-2">
                          {task.processedRows}/{task.totalRows}
                        </div>
                        {task.status === 'processing' && <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{
                    width: `${task.processedRows / task.totalRows * 100}%`
                  }}></div>
                          </div>}
                      </div>
                    </div>
                  </div>)}
            </div>}
        </div>
      </div>

      {/* 上传模态框 */}
      {showUploadModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">数据导入</h2>
                <button onClick={() => {
              setShowUploadModal(false);
              setSelectedFile(null);
            }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">导入类型</label>
                  <select value={importType} onChange={e => setImportType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="elders">老人信息</option>
                    <option value="daily_reports">日报数据</option>
                    <option value="bills">缴费数据</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择文件</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedFile ? selectedFile.name : '点击选择或拖拽CSV文件到此处'}
                    </p>
                    <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors">
                      选择文件
                    </label>
                  </div>
                </div>

                {selectedFile && <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">已选择文件：{selectedFile.name}</span>
                    </div>
                  </div>}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => {
              setShowUploadModal(false);
              setSelectedFile(null);
            }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  取消
                </button>
                <button onClick={handleUpload} disabled={!selectedFile || uploading} className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
                  {uploading ? <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      上传中...
                    </div> : '开始导入'}
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
}