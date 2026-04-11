// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Avatar, AvatarImage, Button, Input, useToast } from '@/components/ui';
// @ts-ignore;
import { Settings, Upload, Save, RefreshCw } from 'lucide-react';

// 养老院品牌配置组件
export function NursingHomeBrand({
  editable = false
}) {
  const [brandConfig, setBrandConfig] = useState({
    name: '皖安养',
    logo: '',
    slogan: '用心陪伴 安心养老',
    primaryColor: '#f97316'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState(brandConfig);
  const {
    toast
  } = useToast();

  // 从本地存储加载配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('nursingHomeBrand');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setBrandConfig(parsed);
      setTempConfig(parsed);
    }
  }, []);

  // 保存配置
  const handleSave = () => {
    setBrandConfig(tempConfig);
    localStorage.setItem('nursingHomeBrand', JSON.stringify(tempConfig));
    setIsEditing(false);

    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('brandConfigUpdated', {
      detail: tempConfig
    }));
    toast({
      title: '保存成功',
      description: '养老院品牌配置已更新',
      variant: 'success'
    });
  };

  // 处理Logo上传
  const handleLogoUpload = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setTempConfig(prev => ({
          ...prev,
          logo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 重置为默认值
  const handleReset = () => {
    const defaultConfig = {
      name: '皖安养',
      logo: '',
      slogan: '用心陪伴 安心养老',
      primaryColor: '#f97316'
    };
    setTempConfig(defaultConfig);
  };

  // 渲染品牌展示（只读模式）
  if (!editable) {
    return <div className="flex items-center space-x-3">
        {brandConfig.logo && <Avatar className="h-12 w-12">
            <AvatarImage src={brandConfig.logo} alt={brandConfig.name} />
          </Avatar>}
        <div>
          <h1 className="text-2xl font-bold text-gray-800" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
            {brandConfig.name}
          </h1>
          <p className="text-sm text-gray-600" style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
            {brandConfig.slogan}
          </p>
        </div>
      </div>;
  }

  // 渲染编辑模式
  return <Card className="p-6 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          养老院品牌配置
        </h3>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? '取消' : '编辑'}
        </Button>
      </div>

      {isEditing ? <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              养老院名称
            </label>
            <Input value={tempConfig.name} onChange={e => setTempConfig(prev => ({
          ...prev,
          name: e.target.value
        }))} placeholder="请输入养老院名称" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              宣传标语
            </label>
            <Input value={tempConfig.slogan} onChange={e => setTempConfig(prev => ({
          ...prev,
          slogan: e.target.value
        }))} placeholder="请输入宣传标语" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo图片
            </label>
            <div className="flex items-center space-x-3">
              {tempConfig.logo && <Avatar className="h-16 w-16">
                  <AvatarImage src={tempConfig.logo} alt="Logo" />
                </Avatar>}
              <div>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                <label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Upload className="h-4 w-4 mr-2" />
                  上传Logo
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              主色调
            </label>
            <div className="flex items-center space-x-3">
              <input type="color" value={tempConfig.primaryColor} onChange={e => setTempConfig(prev => ({
            ...prev,
            primaryColor: e.target.value
          }))} className="h-10 w-20 border border-gray-300 rounded cursor-pointer" />
              <Input value={tempConfig.primaryColor} onChange={e => setTempConfig(prev => ({
            ...prev,
            primaryColor: e.target.value
          }))} placeholder="#f97316" className="flex-1" />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              保存配置
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              重置
            </Button>
          </div>
        </div> : <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {brandConfig.logo && <Avatar className="h-16 w-16">
                <AvatarImage src={brandConfig.logo} alt={brandConfig.name} />
              </Avatar>}
            <div>
              <h3 className="text-xl font-bold text-gray-800">{brandConfig.name}</h3>
              <p className="text-gray-600">{brandConfig.slogan}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">主色调：</span>
            <div className="w-6 h-6 rounded border border-gray-300" style={{
          backgroundColor: brandConfig.primaryColor
        }} />
            <span className="text-sm text-gray-600">{brandConfig.primaryColor}</span>
          </div>
        </div>}
    </Card>;
}

// 品牌展示组件（用于页面标题等）
export function BrandDisplay({
  variant = 'default'
}) {
  const [brandConfig, setBrandConfig] = useState({
    name: '皖安养',
    logo: '',
    slogan: '用心陪伴 安心养老'
  });
  useEffect(() => {
    const savedConfig = localStorage.getItem('nursingHomeBrand');
    if (savedConfig) {
      setBrandConfig(JSON.parse(savedConfig));
    }

    // 监听配置更新
    const handleBrandUpdate = event => {
      setBrandConfig(event.detail);
    };
    window.addEventListener('brandConfigUpdated', handleBrandUpdate);
    return () => {
      window.removeEventListener('brandConfigUpdated', handleBrandUpdate);
    };
  }, []);
  if (variant === 'title-only') {
    return <span>{brandConfig.name}</span>;
  }
  if (variant === 'slogan-only') {
    return <span>{brandConfig.slogan}</span>;
  }
  return <div className="flex items-center space-x-3">
      {brandConfig.logo && <Avatar className="h-10 w-10">
          <AvatarImage src={brandConfig.logo} alt={brandConfig.name} />
        </Avatar>}
      <div>
        <h1 className="text-xl font-bold text-gray-800">{brandConfig.name}</h1>
        <p className="text-sm text-gray-600">{brandConfig.slogan}</p>
      </div>
    </div>;
}