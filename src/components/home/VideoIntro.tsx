'use client';

import { Play } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function VideoIntro() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="lg"
        onClick={() => setShowVideo(true)}
        className="gap-2 border border-gray-700 hover:border-[#F2C086]/50 transition-all"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[#F2C086] rounded-full blur-md opacity-50 animate-pulse"></div>
          <div className="relative bg-[#F2C086] rounded-full p-2">
            <Play className="h-4 w-4 text-[#1a1a1a] fill-[#1a1a1a]" />
          </div>
        </div>
        <span className="text-white">Voir la vidéo</span>
      </Button>

      {showVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="mb-4 text-6xl">🎥</div>
                <p className="text-xl">Vidéo de démonstration</p>
                <p className="text-sm text-gray-400 mt-2">
                  Découvrez comment Kasa simplifie votre gestion financière
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

