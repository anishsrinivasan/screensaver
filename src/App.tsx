import React, { useState, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { StartButton } from './components/StartButton';
import { BackgroundLines } from './components/ui/background-lines';
import { Monitor, Github } from 'lucide-react';
import { InstallPWA } from './components/InstallPWA';

export function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <BackgroundLines className="min-h-screen w-full">
      <InstallPWA />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4 px-4">
              <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-300 text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">
                Screensaver
              </h1>
              <p className="text-slate-400 text-sm md:text-base">
                Experience stunning visuals in fullscreen
              </p>
            </div>

            {isMobile ? (
              <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg mb-8 flex items-center gap-3 border border-white/10 mx-4">
                <Monitor className="w-5 h-5 text-white/70 flex-shrink-0" />
                <p className="text-sm text-white/70">
                  For the best experience, please view on a desktop device
                </p>
              </div>
            ) : (
              <div className="flex justify-center px-4">
                <StartButton onClick={() => setIsPlaying(true)} />
              </div>
            )}
          </div>

          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-3">
              <span className="flex items-center gap-2">
                Built with{' '}
                <a 
                  href="https://bolt.new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  bolt.new
                </a>
              </span>
              <span className="text-slate-700">•</span>
              <a
                href="https://github.com/anishsrinivasan/screensaver"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Star on GitHub</span>
              </a>
            </p>
          </div>
        </div>
      )}
      
      <VideoPlayer 
        isPlaying={isPlaying}
        onExit={() => setIsPlaying(false)}
      />
    </BackgroundLines>
  );
}
