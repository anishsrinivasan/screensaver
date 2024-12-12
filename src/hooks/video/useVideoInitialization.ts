import { useEffect, useRef } from 'react';
import { Video } from '@/types/video';
import { shuffle } from '@/lib/array';

interface UseVideoInitializationProps {
  fetchedVideos: Video[];
  isLoading: boolean;
  setVideos: (videos: Video[]) => void;
}

export function useVideoInitialization({ 
  fetchedVideos, 
  isLoading, 
  setVideos 
}: UseVideoInitializationProps) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isLoading && fetchedVideos.length > 0 && !hasInitialized.current) {
      const shuffledVideos = shuffle(fetchedVideos);
      console.log('[Playlist] Initializing with shuffled videos');
      setVideos(shuffledVideos);
      hasInitialized.current = true;
    }
  }, [fetchedVideos, isLoading, setVideos]);

  return { hasInitialized };
}