import { useEffect, useRef } from 'react';
import { Video } from '@/types/video';

export function useVideoPreload(nextVideo: Video) {
  const preloadVideoRef = useRef<HTMLVideoElement | null>(null);
  const preloadedUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Check if the browser supports the Network Information API
    const connection = (navigator as any).connection;
    const shouldPreload = !connection || 
      (connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g');

    if (shouldPreload && nextVideo?.url && !preloadedUrls.current.has(nextVideo.url)) {
      // Create a new video element for preloading
      const video = document.createElement('video');
      video.style.display = 'none';
      video.preload = 'auto';
      video.muted = true;

      // Add load event listener
      video.addEventListener('loadeddata', () => {
        preloadedUrls.current.add(nextVideo.url);
      });

      // Create and append source element
      const source = document.createElement('source');
      source.src = nextVideo.url;
      source.type = 'video/mp4';
      video.appendChild(source);

      // Clean up previous preloaded video if it exists
      if (preloadVideoRef.current) {
        preloadVideoRef.current.remove();
      }

      // Store reference to current preload video
      preloadVideoRef.current = video;
      document.body.appendChild(video);

      // Load the video
      try {
        video.load();
      } catch (error) {
        console.warn('Error preloading video:', error);
      }

      // Cleanup function
      return () => {
        if (preloadVideoRef.current) {
          preloadVideoRef.current.remove();
          preloadVideoRef.current = null;
        }
      };
    }
  }, [nextVideo?.url]);

  // Clear preloaded URLs when component unmounts
  useEffect(() => {
    return () => {
      preloadedUrls.current.clear();
    };
  }, []);
}