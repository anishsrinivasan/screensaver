import React, { useRef, useEffect } from 'react';

interface VideoTransitionProps {
  currentUrl: string;
  isPlaying: boolean;
  onEnded: () => void;
}

export function VideoTransition({ currentUrl, isPlaying, onEnded }: VideoTransitionProps) {
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const previousVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const currentVideo = currentVideoRef.current;
    const previousVideo = previousVideoRef.current;

    if (currentVideo && previousVideo) {
      // Start playing the new video
      currentVideo.load();
      if (isPlaying) {
        const playPromise = currentVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }

      // Fade out the previous video
      previousVideo.style.opacity = '1';
      setTimeout(() => {
        previousVideo.style.opacity = '0';
      }, 0);

      // After transition, update the previous video source
      setTimeout(() => {
        previousVideo.src = currentUrl;
      }, 1000);
    }
  }, [currentUrl, isPlaying]);

  return (
    <>
      <video
        ref={previousVideoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        muted
        playsInline
      />
      <video
        ref={currentVideoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        onEnded={onEnded}
      >
        <source src={currentUrl} type="video/mp4" />
      </video>
    </>
  );
}