'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getUserPreferences } from '@/lib/actions/preferences';

interface UserPreferences {
  currency: string;
  language: string;
  theme: string;
}

interface PreferencesContextType {
  preferences: UserPreferences | null;
  loading: boolean;
  refreshPreferences: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPreferences = async () => {
    try {
      const prefs = await getUserPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
      // Valeurs par défaut si erreur
      setPreferences({
        currency: 'EUR',
        language: 'fr',
        theme: 'dark',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        loading,
        refreshPreferences: loadPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}

