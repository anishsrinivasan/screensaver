import { useState, useEffect, useCallback } from 'react';
import { VIDEO_PLAYER_CONFIG } from '@/config/constants';

export function useControlsVisibility(timeout = VIDEO_PLAYER_CONFIG.CONTROLS_TIMEOUT) {
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