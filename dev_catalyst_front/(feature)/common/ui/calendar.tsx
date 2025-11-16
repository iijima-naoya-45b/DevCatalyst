'use client';

import * as React from 'react';
import cn from './utils';

type CalendarProps = {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

function Calendar({ value, onChange, className }: CalendarProps) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        'border-input bg-background text-foreground h-10 rounded-md border px-3 text-sm',
        className
      )}
    />
  );
}

export { Calendar };
