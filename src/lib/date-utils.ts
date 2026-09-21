import { Week } from '@/types/menu';

export const SAO_PAULO_TIMEZONE = 'America/Sao_Paulo';

export function toISODate(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: SAO_PAULO_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

export function toDateFromISO(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, (month || 1) - 1, day || 1, 12, 0, 0));
}

export function addDays(dateString: string, days: number): string {
  const date = toDateFromISO(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return toISODate(date);
}

export function getTodayInSaoPaulo(): string {
  return toISODate(new Date());
}

export function getWeekDurationInDays(week: Pick<Week, 'start_date' | 'end_date'>): number {
  const start = toDateFromISO(week.start_date);
  const end = toDateFromISO(week.end_date);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1);
}

export function normalizeWeekDates(week: Week): Week {
  const start = week.start_date || getTodayInSaoPaulo();
  const end = week.end_date || addDays(start, 4);
  return {
    ...week,
    start_date: start,
    end_date: end,
  };
}
