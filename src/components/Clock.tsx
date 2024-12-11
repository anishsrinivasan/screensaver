import React, { memo } from 'react';
import { useTime } from '@/hooks/useTime';
import { ClockContainer } from '@/components/ui/clock/clock-container';
import { ClockDisplay } from '@/components/ui/clock/clock-display';

interface ClockProps {
  isVisible: boolean;
}

export const Clock = memo(function Clock({ isVisible }: ClockProps) {
  const time = useTime();

  return (
    <ClockContainer 
      className={`
        bottom-6 right-6 
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <ClockDisplay time={time} />
    </ClockContainer>
  );
});