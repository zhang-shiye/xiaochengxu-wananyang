// @ts-ignore;
import React from 'react';

import ErrorBoundary from '@/components/ErrorBoundary';

/**
 * 应用级错误处理包装器
 * 为所有页面组件提供统一的错误边界保护
 */
const AppErrorHandler = ({
  children,
  ...props
}) => {
  return <ErrorBoundary $w={props.$w}>
      {children}
    </ErrorBoundary>;
};
export default AppErrorHandler;