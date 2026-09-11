'use client';

import React, { useState, useEffect } from 'react';
import { Week } from '@/types/menu';
import { getClientMenu, saveClientMenu } from '@/lib/storage';
import { initialWeeks } from '@/data/initialData';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { WeekCard } from '@/components/WeekCard';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [weeks, setWeeks] = useState<Week[]>(initialWeeks);
  const [selectedFilter, setSelectedFilter] = useState<string | 'all'>('current');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Carrega do localStorage inicial ou tenta sincronizar via API
    const localData = getClientMenu();
    if (localData && localData.length > 0) {
      setWeeks(localData);
    }

    // Busca dados atualizados da API
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.weeks) && data.weeks.length > 0) {
          setWeeks(data.weeks);
          saveClientMenu(data.weeks);
        }
      })
      .catch((err) => console.log('Usando dados offline/locais:', err))
      .finally(() => setLoading(false));
  }, []);

  const currentWeek = weeks.find((w) => w.is_current) || weeks[0];

  // Limita a exibição a no máximo 4 semanas
  const availableWeeks = weeks.slice(0, 4);

  let displayWeeks: Week[] = [];
  if (selectedFilter === 'all') {
    displayWeeks = availableWeeks;
  } else if (selectedFilter === 'current') {
    displayWeeks = currentWeek ? [currentWeek] : availableWeeks.slice(0, 1);
  } else {
    const found = availableWeeks.find((w) => String(w.id) === String(selectedFilter));
    displayWeeks = found ? [found] : (currentWeek ? [currentWeek] : availableWeeks.slice(0, 1));
  }

  return (
    <>
      <Navbar />

      <Hero />

      <main className="container content pb-5">
        {/* SELETOR DE ATÉ 4 SEMANAS */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div className="week-tabs-container mb-0 w-100 w-lg-auto">
            {/* Botão Semana Atual */}
            <button
              type="button"
              className={`week-tab-btn ${selectedFilter === 'current' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('current')}
            >
              <i className="bi bi-star-fill text-warning"></i>
              <span>Semana Atual {currentWeek ? `(Semana ${currentWeek.week_number})` : ''}</span>
              <span className="tab-badge-current">Hoje</span>
            </button>

            {/* Botões individuais para cada uma das outras semanas até 4 */}
            {availableWeeks
              .filter((w) => w.id !== currentWeek?.id)
              .map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={`week-tab-btn ${selectedFilter === String(w.id) ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(String(w.id))}
                >
                  <i className="bi bi-calendar-event"></i>
                  <span>Semana {w.week_number}</span>
                </button>
              ))}

            {/* Botão Ver Todas as Semanas */}
            <button
              type="button"
              className={`week-tab-btn ${selectedFilter === 'all' ? 'active-all' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              <i className="bi bi-collection-fill"></i>
              <span>Ver Todas ({availableWeeks.length} semanas)</span>
            </button>
          </div>
        </div>

        {/* LISTAGEM DE SEMANAS */}
        {displayWeeks && displayWeeks.length > 0 ? (
          displayWeeks.map((week) => (
            <WeekCard
              key={week.id}
              week={week}
              badgeLabel={week.is_current ? 'Cardápio em vigor' : `Semana ${week.week_number} programada`}
            />
          ))
        ) : (
          <div className="week-card text-center p-5">
            <div className="display-4 mb-3">🍽️</div>
            <h2>Nenhum cardápio disponível</h2>
            <p className="text-muted mb-0">Ainda não há refeições cadastradas.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
