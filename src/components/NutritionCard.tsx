import React from 'react';
import { NutritionInfo } from '@/types/menu';

interface NutritionCardProps {
  nutrition: NutritionInfo;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({ nutrition }) => {
  return (
    <div className="nutrition">
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="nutrition-icon mb-0 icon-energy">
          <i className="bi bi-bar-chart-fill"></i>
        </div>
        <div>
          <h3 className="nutrition-title mb-0">Composição nutricional</h3>
          <small className="text-muted">Média semanal</small>
        </div>
      </div>

      <div className="row g-3">
        {/* ENERGIA */}
        <div className="col-6 col-lg-3">
          <div className="nutrition-item">
            <div className="nutrition-icon icon-energy">
              <i className="bi bi-lightning-charge-fill"></i>
            </div>
            <div className="nutrition-label">ENERGIA</div>
            <div className="nutrition-value">
              {Number(nutrition.energy_kcal).toFixed(0)} <small>kcal</small>
            </div>
          </div>
        </div>

        {/* CARBOIDRATOS */}
        <div className="col-6 col-lg-3">
          <div className="nutrition-item">
            <div className="nutrition-icon icon-carbs">
              <i className="bi bi-basket2-fill"></i>
            </div>
            <div className="nutrition-label">CARBOIDRATOS</div>
            <div className="nutrition-value">
              {Number(nutrition.carbohydrates_g).toFixed(1)} <small>g</small>
            </div>
            <div className="nutrition-vet">
              {Number(nutrition.carbohydrates_vet_percent).toFixed(1)}% VET
            </div>
          </div>
        </div>

        {/* PROTEÍNAS */}
        <div className="col-6 col-lg-3">
          <div className="nutrition-item">
            <div className="nutrition-icon icon-proteins">
              <i className="bi bi-activity"></i>
            </div>
            <div className="nutrition-label">PROTEÍNAS</div>
            <div className="nutrition-value">
              {Number(nutrition.proteins_g).toFixed(1)} <small>g</small>
            </div>
            <div className="nutrition-vet-red">
              {Number(nutrition.proteins_vet_percent).toFixed(1)}% VET
            </div>
          </div>
        </div>

        {/* LIPÍDIOS */}
        <div className="col-6 col-lg-3">
          <div className="nutrition-item">
            <div className="nutrition-icon icon-lipids">
              <i className="bi bi-droplet-fill"></i>
            </div>
            <div className="nutrition-label">LIPÍDIOS</div>
            <div className="nutrition-value">
              {Number(nutrition.lipids_g).toFixed(1)} <small>g</small>
            </div>
            <div className="nutrition-vet">
              {Number(nutrition.lipids_vet_percent).toFixed(1)}% VET
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
