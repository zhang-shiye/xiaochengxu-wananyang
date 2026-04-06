// 统一错误处理工具

/**
 * 错误类型定义
 */
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATA_ERROR: 'DATA_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * 错误处理器
 */
export class ErrorHandler {
  constructor(toast) {
    this.toast = toast;
  }
  
  /**
   * 处理网络错误
   */
  handleNetworkError(error, context = '') {
    console.error(`网络错误 [${context}]:`, error);
    
    this.toast({
      title: '网络连接失败',
      description: '请检查网络连接后重试',
      variant: 'destructive'
    });
    
    return {
      type: ErrorTypes.NETWORK_ERROR,
      message: '网络连接失败',
      originalError: error
    };
  }
  
  /**
   * 处理数据错误
   */
  handleDataError(error, context = '') {
    console.error(`数据错误 [${context}]:`, error);
    
    this.toast({
      title: '数据获取失败',
      description: '数据加载异常，请稍后重试',
      variant: 'destructive'
    });
    
    return {
      type: ErrorTypes.DATA_ERROR,
      message: '数据获取失败',
      originalError: error
    };
  }
  
  /**
   * 处理验证错误
   */
  handleValidationError(errors, context = '') {
    console.warn(`验证错误 [${context}]:`, errors);
    
    const firstError = Object.values(errors)[0];
    if (firstError) {
      this.toast({
        title: '表单验证失败',
        description: firstError.message || '请检查表单信息',
        variant: 'destructive'
      });
    }
    
    return {
      type: ErrorTypes.VALIDATION_ERROR,
      message: '表单验证失败',
      errors: errors
    };
  }
  
  /**
   * 处理权限错误
   */
  handlePermissionError(error, context = '') {
    console.error(`权限错误 [${context}]:`, error);
    
    this.toast({
      title: '权限不足',
      description: '您没有权限执行此操作',
      variant: 'destructive'
    });
    
    return {
      type: ErrorTypes.PERMISSION_ERROR,
      message: '权限不足',
      originalError: error
    };
  }
  
  /**
   * 通用错误处理
   */
  handleError(error, context = '') {
    console.error(`未知错误 [${context}]:`, error);
    
    this.toast({
      title: '系统异常',
      description: '系统出现异常，请稍后重试',
      variant: 'destructive'
    });
    
    return {
      type: ErrorTypes.UNKNOWN_ERROR,
      message: '系统异常',
      originalError: error
    };
  }
  
  /**
   * 智能错误处理
   */
  handle(error, context = '') {
    if (!error) return null;
    
    // 网络错误判断
    if (error.message?.includes('Network') || error.message?.includes('网络')) {
      return this.handleNetworkError(error, context);
    }
    
    // 数据错误判断
    if (error.message?.includes('数据') || error.message?.includes('Data')) {
      return this.handleDataError(error, context);
    }
    
    // 权限错误判断
    if (error.message?.includes('权限') || error.message?.includes('Permission')) {
      return this.handlePermissionError(error, context);
    }
    
    // 默认处理
    return this.handleError(error, context);
  }
}

// 默认导出错误处理器实例
export const errorHandler = new ErrorHandler();

/**
 * 创建错误处理器的工厂函数
 */
export const createErrorHandler = (toast) => {
  return new ErrorHandler(toast);
};