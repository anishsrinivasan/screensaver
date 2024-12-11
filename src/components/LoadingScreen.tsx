import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
        <p className="text-white/80 text-lg font-medium">Loading next experience...</p>
      </div>
    </motion.div>
  );
}