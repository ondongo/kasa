'use client';

import { MonthPicker } from './MonthPicker';
import { formatEurosWithVisibility } from '@/lib/money';
import { Share2, Download, EyeOff, Eye, Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useVisibility } from '@/contexts/VisibilityContext';

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
  const [notificationCount] = useState(3);
  const { isHidden, toggleVisibility } = useVisibility();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

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
      alert('Lien copié dans le presse-papier !');
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implémenter la génération de PDF
    alert('Téléchargement du PDF... (fonctionnalité à venir)');
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
                {formatEurosWithVisibility(summary.totalIncome, isHidden)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Dépenses
              </p>
              <p className="text-md font-semibold tabular-nums text-rose-500">
                {formatEurosWithVisibility(summary.totalExpense, isHidden)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Investissements
              </p>
              <p className="text-md font-semibold tabular-nums text-blue-500">
                {formatEurosWithVisibility(summary.totalInvestment, isHidden)}
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
          className="absolute right-6 top-16 z-50 w-80 rounded-lg border bg-card shadow-lg"
        >
          <div className="border-b p-4">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="border-b p-4 hover:bg-accent">
              <p className="text-sm font-medium">Nouvelle transaction</p>
              <p className="text-xs text-muted-foreground">
                Une dépense de 45,00 € a été ajoutée
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Il y a 2 heures</p>
            </div>
            <div className="border-b p-4 hover:bg-accent">
              <p className="text-sm font-medium">Budget dépassé</p>
              <p className="text-xs text-muted-foreground">
                Votre budget alimentation a été dépassé de 120 €
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Hier</p>
            </div>
            <div className="p-4 hover:bg-accent">
              <p className="text-sm font-medium">Rappel</p>
              <p className="text-xs text-muted-foreground">
                Pensez à ajouter vos transactions de la semaine
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Il y a 3 jours</p>
            </div>
          </div>
          <div className="border-t p-3 text-center">
            <button className="text-sm text-primary hover:underline">
              Voir toutes les notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

