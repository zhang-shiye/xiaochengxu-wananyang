// @ts-ignore;
import React, { useState, useEffect, useRef, useCallback } from 'react';
// @ts-ignore;
import { Card, Button, Input, useToast } from '@/components/ui';
// @ts-ignore;
import { Save, RotateCcw, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';

export default function AdminBrand(props) {
  const {
    toast
  } = useToast();
  const [brandConfig, setBrandConfig] = useState({
    name: '',
    slogan: '',
    logoUrl: '',
    primaryColor: '#f97316',
    contactPhone: '',
    contactAddress: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const timerRef = useRef(null);
  const configRef = useRef(null);

  // 加载品牌配置
  const loadBrandConfig = useCallback(async () => {
    setLoading(true);
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'branding',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {}
          },
          select: {
            $master: true
          },
          pageSize: 1,
          pageNumber: 1
        }
      });
      if (result && result.records && result.records.length > 0) {
        const config = result.records[0];
        const newConfig = {
          _id: config._id,
          name: config.name || '',
          slogan: config.slogan || '',
          logoUrl: config.logoUrl || '',
          primaryColor: config.primaryColor || '#f97316',
          contactPhone: config.contactPhone || '',
          contactAddress: config.contactAddress || '',
          description: config.description || ''
        };
        setBrandConfig(newConfig);
        configRef.current = newConfig;
        setLastSavedTime(new Date());
      }
    } catch (error) {
      console.error('加载品牌配置失败:', error);
      toast({
        title: '加载失败',
        description: error.message || '无法加载品牌配置',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [props.$w, toast]);
  useEffect(() => {
    loadBrandConfig();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 自动保存到 branding 数据模型
  const autoSave = useCallback(async config => {
    try {
      setAutoSaving(true);
      const updateData = {
        name: config.name,
        slogan: config.slogan,
        logoUrl: config.logoUrl,
        primaryColor: config.primaryColor,
        contactPhone: config.contactPhone,
        contactAddress: config.contactAddress,
        description: config.description
      };
      if (config._id) {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'branding',
          methodName: 'wedaUpdateV2',
          params: {
            filter: {
              where: {
                $and: [{
                  _id: {
                    $eq: config._id
                  }
                }]
              }
            },
            data: updateData
          }
        });
      } else {
        const createRes = await props.$w.cloud.callDataSource({
          dataSourceName: 'branding',
          methodName: 'wedaCreateV2',
          params: {
            data: updateData
          }
        });
        if (createRes && createRes.id) {
          setBrandConfig(prev => ({
            ...prev,
            _id: createRes.id
          }));
          configRef.current = {
            ...config,
            _id: createRes.id
          };
        }
      }
      setLastSavedTime(new Date());
      window.dispatchEvent(new CustomEvent('brand-config-updated'));
    } catch (error) {
      console.error('自动保存失败:', error);
      toast({
        title: '自动保存失败',
        description: error.message || '无法保存品牌配置',
        variant: 'destructive'
      });
    } finally {
      setAutoSaving(false);
    }
  }, [props.$w, toast]);

  // 防抖自动保存：1.5秒后触发
  const debouncedSave = useCallback(newConfig => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      autoSave(newConfig);
    }, 1500);
  }, [autoSave]);

  // 统一的字段修改处理，修改后自动触发防抖保存
  const handleFieldChange = (field, value) => {
    const newConfig = {
      ...brandConfig,
      [field]: value
    };
    setBrandConfig(newConfig);
    configRef.current = newConfig;
    debouncedSave(newConfig);
  };

  // 手动保存
  const handleSave = async () => {
    if (!brandConfig.name.trim()) {
      toast({
        title: '验证失败',
        description: '请输入养老院名称',
        variant: 'destructive'
      });
      return;
    }
    setSaving(true);
    try {
      await autoSave(brandConfig);
      toast({
        title: '保存成功',
        description: '品牌配置已更新'
      });
    } catch (error) {
      toast({
        title: '保存失败',
        description: error.message || '无法保存',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  const handleReset = () => {
    loadBrandConfig();
    toast({
      title: '重置成功',
      description: '已恢复到上次保存的配置'
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-24">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => props.$w.utils.navigateBack()} className="text-gray-600 hover:text-amber-600 transition-colors">
              ← 返回
            </button>
            <h1 className="text-xl font-bold text-gray-900">品牌配置</h1>
            <button onClick={loadBrandConfig} className="text-gray-600 hover:text-amber-600 transition-colors p-2">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 自动保存状态提示 */}
      {autoSaving && <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-center text-sm text-amber-700">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            正在自动保存...
          </div>
        </div>}

      {/* 主要内容区 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div> : <Card className="p-6 shadow-lg">
            {/* Logo 设置 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo 图片</label>
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                  {brandConfig.logoUrl ? <img src={brandConfig.logoUrl} alt="Logo" className="w-full h-full object-cover" onError={() => handleFieldChange('logoUrl', '')} /> : <ImageIcon className="w-8 h-8 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <Input placeholder="请输入 Logo 图片 URL" value={brandConfig.logoUrl} onChange={e => handleFieldChange('logoUrl', e.target.value)} className="mb-2" />
                  <p className="text-xs text-gray-500">支持 JPG、PNG 格式，建议尺寸 200x200 像素</p>
                </div>
              </div>
            </div>

            {/* 养老院名称 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                养老院名称 <span className="text-red-500">*</span>
              </label>
              <Input placeholder="请输入养老院名称" value={brandConfig.name} onChange={e => handleFieldChange('name', e.target.value)} maxLength={50} />
              <p className="text-xs text-gray-500 mt-1">最多 50 个字符</p>
            </div>

            {/* 养老院口号 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                养老院口号 <span className="text-red-500">*</span>
              </label>
              <Input placeholder="请输入养老院口号" value={brandConfig.slogan} onChange={e => handleFieldChange('slogan', e.target.value)} maxLength={100} />
              <p className="text-xs text-gray-500 mt-1">最多 100 个字符</p>
            </div>

            {/* 主题颜色 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">主题颜色</label>
              <div className="flex items-center space-x-3">
                <Input type="color" value={brandConfig.primaryColor} onChange={e => handleFieldChange('primaryColor', e.target.value)} className="w-20 h-10 p-1 cursor-pointer" />
                <Input placeholder="#f97316" value={brandConfig.primaryColor} onChange={e => handleFieldChange('primaryColor', e.target.value)} className="flex-1" />
              </div>
              <p className="text-xs text-gray-500 mt-1">影响整个应用的主色调</p>
            </div>

            {/* 联系电话 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
              <Input type="tel" placeholder="请输入联系电话" value={brandConfig.contactPhone} onChange={e => handleFieldChange('contactPhone', e.target.value)} maxLength={20} />
            </div>

            {/* 联系地址 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">联系地址</label>
              <Input placeholder="请输入联系地址" value={brandConfig.contactAddress} onChange={e => handleFieldChange('contactAddress', e.target.value)} maxLength={200} />
            </div>

            {/* 养老院简介 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">养老院简介</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" rows={4} placeholder="请输入养老院简介" value={brandConfig.description} onChange={e => handleFieldChange('description', e.target.value)} maxLength={500} />
              <p className="text-xs text-gray-500 mt-1">{brandConfig.description.length}/500 字符</p>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-3 pt-4">
              <Button onClick={handleSave} disabled={saving || autoSaving} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                {saving ? <span className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    保存中...
                  </span> : <span className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    保存配置
                  </span>}
              </Button>
              <Button onClick={handleReset} disabled={saving} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                重置
              </Button>
            </div>

            {/* 最后保存时间 */}
            {lastSavedTime && <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>最后保存时间: {lastSavedTime.toLocaleString('zh-CN')}</span>
                </div>
              </div>}

            {/* 配置预览 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">配置预览</h3>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 space-y-3">
                {brandConfig.logoUrl && <div className="flex justify-center">
                    <img src={brandConfig.logoUrl} alt="Logo" className="w-20 h-20 object-contain" onError={() => handleFieldChange('logoUrl', '')} />
                  </div>}
                <h3 className="text-2xl font-bold text-center" style={{
              color: brandConfig.primaryColor
            }}>
                  {brandConfig.name || '养老院名称'}
                </h3>
                <p className="text-center text-gray-600">{brandConfig.slogan || '养老院口号'}</p>
                {brandConfig.contactPhone && <p className="text-center text-sm text-gray-500">📞 {brandConfig.contactPhone}</p>}
                {brandConfig.contactAddress && <p className="text-center text-sm text-gray-500">📍 {brandConfig.contactAddress}</p>}
              </div>
            </div>
          </Card>}
      </div>
    </div>;
}