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
  const [selectedFilter, setSelectedFilter] = useState<'current' | 'next' | 'all'>('current');
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
  const nextWeek = weeks.find((w) => !w.is_current) || weeks[1];

  let displayWeeks: Week[] = [];
  if (selectedFilter === 'current' && currentWeek) {
    displayWeeks = [currentWeek];
  } else if (selectedFilter === 'next' && nextWeek) {
    displayWeeks = [nextWeek];
  } else {
    displayWeeks = weeks;
  }

  return (
    <>
      <Navbar />

      <Hero />

      <main className="container content pb-5">
        {/* FILTROS / ABAS DE SEMANA */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div className="week-tabs-container mb-0">
            <button
              type="button"
              className={`week-tab-btn ${selectedFilter === 'current' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('current')}
            >
              <i className="bi bi-calendar-check-fill"></i>
              <span>Semana Atual {currentWeek ? `(Semana ${currentWeek.week_number})` : ''}</span>
            </button>

            <button
              type="button"
              className={`week-tab-btn ${selectedFilter === 'next' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('next')}
            >
              <i className="bi bi-arrow-right-circle-fill"></i>
              <span>Próxima Semana {nextWeek ? `(Semana ${nextWeek.week_number})` : ''}</span>
            </button>

            <button
              type="button"
              className={`week-tab-btn ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              <i className="bi bi-collection-fill"></i>
              <span>Ver Ambas</span>
            </button>
          </div>

          <span className="text-muted small">
            <i className="bi bi-clock-history me-1"></i>
            Atualizado recentemente
          </span>
        </div>

        {/* LISTAGEM DE SEMANAS */}
        {displayWeeks && displayWeeks.length > 0 ? (
          displayWeeks.map((week) => (
            <WeekCard
              key={week.id}
              week={week}
              badgeLabel={week.is_current ? 'Cardápio em vigor' : 'Cardápio programado'}
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

