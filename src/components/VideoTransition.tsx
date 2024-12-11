import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video } from '@/types/video';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { VideoElement } from './ui/video/video-element';

interface VideoTransitionProps {
  video: Video;
  isPlaying: boolean;
  onEnded: () => void;
  onCanPlay: () => void;
  onLoadStart: () => void;
}

export function VideoTransition({
  video,
  isPlaying,
  onEnded,
  onCanPlay,
  onLoadStart,
}: VideoTransitionProps) {
  const { videoRef, isReady } = useVideoPlayback({
    video,
    isPlaying,
    onEnded,
    onCanPlay,
    onLoadStart,
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={video.id}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { duration: 0.8, ease: 'easeInOut' }
        }}
        exit={{ 
          opacity: 0,
          transition: { duration: 0.8, ease: 'easeInOut' }
        }}
        className="absolute inset-0 bg-black motion-div"
      >
        <VideoElement
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-800 ${
            isReady ? 'opacity-100' : 'opacity-0'
          }`}
          muted
          playsInline
          autoPlay
          onEnded={onEnded}
        >
          <source src={video.url} type="video/mp4" />
        </VideoElement>
      </motion.div>
    </AnimatePresence>
  );
}