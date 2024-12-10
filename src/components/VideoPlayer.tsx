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

  useEffect(() => {
    if (isPlaying) {
      resetPlaylist();
    }
  }, [isPlaying, resetPlaylist]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) return;
    
    if (e.code === 'Space' || e.code === 'ArrowRight') {
      e.preventDefault();
      nextVideo();
    } else if (e.code === 'ArrowLeft') {
      previousVideo();
    }
    showControls();
  }, [isPlaying, nextVideo, previousVideo, showControls]);

  const handleMouseMove = useCallback(() => {
    if (isPlaying) {
      showControls();
    }
  }, [isPlaying, showControls]);

  useEffect(() => {
    const container = containerRef.current;
    if (isPlaying && container) {
      container.requestFullscreen().catch(console.error);
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
        onEnded={nextVideo}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
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