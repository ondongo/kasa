'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MonthPickerProps {
  month: string; // Format: "YYYY-MM"
  onMonthChange: (month: string) => void;
}

export function MonthPicker({ month, onMonthChange }: MonthPickerProps) {
  const handlePrevious = () => {
    const [year, monthNum] = month.split('-').map(Number);
    const date = new Date(year, monthNum - 2, 1); // -2 car monthNum est 1-indexed et on veut le mois précédent
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    onMonthChange(`${newYear}-${newMonth}`);
  };

  const handleNext = () => {
    const [year, monthNum] = month.split('-').map(Number);
    const date = new Date(year, monthNum, 1); // monthNum devient le mois suivant avec Date(year, monthNum, 1)
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    onMonthChange(`${newYear}-${newMonth}`);
  };

  const handleToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const monthNum = String(now.getMonth() + 1).padStart(2, '0');
    onMonthChange(`${year}-${monthNum}`);
  };

  // Formater le mois pour l'affichage
  const [year, monthNum] = month.split('-').map(Number);
  const date = new Date(year, monthNum - 1, 1);
  const displayMonth = format(date, 'MMMM yyyy', { locale: fr });

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handlePrevious}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={handleToday}
        className="min-w-[200px] rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium capitalize transition-colors hover:bg-accent"
      >
        {displayMonth}
      </button>
      <button
        onClick={handleNext}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

