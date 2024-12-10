import React from 'react';

interface VideoCreditsProps {
  title: string;
  author: string;
  source: string;
  isVisible: boolean;
}

export function VideoCredits({ title, author, source, isVisible }: VideoCreditsProps) {
  return (
    <div 
      className={`
        fixed bottom-24 md:bottom-8 left-4 md:left-8
        bg-black/10 backdrop-blur-[2px] px-4 md:px-6 py-3 md:py-4 rounded-lg text-white
        w-[calc(100%-2rem)] md:w-auto md:min-w-[320px] md:max-w-md
        transition-opacity duration-300 z-50 touch-none
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <h2 className="text-lg md:text-2xl font-bold tracking-wide mb-1">{title}</h2>
      <p className="text-xs md:text-sm text-white/80 font-medium mb-1">{author}</p>
      <a 
        href={source}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] md:text-xs text-white hover:text-white/90 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        Source
      </a>
    </div>
  );
}