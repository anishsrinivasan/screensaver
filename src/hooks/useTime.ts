import { useState, useEffect } from 'react';
import { formatTime } from '@/lib/date';

export function useTime() {
  const [time, setTime] = useState<string>(formatTime(new Date()));

  useEffect(() => {
    const updateTime = () => {
      setTime(formatTime(new Date()));
    };

    // Initial update
    updateTime();

    // Calculate delay until next second
    const now = new Date();
    const delay = 1000 - now.getMilliseconds();

    // Set initial timeout to sync with system clock
    const timeout = setTimeout(() => {
      updateTime();
      
      // Start interval at the beginning of a second
      const interval = setInterval(updateTime, 1000);
      
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  return time;
}