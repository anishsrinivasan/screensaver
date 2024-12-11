import { useState, useEffect } from 'react';
import { getVideos } from '@/lib/supabase';
import type { Video } from '@/types/video';

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadVideos() {
      try {
        const data = await getVideos();
        if (isMounted) {
          setVideos(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    videos,
    isLoading,
    error,
    hasError: error !== null
  };
}