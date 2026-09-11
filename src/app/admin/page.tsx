'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Week, Meal, NutritionInfo } from '@/types/menu';
import { getClientMenu, saveClientMenu, resetClientMenu } from '@/lib/storage';
import { isAdminAuthenticated, clearAdminSession } from '@/lib/auth';
import { initialWeeks } from '@/data/initialData';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [weeks, setWeeks] = useState<Week[]>(initialWeeks);
  const [activeWeekIndex, setActiveWeekIndex] = useState<number>(0); // 0 = Semana Atual, 1 = Próxima Semana
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);

  // Verificação de autenticação
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    const localData = getClientMenu();
    if (localData && localData.length > 0) {
      setWeeks(localData);
    }

    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.weeks) && data.weeks.length > 0) {
          setWeeks(data.weeks);
          saveClientMenu(data.weeks);
        }
      })
      .catch((err) => console.log('Usando dados offline:', err));
  }, [router]);

  const currentWeek = weeks[activeWeekIndex] || weeks[0];

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  const showNotification = (text: string, type: 'success' | 'danger' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Salvar no servidor e localStorage
  const handleSave = async () => {
    setSaving(true);
    try {
      saveClientMenu(weeks);

      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeks }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification('Cardápio salvo com sucesso! As alterações já estão visíveis publicamente.');
      } else {
        showNotification('Salvo localmente com sucesso! (Servidor retornou aviso)', 'success');
      }
    } catch {
      saveClientMenu(weeks);
      showNotification('Salvo localmente no navegador com sucesso!', 'success');
    } finally {
      setSaving(false);
    }
  };

  // Restaurar dados padrão de teste
  const handleReset = () => {
    if (confirm('Tem certeza que deseja restaurar o cardápio padrão de exemplo? Todas as alterações serão substituídas.')) {
      const reset = resetClientMenu();
      setWeeks(reset);
      fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeks: reset }),
      }).catch(() => {});
      showNotification('Cardápio restaurado para o padrão de exemplo!', 'success');
    }
  };

  // Copiar cardápio da semana atual para a próxima semana
  const handleCopyCurrentToNext = () => {
    if (weeks.length < 2) return;
    if (confirm('Deseja copiar as refeições e informações nutricionais da Semana Atual para a Próxima Semana?')) {
      const updatedWeeks = [...weeks];
      const source = updatedWeeks[0];
      const target = updatedWeeks[1];

      target.meals = source.meals.map((m, idx) => ({
        ...m,
        id: Date.now() + idx,
        week_id: target.id,
      }));

      if (source.nutritionInfo) {
        target.nutritionInfo = {
          ...source.nutritionInfo,
          id: Date.now(),
          week_id: target.id,
        };
      }

      setWeeks(updatedWeeks);
      showNotification('Refeições copiadas com sucesso para a Próxima Semana! Não se esqueça de salvar.');
    }
  };

  // Atualizar campos da semana ativa
  const updateWeekField = (field: keyof Week, value: any) => {
    setWeeks((prev) => {
      const updated = [...prev];
      updated[activeWeekIndex] = {
        ...updated[activeWeekIndex],
        [field]: value,
      };
      return updated;
    });
  };

  // Atualizar refeição específica
  const updateMealField = (mealIndex: number, field: keyof Meal, value: string) => {
    setWeeks((prev) => {
      const updated = [...prev];
      const currentMeals = [...updated[activeWeekIndex].meals];
      currentMeals[mealIndex] = {
        ...currentMeals[mealIndex],
        [field]: value,
      };
      updated[activeWeekIndex] = {
        ...updated[activeWeekIndex],
        meals: currentMeals,
      };
      return updated;
    });
  };

  // Adicionar dia de refeição
  const handleAddMeal = () => {
    setWeeks((prev) => {
      const updated = [...prev];
      const newMeal: Meal = {
        id: Date.now(),
        week_id: updated[activeWeekIndex].id,
        day_of_week: 'Novo dia',
        date: updated[activeWeekIndex].start_date,
        main_dish: 'Digite aqui a descrição da merenda...',
        salad: '',
        fruit: '',
      };
      updated[activeWeekIndex] = {
        ...updated[activeWeekIndex],
        meals: [...updated[activeWeekIndex].meals, newMeal],
      };
      return updated;
    });
  };

  // Remover dia de refeição
  const handleRemoveMeal = (mealIndex: number) => {
    if (confirm('Tem certeza que deseja remover esta refeição?')) {
      setWeeks((prev) => {
        const updated = [...prev];
        const currentMeals = updated[activeWeekIndex].meals.filter((_, idx) => idx !== mealIndex);
        updated[activeWeekIndex] = {
          ...updated[activeWeekIndex],
          meals: currentMeals,
        };
        return updated;
      });
    }
  };

  // Atualizar informações nutricionais
  const updateNutritionField = (field: keyof NutritionInfo, value: number) => {
    setWeeks((prev) => {
      const updated = [...prev];
      const currentNutrition: NutritionInfo = updated[activeWeekIndex].nutritionInfo || {
        week_id: updated[activeWeekIndex].id,
        energy_kcal: 0,
        carbohydrates_g: 0,
        carbohydrates_vet_percent: 0,
        proteins_g: 0,
        proteins_vet_percent: 0,
        lipids_g: 0,
        lipids_vet_percent: 0,
      };

      updated[activeWeekIndex] = {
        ...updated[activeWeekIndex],
        nutritionInfo: {
          ...currentNutrition,
          [field]: value,
        },
      };
      return updated;
    });
  };

  return (
    <>
      <Navbar isAdmin={true} />

      <main className="container content py-4 pb-5">
        {/* TOPO DO PAINEL */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h1 className="fw-bold mb-1 fs-3">Painel de Gerenciamento do Cardápio</h1>
            <p className="text-muted small mb-0">
              Edite as refeições, saladas, frutas e tabela nutricional dos alunos da ETEC Boituva.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link href="/" target="_blank" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
              <i className="bi bi-box-arrow-up-right me-1"></i>
              Visualizar Cardápio Público
            </Link>

            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
              <i className="bi bi-box-arrow-right me-1"></i>
              Sair
            </button>
          </div>
        </div>

        {/* NOTIFICAÇÃO */}
        {notification && (
          <div
            className={`alert alert-${notification.type} alert-dismissible fade show d-flex align-items-center gap-2 mb-4`}
            role="alert"
          >
            <i
              className={`bi ${
                notification.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'
              } fs-5`}
            ></i>
            <div>{notification.text}</div>
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={() => setNotification(null)}
            ></button>
          </div>
        )}

        {/* ABAS DE SELEÇÃO: SEMANA ATUAL VS PRÓXIMA SEMANA */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <ul className="nav nav-pills nav-pills-etec">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeWeekIndex === 0 ? 'active' : ''}`}
                onClick={() => setActiveWeekIndex(0)}
              >
                <i className="bi bi-calendar-check me-2"></i>
                Semana Atual {weeks[0] ? `(Semana ${weeks[0].week_number})` : ''}
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeWeekIndex === 1 ? 'active' : ''}`}
                onClick={() => setActiveWeekIndex(1)}
              >
                <i className="bi bi-arrow-right-circle me-2"></i>
                Próxima Semana {weeks[1] ? `(Semana ${weeks[1].week_number})` : ''}
              </button>
            </li>
          </ul>

          <div className="d-flex gap-2">
            {activeWeekIndex === 1 && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill"
                onClick={handleCopyCurrentToNext}
                title="Copiar itens da semana 1 para a semana 2"
              >
                <i className="bi bi-files me-1"></i>
                Copiar da Semana Atual
              </button>
            )}

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill"
              onClick={handleReset}
              title="Restaurar dados padrões de exemplo"
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i>
              Restaurar Padrão
            </button>

            <button
              type="button"
              className="btn btn-etec-primary px-4 shadow-sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <i className="bi bi-floppy2-fill me-2"></i>
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>

        {/* DETALHES DA SEMANA */}
        {currentWeek && (
          <>
            <div className="admin-card">
              <div className="admin-header d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-sliders me-2 text-success"></i>
                  Configurações da {activeWeekIndex === 0 ? 'Semana Atual' : 'Próxima Semana'}
                </h5>
                <span className="badge bg-light text-dark border">ID: {currentWeek.id}</span>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Número da Semana</label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentWeek.week_number}
                    onChange={(e) => updateWeekField('week_number', parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Data Inicial (Segunda)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={currentWeek.start_date}
                    onChange={(e) => updateWeekField('start_date', e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Data Final (Sexta)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={currentWeek.end_date}
                    onChange={(e) => updateWeekField('end_date', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* REFEIÇÕES DIÁRIAS */}
            <div className="admin-card">
              <div className="admin-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-1">
                    <i className="bi bi-egg-fried me-2 text-warning"></i>
                    Refeições Diárias (Merenda, Salada e Fruta)
                  </h5>
                  <p className="text-muted small mb-0">
                    Preencha o cardápio servido para cada dia da semana.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-etec-secondary rounded-pill"
                  onClick={handleAddMeal}
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  Adicionar Dia
                </button>
              </div>

              <div className="row g-4">
                {currentWeek.meals.map((meal, mIndex) => (
                  <div key={meal.id || mIndex} className="col-12 col-lg-6">
                    <div className="border rounded-4 p-3 bg-light h-100 position-relative">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-success rounded-pill px-3 py-2">
                            {meal.day_of_week || `Dia ${mIndex + 1}`}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm border-0"
                          onClick={() => handleRemoveMeal(mIndex)}
                          title="Remover refeição"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-7">
                          <label className="form-label small fw-semibold text-muted mb-1">
                            Dia da Semana
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={meal.day_of_week}
                            onChange={(e) => updateMealField(mIndex, 'day_of_week', e.target.value)}
                          />
                        </div>

                        <div className="col-5">
                          <label className="form-label small fw-semibold text-muted mb-1">Data</label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={meal.date}
                            onChange={(e) => updateMealField(mIndex, 'date', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* MERENDA PRINCIPAL */}
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-success mb-1">
                          <i className="bi bi-egg-fried me-1"></i>
                          Prato Principal / Merenda
                        </label>
                        <textarea
                          className="form-control form-control-sm"
                          rows={3}
                          value={meal.main_dish}
                          onChange={(e) => updateMealField(mIndex, 'main_dish', e.target.value)}
                          placeholder="Ex: Arroz, feijão, frango assado e legumes..."
                          required
                        />
                      </div>

                      {/* SALADA */}
                      <div className="mb-2">
                        <label className="form-label small fw-semibold text-secondary mb-1">
                          <i className="bi bi-flower1 me-1 text-success"></i>
                          Salada (opcional)
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={meal.salad || ''}
                          onChange={(e) => updateMealField(mIndex, 'salad', e.target.value)}
                          placeholder="Ex: Alface americana com tomate"
                        />
                      </div>

                      {/* FRUTA */}
                      <div>
                        <label className="form-label small fw-semibold text-secondary mb-1">
                          <i className="bi bi-apple me-1 text-danger"></i>
                          Fruta da época (opcional)
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={meal.fruit || ''}
                          onChange={(e) => updateMealField(mIndex, 'fruit', e.target.value)}
                          placeholder="Ex: Banana prata, maçã, melancia..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COMPOSIÇÃO NUTRICIONAL */}
            <div className="admin-card">
              <div className="admin-header">
                <h5 className="fw-bold mb-1">
                  <i className="bi bi-bar-chart-fill me-2 text-primary"></i>
                  Composição Nutricional (Média Semanal)
                </h5>
                <p className="text-muted small mb-0">
                  Insira os valores médios nutricionais calculados para as refeições desta semana.
                </p>
              </div>

              {currentWeek.nutritionInfo && (
                <div className="row g-3">
                  <div className="col-12 col-md-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <label className="form-label fw-bold small text-success">
                        <i className="bi bi-lightning-charge-fill me-1"></i>
                        Energia (kcal)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={currentWeek.nutritionInfo.energy_kcal}
                        onChange={(e) =>
                          updateNutritionField('energy_kcal', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <label className="form-label fw-bold small text-warning-emphasis">
                        <i className="bi bi-basket2-fill me-1"></i>
                        Carboidratos (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control mb-2"
                        value={currentWeek.nutritionInfo.carbohydrates_g}
                        onChange={(e) =>
                          updateNutritionField('carbohydrates_g', parseFloat(e.target.value) || 0)
                        }
                      />
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">% VET</span>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={currentWeek.nutritionInfo.carbohydrates_vet_percent}
                          onChange={(e) =>
                            updateNutritionField('carbohydrates_vet_percent', parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <label className="form-label fw-bold small text-danger">
                        <i className="bi bi-activity me-1"></i>
                        Proteínas (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control mb-2"
                        value={currentWeek.nutritionInfo.proteins_g}
                        onChange={(e) =>
                          updateNutritionField('proteins_g', parseFloat(e.target.value) || 0)
                        }
                      />
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">% VET</span>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={currentWeek.nutritionInfo.proteins_vet_percent}
                          onChange={(e) =>
                            updateNutritionField('proteins_vet_percent', parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <label className="form-label fw-bold small text-info">
                        <i className="bi bi-droplet-fill me-1"></i>
                        Lipídios (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control mb-2"
                        value={currentWeek.nutritionInfo.lipids_g}
                        onChange={(e) =>
                          updateNutritionField('lipids_g', parseFloat(e.target.value) || 0)
                        }
                      />
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">% VET</span>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={currentWeek.nutritionInfo.lipids_vet_percent}
                          onChange={(e) =>
                            updateNutritionField('lipids_vet_percent', parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BOTÃO FLUTUANTE / FIXO PARA SALVAR */}
            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                className="btn btn-etec-primary px-5 py-3 fs-6 shadow"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Salvando alterações...
                  </>
                ) : (
                  <>
                    <i className="bi bi-floppy2-fill me-2"></i>
                    Salvar Cardápio Completo
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

