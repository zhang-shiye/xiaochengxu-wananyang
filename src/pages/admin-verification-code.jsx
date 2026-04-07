// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, Button, Input, Avatar, AvatarImage, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, Copy, Share2, User, Phone, Calendar, RefreshCw, Check, X } from 'lucide-react';

import AdminTabBar from '@/components/AdminTabBar';
export default function AdminVerificationCode(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('verification-code');
  const [searchTerm, setSearchTerm] = useState('');
  const [elders, setElders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取老人列表和验证码
  const fetchEldersWithCodes = async () => {
    try {
      setLoading(true);
      const result = await props.$w.cloud.callFunction({
        name: 'getEldersWithVerificationCodes',
        data: {
          search: searchTerm
        }
      });
      if (result.result.success) {
        setElders(result.result.data);
      } else {
        toast({
          title: '获取数据失败',
          description: result.result.error || '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '网络错误',
        description: '获取数据失败，请检查网络连接',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEldersWithCodes();
  }, [searchTerm]);

  // 复制验证码
  const copyVerificationCode = async code => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        toast({
          title: '复制成功',
          description: `验证码 ${code} 已复制到剪贴板`
        });
      } else {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast({
          title: '复制成功',
          description: `验证码 ${code} 已复制到剪贴板`
        });
      }
    } catch (error) {
      toast({
        title: '复制失败',
        description: '请手动复制验证码',
        variant: 'destructive'
      });
    }
  };

  // 分享验证码给家属
  const shareVerificationCode = async elder => {
    try {
      const shareText = `【${elder.name}专属验证码】\n\n验证码：${elder.verificationCode}\n有效期：今日有效\n\n请在微信小程序中输入此验证码完成绑定。如有疑问请联系护理院工作人员。`;
      if (navigator.share) {
        await navigator.share({
          title: `${elder.name}专属验证码`,
          text: shareText
        });
      } else {
        // 降级方案：复制到剪贴板
        await copyVerificationCode(shareText);
        toast({
          title: '分享内容已复制',
          description: '分享内容已复制到剪贴板，您可以粘贴发送给家属'
        });
      }
    } catch (error) {
      toast({
        title: '分享失败',
        description: '请手动复制验证码发送给家属',
        variant: 'destructive'
      });
    }
  };

  // 刷新验证码
  const refreshVerificationCode = async elderId => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'refreshVerificationCode',
        data: {
          elderId
        }
      });
      if (result.result.success) {
        toast({
          title: '刷新成功',
          description: '验证码已更新'
        });
        fetchEldersWithCodes();
      } else {
        toast({
          title: '刷新失败',
          description: result.result.error || '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '网络错误',
        description: '刷新失败，请检查网络连接',
        variant: 'destructive'
      });
    }
  };

  // 批量转发验证码
  const batchShareCodes = async () => {
    const activeElders = elders.filter(elder => elder.status === 'active');
    if (activeElders.length === 0) {
      toast({
        title: '没有可转发的老人',
        description: '请先添加老人信息',
        variant: 'destructive'
      });
      return;
    }
    try {
      const batchText = activeElders.map(elder => `【${elder.name}专属验证码】\n验证码：${elder.verificationCode}\n有效期：今日有效`).join('\n\n');
      const fullText = `今日老人专属验证码清单\n\n${batchText}\n\n请在微信小程序中输入对应验证码完成绑定。如有疑问请联系护理院工作人员。`;
      if (navigator.share) {
        await navigator.share({
          title: '老人专属验证码清单',
          text: fullText
        });
      } else {
        await copyVerificationCode(fullText);
        toast({
          title: '批量分享成功',
          description: '所有验证码已复制到剪贴板'
        });
      }
    } catch (error) {
      toast({
        title: '批量分享失败',
        description: '请手动复制验证码',
        variant: 'destructive'
      });
    }
  };
  const getStatusBadge = status => {
    const statusMap = {
      active: {
        label: '在院',
        variant: 'default'
      },
      inactive: {
        label: '离院',
        variant: 'secondary'
      },
      discharged: {
        label: '出院',
        variant: 'destructive'
      }
    };
    return statusMap[status] || {
      label: '未知',
      variant: 'secondary'
    };
  };
  const filteredElders = elders.filter(elder => elder.name?.toLowerCase().includes(searchTerm.toLowerCase()) || elder.phone?.includes(searchTerm));
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">专属验证码</h1>
          <Button size="sm" onClick={batchShareCodes} className="bg-blue-600 hover:bg-blue-700">
            <Share2 className="w-4 h-4 mr-2" />
            批量转发
          </Button>
        </div>

        {/* 搜索 */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="搜索老人姓名或电话..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        {/* 老人列表 */}
        {loading ? <div className="text-center py-8">
            <div className="text-gray-500">加载中...</div>
          </div> : filteredElders.length === 0 ? <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无老人信息</p>
          </div> : <div className="space-y-4 mb-20">
            {filteredElders.map(elder => <Card key={elder._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face`} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{elder.name}</h3>
                          <Badge variant={getStatusBadge(elder.status).variant} className="text-xs">
                            {getStatusBadge(elder.status).label}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-2" />
                            {elder.phone}
                          </div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-2" />
                            {elder.roomNumber}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-2" />
                            入住: {new Date(elder.admissionDate).toLocaleDateString()}
                          </div>
                        </div>
                        {elder.verificationCode && <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">今日验证码</p>
                                <p className="text-lg font-mono font-bold text-blue-600">{elder.verificationCode}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => copyVerificationCode(elder.verificationCode)}>
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => shareVerificationCode(elder)}>
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => refreshVerificationCode(elder._id)}>
                                  <RefreshCw className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>}
      </div>
      <AdminTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>;
}