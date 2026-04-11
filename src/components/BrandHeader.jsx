// @ts-ignore;
import React from 'react';

export default function BrandHeader({
  variant = 'default',
  className = ''
}) {
  const variants = {
    default: {
      title: '皖安养',
      subtitle: '用心陪伴 安心养老',
      titleSize: 'text-4xl',
      subtitleSize: 'text-lg'
    },
    small: {
      title: '皖安养',
      subtitle: '用心陪伴 安心养老',
      titleSize: 'text-2xl',
      subtitleSize: 'text-base'
    },
    minimal: {
      title: '皖安养',
      subtitle: '',
      titleSize: 'text-xl',
      subtitleSize: ''
    }
  };
  const currentVariant = variants[variant] || variants.default;
  return <div className={`text-center ${className}`}>
      <h1 className={`${currentVariant.titleSize} font-bold text-amber-900 mb-2`} style={{
      fontFamily: 'Playfair Display, serif'
    }}>
        {currentVariant.title}
      </h1>
      {currentVariant.subtitle && <p className={`${currentVariant.subtitleSize} text-amber-700`} style={{
      fontFamily: 'Nunito Sans, sans-serif'
    }}>
          {currentVariant.subtitle}
        </p>}
    </div>;
}