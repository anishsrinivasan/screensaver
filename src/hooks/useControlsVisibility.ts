import { useState, useEffect, useCallback } from 'react';

export function useControlsVisibility(timeout = 3000) {
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId: number;

  const showControls = useCallback(() => {
    setIsVisible(true);
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, timeout);
  }, [timeout]);

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  return { isVisible, showControls };
}