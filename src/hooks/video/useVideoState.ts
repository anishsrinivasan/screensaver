import { useState, useCallback } from 'react';

export function useVideoState() {
  const [isReady, setIsReady] = useState(false);

  const setReady = useCallback((ready: boolean) => {
    setIsReady(ready);
  }, []);

  const resetState = useCallback(() => {
    setIsReady(false);
  }, []);

  return {
    isReady,
    setReady,
    resetState,
  };
}