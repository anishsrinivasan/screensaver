import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VideoControls } from './VideoControls';
import { VideoCredits } from './VideoCredits';
import { Clock } from './Clock';
import { useVideoPlaylist } from '../hooks/useVideoPlaylist';
import { useControlsVisibility } from '../hooks/useControlsVisibility';
import { useVideoState } from '../hooks/useVideoState';
import { VideoTransition } from './VideoTransition';
import { LoadingScreen } from './LoadingScreen';

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
    resetPlaylist
  } = useVideoPlaylist();
  const { isVisible, showControls } = useControlsVisibility();
  const { isLoading, handleLoadStart, handleCanPlay } = useVideoState();

  useEffect(() => {
    if (isPlaying) {
      console.log('[Player] Starting playback session');
      resetPlaylist();
    }
  }, [isPlaying, resetPlaylist]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) return;
    
    if (e.code === 'Space' || e.code === 'ArrowRight') {
      e.preventDefault();
      console.log('[Player] Next video triggered by keyboard:', e.code);
      nextVideo();
    } else if (e.code === 'ArrowLeft') {
      console.log('[Player] Previous video triggered by keyboard:', e.code);
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
      console.log('[Player] Requesting fullscreen');
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
        console.log('[Player] Exiting fullscreen - stopping playback');
        onExit();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onExit]);

  const handleVideoEnd = useCallback(() => {
    console.log('[Player] Video ended - moving to next');
    nextVideo();
  }, [nextVideo]);

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full ${isPlaying ? 'fixed inset-0 bg-black z-50' : 'hidden'}`}
      onClick={() => {
        console.log('[Player] Next video triggered by click');
        nextVideo();
      }}
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
          <Clock isVisible={true} />
        </>
      )}
    </div>
  );
}