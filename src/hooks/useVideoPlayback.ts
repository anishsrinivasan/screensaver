import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const playAttempts = useRef(0);
  const maxPlayAttempts = 3;

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isPlaying) return;

    try {
      await video.play();
      setIsReady(true);
      setIsLoading(false);
      playAttempts.current = 0;
    } catch (error) {
      console.error('Failed to play video:', error);
      if (playAttempts.current < maxPlayAttempts) {
        playAttempts.current++;
        setTimeout(play, 1000);
      } else {
        setIsReady(false);
        console.error('Max play attempts reached');
      }
    }
  }, [isPlaying]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsReady(false);
      setIsLoading(true);
      onLoadStart();
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      onCanPlay();
      if (isPlaying) {
        play();
      }
    };

    const handleEnded = () => {
      setIsReady(false);
      onEnded();
    };

    const handleError = (e: Event) => {
      console.error('Video error:', (e.target as HTMLVideoElement).error);
      setIsLoading(false);
      setIsReady(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [isPlaying, onCanPlay, onEnded, onLoadStart, play]);

  // Handle play state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      play();
    } else {
      video.pause();
      setIsReady(false);
    }
  }, [isPlaying, play]);

  // Load new video when URL changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsReady(false);
    setIsLoading(true);
    playAttempts.current = 0;
    video.load();
  }, [video.url]);

  return { videoRef, isReady, isLoading };
}