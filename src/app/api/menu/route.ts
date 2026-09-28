import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest, verifyAdminSessionValue } from '@/lib/auth-server';
import { getMenuState, saveMenuState } from '@/lib/menu-store';
import { menuStateInputSchema } from '@/lib/menu-schema';
import { ZodError } from 'zod';

export const runtime = 'nodejs';

async function requireAdmin(request: Request) {
  const sessionCookie = getAdminSessionFromRequest(request);
  return verifyAdminSessionValue(sessionCookie);
}

export async function GET() {
  try {
    const state = await getMenuState();
    return NextResponse.json({ success: true, ...state });
  } catch (error) {
    console.error('Erro ao carregar o cardápio:', error);
    return NextResponse.json(
      { success: false, error: 'Persistência do cardápio indisponível' },
      { status: 503 }
    );
  }
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
    const input = menuStateInputSchema.parse(body);
    const state = await saveMenuState(input.weeks, input.cycle_mode);

    return NextResponse.json({
      success: true,
      message: 'Cardápio atualizado com sucesso',
      weeks: state.weeks,
      cycle_mode: state.cycle_mode,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.flatten() },
        { status: 400 }
      );
    }
    console.error('Erro na API /api/menu:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao salvar cardápio' },
      { status: 500 }
    );
  }
}
