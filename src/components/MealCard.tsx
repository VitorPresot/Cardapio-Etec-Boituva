import React from 'react';
import { Meal } from '@/types/menu';
import { formatDateBR } from '@/lib/storage';

interface MealCardProps {
  meal: Meal;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  return (
    <article className="meal-card">
      <div className="d-flex align-items-center gap-3">
        <div className="day-icon">
          <i className="bi bi-calendar-day"></i>
        </div>
        <div>
          <h3 className="day-title">{meal.day_of_week}</h3>
          <span className="day-date">{formatDateBR(meal.date)}</span>
        </div>
      </div>

      {/* REFEIÇÃO PRINCIPAL / MERENDA */}
      <div className="main-dish">
        <div className="main-dish-label">
          <i className="bi bi-egg-fried me-1"></i>
          Merenda
        </div>
        <p>{meal.main_dish}</p>
      </div>

      {/* SALADA */}
      {meal.salad && (
        <div className="food-item">
          <span className="food-icon salad-icon">
            <i className="bi bi-flower1"></i>
          </span>
          <div>
            <strong>Salada:</strong> {meal.salad}
          </div>
        </div>
      )}

      {/* FRUTA */}
      {meal.fruit && (
        <div className="food-item">
          <span className="food-icon fruit-icon">
            <i className="bi bi-apple"></i>
          </span>
          <div>
            <strong>Fruta:</strong> {meal.fruit}
          </div>
        </div>
      )}
    </article>
  );
};
