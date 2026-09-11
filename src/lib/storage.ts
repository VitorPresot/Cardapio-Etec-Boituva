import { Week } from '@/types/menu';
import { initialWeeks } from '@/data/initialData';

const STORAGE_KEY = 'etec_cardapio_data_v1';

export function formatDateBR(dateStr?: string | null): string {
  if (!dateStr) return '';
  // Se já estiver no formato dd/mm/yyyy
  if (dateStr.includes('/')) return dateStr;
  
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

export function getClientMenu(): Week[] {
  if (typeof window === 'undefined') {
    return initialWeeks;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Erro ao ler cardápio do localStorage:', err);
  }

  return initialWeeks;
}

export function saveClientMenu(weeks: Week[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weeks));
  } catch (err) {
    console.error('Erro ao salvar cardápio no localStorage:', err);
  }
}

export function resetClientMenu(): Week[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Erro ao limpar localStorage:', err);
    }
  }
  return initialWeeks;
}

