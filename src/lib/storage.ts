import { Week } from '@/types/menu';
import { initialWeeks } from '@/data/initialData';

export function formatDateBR(dateStr?: string | null): string {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;

  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

export function getClientMenu(): Week[] {
  return initialWeeks;
}

export function saveClientMenu(_weeks: Week[]): void {
  return;
}

export function resetClientMenu(): Week[] {
  return initialWeeks;
}

