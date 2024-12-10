import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VideoControls } from './VideoControls';
import { VideoCredits } from './VideoCredits';
import { useVideoPlaylist } from '../hooks/useVideoPlaylist';
import { useControlsVisibility } from '../hooks/useControlsVisibility';
import { VideoTransition } from './VideoTransition';
import { LoadingScreen } from './LoadingScreen';

interface VideoPlayerProps {
  isPlaying: boolean;
  onExit: () => void;
}

export function VideoPlayer({ isPlaying, onExit }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    currentVideo, 
    nextVideo, 
    previousVideo, 
    currentIndex, 
    totalVideos, 
    resetPlaylist
  } = useVideoPlaylist();
  const { isVisible, showControls } = useControlsVisibility();

  // Reset playlist when screensaver starts
  useEffect(() => {
    if (isPlaying) {
      resetPlaylist();
    }
  }, [isPlaying, resetPlaylist]);

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

  useEffect(() => {
    const container = containerRef.current;
    if (isPlaying && container) {
      container.requestFullscreen().catch(console.error);
    } else if (!isPlaying && document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
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
      <VideoTransition
        video={currentVideo}
        isPlaying={isPlaying}
        onEnded={handleVideoEnd}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
      />

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