import { useState, useCallback, useEffect } from 'react';
import { videos as originalVideos } from '../data/videos';
import { shuffle } from '@/lib/array';
import { Video } from '@/types/video';

export function useVideoPlaylist() {
  const [videos, setVideos] = useState<Video[]>(originalVideos);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Shuffle videos when the playlist is initialized
  useEffect(() => {
    const shuffledVideos = shuffle(originalVideos);
    console.log('[Playlist] Initialized with shuffled videos:', 
      shuffledVideos.map(v => v.title));
    setVideos(shuffledVideos);
    setCurrentIndex(0);
  }, []);

  const nextVideo = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % videos.length;
      console.log(`[Playlist] Moving to next video: ${videos[next].title}`);
      return next;
    });
  }, [videos.length]);

  const previousVideo = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev - 1 + videos.length) % videos.length;
      console.log(`[Playlist] Moving to previous video: ${videos[next].title}`);
      return next;
    });
  }, [videos.length]);

  // Reset playlist with new shuffled order
  const resetPlaylist = useCallback(() => {
    const shuffledVideos = shuffle(originalVideos);
    console.log('[Playlist] Resetting with new shuffled order:', 
      shuffledVideos.map(v => v.title));
    setVideos(shuffledVideos);
    setCurrentIndex(0);
  }, []);

  return {
    currentVideo: videos[currentIndex],
    nextVideo,
    previousVideo,
    resetPlaylist,
    totalVideos: videos.length,
    currentIndex,
  };
}