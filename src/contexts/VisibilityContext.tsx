'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface VisibilityContextType {
  isHidden: boolean;
  toggleVisibility: () => void;
}

const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined);

export function VisibilityProvider({ children }: { children: ReactNode }) {
  const [isHidden, setIsHidden] = useState(false);

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  return (
    <VisibilityContext.Provider value={{ isHidden, toggleVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useVisibility() {
  const context = useContext(VisibilityContext);
  if (context === undefined) {
    throw new Error('useVisibility doit être utilisé dans un VisibilityProvider');
  }
  return context;
}

