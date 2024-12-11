import { useEffect } from 'react';

interface UseVideoEventsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  onEnded: () => void;
  onCanPlay: () => void;
  onLoadStart: () => void;
  onPlay: () => void;
  onPause: () => void;
  play: () => Promise<void>;
}

export function useVideoEvents({
  videoRef,
  isPlaying,
  onEnded,
  onCanPlay,
  onLoadStart,
  onPlay,
  onPause,
  play,
}: UseVideoEventsProps) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      onLoadStart();
    };

    const handleCanPlay = () => {
      onCanPlay();
      if (isPlaying) {
        play();
      }
    };

    const handlePlay = () => {
      onPlay();
    };

    const handlePause = () => {
      onPause();
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', onEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isPlaying, onCanPlay, onEnded, onLoadStart, onPause, onPlay, play]);
}