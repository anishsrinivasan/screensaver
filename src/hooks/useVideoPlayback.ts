import { useEffect, useRef, useState } from 'react';
import { Video } from '@/types/video';

interface UseVideoPlaybackProps {
  video: Video;
  isPlaying: boolean;
  onEnded: () => void;
  onCanPlay: () => void;
  onLoadStart: () => void;
}

export function useVideoPlayback({
  video,
  isPlaying,
  onEnded,
  onCanPlay,
  onLoadStart,
}: UseVideoPlaybackProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const playAttempts = useRef(0);
  const maxPlayAttempts = 5;
  const attemptTimeout = useRef<number>();
  const isLoadingRef = useRef(false);

  const attemptPlay = async () => {
    const videoElement = videoRef.current;
    if (!videoElement || !isPlaying || isLoadingRef.current) return;

    try {
      await videoElement.play();
      playAttempts.current = 0;
      setIsReady(true);
    } catch (error) {
      console.warn('Playback attempt failed:', error);
      
      if (playAttempts.current < maxPlayAttempts) {
        playAttempts.current++;
        attemptTimeout.current = window.setTimeout(
          attemptPlay,
          Math.min(1000 * playAttempts.current, 5000)
        );
      }
    }
  };

  // Reset state when video changes
  useEffect(() => {
    setIsReady(false);
    playAttempts.current = 0;
    isLoadingRef.current = true;

    if (attemptTimeout.current) {
      clearTimeout(attemptTimeout.current);
    }

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = 0;
      videoElement.load();
    }
  }, [video.url]); // Changed from video.id to video.url to ensure proper reloading

  // Handle video loading and metadata
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadStart = () => {
      isLoadingRef.current = true;
      setIsReady(false);
      onLoadStart();
    };

    const handleCanPlay = () => {
      isLoadingRef.current = false;
      onCanPlay();
      if (isPlaying) attemptPlay();
    };

    const handleLoadedMetadata = () => {
      if (isPlaying && !isLoadingRef.current) attemptPlay();
    };

    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      console.error('Video loading error:', target.error);
      isLoadingRef.current = false;
    };

    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('error', handleError);
    };
  }, [isPlaying, onCanPlay, onLoadStart]);

  // Handle play state changes
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying && !isLoadingRef.current) {
      attemptPlay();
    } else if (!isPlaying) {
      videoElement.pause();
      setIsReady(false);
    }

    return () => {
      if (attemptTimeout.current) {
        clearTimeout(attemptTimeout.current);
      }
    };
  }, [isPlaying]);

  return {
    videoRef,
    isReady,
  };
}