import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video } from '@/types/video';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';

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
  const { videoRef, isReady, isLoading } = useVideoPlayback({
    video,
    isPlaying,
    onEnded,
    onCanPlay,
    onLoadStart,
  });

  return (
    <AnimatePresence>
      <motion.div
        key={video.id}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          autoPlay
          onEnded={onEnded}
        >
          <source src={video.url} type="video/mp4" />
        </video>
      </motion.div>
    </AnimatePresence>
  );
}