'use client';

import { Users, PiggyBank, Wallet, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const badges = [
  { 
    icon: Users, 
    label: 'Budget Couple', 
    bgColor: 'bg-white/10', 
    borderColor: 'border-white/30',
    textColor: 'text-white',
    iconBg: 'bg-white/20',
    pointerColor: 'white',
    pointerPosition: 'bottom-right',
    position: 'top-left' 
  },
  { 
    icon: PiggyBank, 
    label: 'Tontines', 
    bgColor: 'bg-[#F2C086]/20', 
    borderColor: 'border-[#F2C086]/40',
    textColor: 'text-[#F2C086]',
    iconBg: 'bg-[#F2C086]/30',
    pointerColor: '#F2C086',
    pointerPosition: 'bottom-left',
    position: 'top-right' 
  },
  { 
    icon: Wallet, 
    label: 'Dépenses', 
    bgColor: 'bg-[#F2C086]/20', 
    borderColor: 'border-[#F2C086]/40',
    textColor: 'text-[#F2C086]',
    iconBg: 'bg-[#F2C086]/30',
    pointerColor: '#F2C086',
    pointerPosition: 'top-right',
    position: 'bottom-left' 
  },
  { 
    icon: TrendingUp, 
    label: 'Investissements', 
    bgColor: 'bg-white/10', 
    borderColor: 'border-white/30',
    textColor: 'text-white',
    iconBg: 'bg-white/20',
    pointerColor: 'white',
    pointerPosition: 'top-left',
    position: 'bottom-right' 
  },
];

export function FloatingBadges() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        let positionClasses = '';
        let animationClass = '';

        switch (badge.position) {
          case 'top-left':
            positionClasses = 'top-[140px] left-8 lg:left-16';
            animationClass = 'floating-1';
            break;
          case 'top-right':
            positionClasses = 'top-[160px] right-8 lg:right-16';
            animationClass = 'floating-2';
            break;
          case 'bottom-left':
            positionClasses = 'top-[380px] left-20 lg:left-40';
            animationClass = 'floating-3';
            break;
          case 'bottom-right':
            positionClasses = 'top-[380px] right-20 lg:right-40';
            animationClass = 'floating-4';
            break;
        }

        // Position des points pulse superposés au badge, juste au bout (haut ou bas, centrés)
        let pointClasses = '';
        const pointColor = badge.pointerColor === 'white' 
          ? 'bg-white' 
          : 'bg-[#F2C086]';
        
        switch (badge.position) {
          case 'top-left':
            // Point en bas du badge, centré, collé au bord
            pointClasses = 'absolute -bottom-1 left-1/2 -translate-x-1/2';
            break;
          case 'top-right':
            // Point en bas du badge, centré, collé au bord
            pointClasses = 'absolute -bottom-1 left-1/2 -translate-x-1/2';
            break;
          case 'bottom-left':
            // Point en haut du badge, centré, collé au bord
            pointClasses = 'absolute -top-1 left-1/2 -translate-x-1/2';
            break;
          case 'bottom-right':
            // Point en haut du badge, centré, collé au bord
            pointClasses = 'absolute -top-1 left-1/2 -translate-x-1/2';
            break;
        }
        
        return (
          <div
            key={index}
            className={`hidden lg:flex absolute ${positionClasses} ${animationClass} items-center gap-2 px-4 py-2 rounded-full border ${badge.borderColor} ${badge.bgColor} backdrop-blur-sm z-10`}
          >
            <div className={`p-1.5 rounded-full ${badge.iconBg}`}>
              <Icon className="h-4 w-4 text-[#F2C086]" />
            </div>
            <span className={`text-sm font-medium ${badge.textColor}`}>
              {badge.label}
            </span>
          </div>
        );
      })}
    </>
  );
}

