'use client';

import { cn } from '@/lib/utils';
import { LpInfoCardProps } from '../types';

export function LpInfoCard({
  icon,
  title,
  description,
  children,
  className,
  iconWrapperClassName,
  titleClassName,
  descriptionClassName,
  style,
}: LpInfoCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gold/30 bg-white/95 p-8 shadow-lg transition-all duration-300 dark:border-gold/35 dark:bg-slate-900/60',
        className
      )}
      style={style}
    >
      {icon && (
        <div className={cn('mb-6 flex items-center justify-center', iconWrapperClassName)}>
          {icon}
        </div>
      )}

      {title && (
        <h3
          className={cn('mb-4 text-xl font-semibold text-gray-900 dark:text-white', titleClassName)}
        >
          {title}
        </h3>
      )}

      {description && (
        <div
          className={cn(
            'text-sm leading-relaxed text-gray-600 dark:text-gray-400',
            descriptionClassName
          )}
        >
          {description}
        </div>
      )}

      {children}
    </div>
  );
}
