import { useEffect, useRef, useState, useCallback } from 'react';
import { Video } from '@/types/video';
import { useVideoEvents } from './video/useVideoEvents';
import { useVideoState } from './video/useVideoState';

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
  const maxPlayAttempts = 3;

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isPlaying) return;

    try {
      await video.play();
      setReady(true);
      playAttempts.current = 0;
    } catch (error) {
      console.error(`[Video] Failed to play:`, error);
      if (playAttempts.current < maxPlayAttempts) {
        playAttempts.current++;
        setTimeout(play, 1000);
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

  // Handle play/pause state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      play();
    } else {
      video.pause();
      setReady(false);
    }
  }, [isPlaying, play, setReady]);

  // Handle video source changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    resetState();
    playAttempts.current = 0;
    video.load();
  }, [video.url, resetState]);

  return { videoRef, isReady };
}