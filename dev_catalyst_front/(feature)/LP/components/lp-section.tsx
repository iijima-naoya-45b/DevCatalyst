'use client';

import { cn } from '@/lib/utils';
import { LpSectionProps } from '../types';

export function LpSection({ id, children, className, containerClassName }: LpSectionProps) {
  return (
    <section
      id={id}
      className={cn('relative py-24 md:py-32 overflow-hidden', className)}
    >
      <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10', containerClassName)}>
        {children}
      </div>
    </section>
  );
}

