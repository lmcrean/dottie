import React from 'react';
import { PATTERN_DATA } from '../../../../steps/context/types/recommendations';
import { MenstrualPattern } from '@/src/pages/assessment/steps/context/types';

interface PatternIconProps {
  pattern: MenstrualPattern;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PatternIcon = ({ pattern, size = 'md', className = '' }: PatternIconProps) => {
  const patternInfo = PATTERN_DATA[pattern];
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  return (
    <img
      src={patternInfo.icon}
      className={`${sizeClasses[size]} ${className}`}
      alt={`${patternInfo.title} icon`}
      title={patternInfo.title}
    />
  );
}; 