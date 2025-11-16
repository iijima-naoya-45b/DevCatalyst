'use client';

import { cn } from '@/lib/utils';
import { LpSectionProps } from '../types';

export function LpSection({ id, children, className, containerClassName }: LpSectionProps) {
  return (
    <section
      id={id}
      className={cn('relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden', className)}
    >
      <div className={cn('max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10', containerClassName)}>
        {children}
      </div>
    </section>
  );
}

