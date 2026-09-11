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
  const [activeWeekIndex, setActiveWeekIndex] = useState<number>(0);
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
        showNotification('Cardápio das 4 semanas salvo com sucesso! Já está visível publicamente.');
      } else {
        showNotification('Salvo localmente com sucesso no navegador!', 'success');
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
    if (confirm('Tem certeza que deseja restaurar o cardápio padrão de exemplo (4 semanas)?')) {
      const reset = resetClientMenu();
      setWeeks(reset);
      setActiveWeekIndex(0);
      fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeks: reset }),
      }).catch(() => {});
      showNotification('Cardápio restaurado para o padrão original de 4 semanas!', 'success');
    }
  };

  // Adicionar uma nova semana (máximo 4)
  const handleAddWeek = () => {
    if (weeks.length >= 4) {
      alert('O sistema suporta no máximo 4 semanas de planejamento simultâneo.');
      return;
    }

    const nextWeekNumber = weeks.length + 1;
    const newWeek: Week = {
      id: Date.now(),
      week_number: nextWeekNumber,
      start_date: '2025-04-07',
      end_date: '2025-04-11',
      is_current: false,
      meals: [
        {
          id: Date.now() + 1,
          week_id: Date.now(),
          day_of_week: 'Segunda-feira',
          date: '2025-04-07',
          main_dish: 'Arroz branco, feijão carioca, carne moída refogada com legumes e purê.',
          salad: 'Alface e tomate',
          fruit: 'Maçã',
        },
        {
          id: Date.now() + 2,
          week_id: Date.now(),
          day_of_week: 'Terça-feira',
          date: '2025-04-08',
          main_dish: 'Arroz integral, feijão preto, filé de frango ao molho e batata assada.',
          salad: 'Cenoura ralada',
          fruit: 'Banana prata',
        },
        {
          id: Date.now() + 3,
          week_id: Date.now(),
          day_of_week: 'Quarta-feira',
          date: '2025-04-09',
          main_dish: 'Macarrão com carne e queijo ralado.',
          salad: 'Pepino com hortelã',
          fruit: 'Laranja',
        },
        {
          id: Date.now() + 4,
          week_id: Date.now(),
          day_of_week: 'Quinta-feira',
          date: '2025-04-10',
          main_dish: 'Arroz branco, feijão carioca, iscas de carne e abobrinha.',
          salad: 'Beterraba ralada',
          fruit: 'Tangerina',
        },
        {
          id: Date.now() + 5,
          week_id: Date.now(),
          day_of_week: 'Sexta-feira',
          date: '2025-04-11',
          main_dish: 'Galinhada caipira especial e feijão.',
          salad: 'Folhas verdes mistas',
          fruit: 'Melancia',
        },
      ],
      nutritionInfo: {
        id: Date.now(),
        week_id: Date.now(),
        energy_kcal: 700.0,
        carbohydrates_g: 95.0,
        carbohydrates_vet_percent: 55.0,
        proteins_g: 36.0,
        proteins_vet_percent: 21.0,
        lipids_g: 19.0,
        lipids_vet_percent: 24.0,
      },
    };

    setWeeks([...weeks, newWeek]);
    setActiveWeekIndex(weeks.length);
    showNotification(`Semana ${nextWeekNumber} adicionada!`, 'success');
  };

  // Remover a semana ativa (mínimo 1)
  const handleRemoveWeek = () => {
    if (weeks.length <= 1) {
      alert('Você deve manter pelo menos 1 semana cadastrada.');
      return;
    }

    if (confirm(`Tem certeza que deseja remover a Semana ${currentWeek.week_number}?`)) {
      const updated = weeks.filter((_, idx) => idx !== activeWeekIndex);
      setWeeks(updated);
      setActiveWeekIndex(Math.max(0, activeWeekIndex - 1));
      showNotification('Semana removida com sucesso.', 'success');
    }
  };

  // Definir como semana atual
  const handleSetAsCurrent = () => {
    const updated = weeks.map((w, idx) => ({
      ...w,
      is_current: idx === activeWeekIndex,
    }));
    setWeeks(updated);
    showNotification(`Semana ${currentWeek.week_number} definida como Semana Atual em vigor!`, 'success');
  };

  // Copiar cardápio de outra semana
  const handleCopyFromWeek = (sourceIndex: number) => {
    if (sourceIndex === activeWeekIndex) return;
    const source = weeks[sourceIndex];
    if (!source) return;

    if (confirm(`Deseja copiar o cardápio da Semana ${source.week_number} para a Semana ${currentWeek.week_number}?`)) {
      const updated = [...weeks];
      const target = updated[activeWeekIndex];

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

      setWeeks(updated);
      showNotification(`Refeições copiadas da Semana ${source.week_number} com sucesso!`, 'success');
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
    if (confirm('Tem certeza que deseja remover este dia do cardápio?')) {
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
        {/* CABEÇALHO DO PAINEL */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger text-white rounded-pill px-3 py-1 fw-bold">
                Painel Administrativo
              </span>
              <span className="text-muted small">• Até 4 Semanas de Planejamento</span>
            </div>
            <h1 className="fw-bold mb-1 fs-3">Gerenciador de Cardápios • ETEC Boituva</h1>
            <p className="text-muted small mb-0">
              Configure as semanas letivas, pratos, saladas frescas, frutas e os dados nutricionais dos alunos.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link href="/" target="_blank" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
              <i className="bi bi-box-arrow-up-right me-1"></i>
              Ver Site Público
            </Link>

            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
              <i className="bi bi-box-arrow-right me-1"></i>
              Sair
            </button>
          </div>
        </div>

        {/* NOTIFICAÇÕES */}
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

        {/* ABAS DE NAVEGAÇÃO DE ATÉ 4 SEMANAS */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <ul className="nav nav-pills nav-pills-etec">
            {weeks.map((week, idx) => (
              <li key={week.id} className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeWeekIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveWeekIndex(idx)}
                >
                  <i className={`bi ${week.is_current ? 'bi-star-fill text-warning' : 'bi-calendar3'} me-2`}></i>
                  Semana {week.week_number}
                  {week.is_current && <span className="badge bg-light text-success ms-2">Atual</span>}
                </button>
              </li>
            ))}

            {weeks.length < 4 && (
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-outline-success rounded-pill px-3 py-2 ms-2"
                  onClick={handleAddWeek}
                  title="Adicionar mais uma semana (máximo 4)"
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  + Nova Semana ({weeks.length}/4)
                </button>
              </li>
            )}
          </ul>

          <div className="d-flex gap-2 align-items-center flex-wrap">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill"
              onClick={handleReset}
              title="Restaurar dados padrões de exemplo para 4 semanas"
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
                  Salvar Todas as Semanas
                </>
              )}
            </button>
          </div>
        </div>

        {/* DETALHES DA SEMANA ATIVA */}
        {currentWeek && (
          <>
            <div className="admin-card">
              <div className="admin-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                    <i className="bi bi-sliders text-success"></i>
                    <span>Configurações da Semana {currentWeek.week_number}</span>
                    {currentWeek.is_current ? (
                      <span className="badge bg-success">Semana Atual em Vigor</span>
                    ) : (
                      <span className="badge bg-secondary">Planejamento Futuro</span>
                    )}
                  </h5>
                  <small className="text-muted">Ajuste o número da semana, as datas limites e a vigência.</small>
                </div>

                <div className="d-flex gap-2">
                  {!currentWeek.is_current && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success rounded-pill"
                      onClick={handleSetAsCurrent}
                    >
                      <i className="bi bi-check2-circle me-1"></i>
                      Definir como Semana Atual
                    </button>
                  )}

                  {weeks.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger rounded-pill"
                      onClick={handleRemoveWeek}
                      title="Excluir esta semana"
                    >
                      <i className="bi bi-trash3 me-1"></i>
                      Excluir Semana
                    </button>
                  )}
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small text-gray-700">Número da Semana</label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentWeek.week_number}
                    onChange={(e) => updateWeekField('week_number', parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small text-gray-700">Data Inicial (Segunda)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={currentWeek.start_date}
                    onChange={(e) => updateWeekField('start_date', e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small text-gray-700">Data Final (Sexta)</label>
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
                    Refeições Diárias da Semana {currentWeek.week_number}
                  </h5>
                  <p className="text-muted small mb-0">
                    Cadastre a merenda principal, a salada do dia e a fruta de cada dia.
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
                    <div className="border rounded-4 p-3 bg-light h-100 position-relative shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-success rounded-pill px-3 py-2 fw-bold">
                          {meal.day_of_week || `Dia ${mIndex + 1}`}
                        </span>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm border-0"
                          onClick={() => handleRemoveMeal(mIndex)}
                          title="Remover refeição deste dia"
                        >
                          <i className="bi bi-trash3-fill text-danger"></i>
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
                          Salada Fresca
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={meal.salad || ''}
                          onChange={(e) => updateMealField(mIndex, 'salad', e.target.value)}
                          placeholder="Ex: Alface americana com tomate fresco"
                        />
                      </div>

                      {/* FRUTA */}
                      <div>
                        <label className="form-label small fw-semibold text-danger mb-1">
                          <i className="bi bi-apple me-1 text-danger"></i>
                          Fruta da Época
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={meal.fruit || ''}
                          onChange={(e) => updateMealField(mIndex, 'fruit', e.target.value)}
                          placeholder="Ex: Banana prata, maçã, melancia fresca..."
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
                  Composição Nutricional Média (Semana {currentWeek.week_number})
                </h5>
                <p className="text-muted small mb-0">
                  Insira os valores médios nutricionais calculados para esta semana letiva.
                </p>
              </div>

              {currentWeek.nutritionInfo && (
                <div className="row g-3">
                  <div className="col-12 col-md-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <label className="form-label fw-bold small text-warning-emphasis">
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
                      <label className="form-label fw-bold small text-success">
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

            {/* BOTÃO PRINCIPAL PARA SALVAR */}
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
                    Salvando cardápios...
                  </>
                ) : (
                  <>
                    <i className="bi bi-floppy2-fill me-2"></i>
                    Salvar Cardápio Completo (4 Semanas)
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
