import { z } from 'zod';

const idSchema = z.union([z.string().min(1).max(100), z.number().finite()]);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD');

const mealSchema = z.object({
  id: idSchema,
  week_id: idSchema,
  day_of_week: z.string().trim().min(1).max(40),
  date: dateSchema,
  main_dish: z.string().trim().min(1).max(1000),
  salad: z.string().trim().max(500).nullable().optional(),
  fruit: z.string().trim().max(200).nullable().optional(),
}).strict();

const nutritionSchema = z.object({
  id: idSchema.optional(),
  week_id: idSchema,
  energy_kcal: z.number().finite().min(0).max(10000),
  carbohydrates_g: z.number().finite().min(0).max(1000),
  carbohydrates_vet_percent: z.number().finite().min(0).max(100),
  proteins_g: z.number().finite().min(0).max(1000),
  proteins_vet_percent: z.number().finite().min(0).max(100),
  lipids_g: z.number().finite().min(0).max(1000),
  lipids_vet_percent: z.number().finite().min(0).max(100),
}).strict();

export const weekSchema = z.object({
  id: idSchema,
  week_number: z.number().int().min(1).max(52),
  start_date: dateSchema,
  end_date: dateSchema,
  is_current: z.boolean().optional(),
  meals: z.array(mealSchema).max(31),
  nutritionInfo: nutritionSchema.optional(),
}).strict().superRefine((week, context) => {
  if (week.end_date < week.start_date) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['end_date'],
      message: 'A data final deve ser igual ou posterior à data inicial',
    });
  }
});

export const menuStateInputSchema = z.object({
  weeks: z.array(weekSchema).min(1).max(4),
  cycle_mode: z.boolean().default(false),
}).strict();

export const menuStateSchema = menuStateInputSchema.extend({
  _id: z.literal('default'),
  updated_at: z.string().datetime(),
});

export type MenuStateInput = z.infer<typeof menuStateInputSchema>;
