import { useState, useCallback } from 'react';
import { videos } from '../data/videos';

export function useVideoPlaylist() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  }, []);

  const previousVideo = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  }, []);

  return {
    currentVideo: videos[currentIndex],
    nextVideo,
    previousVideo,
    totalVideos: videos.length,
    currentIndex,
  };
}