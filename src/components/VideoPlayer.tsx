import React, { useRef, useEffect, useCallback, useState } from 'react';
import { VideoControls } from './VideoControls';
import { VideoCredits } from './VideoCredits';
import { useVideoPlaylist } from '../hooks/useVideoPlaylist';
import { useControlsVisibility } from '../hooks/useControlsVisibility';
import { LoadingScreen } from './LoadingScreen';

interface VideoPlayerProps {
  isPlaying: boolean;
  onExit: () => void;
}

export function VideoPlayer({ isPlaying, onExit }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentVideo, nextVideo, previousVideo, currentIndex, totalVideos } = useVideoPlaylist();
  const { isVisible, showControls } = useControlsVisibility();

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (isPlaying) {
      if (e.code === 'Space') {
        e.preventDefault();
        nextVideo();
      } else if (e.code === 'ArrowRight') {
        nextVideo();
      } else if (e.code === 'ArrowLeft') {
        previousVideo();
      }
      showControls();
    }
  }, [isPlaying, nextVideo, previousVideo, showControls]);

  const handleMouseMove = useCallback(() => {
    if (isPlaying) {
      showControls();
    }
  }, [isPlaying, showControls]);

  const handleVideoEnd = useCallback(() => {
    nextVideo();
  }, [nextVideo]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle video playback when the loading state or isPlaying changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying && !isLoading) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, handle this case if needed
        });
      }
    }
  }, [isPlaying, isLoading]);

  // Handle video source changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    video.load();
  }, [currentVideo.url]);

  useEffect(() => {
    const container = containerRef.current;

    if (isPlaying && container) {
      container.requestFullscreen();
    } else if (!isPlaying && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [isPlaying]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onExit();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onExit]);

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full ${isPlaying ? 'fixed inset-0 bg-black z-50' : 'hidden'}`}
      onClick={nextVideo}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        onEnded={handleVideoEnd}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
      >
        <source src={currentVideo.url} type="video/mp4" />
      </video>

      {isLoading && <LoadingScreen />}

      {isPlaying && (
        <>
          <VideoControls
            onNext={nextVideo}
            onPrevious={previousVideo}
            currentIndex={currentIndex}
            totalVideos={totalVideos}
            isVisible={isVisible}
          />
          <VideoCredits
            title={currentVideo.title}
            author={currentVideo.author}
            source={currentVideo.source}
            isVisible={isVisible}
          />
        </>
      )}
    </div>
  );
}