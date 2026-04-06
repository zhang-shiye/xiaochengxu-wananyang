// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Input, Textarea, useToast } from '@/components/ui';
// @ts-ignore;
import { CheckCircle, Clock, AlertTriangle, Plus, Search, Filter } from 'lucide-react';

export default function CaregiverTasks(props) {
  const [tasks, setTasks] = useState([{
    id: 1,
    senior: '张爷爷',
    room: '201',
    task: '晨间护理',
    time: '08:00',
    status: 'completed',
    notes: '血压正常，精神状态良好'
  }, {
    id: 2,
    senior: '李奶奶',
    room: '305',
    task: '服药提醒',
    time: '09:30',
    status: 'pending',
    notes: ''
  }, {
    id: 3,
    senior: '王爷爷',
    room: '102',
    task: '康复训练',
    time: '10:00',
    status: 'in-progress',
    notes: '正在进行上肢训练'
  }, {
    id: 4,
    senior: '赵奶奶',
    room: '208',
    task: '午餐照料',
    time: '12:00',
    status: 'pending',
    notes: ''
  }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const {
    toast
  } = useToast();
  const handleCompleteTask = taskId => {
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      status: 'completed'
    } : task));
    toast({
      title: '任务完成',
      description: '任务状态已更新为已完成'
    });
  };
  const handleStartTask = taskId => {
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      status: 'in-progress'
    } : task));
    toast({
      title: '任务开始',
      description: '任务状态已更新为进行中'
    });
  };
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.senior.includes(searchTerm) || task.task.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const getStatusIcon = status => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };
  return <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{
          fontFamily: 'Noto Sans SC, sans-serif'
        }}>
            护理任务管理
          </h1>
          <p className="text-gray-600">管理今日护理任务，实时更新任务状态</p>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input placeholder="搜索老人姓名或任务类型..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <div className="flex space-x-2">
                <Button variant={filterStatus === 'all' ? 'default' : 'outline'} onClick={() => setFilterStatus('all')}>
                  全部
                </Button>
                <Button variant={filterStatus === 'pending' ? 'default' : 'outline'} onClick={() => setFilterStatus('pending')}>
                  待处理
                </Button>
                <Button variant={filterStatus === 'in-progress' ? 'default' : 'outline'} onClick={() => setFilterStatus('in-progress')}>
                  进行中
                </Button>
                <Button variant={filterStatus === 'completed' ? 'default' : 'outline'} onClick={() => setFilterStatus('completed')}>
                  已完成
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 任务列表 */}
        <div className="space-y-4">
          {filteredTasks.map(task => <Card key={task.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(task.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{task.senior} - {task.task}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>房间 {task.room}</span>
                          <span>时间 {task.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    {task.notes && <div className="bg-gray-50 rounded-lg p-3 mt-2">
                        <p className="text-sm text-gray-700">{task.notes}</p>
                      </div>}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status === 'completed' ? '已完成' : task.status === 'in-progress' ? '进行中' : '待处理'}
                    </Badge>
                    
                    {task.status === 'pending' && <Button size="sm" onClick={() => handleStartTask(task.id)} className="bg-blue-600 hover:bg-blue-700">
                        开始任务
                      </Button>}
                    
                    {task.status === 'in-progress' && <Button size="sm" onClick={() => handleCompleteTask(task.id)} className="bg-green-600 hover:bg-green-700">
                        完成任务
                      </Button>}
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* 统计信息 */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                <p className="text-sm text-gray-600">总任务数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">已完成</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </p>
                <p className="text-sm text-gray-600">进行中</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}