// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, Button, Input, useToast } from '@/components/ui';
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
        {brandConfig.logo && <div className="h-12 w-12 rounded-full overflow-hidden">
            <img src={brandConfig.logo} alt={brandConfig.name} className="h-full w-full object-cover" />
          </div>}
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
        <h2 className="text-xl font-bold text-gray-800" style={{
        fontFamily: 'Nunito Sans, sans-serif'
      }}>
            品牌设置
          </h2>
        <Button variant="ghost" onClick={() => setIsEditing(true)}>
          <Settings className="w-5 h-5 mr-2" />
          编辑
        </Button>
      </div>

      {!isEditing ? <div className="space-y-6">
          {/* 预览模式 */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
            {brandConfig.logo && <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-amber-300">
                <img src={brandConfig.logo} alt={brandConfig.name} className="h-full w-full object-cover" />
              </div>}
            <div>
              <h3 className="text-2xl font-bold text-gray-800" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
                  {brandConfig.name}
                </h3>
              <p className="text-gray-600" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
                  {brandConfig.slogan}
                </p>
            </div>
          </div>
        </div> : <div className="space-y-4">
          {/* 编辑模式 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{
            fontFamily: 'Nunito Sans, sans-serif'
          }}>
                    Logo
                  </label>
              <div className="flex items-center space-x-4">
                {tempConfig.logo ? <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-dashed border-gray-300">
                    <img src={tempConfig.logo} alt="Logo" className="h-full w-full object-cover" />
                  </div> : <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <Settings className="w-8 h-8 text-amber-600" />
                  </div>}
                <div>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                  <Button asChild>
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      上传Logo
                    </label>
                  </Button>
                </div>
              </div>
            </div>

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
            </div>

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
            </div>

            <div className="flex items-center space-x-3">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重置
              </Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                取消
              </Button>
            </div>
          </div>
        </div>}
    </Card>;
}