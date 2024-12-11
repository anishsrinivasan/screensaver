import React from 'react';
import { cn } from '@/lib/utils';

interface ClockContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ClockContainer({ children, className }: ClockContainerProps) {
  return (
    <div className={cn(
      "fixed z-50 px-6 py-3 rounded-full",
      className
    )}>
      {children}
    </div>
  );
}