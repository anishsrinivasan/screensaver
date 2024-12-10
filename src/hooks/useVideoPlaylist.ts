import { useState, useCallback, useEffect } from 'react';
import { videos as originalVideos } from '../data/videos';
import { shuffle } from '@/lib/array';
import { Video } from '@/types/video';

export function useVideoPlaylist() {
  const [videos, setVideos] = useState<Video[]>(originalVideos);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Shuffle videos when the playlist is initialized
  useEffect(() => {
    setVideos(shuffle(originalVideos));
    setCurrentIndex(0);
  }, []);

  const nextVideo = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  const previousVideo = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  }, [videos.length]);

  // Reset playlist with new shuffled order
  const resetPlaylist = useCallback(() => {
    setVideos(shuffle(originalVideos));
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