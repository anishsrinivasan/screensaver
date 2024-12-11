import { useState, useEffect } from 'react';
import { fetchVideos } from '@/services/api/videos';
import { fallbackVideos } from '@/data/videos';
import type { Video } from '@/types/video';

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        const data = await fetchVideos();
        setVideos(data);
      } catch (err) {
        console.warn('Falling back to local videos:', err);
        setVideos(fallbackVideos);
        setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
      } finally {
        setIsLoading(false);
      }
    }

    loadVideos();
  }, []);

  return {
    videos,
    isLoading,
    error,
    hasError: error !== null
  };
}