import { useEffect, useRef, useState, useCallback } from 'react';
import { Video } from '@/types/video';

interface UseVideoPlaybackProps {
  video: Video;
  isPlaying: boolean;
  onEnded: () => void;
  onCanPlay: () => void;
  onLoadStart: () => void;
}

const isVideoPlaying = (video: HTMLVideoElement): boolean => {
  return !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
};

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
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const checkPlayingIntervalRef = useRef<number>();

  // Periodically check if video is actually playing
  const startPlayingCheck = useCallback(() => {
    if (checkPlayingIntervalRef.current) {
      window.clearInterval(checkPlayingIntervalRef.current);
    }

    checkPlayingIntervalRef.current = window.setInterval(() => {
      const video = videoRef.current;
      if (video && isVideoPlaying(video)) {
        console.log(`[Video ${video.id}] Confirmed playing - hiding loader`);
        setIsLoading(false);
      }
    }, 1000);
  }, []);

  const stopPlayingCheck = useCallback(() => {
    if (checkPlayingIntervalRef.current) {
      window.clearInterval(checkPlayingIntervalRef.current);
      checkPlayingIntervalRef.current = undefined;
    }
  }, []);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isPlaying) return;

    try {
      console.log(`[Video ${video.id}] Initiating play attempt`);
      playPromiseRef.current = video.play();
      
      if (playPromiseRef.current) {
        await playPromiseRef.current;
        console.log(`[Video ${video.id}] Started playing successfully`);
        if (isVideoPlaying(video)) {
          console.log(`[Video ${video.id}] Confirmed playing immediately`);
          setIsLoading(false);
        }
        setIsReady(true);
        startPlayingCheck();
        playAttempts.current = 0;
      }
    } catch (error) {
      console.error(`[Video ${video.id}] Failed to play:`, error);
      if (playAttempts.current < maxPlayAttempts) {
        playAttempts.current++;
        console.log(`[Video ${video.id}] Retry attempt ${playAttempts.current}/${maxPlayAttempts}`);
        setTimeout(play, 1000);
      } else {
        setIsReady(false);
        console.error(`[Video ${video.id}] Max play attempts reached`);
      }
    }
  }, [isPlaying, startPlayingCheck]);

  const pause = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      stopPlayingCheck();
      if (playPromiseRef.current) {
        await playPromiseRef.current;
      }
      video.pause();
      console.log(`[Video ${video.id}] Paused successfully`);
    } catch (error) {
      console.error(`[Video ${video.id}] Error pausing:`, error);
    }
  }, [stopPlayingCheck]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsReady(false);
      setIsLoading(true);
      console.log(`[Video ${video.id}] Loading started`);
      onLoadStart();
    };

    const handleCanPlay = () => {
      console.log(`[Video ${video.id}] Can play - ready to start playback`);
      if (isVideoPlaying(video)) {
        console.log(`[Video ${video.id}] Already playing when can play fired`);
        setIsLoading(false);
      }
      onCanPlay();
      if (isPlaying) {
        play();
      }
    };

    const handleEnded = () => {
      stopPlayingCheck();
      setIsReady(false);
      console.log(`[Video ${video.id}] Playback ended`);
      onEnded();
    };

    const handleError = (e: Event) => {
      const error = (e.target as HTMLVideoElement).error;
      console.error(`[Video ${video.id}] Error:`, error);
      stopPlayingCheck();
      setIsLoading(false);
      setIsReady(false);
    };

    const handleStalled = () => {
      console.log(`[Video ${video.id}] Playback stalled`);
      setIsLoading(true);
    };

    const handleWaiting = () => {
      console.log(`[Video ${video.id}] Playback waiting`);
      setIsLoading(true);
    };

    const handlePlaying = () => {
      console.log(`[Video ${video.id}] Playback resumed`);
      if (isVideoPlaying(video)) {
        console.log(`[Video ${video.id}] Confirmed playing on playing event`);
        setIsLoading(false);
      }
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [isPlaying, onCanPlay, onEnded, onLoadStart, play, stopPlayingCheck]);

  // Handle play state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      console.log(`[Video ${video.id}] Attempting to play`);
      play();
    } else {
      console.log(`[Video ${video.id}] Attempting to pause`);
      pause();
      setIsReady(false);
    }
  }, [isPlaying, play, pause]);

  // Load new video when URL changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    stopPlayingCheck();
    setIsReady(false);
    setIsLoading(true);
    playAttempts.current = 0;
    console.log(`[Video ${video.id}] Loading new video URL: ${video.src}`);
    video.load();
  }, [video.url, stopPlayingCheck]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      stopPlayingCheck();
    };
  }, [stopPlayingCheck]);

  return { videoRef, isReady, isLoading };
}