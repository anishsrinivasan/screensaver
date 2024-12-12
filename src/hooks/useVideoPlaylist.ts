import { useState } from 'react';
import { useVideos } from './data';
import { useVideoInitialization } from './video/useVideoInitialization';
import { useVideoNavigation } from './video/useVideoNavigation';
import type { Video } from '@/types/video';

export function useVideoPlaylist() {
  const { videos: fetchedVideos, isLoading } = useVideos();
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useVideoInitialization({
    fetchedVideos,
    isLoading,
    setVideos,
  });

  const { nextVideo, previousVideo, resetPlaylist } = useVideoNavigation({
    videos,
    currentIndex,
    setCurrentIndex,
    setVideos,
  });

  return {
    currentVideo: videos[currentIndex],
    nextVideo,
    previousVideo,
    resetPlaylist,
    totalVideos: videos.length,
    currentIndex,
    isLoading,
    hasVideos: videos.length > 0
  };
}