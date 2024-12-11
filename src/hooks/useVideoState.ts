import { useState, useCallback } from 'react';

export function useVideoState() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadStart = useCallback(() => {
    console.log('[VideoState] Loading started');
    setIsLoading(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    console.log('[VideoState] Can play - hiding loader');
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    console.log('[VideoState] Error occurred - hiding loader');
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    handleLoadStart,
    handleCanPlay,
    handleError
  };
}