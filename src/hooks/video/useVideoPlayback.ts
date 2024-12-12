import { useEffect, useRef, useCallback } from 'react';
import { Video } from '@/types/video';
import { useVideoEvents } from './useVideoEvents';
import { useVideoState } from './useVideoState';
import { VIDEO_PLAYER_CONFIG } from '@/config/constants';

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
  const { isReady, setReady, resetState } = useVideoState();
  const playAttempts = useRef(0);

  const play = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || !isPlaying) return;

    try {
      await videoElement.play();
      setReady(true);
      playAttempts.current = 0;
    } catch (error) {
      console.error(`[Video] Failed to play:`, error);
      if (playAttempts.current < VIDEO_PLAYER_CONFIG.PLAY_ATTEMPTS) {
        playAttempts.current++;
        setTimeout(play, VIDEO_PLAYER_CONFIG.PLAY_RETRY_DELAY);
      }
    }
  }, [isPlaying, setReady]);

  useVideoEvents({
    videoRef,
    isPlaying,
    onEnded,
    onCanPlay,
    onLoadStart,
    onPlay: () => setReady(true),
    onPause: () => setReady(false),
    play,
  });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      play();
    } else {
      videoElement.pause();
      setReady(false);
    }
  }, [isPlaying, play, setReady]);

  useEffect(() => {
    if (!video?.url) return;
    
    const videoElement = videoRef.current;
    if (!videoElement) return;

    resetState();
    playAttempts.current = 0;
    videoElement.load();
  }, [video?.url, resetState]);

  return { videoRef, isReady };
}