'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, TrendingUp, TrendingDown, Wallet, Settings, LogOut, ChevronDown, Crown, Users } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

const navigation = [
  { name: 'Synthèse', href: '/dashboard', icon: LayoutGrid },
  { name: 'Revenus', href: '/incomes', icon: TrendingUp },
  { name: 'Dépenses', href: '/expenses', icon: TrendingDown },
  { 
    name: 'Patrimoine', 
    href: '/investments', 
    icon: Wallet,
    subItems: [
      { name: 'Investissements', href: '/investments' },
      { name: 'Caisses d\'épargne', href: '/investments/savings-boxes' },
    ]
  },
  { name: 'Tontines', href: '/tontines', icon: Users },
  { name: 'Abonnement', href: '/pricing', icon: Crown },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>('Patrimoine');

  return (
    <div className="relative flex h-screen w-64 flex-col bg-[#1a1a1a] text-gray-300">
      {/* Gradient background vers le haut */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#2a2a2a] to-transparent opacity-50" />
      
      {/* Logo */}
      <div className="relative z-10 flex h-20 items-center px-6">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <h1 className="text-xl font-semibold tracking-tight text-[#F2C086]">Kasa</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 pt-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.subItems?.some(sub => pathname === sub.href) && expandedItem === item.name);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItem === item.name;

          return (
            <div key={item.name}>
              {hasSubItems ? (
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : item.name)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white/5 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white/5 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )}

              {/* Sub-items */}
              {hasSubItems && isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems?.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          'block rounded-lg px-3 py-2 text-sm transition-all duration-200',
                          isSubActive
                            ? 'bg-white/10 text-white font-medium'
                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                        )}
                      >
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-white/5 hover:text-gray-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}

