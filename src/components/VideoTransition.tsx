import React, { useState, useEffect } from 'react';
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
  const [key, setKey] = useState(video.id);
  const { videoRef, isReady } = useVideoPlayback({
    video,
    isPlaying,
    onEnded,
    onCanPlay,
    onLoadStart,
  });

  useEffect(() => {
    setKey(video.id);
  }, [video.id]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="none"
          onEnded={onEnded}
        >
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </AnimatePresence>
  );
}