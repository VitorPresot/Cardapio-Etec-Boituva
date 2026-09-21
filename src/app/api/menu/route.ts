import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest, verifyAdminSessionValue } from '@/lib/auth-server';
import { getMenuState, saveMenuState } from '@/lib/menu-store';
import { Week } from '@/types/menu';

async function requireAdmin(request: Request) {
  const sessionCookie = getAdminSessionFromRequest(request);
  return verifyAdminSessionValue(sessionCookie);
}

export async function GET() {
  const state = await getMenuState();
  return NextResponse.json({
    success: true,
    weeks: state.weeks,
    cycle_mode: state.cycle_mode,
    updated_at: state.updated_at,
  });
}

export async function POST(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { success: false, error: 'Não autorizado' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!body || !Array.isArray(body.weeks)) {
      return NextResponse.json(
        { success: false, error: 'Formato de dados inválido' },
        { status: 400 }
      );
    }

    const weeks = body.weeks as Week[];
    const cycleMode = Boolean(body.cycle_mode);
    const state = await saveMenuState(weeks, cycleMode);

    return NextResponse.json({
      success: true,
      message: 'Cardápio atualizado com sucesso',
      weeks: state.weeks,
      cycle_mode: state.cycle_mode,
    });
  } catch (error) {
    console.error('Erro na API /api/menu:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao salvar cardápio' },
      { status: 500 }
    );
  }
}

