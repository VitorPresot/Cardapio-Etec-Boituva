export interface Meal {
  id: string | number;
  week_id: string | number;
  day_of_week: string; // Ex: 'Segunda-feira'
  date: string; // Formato YYYY-MM-DD
  main_dish: string; // Refeição principal / Merenda
  salad?: string | null; // Salada do dia
  fruit?: string | null; // Fruta do dia
}

export interface NutritionInfo {
  id?: string | number;
  week_id: string | number;
  energy_kcal: number;
  carbohydrates_g: number;
  carbohydrates_vet_percent: number;
  proteins_g: number;
  proteins_vet_percent: number;
  lipids_g: number;
  lipids_vet_percent: number;
}

export interface Week {
  id: string | number;
  week_number: number;
  start_date: string; // Formato YYYY-MM-DD
  end_date: string; // Formato YYYY-MM-DD
  is_current?: boolean;
  meals: Meal[];
  nutritionInfo?: NutritionInfo;
}

export interface MenuSettings {
  cycle_mode: boolean;
  updated_at?: string;
}

export interface MenuStateDocument {
  _id: string;
  weeks: Week[];
  cycle_mode: boolean;
  updated_at: string;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
}

export interface MenuData {
  weeks: Week[];
  lastUpdated: string;
}

