// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Input, useToast } from '@/components/ui';
// @ts-ignore;
import { Camera, Save, RotateCcw, Image as ImageIcon } from 'lucide-react';

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

  // 加载品牌配置
  useEffect(() => {
    loadBrandConfig();
  }, []);
  const loadBrandConfig = async () => {
    setLoading(true);
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'branding',
        methodName: 'wedaGetV2',
        params: {
          where: {}
        }
      });
      if (result && result.data && result.data.length > 0) {
        const config = result.data[0];
        setBrandConfig({
          _id: config._id,
          name: config.name || '皖安养',
          slogan: config.slogan || '用心陪伴 安心养老',
          logoUrl: config.logoUrl || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=face',
          primaryColor: config.primaryColor || '#f97316',
          contactPhone: config.contactPhone || '',
          contactAddress: config.contactAddress || '',
          description: config.description || ''
        });
      } else {
        // 如果没有数据，创建默认配置
        toast({
          title: '初始化配置',
          description: '系统已自动创建默认品牌配置'
        });
      }
    } catch (error) {
      console.error('加载品牌配置失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载品牌配置，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    if (!brandConfig.name.trim()) {
      toast({
        title: '验证失败',
        description: '请输入养老院名称',
        variant: 'destructive'
      });
      return;
    }
    if (!brandConfig.slogan.trim()) {
      toast({
        title: '验证失败',
        description: '请输入养老院口号',
        variant: 'destructive'
      });
      return;
    }
    setSaving(true);
    try {
      const updateData = {
        name: brandConfig.name,
        slogan: brandConfig.slogan,
        logoUrl: brandConfig.logoUrl,
        primaryColor: brandConfig.primaryColor,
        contactPhone: brandConfig.contactPhone,
        contactAddress: brandConfig.contactAddress,
        description: brandConfig.description,
        updatedAt: new Date().toISOString()
      };
      if (brandConfig._id) {
        // 更新现有配置
        const updateResult = await props.$w.cloud.callDataSource({
          dataSourceName: 'branding',
          methodName: 'wedaUpdateV2',
          params: {
            where: {
              _id: brandConfig._id
            },
            data: updateData
          }
        });

        // 检查更新是否成功
        if (!updateResult || updateResult.total === 0) {
          throw new Error('更新失败，未找到对应的记录');
        }
      } else {
        // 创建新配置
        await props.$w.cloud.callDataSource({
          dataSourceName: 'branding',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              ...updateData,
              _id: 'branding_001',
              createdAt: new Date().toISOString()
            }
          }
        });
      }
      toast({
        title: '保存成功',
        description: '品牌配置已更新'
      });

      // 通知其他组件刷新
      window.dispatchEvent(new CustomEvent('brand-config-updated'));
    } catch (error) {
      console.error('保存品牌配置失败:', error);
      toast({
        title: '保存失败',
        description: error.message || '无法保存品牌配置，请稍后重试',
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
      
      {/* 主要内容区 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div> : <Card className="p-6 shadow-lg">
            {/* Logo 设置 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo 图片
              </label>
              <div className="flex items-start space-x-4">
                {/* Logo 预览 */}
                <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                  {brandConfig.logoUrl ? <img src={brandConfig.logoUrl} alt="Logo" className="w-full h-full object-cover" onError={() => setBrandConfig(prev => ({
                ...prev,
                logoUrl: ''
              }))} /> : <ImageIcon className="w-8 h-8 text-gray-400" />}
                </div>
                
                {/* Logo 输入 */}
                <div className="flex-1">
                  <Input placeholder="请输入 Logo 图片 URL" value={brandConfig.logoUrl} onChange={e => setBrandConfig(prev => ({
                ...prev,
                logoUrl: e.target.value
              }))} className="mb-2" />
                  <p className="text-xs text-gray-500">
                    支持 JPG、PNG 格式，建议尺寸 200x200 像素
                  </p>
                </div>
              </div>
            </div>
            
            {/* 养老院名称 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                养老院名称 <span className="text-red-500">*</span>
              </label>
              <Input placeholder="请输入养老院名称" value={brandConfig.name} onChange={e => setBrandConfig(prev => ({
            ...prev,
            name: e.target.value
          }))} maxLength={50} />
              <p className="text-xs text-gray-500 mt-1">
                最多 50 个字符
              </p>
            </div>
            
            {/* 养老院口号 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                养老院口号 <span className="text-red-500">*</span>
              </label>
              <Input placeholder="请输入养老院口号" value={brandConfig.slogan} onChange={e => setBrandConfig(prev => ({
            ...prev,
            slogan: e.target.value
          }))} maxLength={100} />
              <p className="text-xs text-gray-500 mt-1">
                最多 100 个字符
              </p>
            </div>
            
            {/* 主题颜色 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主题颜色
              </label>
              <div className="flex items-center space-x-3">
                <Input type="color" value={brandConfig.primaryColor} onChange={e => setBrandConfig(prev => ({
              ...prev,
              primaryColor: e.target.value
            }))} className="w-20 h-10 p-1 cursor-pointer" />
                <Input placeholder="#f97316" value={brandConfig.primaryColor} onChange={e => setBrandConfig(prev => ({
              ...prev,
              primaryColor: e.target.value
            }))} className="flex-1" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                影响整个应用的主色调
              </p>
            </div>
            
            {/* 联系电话 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系电话
              </label>
              <Input type="tel" placeholder="请输入联系电话" value={brandConfig.contactPhone} onChange={e => setBrandConfig(prev => ({
            ...prev,
            contactPhone: e.target.value
          }))} maxLength={20} />
            </div>
            
            {/* 联系地址 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系地址
              </label>
              <Input placeholder="请输入联系地址" value={brandConfig.contactAddress} onChange={e => setBrandConfig(prev => ({
            ...prev,
            contactAddress: e.target.value
          }))} maxLength={200} />
            </div>
            
            {/* 养老院简介 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                养老院简介
              </label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" rows={4} placeholder="请输入养老院简介" value={brandConfig.description} onChange={e => setBrandConfig(prev => ({
            ...prev,
            description: e.target.value
          }))} maxLength={500} />
              <p className="text-xs text-gray-500 mt-1">
                {brandConfig.description.length}/500 字符
              </p>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex space-x-3 pt-4">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                {saving ? <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
            
            {/* 配置预览 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">配置预览</h3>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 space-y-3">
                {brandConfig.logoUrl && <div className="flex justify-center">
                    <img src={brandConfig.logoUrl} alt="Logo" className="w-20 h-20 object-contain" onError={() => setBrandConfig(prev => ({
                ...prev,
                logoUrl: ''
              }))} />
                  </div>}
                <h3 className="text-2xl font-bold text-center" style={{
              color: brandConfig.primaryColor
            }}>
                  {brandConfig.name || '养老院名称'}
                </h3>
                <p className="text-center text-gray-600">
                  {brandConfig.slogan || '养老院口号'}
                </p>
                {brandConfig.contactPhone && <p className="text-center text-sm text-gray-500">
                    📞 {brandConfig.contactPhone}
                  </p>}
                {brandConfig.contactAddress && <p className="text-center text-sm text-gray-500">
                    📍 {brandConfig.contactAddress}
                  </p>}
              </div>
            </div>
          </Card>}
      </div>
    </div>;
}