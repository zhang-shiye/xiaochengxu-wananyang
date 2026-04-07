// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Camera, User, Save, QrCode, Edit3 } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

export default function AdminBindCode({
  $w
}) {
  const {
    toast
  } = useToast();
  const [code, setCode] = useState('');
  const [seniorInfo, setSeniorInfo] = useState(null);
  const [isBinding, setIsBinding] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // 模拟老人数据
  const mockSeniors = [{
    id: 1,
    name: '张爷爷',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    room: '101室'
  }, {
    id: 2,
    name: '李奶奶',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    room: '102室'
  }, {
    id: 3,
    name: '王爷爷',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    room: '103室'
  }, {
    id: 4,
    name: '赵奶奶',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    room: '104室'
  }];

  // 模拟扫码功能
  const handleScanCode = () => {
    setIsScanning(true);
    setTimeout(() => {
      const mockCode = 'SENIOR_' + Math.random().toString(36).substr(2, 8).toUpperCase();
      setCode(mockCode);
      setIsScanning(false);
      toast({
        title: '扫码成功',
        description: '已识别验证码'
      });
    }, 2000);
  };

  // 手动输入验证码
  const handleManualInput = () => {
    if (!code.trim()) {
      toast({
        title: '请输入验证码',
        description: '验证码不能为空',
        variant: 'destructive'
      });
      return;
    }
    handleBindCode();
  };

  // 绑定验证码
  const handleBindCode = async () => {
    if (!code.trim()) {
      toast({
        title: '请输入验证码',
        description: '验证码不能为空',
        variant: 'destructive'
      });
      return;
    }
    setIsBinding(true);
    try {
      // 模拟根据验证码查询老人信息
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟匹配老人信息（这里简化处理，实际应该调用API）
      const matchedSenior = mockSeniors.find(senior => code.includes('SENIOR') || code.includes(senior.name.substring(0, 1))) || mockSeniors[0];
      setSeniorInfo(matchedSenior);
      toast({
        title: '绑定成功',
        description: `已为${matchedSenior.name}绑定专属验证码`
      });
    } catch (error) {
      toast({
        title: '绑定失败',
        description: '请检查验证码是否正确',
        variant: 'destructive'
      });
    } finally {
      setIsBinding(false);
    }
  };

  // 保存绑定
  const handleSave = async () => {
    if (!seniorInfo) {
      toast({
        title: '请先绑定验证码',
        description: '绑定成功后再保存',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 模拟保存到数据库
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: '保存成功',
        description: `专属验证码已保存，${seniorInfo.name}的家属可通过此验证码接收信息`
      });

      // 重置表单
      setCode('');
      setSeniorInfo(null);
    } catch (error) {
      toast({
        title: '保存失败',
        description: '请重试',
        variant: 'destructive'
      });
    }
  };

  // 重新绑定
  const handleRebind = () => {
    setCode('');
    setSeniorInfo(null);
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <QrCode className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">专属验证码绑定</h1>
                <p className="text-sm text-gray-600">为老人绑定专属验证码</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!seniorInfo ? (/* 绑定状态 */
      <div className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">绑定专属验证码</h2>
                <p className="text-gray-600">为老人绑定专属验证码，家属可通过此验证码接收信息</p>
              </div>

              {/* 扫码区域 */}
              <div className="mb-6">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border-2 border-dashed border-amber-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">扫码绑定</h3>
                    <p className="text-gray-600 mb-4">扫描老人专属验证码进行绑定</p>
                    <button onClick={handleScanCode} disabled={isScanning} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50">
                      {isScanning ? '扫描中...' : '开始扫码'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 或分隔线 */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">或</span>
                </div>
              </div>

              {/* 手动输入 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  手动输入验证码
                </label>
                <div className="flex space-x-3">
                  <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="请输入专属验证码" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200" />
                  <button onClick={handleManualInput} disabled={isBinding || !code.trim()} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2">
                    <Edit3 className="w-4 h-4" />
                    <span>绑定</span>
                  </button>
                </div>
              </div>

              {/* 操作说明 */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h4 className="font-medium text-amber-800 mb-2">操作说明</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• 专属验证码用于家属接收老人相关信息</li>
                  <li>• 可通过扫码或手动输入验证码进行绑定</li>
                  <li>• 绑定成功后家属可通过验证码接收日报、账单等信息</li>
                  <li>• 每个老人只能绑定一个专属验证码</li>
                </ul>
              </div>
            </div>
          </div>) : (/* 绑定成功状态 */
      <div className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">绑定成功</h2>
                <p className="text-gray-600">专属验证码已绑定到以下老人</p>
              </div>

              {/* 老人信息卡片 */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 mb-6 border border-amber-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img src={seniorInfo.avatar} alt={seniorInfo.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{seniorInfo.name}</h3>
                    <p className="text-gray-600 mb-2">房间号：{seniorInfo.room}</p>
                    <div className="bg-white rounded-lg p-3 border border-amber-200">
                      <p className="text-sm text-gray-600 mb-1">专属验证码</p>
                      <p className="text-lg font-mono font-bold text-amber-700">{code}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-3">
                <button onClick={handleSave} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>保存绑定</span>
                </button>
                <button onClick={handleRebind} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200">
                  重新绑定
                </button>
              </div>

              {/* 提示信息 */}
              <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">绑定成功</h4>
                <p className="text-sm text-green-700">
                  {seniorInfo.name}的专属验证码已绑定成功。家属可通过此验证码接收老人的日报、账单、请假等信息。
                </p>
              </div>
            </div>
          </div>)}
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex justify-center space-x-6">
            <button onClick={() => $w.utils.navigateTo({
            pageId: 'admin-dashboard',
            params: {}
          })} className="flex flex-col items-center space-y-1 text-gray-600 hover:text-amber-600 transition-colors">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <span className="text-xs">工作台</span>
            </button>
            <button onClick={() => $w.utils.navigateTo({
            pageId: 'admin-verification-code',
            params: {}
          })} className="flex flex-col items-center space-y-1 text-amber-600">
              <div className="w-6 h-6 bg-amber-600 rounded"></div>
              <span className="text-xs">验证码</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-amber-600 transition-colors">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <span className="text-xs">我的</span>
            </button>
          </div>
        </div>
      </div>
    </div>;
}