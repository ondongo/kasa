'use client';

import { MonthPicker } from './MonthPicker';
import { NotificationPanel } from './NotificationPanel';
import { formatEurosWithVisibility } from '@/lib/money';
import { Share2, Download, EyeOff, Eye, Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useVisibility } from '@/contexts/VisibilityContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { getUnreadCount } from '@/lib/actions/notifications';
import { toast } from 'react-toastify';

interface TopbarProps {
  month: string;
  onMonthChange: (month: string) => void;
  summary?: {
    totalIncome: number;
    totalExpense: number;
    totalInvestment: number;
  };
}

export function Topbar({ month, onMonthChange, summary }: TopbarProps) {
  const [notificationCount, setNotificationCount] = useState(0);
  const { isHidden, toggleVisibility } = useVisibility();
  const { preferences } = usePreferences();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const currency = preferences?.currency || 'EUR';

  useEffect(() => {
    loadNotificationCount();
  }, []);

  async function loadNotificationCount() {
    try {
      const count = await getUnreadCount();
      setNotificationCount(count);
    } catch (error) {
      console.error('Erreur lors du chargement du compteur:', error);
    }
  }

  // Fermer le panneau de notifications quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon Budget',
          text: `Budget pour ${month}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier dans le presse-papier
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papier !');
    }
  };

  const handleDownloadPDF = () => {
    // Ouvrir le rapport dans un nouvel onglet pour impression/téléchargement PDF
    const url = `/api/reports/pdf?month=${month}`;
    window.open(url, '_blank');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="relative flex h-16 items-center justify-between border-b bg-card px-6">
      {/* Sélecteur de mois */}
      <MonthPicker month={month} onMonthChange={onMonthChange} />

      {/* Résumé financier avec couleurs professionnelles */}
      {summary && (
        <div className="flex items-center gap-8">
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Revenus
              </p>
              <p className="text-md font-semibold tabular-nums text-emerald-500">
                {formatEurosWithVisibility(summary.totalIncome, isHidden, currency)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Dépenses
              </p>
              <p className="text-md font-semibold tabular-nums text-rose-500">
                {formatEurosWithVisibility(summary.totalExpense, isHidden, currency)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Investissements
              </p>
              <p className="text-md font-semibold tabular-nums text-blue-500">
                {formatEurosWithVisibility(summary.totalInvestment, isHidden, currency)}
              </p>
            </div>
          </div>

          {/* Séparateur vertical */}
          <div className="h-8 w-px bg-border" />

          {/* Icônes d'actions */}
          <div className="flex items-center gap-2">
            {/* Partager */}
            <button
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Partager"
            >
              <Share2 className="h-4 w-4" />
            </button>

            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Télécharger en PDF"
            >
              <Download className="h-4 w-4" />
            </button>

            {/* Cacher/Afficher */}
            <button
              onClick={toggleVisibility}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title={isHidden ? 'Afficher les montants' : 'Masquer les montants'}
            >
              {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>

            {/* Notifications */}
            <button
              onClick={toggleNotifications}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Panneau de notifications */}
      {showNotifications && (
        <div
          ref={notificationsRef}
          className="absolute right-6 top-16 z-50"
        >
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        </div>
      )}
    </div>
  );
}

