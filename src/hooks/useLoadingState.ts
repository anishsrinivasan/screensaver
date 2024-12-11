import { useState, useCallback, useRef, useEffect } from 'react';
import { VIDEO_PLAYER_CONFIG } from '@/config/constants';

export function useLoadingState(delay = VIDEO_PLAYER_CONFIG.LOADING_DELAY) {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const loadingTimeout = useRef<number>();

  const startLoading = useCallback(() => {
    setIsLoading(true);
    // Clear any existing timeout
    if (loadingTimeout.current) {
      window.clearTimeout(loadingTimeout.current);
    }
    // Set timeout to show loader after delay
    loadingTimeout.current = window.setTimeout(() => {
      if (isLoading) {
        setShouldShowLoader(true);
      }
    }, delay);
  }, [delay, isLoading]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setShouldShowLoader(false);
    if (loadingTimeout.current) {
      window.clearTimeout(loadingTimeout.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeout.current) {
        window.clearTimeout(loadingTimeout.current);
      }
    };
  }, []);

  return {
    isLoading,
    shouldShowLoader,
    startLoading,
    stopLoading
  };
}