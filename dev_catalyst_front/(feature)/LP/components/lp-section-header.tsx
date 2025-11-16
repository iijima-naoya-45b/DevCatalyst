'use client';

import { cn } from '@/lib/utils';
import { LpSectionHeaderProps, LpSectionHeaderAlign } from '../types';

export function LpSectionHeader({
  label,
  title,
  description,
  align = 'center',
  className,
  labelClassName,
  titleClassName,
  descriptionClassName,
  isVisible = true,
  transitionDelay = 0,
}: LpSectionHeaderProps) {
  const alignment = align === 'center' ? 'text-center' : 'text-left';
  const baseTransition = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';

  const style = transitionDelay ? { transitionDelay: `${transitionDelay}ms` } : undefined;

  return (
    <div className={cn(alignment, className)}>
      {label && (
        <span
          className={cn(
            'inline-block text-sm font-semibold uppercase tracking-wider gold-soft-text transition-all duration-1000',
            baseTransition,
            labelClassName
          )}
          style={style}
        >
          {label}
        </span>
      )}

      <h2
        className={cn(
          'mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 dark:text-white transition-all duration-1000',
          baseTransition,
          titleClassName
        )}
        style={style}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto transition-all duration-1000',
            align === 'left' ? 'mx-0' : 'mx-auto',
            baseTransition,
            descriptionClassName
          )}
          style={style}
        >
          {description}
        </p>
      )}
    </div>
  );
}
