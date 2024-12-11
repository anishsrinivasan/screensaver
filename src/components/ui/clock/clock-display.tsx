import React from 'react';
import { cn } from '@/lib/utils';

interface ClockDisplayProps {
  time: string;
  className?: string;
}

export function ClockDisplay({ time, className }: ClockDisplayProps) {
  return (
    <p className={cn(
      "text-white font-semibold text-2xl md:text-3xl",
      className
    )}>
      {time}
    </p>
  );
}