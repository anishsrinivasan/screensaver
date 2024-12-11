import { useCallback } from 'react';
import { Video } from '@/types/video';
import { shuffle } from '@/lib/array';

interface UseVideoNavigationProps {
  videos: Video[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  setVideos: (videos: Video[]) => void;
}

export function useVideoNavigation({
  videos,
  currentIndex,
  setCurrentIndex,
  setVideos,
}: UseVideoNavigationProps) {
  const nextVideo = useCallback(() => {
    if (videos.length === 0) return;
    
    setCurrentIndex((prev) => {
      const next = (prev + 1) % videos.length;
      console.log(`[Playlist] Moving to next video: ${videos[next].title}`);
      return next;
    });
  }, [videos, setCurrentIndex]);

  const previousVideo = useCallback(() => {
    if (videos.length === 0) return;
    
    setCurrentIndex((prev) => {
      const next = (prev - 1 + videos.length) % videos.length;
      console.log(`[Playlist] Moving to previous video: ${videos[next].title}`);
      return next;
    });
  }, [videos, setCurrentIndex]);

  const resetPlaylist = useCallback(() => {
    if (videos.length === 0) return;
    
    const shuffledVideos = shuffle([...videos]);
    console.log('[Playlist] Resetting playlist order');
    setVideos(shuffledVideos);
    setCurrentIndex(0);
  }, [videos, setVideos, setCurrentIndex]);

  return {
    nextVideo,
    previousVideo,
    resetPlaylist,
  };
}