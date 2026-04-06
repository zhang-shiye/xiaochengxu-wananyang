// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, Button } from '@/components/ui';
// @ts-ignore;
import { RefreshCw, AlertTriangle, Info } from 'lucide-react';

/**
 * 数据加载包装器 - 统一处理数据加载状态
 */
const DataLoadingWrapper = ({
  loading = false,
  error = null,
  data = null,
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children,
  showEmptyState = true
}) => {
  // 加载状态
  if (loading) {
    if (loadingComponent) return loadingComponent;
    return <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
        <p className="text-gray-600">数据加载中...</p>
      </div>;
  }

  // 错误状态
  if (error) {
    if (errorComponent) return errorComponent;
    return <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          数据加载失败
        </h3>
        <p className="text-gray-600 mb-4 max-w-md">
          {error.message || '请检查网络连接后重试'}
        </p>
        {onRetry && <Button onClick={onRetry} className="bg-amber-500 hover:bg-amber-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            重新加载
          </Button>}
      </div>;
  }

  // 空数据状态
  if (showEmptyState && (!data || Array.isArray(data) && data.length === 0)) {
    if (emptyComponent) return emptyComponent;
    return <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          暂无数据
        </h3>
        <p className="text-gray-600">当前没有可显示的数据</p>
      </div>;
  }

  // 数据正常，渲染子组件
  return children;
};
export default DataLoadingWrapper;