import { initialWeeks } from '@/data/initialData';
import { getMenuCollection } from '@/lib/mongo';
import { menuStateSchema, MenuStateInput, weekSchema } from '@/lib/menu-schema';
import { addDays, getTodayInSaoPaulo, getWeekDurationInDays, toDateFromISO } from '@/lib/date-utils';
import { MenuStateDocument, Week } from '@/types/menu';

const DEFAULT_CYCLE_MODE = false;

type MenuState = Omit<MenuStateDocument, '_id'>;

function sortWeeks(weeks: Week[]): Week[] {
  return [...weeks].sort((left, right) => left.start_date.localeCompare(right.start_date));
}

function markCurrentWeek(weeks: Week[]): Week[] {
  const today = getTodayInSaoPaulo();
  const sorted = sortWeeks(weeks);
  const currentIndex = sorted.findIndex(
    (week) => week.start_date <= today && week.end_date >= today
  );
  const fallbackIndex = sorted.findIndex((week) => week.end_date >= today);
  const selectedIndex = currentIndex >= 0 ? currentIndex : fallbackIndex >= 0 ? fallbackIndex : sorted.length - 1;

  return sorted.map((week, index) => ({
    ...week,
    is_current: index === selectedIndex,
  }));
}

export function reconcileCycle(weeks: Week[], cycleMode: boolean): Week[] {
  const safeWeeks = sortWeeks(weeks);
  if (safeWeeks.length === 0) return [];
  if (!cycleMode) return markCurrentWeek(safeWeeks);

  const today = toDateFromISO(getTodayInSaoPaulo());
  const rotated = safeWeeks.map((week) => ({ ...week }));
  let lastEndDate = today;

  for (const week of rotated) {
    const originalStartDate = week.start_date;
    const endDate = toDateFromISO(week.end_date);
    if (endDate < today) {
      const duration = getWeekDurationInDays(week);
      const newStart = addDays(toISODate(lastEndDate), 1);
      const newEnd = addDays(newStart, duration - 1);
      week.start_date = newStart;
      week.end_date = newEnd;
      for (const meal of week.meals) {
        const offset = Math.max(0, Math.round(
          (toDateFromISO(meal.date).getTime() - toDateFromISO(originalStartDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ));
        meal.date = addDays(newStart, offset);
      }
    }
    lastEndDate = toDateFromISO(week.end_date);
  }

  return markCurrentWeek(rotated);
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function normalizeState(record: MenuStateDocument): MenuState {
  const parsed = menuStateSchema.parse(record);
  const weeks = reconcileCycle(parsed.weeks, parsed.cycle_mode);
  return {
    weeks,
    cycle_mode: parsed.cycle_mode,
    updated_at: parsed.updated_at,
  };
}

function buildState(weeks: Week[], cycleMode: boolean): MenuState {
  const validatedWeeks = weeks.map((week) => weekSchema.parse(week));
  return {
    weeks: reconcileCycle(validatedWeeks, cycleMode),
    cycle_mode: cycleMode,
    updated_at: new Date().toISOString(),
  };
}

export async function getMenuState(): Promise<MenuState> {
  const collection = await getMenuCollection();
  const record = await collection.findOne({ _id: 'default' });

  if (record) {
    const state = normalizeState(record);
    if (JSON.stringify(state.weeks) !== JSON.stringify(record.weeks)) {
      await collection.updateOne({ _id: 'default' }, { $set: state });
    }
    return state;
  }

  const state = buildState(initialWeeks, DEFAULT_CYCLE_MODE);
  await collection.insertOne({ _id: 'default', ...state });
  return state;
}

export async function saveMenuState(weeks: Week[], cycleMode: boolean): Promise<MenuState> {
  const state = buildState(weeks, cycleMode);
  const collection = await getMenuCollection();
  await collection.updateOne(
    { _id: 'default' },
    { $set: state, $setOnInsert: { _id: 'default' } },
    { upsert: true }
  );
  return state;
}

export async function processCronExpiredWeeks(): Promise<MenuState> {
  const state = await getMenuState();
  const updated = buildState(state.weeks, state.cycle_mode);
  const collection = await getMenuCollection();
  await collection.updateOne(
    { _id: 'default' },
    { $set: updated, $setOnInsert: { _id: 'default' } },
    { upsert: true }
  );
  return updated;
}

export function buildMenuStateDocument(weeks: Week[], cycleMode: boolean): MenuStateDocument {
  const state = buildState(weeks, cycleMode);
  return { _id: 'default', ...state };
}
