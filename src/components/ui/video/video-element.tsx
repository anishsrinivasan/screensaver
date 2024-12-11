import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface VideoElementProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  className?: string;
}

export const VideoElement = forwardRef<HTMLVideoElement, VideoElementProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <video
        ref={ref}
        className={cn(
          'video-element transition-opacity duration-800',
          className
        )}
        {...props}
      >
        {children}
      </video>
    );
  }
);