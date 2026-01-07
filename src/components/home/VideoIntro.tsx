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
        className="gap-2 bg-white hover:bg-white/90 text-black border-0 rounded-full h-14 px-8 text-lg font-medium"
      >
        <Play className="h-5 w-5 text-[#F2C086] fill-[#F2C086]" />
        <span>Voir la vidéo</span>
      </Button>

      {showVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-card rounded-2xl overflow-hidden border-2 border-[#F2C086]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 bg-[#2A2520] rounded-full p-2 transition-colors"
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

