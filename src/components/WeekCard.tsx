import React from 'react';
import { Week } from '@/types/menu';
import { formatDateBR } from '@/lib/storage';
import { MealCard } from './MealCard';
import { NutritionCard } from './NutritionCard';

interface WeekCardProps {
  week: Week;
  badgeLabel?: string;
}

export const WeekCard: React.FC<WeekCardProps> = ({ week, badgeLabel }) => {
  return (
    <section className="week-card">
      {/* WEEK HEADER */}
      <div className="week-header">
        <div className="row align-items-center">
          <div className="col-md">
            <h2 className="week-title d-flex align-items-center flex-wrap gap-2">
              <span>Semana {week.week_number}</span>
              {week.is_current ? (
                <span className="badge badge-semana-atual">
                  <i className="bi bi-star-fill text-warning me-1"></i> Semana Atual
                </span>
              ) : (
                <span className="badge badge-semana-futura">
                  <i className="bi bi-calendar-event me-1"></i> Planejamento
                </span>
              )}
            </h2>

            <p className="date-range">
              <i className="bi bi-calendar-week me-1"></i>
              {formatDateBR(week.start_date)}
              <span className="mx-1">até</span>
              {formatDateBR(week.end_date)}
            </p>
          </div>

          <div className="col-md-auto mt-2 mt-md-0">
            <span className="week-status-pill">
              <i className="bi bi-check-circle me-1 text-success"></i>
              {badgeLabel || 'Cardápio disponível'}
            </span>
          </div>
        </div>
      </div>

      {/* MEALS GRID */}
      <div className="meal-grid">
        <div className="row g-3">
          {week.meals && week.meals.length > 0 ? (
            week.meals.map((meal) => (
              <div key={meal.id} className="col-12 col-md-6 col-lg-4">
                <MealCard meal={meal} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4 text-muted">
              Nenhuma refeição cadastrada para esta semana.
            </div>
          )}
        </div>
      </div>

      {/* NUTRITION */}
      {week.nutritionInfo && <NutritionCard nutrition={week.nutritionInfo} />}
    </section>
  );
};
