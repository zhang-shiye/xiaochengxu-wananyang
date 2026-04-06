// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';

// 表单验证规则
export const validationRules = {
  required: value => !value && '此字段为必填项',
  email: value => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && '请输入有效的邮箱地址',
  phone: value => !/^1[3-9]\d{9}$/.test(value) && '请输入有效的手机号码',
  minLength: min => value => value.length < min && `至少需要${min}个字符`,
  maxLength: max => value => value.length > max && `不能超过${max}个字符`,
  date: value => !/^\d{4}-\d{2}-\d{2}$/.test(value) && '请输入有效的日期格式(YYYY-MM-DD)',
  number: value => isNaN(value) && '请输入有效的数字'
};

// 表单验证钩子
export function useFormValidation(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const {
    toast
  } = useToast();
  const validateField = (name, value, rules = []) => {
    const fieldErrors = [];
    rules.forEach(rule => {
      const error = rule(value);
      if (error) fieldErrors.push(error);
    });
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[0] || null
    }));
    return fieldErrors.length === 0;
  };
  const validateForm = rules => {
    const newErrors = {};
    let isValid = true;
    Object.keys(rules).forEach(name => {
      const fieldRules = rules[name];
      const value = values[name];
      const fieldErrors = [];
      fieldRules.forEach(rule => {
        const error = rule(value);
        if (error) fieldErrors.push(error);
      });
      if (fieldErrors.length > 0) {
        newErrors[name] = fieldErrors[0];
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };
  const handleChange = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // 实时验证已触摸的字段
    if (touched[name]) {
      validateField(name, value, []);
    }
  };
  const handleBlur = name => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  const showSuccessToast = (message = '操作成功') => {
    toast({
      title: '成功',
      description: message,
      variant: 'default'
    });
  };
  const showErrorToast = (message = '操作失败，请重试') => {
    toast({
      title: '错误',
      description: message,
      variant: 'destructive'
    });
  };
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    resetForm,
    showSuccessToast,
    showErrorToast,
    setValues,
    setErrors
  };
}

// 表单提交按钮组件
export function SubmitButton({
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  return <button type="submit" disabled={disabled || loading} className={`
        w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200
        ${loading || disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 active:scale-95'}
        ${className}
      `} {...props}>
      {loading ? <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          提交中...
        </div> : children}
    </button>;
}