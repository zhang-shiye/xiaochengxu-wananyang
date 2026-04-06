// 数据管理工具 - 提供统一的数据处理和空值检查

/**
 * 安全访问对象属性，避免空值错误
 * @param {Object} obj - 要访问的对象
 * @param {string} path - 属性路径，支持点号分隔
 * @param {any} defaultValue - 默认值
 * @returns {any}
 */
export const safeGet = (obj, path, defaultValue = null) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result == null || typeof result !== 'object') return defaultValue;
    result = result[key];
  }
  
  return result ?? defaultValue;
};

/**
 * 检查数据是否为空或无效
 * @param {any} data - 要检查的数据
 * @returns {boolean}
 */
export const isEmptyData = (data) => {
  if (data == null) return true;
  if (typeof data === 'string' && data.trim() === '') return true;
  if (Array.isArray(data) && data.length === 0) return true;
  if (typeof data === 'object' && Object.keys(data).length === 0) return true;
  return false;
};

/**
 * 统一的数据加载状态管理
 */
export class DataLoader {
  constructor() {
    this.loadingStates = new Map();
    this.errorStates = new Map();
  }
  
  setLoading(key, isLoading) {
    this.loadingStates.set(key, isLoading);
  }
  
  setError(key, error) {
    this.errorStates.set(key, error);
  }
  
  getLoading(key) {
    return this.loadingStates.get(key) || false;
  }
  
  getError(key) {
    return this.errorStates.get(key) || null;
  }
  
  clear(key) {
    this.loadingStates.delete(key);
    this.errorStates.delete(key);
  }
}

/**
 * 数据验证工具
 */
export const validateData = {
  // 验证老人数据
  elder: (elderData) => {
    if (!elderData) return { isValid: false, message: '老人数据为空' };
    
    const requiredFields = ['name', 'age', 'roomNumber'];
    const missingFields = requiredFields.filter(field => !elderData[field]);
    
    if (missingFields.length > 0) {
      return { 
        isValid: false, 
        message: `缺少必要字段: ${missingFields.join(', ')}` 
      };
    }
    
    return { isValid: true, message: '数据有效' };
  },
  
  // 验证请假申请数据
  leaveRequest: (leaveData) => {
    if (!leaveData) return { isValid: false, message: '请假数据为空' };
    
    const requiredFields = ['reason', 'startDate', 'endDate'];
    const missingFields = requiredFields.filter(field => !leaveData[field]);
    
    if (missingFields.length > 0) {
      return { 
        isValid: false, 
        message: `缺少必要字段: ${missingFields.join(', ')}` 
      };
    }
    
    // 验证日期逻辑
    const startDate = new Date(leaveData.startDate);
    const endDate = new Date(leaveData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      return { isValid: false, message: '开始日期不能早于今天' };
    }
    
    if (endDate < startDate) {
      return { isValid: false, message: '结束日期不能早于开始日期' };
    }
    
    return { isValid: true, message: '数据有效' };
  },
  
  // 验证账单数据
  bill: (billData) => {
    if (!billData) return { isValid: false, message: '账单数据为空' };
    
    const requiredFields = ['amount', 'dueDate', 'elderId'];
    const missingFields = requiredFields.filter(field => !billData[field]);
    
    if (missingFields.length > 0) {
      return { 
        isValid: false, 
        message: `缺少必要字段: ${missingFields.join(', ')}` 
      };
    }
    
    return { isValid: true, message: '数据有效' };
  }
};

/**
 * 数据格式化工具
 */
export const formatData = {
  // 格式化日期
  date: (dateString, format = 'YYYY-MM-DD') => {
    if (!dateString) return '未知';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '无效日期';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  },
  
  // 格式化金额
  amount: (amount) => {
    if (amount == null || isNaN(amount)) return '¥0.00';
    return `¥${parseFloat(amount).toFixed(2)}`;
  },
  
  // 格式化电话号码
  phone: (phoneNumber) => {
    if (!phoneNumber) return '未知';
    
    // 简单的手机号格式化
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    
    return phoneNumber;
  }
};

// 默认导出数据管理工具实例
export const dataLoader = new DataLoader();