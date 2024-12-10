import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoControlsProps {
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalVideos: number;
  isVisible: boolean;
}

export function VideoControls({ 
  onNext, 
  onPrevious, 
  currentIndex, 
  totalVideos,
  isVisible 
}: VideoControlsProps) {
  return (
    <div 
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-6 
        bg-black/20 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full text-white
        transition-opacity duration-300 z-50 touch-none
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Previous video"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Next video"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
}