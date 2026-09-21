import { initialWeeks } from '@/data/initialData';
import { getMenuCollection } from '@/lib/mongo';
import { addDays, getTodayInSaoPaulo, getWeekDurationInDays, toDateFromISO } from '@/lib/date-utils';
import { MenuStateDocument, Week } from '@/types/menu';

const DEFAULT_CYCLE_MODE = false;
const TABLE_NAME = 'menu_state';

function sortWeeks(weeks: Week[]): Week[] {
  return [...weeks].sort((left, right) => {
    const leftDate = toDateFromISO(left.start_date || '2000-01-01');
    const rightDate = toDateFromISO(right.start_date || '2000-01-01');
    return leftDate.getTime() - rightDate.getTime();
  });
}

function markCurrentWeek(weeks: Week[]): Week[] {
  const today = getTodayInSaoPaulo();
  const nextWeeks = weeks.map((week) => ({ ...week, is_current: false }));

  const current = nextWeeks.find((week) => {
    const start = toDateFromISO(week.start_date);
    const end = toDateFromISO(week.end_date);
    const currentDate = toDateFromISO(today);
    return currentDate >= start && currentDate <= end;
  });

  if (current) {
    return nextWeeks.map((week) => ({
      ...week,
      is_current: week.id === current.id,
    }));
  }

  if (nextWeeks.length > 0) {
    return nextWeeks.map((week, index) => ({
      ...week,
      is_current: index === 0,
    }));
  }

  return nextWeeks;
}

function reconcileCycle(weeks: Week[], cycleMode: boolean): Week[] {
  const safeWeeks = sortWeeks(weeks || []);
  const today = toDateFromISO(getTodayInSaoPaulo());
  const activeWeeks: Week[] = [];
  const expiredWeeks: Week[] = [];

  for (const week of safeWeeks) {
    const end = toDateFromISO(week.end_date);
    if (end < today) {
      expiredWeeks.push(week);
    } else {
      activeWeeks.push(week);
    }
  }

  if (!cycleMode) {
    return markCurrentWeek(activeWeeks);
  }

  let lastEndDate = activeWeeks.length > 0
    ? toDateFromISO(activeWeeks[activeWeeks.length - 1].end_date)
    : today;

  for (const expiredWeek of expiredWeeks) {
    const duration = getWeekDurationInDays(expiredWeek);
    const newStart = addDays(toDateFromISO(lastEndDate.toISOString().slice(0, 10)).toISOString().slice(0, 10), 1);
    const newEnd = addDays(newStart, duration - 1);
    const rotated: Week = {
      ...expiredWeek,
      start_date: newStart,
      end_date: newEnd,
      is_current: false,
    };
    activeWeeks.push(rotated);
    lastEndDate = toDateFromISO(newEnd);
  }

  return markCurrentWeek(activeWeeks);
}

function normalizeState(record: any): { weeks: Week[]; cycle_mode: boolean; updated_at: string } {
  const weeks = Array.isArray(record?.weeks) ? record.weeks as Week[] : initialWeeks;
  const cycleMode = Boolean(record?.cycle_mode ?? DEFAULT_CYCLE_MODE);
  return {
    weeks: reconcileCycle(weeks, cycleMode),
    cycle_mode: cycleMode,
    updated_at: String(record?.updated_at || new Date().toISOString()),
  };
}

export async function getMenuState(): Promise<{ weeks: Week[]; cycle_mode: boolean; updated_at: string }> {
  try {
    const collection = await getMenuCollection();
    const { data, error } = await collection.select('*').eq('id', 'default').maybeSingle();

    if (!error && data) {
      const next = normalizeState(data);
      await collection.upsert({ id: 'default', ...next }, { onConflict: 'id' });
      return next;
    }
  } catch {
    // fallback to seeded data when Supabase is not configured or unavailable
  }

  const seeded = reconcileCycle(initialWeeks, DEFAULT_CYCLE_MODE);
  return {
    weeks: seeded,
    cycle_mode: DEFAULT_CYCLE_MODE,
    updated_at: new Date().toISOString(),
  };
}

export async function saveMenuState(weeks: Week[], cycleMode: boolean): Promise<{ weeks: Week[]; cycle_mode: boolean; updated_at: string }> {
  const normalized = reconcileCycle(weeks || [], Boolean(cycleMode));
  const state = {
    weeks: normalized,
    cycle_mode: Boolean(cycleMode),
    updated_at: new Date().toISOString(),
  };

  try {
    const collection = await getMenuCollection();
    const { error } = await collection.upsert({ id: 'default', ...state }, { onConflict: 'id' });
    if (!error) {
      return state;
    }
  } catch {
    // no-op fallback
  }

  return state;
}

export async function processCronExpiredWeeks(): Promise<{ weeks: Week[]; cycle_mode: boolean; updated_at: string }> {
  const state = await getMenuState();
  const next = reconcileCycle(state.weeks, state.cycle_mode);
  const updated = {
    weeks: next,
    cycle_mode: state.cycle_mode,
    updated_at: new Date().toISOString(),
  };

  try {
    const collection = await getMenuCollection();
    await collection.upsert({ id: 'default', ...updated }, { onConflict: 'id' });
  } catch {
    // ignore if Supabase is unavailable in local development
  }

  return updated;
}

export function buildMenuStateDocument(weeks: Week[], cycleMode: boolean): MenuStateDocument {
  const state = reconcileCycle(weeks, cycleMode);
  return {
    _id: 'default',
    weeks: state,
    cycle_mode: Boolean(cycleMode),
    updated_at: new Date().toISOString(),
  };
}
