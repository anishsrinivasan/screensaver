import React from 'react';
import { Play } from 'lucide-react';

interface StartButtonProps {
  onClick: () => void;
}

export function StartButton({ onClick }: StartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 bg-slate-900/90 hover:bg-slate-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full transition-all duration-300 transform hover:scale-105"
    >
      <Play className="w-5 h-5 md:w-6 md:h-6 group-hover:text-emerald-400 transition-colors" />
      <span className="text-base md:text-lg font-medium whitespace-nowrap">Start Screensaver</span>
    </button>
  );
}