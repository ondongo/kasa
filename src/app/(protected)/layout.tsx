'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { SessionProvider } from 'next-auth/react';
import { VisibilityProvider } from '@/contexts/VisibilityContext';
import { PreferencesProvider } from '@/contexts/PreferencesContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PreferencesProvider>
        <VisibilityProvider>
          <div className="flex h-screen overflow-hidden bg-[#0f0f0f]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f0f0f] dark:to-[#1a1a1a]">
              {children}
            </main>
          </div>
        </VisibilityProvider>
      </PreferencesProvider>
    </SessionProvider>
  );
}

