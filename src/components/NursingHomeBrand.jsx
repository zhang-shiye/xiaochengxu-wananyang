// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Input, useToast } from '@/components/ui';
// @ts-ignore;
import { Settings, Upload, Save, RefreshCw } from 'lucide-react';

// 养老院品牌配置组件
export function NursingHomeBrand({
  editable = false,
  className = '',
  showLogo = true,
  showSlogan = true,
  size = 'normal',
  $w
}) {
  const [brandConfig, setBrandConfig] = useState({
    _id: null,
    name: '皖安养',
    slogan: '用心陪伴 安心养老',
    logoUrl: '',
    primaryColor: '#f97316'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState(brandConfig);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();

  // 从数据模型加载配置
  const loadBrandConfig = async () => {
    if (!$w) return;
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'branding',
        methodName: 'wedaGetV2',
        params: {}
      });
      if (result && result.data && result.data.length > 0) {
        const config = result.data[0];
        setBrandConfig({
          _id: config._id,
          name: config.name || '皖安养',
          slogan: config.slogan || '用心陪伴 安心养老',
          logoUrl: config.logoUrl || '',
          primaryColor: config.primaryColor || '#f97316'
        });
        setTempConfig({
          _id: config._id,
          name: config.name || '皖安养',
          slogan: config.slogan || '用心陪伴 安心养老',
          logoUrl: config.logoUrl || '',
          primaryColor: config.primaryColor || '#f97316'
        });
      }
    } catch (error) {
      console.error('加载品牌配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取配置
  useEffect(() => {
    if ($w) {
      loadBrandConfig();
    }
  }, [$w]);

  // 保存配置
  const handleSave = async () => {
    try {
      setLoading(true);
      const updateData = {
        name: tempConfig.name,
        slogan: tempConfig.slogan,
        logoUrl: tempConfig.logoUrl,
        primaryColor: tempConfig.primaryColor,
        updatedAt: new Date().toISOString()
      };
      let result;
      if (tempConfig._id) {
        // 更新现有配置
        result = await $w.cloud.callDataSource({
          dataSourceName: 'branding',
          methodName: 'wedaUpdateV2',
          params: {
            where: {
              _id: tempConfig._id
            },
            data: updateData
          }
        });
      } else {
        // 创建新配置
        result = await $w.cloud.callDataSource({
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
      if (result) {
        setBrandConfig({
          ...tempConfig,
          _id: tempConfig._id || 'branding_001'
        });
        setIsEditing(false);
        window.dispatchEvent(new CustomEvent('brandConfigUpdated', {
          detail: {
            ...tempConfig,
            _id: tempConfig._id || 'branding_001'
          }
        }));
        toast({
          title: '保存成功',
          description: '养老院品牌配置已更新',
          variant: 'success'
        });
      }
    } catch (error) {
      console.error('保存品牌配置失败:', error);
      toast({
        title: '保存失败',
        description: error.message || '保存配置时发生错误',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理Logo上传
  const handleLogoUpload = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setTempConfig(prev => ({
          ...prev,
          logoUrl: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 重置为默认值
  const handleReset = () => {
    const defaultConfig = {
      _id: brandConfig._id,
      name: '皖安养',
      slogan: '用心陪伴 安心养老',
      logoUrl: '',
      primaryColor: '#f97316'
    };
    setTempConfig(defaultConfig);
  };

  // 监听品牌配置更新事件
  useEffect(() => {
    const handleBrandUpdate = event => {
      setBrandConfig(event.detail);
      setTempConfig(event.detail);
    };
    window.addEventListener('brandConfigUpdated', handleBrandUpdate);
    return () => window.removeEventListener('brandConfigUpdated', handleBrandUpdate);
  }, []);

  // 监听品牌配置更新后重新加载
  useEffect(() => {
    const handleBrandUpdate = () => {
      if ($w) {
        loadBrandConfig();
      }
    };
    window.addEventListener('brandConfigUpdated', handleBrandUpdate);
    return () => window.removeEventListener('brandConfigUpdated', handleBrandUpdate);
  }, [$w]);

  // 渲染品牌展示（只读模式）
  if (!editable) {
    const sizeClasses = size === 'large' ? 'text-3xl' : size === 'small' ? 'text-lg' : 'text-2xl';
    const sloganSizeClasses = size === 'large' ? 'text-base' : size === 'small' ? 'text-xs' : 'text-sm';
    const logoSizeClasses = size === 'large' ? 'h-16 w-16' : size === 'small' ? 'h-8 w-8' : 'h-12 w-12';
    if (loading) {
      return <div className={`flex items-center space-x-3 ${className}`}>
          <div className={`${logoSizeClasses} rounded-full bg-gray-200 animate-pulse`}></div>
          <div className="space-y-2">
            <div className={`h-4 bg-gray-200 rounded animate-pulse ${sizeClasses}`}></div>
            <div className={`h-3 bg-gray-200 rounded animate-pulse ${sloganSizeClasses}`}></div>
          </div>
        </div>;
    }
    return <div className={`flex items-center space-x-3 ${className}`}>
        {showLogo && brandConfig.logoUrl && <div className={`${logoSizeClasses} rounded-full overflow-hidden`}>
            <img src={brandConfig.logoUrl} alt="养老院Logo" className="w-full h-full object-cover" />
          </div>}
        
        <div className="flex flex-col">
          <h3 className={`font-bold ${sizeClasses}`} style={{
          color: brandConfig.primaryColor
        }}>
            {brandConfig.name}
          </h3>
          {showSlogan && <p className={`text-gray-600 ${sloganSizeClasses}`} style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
              {brandConfig.slogan}
            </p>}
        </div>
      </div>;
  }

  // 渲染品牌配置（编辑模式）
  return <div className={`max-w-4xl mx-auto p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 min-h-screen ${className}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{
        fontFamily: 'Playfair Display, serif',
        color: brandConfig.primaryColor
      }}>
          品牌设置
        </h2>
        <p className="text-gray-600" style={{
        fontFamily: 'Nunito Sans, sans-serif'
      }}>
          配置养老院的品牌信息，包括名称、口号、Logo和主题色
        </p>
      </div>
      
      {loading ? <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div> : <div className="space-y-6">
          {/* 预览区域 */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
              预览效果
            </h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                {tempConfig.logoUrl ? <img src={tempConfig.logoUrl} alt="Logo预览" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400">
                    <Settings className="w-8 h-8" />
                  </div>}
              </div>
              <div>
                <h4 className="text-2xl font-bold" style={{
              color: tempConfig.primaryColor,
              fontFamily: 'Playfair Display, serif'
            }}>
                  {tempConfig.name || '养老院名称'}
                </h4>
                <p className="text-gray-600" style={{
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
                  {tempConfig.slogan || '口号'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Logo设置 */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
                  养老院Logo
                </label>
            <div className="flex items-start space-x-4">
              <div className="h-24 w-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                {tempConfig.logoUrl ? <img src={tempConfig.logoUrl} alt="当前Logo" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400">
                    <Settings className="w-12 h-12" />
                  </div>}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1" style={{
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                        Logo图片URL
                      </label>
                  <Input value={tempConfig.logoUrl} onChange={e => setTempConfig(prev => ({
                ...prev,
                logoUrl: e.target.value
              }))} placeholder="输入Logo图片URL" />
                </div>
                <div>
                  <Button asChild>
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      上传Logo
                    </label>
                  </Button>
                  <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>
            </div>
          </div>
          
          {/* 名称设置 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
                  养老院名称
                </label>
            <Input value={tempConfig.name} onChange={e => setTempConfig(prev => ({
          ...prev,
          name: e.target.value
        }))} placeholder="输入养老院名称" />
            <p className="text-xs text-gray-500 mt-1" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
                  建议使用简洁易记的名称
                </p>
          </div>
          
          {/* 口号设置 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
                  宣传口号
                </label>
            <Input value={tempConfig.slogan} onChange={e => setTempConfig(prev => ({
          ...prev,
          slogan: e.target.value
        }))} placeholder="输入宣传口号" />
            <p className="text-xs text-gray-500 mt-1" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
                  体现养老院的服务理念
                </p>
          </div>
          
          {/* 主题色设置 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
                  主题颜色
                </label>
            <div className="flex items-center space-x-3">
              <input type="color" value={tempConfig.primaryColor} onChange={e => setTempConfig(prev => ({
            ...prev,
            primaryColor: e.target.value
          }))} className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer" />
              <Input value={tempConfig.primaryColor} onChange={e => setTempConfig(prev => ({
            ...prev,
            primaryColor: e.target.value
          }))} placeholder="#ffffff" />
            </div>
            <p className="text-xs text-gray-500 mt-1" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
                  建议使用温暖的橙色系
                </p>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={handleReset} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重置
            </Button>
            <Button onClick={handleSave} disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              {loading ? '保存中...' : '保存配置'}
            </Button>
          </div>
        </div>}
    </div>;
}