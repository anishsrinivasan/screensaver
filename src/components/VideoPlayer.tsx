import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VideoControls } from './VideoControls';
import { VideoCredits } from './VideoCredits';
import { Clock } from './Clock';
import { useVideoPlaylist } from '@/hooks/useVideoPlaylist';
import { useControlsVisibility } from '@/hooks/useControlsVisibility';
import { useLoadingState } from '@/hooks/useLoadingState';
import { VideoTransition } from './VideoTransition';
import { LoadingScreen } from './LoadingScreen';
import { VIDEO_PLAYER_CONFIG } from '@/config/constants';

interface VideoPlayerProps {
  isPlaying: boolean;
  onExit: () => void;
}

export function VideoPlayer({ isPlaying, onExit }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    currentVideo, 
    nextVideo, 
    previousVideo, 
    currentIndex, 
    totalVideos,
    resetPlaylist,
    isLoading: isLoadingVideos,
    hasVideos
  } = useVideoPlaylist();
  const { isVisible, showControls } = useControlsVisibility(VIDEO_PLAYER_CONFIG.CONTROLS_TIMEOUT);
  const { shouldShowLoader, startLoading, stopLoading } = useLoadingState(VIDEO_PLAYER_CONFIG.LOADING_DELAY);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isPlaying && hasVideos && !hasStarted) {
      console.log('[Player] Starting playback session');
      resetPlaylist();
      setHasStarted(true);
    }
  }, [isPlaying, hasVideos, resetPlaylist, hasStarted]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isPlaying || !hasVideos) return;
    
    if (e.code === 'Space' || e.code === 'ArrowRight') {
      e.preventDefault();
      console.log('[Player] Next video triggered by keyboard:', e.code);
      nextVideo();
    } else if (e.code === 'ArrowLeft') {
      console.log('[Player] Previous video triggered by keyboard:', e.code);
      previousVideo();
    }
    showControls();
  }, [isPlaying, hasVideos, nextVideo, previousVideo, showControls]);

  const handleMouseMove = useCallback(() => {
    if (isPlaying) {
      showControls();
    }
  }, [isPlaying, showControls]);

  useEffect(() => {
    const container = containerRef.current;
    if (isPlaying && container && hasVideos) {
      console.log('[Player] Requesting fullscreen');
      container.requestFullscreen().catch(console.error);
    }
  }, [isPlaying, hasVideos]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        console.log('[Player] Exiting fullscreen - stopping playback');
        onExit();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onExit]);

  const handleVideoEnd = useCallback(() => {
    if (!hasVideos) return;
    console.log('[Player] Video ended - moving to next');
    nextVideo();
  }, [nextVideo, hasVideos]);

  if (isLoadingVideos) {
    return <LoadingScreen />;
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full ${isPlaying ? 'fixed inset-0 bg-black z-50' : 'hidden'}`}
      onClick={() => {
        if (hasVideos) {
          console.log('[Player] Next video triggered by click');
          nextVideo();
        }
      }}
      onMouseMove={handleMouseMove}
    >
      {currentVideo && (
        <VideoTransition
          video={currentVideo}
          isPlaying={isPlaying}
          onEnded={handleVideoEnd}
          onLoadStart={startLoading}
          onCanPlay={stopLoading}
        />
      )}

      {shouldShowLoader && <LoadingScreen />}

      {isPlaying && currentVideo && (
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
          <Clock isVisible={true} />
        </>
      )}
    </div>
  );
}