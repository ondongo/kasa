'use client';

import { Users, PiggyBank, Wallet, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const badges = [
  { icon: Users, label: 'Budget Couple', color: '#F2C086', position: 'top-left' },
  { icon: PiggyBank, label: 'Tontines', color: '#F2C086', position: 'top-right' },
  { icon: Wallet, label: 'Dépenses', color: '#F2C086', position: 'bottom-left' },
  { icon: TrendingUp, label: 'Investissements', color: '#F2C086', position: 'bottom-right' },
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
            positionClasses = 'top-32 left-8 lg:left-20';
            animationClass = 'floating-1';
            break;
          case 'top-right':
            positionClasses = 'top-40 right-8 lg:right-32';
            animationClass = 'floating-2';
            break;
          case 'bottom-left':
            positionClasses = 'top-[500px] left-12 lg:left-40';
            animationClass = 'floating-3';
            break;
          case 'bottom-right':
            positionClasses = 'top-[450px] right-12 lg:right-48';
            animationClass = 'floating-4';
            break;
        }

        return (
          <div
            key={index}
            className={`hidden lg:flex absolute ${positionClasses} ${animationClass} items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-all hover:scale-110 z-10`}
            style={{
              background: `${badge.color}15`,
              borderColor: `${badge.color}40`,
            }}
          >
            <div
              className="p-1.5 rounded-full"
              style={{ backgroundColor: `${badge.color}30` }}
            >
              <Icon className="h-4 w-4" style={{ color: badge.color }} />
            </div>
            <span
              className="text-sm font-medium"
              style={{ color: badge.color }}
            >
              {badge.label}
            </span>
            <div className="absolute -top-1 -right-1">
              <span className="relative flex h-3 w-3">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: badge.color }}
                ></span>
                <span
                  className="relative inline-flex rounded-full h-3 w-3"
                  style={{ backgroundColor: badge.color }}
                ></span>
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}

